package webhook

import (
	"context"
	"log"
	"sync"
	"time"

	"github.com/jr-k/mailgress/internal/config"
	"github.com/jr-k/mailgress/internal/domain"
	"github.com/jr-k/mailgress/internal/service"
)

type Job struct {
	Webhook *domain.Webhook
	Email   *domain.Email
	Attempt int
}

type Dispatcher struct {
	jobs            chan *Job
	workers         int
	webhookService  *service.WebhookService
	deliveryService *service.DeliveryService
	emailService    *service.EmailService
	config          *config.Config
	wg              sync.WaitGroup
	ctx             context.Context
	cancel          context.CancelFunc
	evaluator       *RuleEvaluator
}

func NewDispatcher(
	cfg *config.Config,
	webhookService *service.WebhookService,
	deliveryService *service.DeliveryService,
	emailService *service.EmailService,
) *Dispatcher {
	ctx, cancel := context.WithCancel(context.Background())

	return &Dispatcher{
		jobs:            make(chan *Job, 1000),
		workers:         cfg.WebhookWorkers,
		webhookService:  webhookService,
		deliveryService: deliveryService,
		emailService:    emailService,
		config:          cfg,
		ctx:             ctx,
		cancel:          cancel,
		evaluator:       NewRuleEvaluator(),
	}
}

func (d *Dispatcher) Start() {
	log.Printf("Starting webhook dispatcher with %d workers", d.workers)

	for i := 0; i < d.workers; i++ {
		d.wg.Add(1)
		go d.worker(i)
	}

	d.wg.Add(1)
	go d.retryWorker()
}

func (d *Dispatcher) Stop() {
	log.Println("Stopping webhook dispatcher...")
	d.cancel()
	close(d.jobs)
	d.wg.Wait()
	log.Println("Webhook dispatcher stopped")
}

func (d *Dispatcher) Dispatch(mailboxID int64, email *domain.Email) {
	webhooks, err := d.webhookService.ListActiveByMailbox(d.ctx, mailboxID)
	if err != nil {
		log.Printf("Failed to get webhooks for mailbox %d: %v", mailboxID, err)
		return
	}

	for _, webhook := range webhooks {
		if !d.evaluator.Evaluate(webhook.Rules, email) {
			continue
		}

		select {
		case d.jobs <- &Job{Webhook: webhook, Email: email, Attempt: 1}:
		default:
			log.Printf("Webhook job queue full, dropping job for webhook %d", webhook.ID)
		}
	}
}

func (d *Dispatcher) worker(id int) {
	defer d.wg.Done()

	for {
		select {
		case <-d.ctx.Done():
			return
		case job, ok := <-d.jobs:
			if !ok {
				return
			}
			d.processJob(job)
		}
	}
}

func (d *Dispatcher) processJob(job *Job) {
	payload := BuildPayload(job.Email, job.Webhook)
	payloadBytes, _ := payload.JSON()

	delivery, err := d.deliveryService.Create(d.ctx, job.Webhook.ID, job.Email.ID, job.Attempt, string(payloadBytes))
	if err != nil {
		log.Printf("Failed to create delivery record: %v", err)
		return
	}

	startTime := time.Now()
	timeout := time.Duration(job.Webhook.TimeoutSec) * time.Second
	statusCode, responseBody, err := SendWebhook(d.ctx, job.Webhook, payloadBytes, timeout)
	duration := int(time.Since(startTime).Milliseconds())

	var status string
	var errorMsg string

	if err != nil {
		errorMsg = err.Error()
		if job.Attempt < job.Webhook.MaxRetries {
			status = domain.DeliveryStatusRetrying
		} else {
			status = domain.DeliveryStatusFailed
		}
	} else if statusCode >= 200 && statusCode < 300 {
		status = domain.DeliveryStatusSuccess
	} else {
		errorMsg = "Non-2xx response"
		if job.Attempt < job.Webhook.MaxRetries {
			status = domain.DeliveryStatusRetrying
		} else {
			status = domain.DeliveryStatusFailed
		}
	}

	truncatedResponse := responseBody
	if len(truncatedResponse) > 1000 {
		truncatedResponse = truncatedResponse[:1000] + "..."
	}

	_, err = d.deliveryService.UpdateStatus(d.ctx, delivery.ID, status, &statusCode, truncatedResponse, errorMsg, &duration)
	if err != nil {
		log.Printf("Failed to update delivery status: %v", err)
	}
}

func (d *Dispatcher) retryWorker() {
	defer d.wg.Done()

	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-d.ctx.Done():
			return
		case <-ticker.C:
			d.processPendingRetries()
		}
	}
}

func (d *Dispatcher) processPendingRetries() {
	deliveries, err := d.deliveryService.ListPending(d.ctx, 100)
	if err != nil {
		log.Printf("Failed to list pending deliveries: %v", err)
		return
	}

	for _, delivery := range deliveries {
		if delivery.Status != domain.DeliveryStatusRetrying {
			continue
		}

		webhook, err := d.webhookService.GetByID(d.ctx, delivery.WebhookID)
		if err != nil {
			continue
		}

		// Check if max retries exceeded - mark as failed and skip
		if delivery.Attempt >= webhook.MaxRetries {
			d.deliveryService.UpdateStatus(d.ctx, delivery.ID, domain.DeliveryStatusFailed, nil, "", "Max retries exceeded", nil)
			continue
		}

		email, err := d.emailService.GetByID(d.ctx, delivery.EmailID)
		if err != nil {
			log.Printf("Failed to get email %d for retry: %v", delivery.EmailID, err)
			d.deliveryService.UpdateStatus(d.ctx, delivery.ID, domain.DeliveryStatusFailed, nil, "", "Email not found", nil)
			continue
		}

		// Mark the current delivery as failed before scheduling the retry
		// This prevents the retryWorker from picking it up again
		d.deliveryService.UpdateStatus(d.ctx, delivery.ID, domain.DeliveryStatusFailed, delivery.StatusCode, delivery.ResponseBody, delivery.ErrorMessage+" (retry scheduled)", delivery.DurationMs)

		select {
		case d.jobs <- &Job{Webhook: webhook, Email: email, Attempt: delivery.Attempt + 1}:
		default:
			log.Printf("Job queue full, could not schedule retry for webhook %d", webhook.ID)
		}
	}
}

func (d *Dispatcher) ManualRetry(webhookID, emailID int64) error {
	webhook, err := d.webhookService.GetByID(d.ctx, webhookID)
	if err != nil {
		return err
	}

	select {
	case d.jobs <- &Job{Webhook: webhook, Email: &domain.Email{ID: emailID}, Attempt: 1}:
		return nil
	default:
		return nil
	}
}
