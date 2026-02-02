package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	mw "github.com/jr-k/mailgress/internal/http/middleware"
	"github.com/jr-k/mailgress/internal/service"
	"github.com/jr-k/mailgress/internal/webhook"
	"github.com/romsar/gonertia"
)

type WebhookHandler struct {
	inertia         *gonertia.Inertia
	webhookService  *service.WebhookService
	deliveryService *service.DeliveryService
	mailboxService  *service.MailboxService
	domainService   *service.DomainService
	dispatcher      *webhook.Dispatcher
}

func NewWebhookHandler(
	inertia *gonertia.Inertia,
	webhookService *service.WebhookService,
	deliveryService *service.DeliveryService,
	mailboxService *service.MailboxService,
	domainService *service.DomainService,
	dispatcher *webhook.Dispatcher,
) *WebhookHandler {
	return &WebhookHandler{
		inertia:         inertia,
		webhookService:  webhookService,
		deliveryService: deliveryService,
		mailboxService:  mailboxService,
		domainService:   domainService,
		dispatcher:      dispatcher,
	}
}

func (h *WebhookHandler) getAllMailboxesWithDomain(r *http.Request) interface{} {
	user := mw.GetUser(r)
	if user.IsAdmin {
		mbs, _ := h.mailboxService.List(r.Context())
		for _, mb := range mbs {
			if mb.DomainID != nil {
				domain, _ := h.domainService.GetByID(r.Context(), *mb.DomainID)
				mb.Domain = domain
			}
		}
		return mbs
	}
	mbs, _ := h.mailboxService.ListByOwner(r.Context(), user.ID)
	for _, mb := range mbs {
		if mb.DomainID != nil {
			domain, _ := h.domainService.GetByID(r.Context(), *mb.DomainID)
			mb.Domain = domain
		}
	}
	return mbs
}

func (h *WebhookHandler) checkMailboxAccess(w http.ResponseWriter, r *http.Request) (int64, bool) {
	user := mw.GetUser(r)

	mailboxID, err := strconv.ParseInt(chi.URLParam(r, "mailboxId"), 10, 64)
	if err != nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return 0, false
	}

	mailbox, err := h.mailboxService.GetByID(r.Context(), mailboxID)
	if err != nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return 0, false
	}

	if !user.IsAdmin && (mailbox.OwnerID == nil || *mailbox.OwnerID != user.ID) {
		h.inertia.Render(w, r, "Errors/Forbidden", nil)
		return 0, false
	}

	return mailboxID, true
}

func (h *WebhookHandler) Index(w http.ResponseWriter, r *http.Request) {
	mailboxID, ok := h.checkMailboxAccess(w, r)
	if !ok {
		return
	}

	mailbox, _ := h.mailboxService.GetByID(r.Context(), mailboxID)
	if mailbox.DomainID != nil {
		domain, _ := h.domainService.GetByID(r.Context(), *mailbox.DomainID)
		mailbox.Domain = domain
	}

	allMailboxes := h.getAllMailboxesWithDomain(r)

	webhooks, _ := h.webhookService.ListByMailbox(r.Context(), mailboxID)

	for _, wh := range webhooks {
		stats, _ := h.webhookService.GetDeliveryStats(r.Context(), wh.ID)
		wh.DeliveryStats = stats
	}

	h.inertia.Render(w, r, "Webhooks/Index", gonertia.Props{
		"mailbox":      mailbox,
		"allMailboxes": allMailboxes,
		"webhooks":     webhooks,
	})
}

func (h *WebhookHandler) Create(w http.ResponseWriter, r *http.Request) {
	mailboxID, ok := h.checkMailboxAccess(w, r)
	if !ok {
		return
	}

	mailbox, _ := h.mailboxService.GetByID(r.Context(), mailboxID)
	if mailbox.DomainID != nil {
		domain, _ := h.domainService.GetByID(r.Context(), *mailbox.DomainID)
		mailbox.Domain = domain
	}

	allMailboxes := h.getAllMailboxesWithDomain(r)

	h.inertia.Render(w, r, "Webhooks/Create", gonertia.Props{
		"mailbox":      mailbox,
		"allMailboxes": allMailboxes,
	})
}

func (h *WebhookHandler) Store(w http.ResponseWriter, r *http.Request) {
	mailboxID, ok := h.checkMailboxAccess(w, r)
	if !ok {
		return
	}

	var req struct {
		Name               string            `json:"name"`
		URL                string            `json:"url"`
		HMACSecret         string            `json:"hmac_secret"`
		Headers            map[string]string `json:"headers"`
		TimeoutSec         int               `json:"timeout_sec"`
		MaxRetries         int               `json:"max_retries"`
		IncludeBody        bool              `json:"include_body"`
		IncludeAttachments bool              `json:"include_attachments"`
		Rules              []struct {
			RuleGroup  int    `json:"rule_group"`
			Field      string `json:"field"`
			Operator   string `json:"operator"`
			Value      string `json:"value"`
			HeaderName string `json:"header_name"`
		} `json:"rules"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		mailbox, _ := h.mailboxService.GetByID(r.Context(), mailboxID)
		h.inertia.Render(w, r, "Webhooks/Create", gonertia.Props{
			"mailbox": mailbox,
			"error":   "Invalid request",
		})
		return
	}

	if req.TimeoutSec == 0 {
		req.TimeoutSec = 30
	}
	if req.MaxRetries == 0 {
		req.MaxRetries = 3
	}

	wh, err := h.webhookService.Create(r.Context(), service.CreateWebhookParams{
		MailboxID:          mailboxID,
		Name:               req.Name,
		URL:                req.URL,
		Headers:            req.Headers,
		HMACSecret:         req.HMACSecret,
		TimeoutSec:         req.TimeoutSec,
		MaxRetries:         req.MaxRetries,
		IncludeBody:        req.IncludeBody,
		IncludeAttachments: req.IncludeAttachments,
	})
	if err != nil {
		mailbox, _ := h.mailboxService.GetByID(r.Context(), mailboxID)
		h.inertia.Render(w, r, "Webhooks/Create", gonertia.Props{
			"mailbox": mailbox,
			"error":   err.Error(),
		})
		return
	}

	for _, rule := range req.Rules {
		h.webhookService.CreateRule(r.Context(), wh.ID, rule.RuleGroup, rule.Field, rule.Operator, rule.Value, rule.HeaderName)
	}

	h.inertia.Location(w, r, "/mailboxes/"+strconv.FormatInt(mailboxID, 10)+"/webhooks")
}

func (h *WebhookHandler) Show(w http.ResponseWriter, r *http.Request) {
	mailboxID, ok := h.checkMailboxAccess(w, r)
	if !ok {
		return
	}

	webhookID, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	mailbox, _ := h.mailboxService.GetByID(r.Context(), mailboxID)
	if mailbox.DomainID != nil {
		domain, _ := h.domainService.GetByID(r.Context(), *mailbox.DomainID)
		mailbox.Domain = domain
	}
	wh, err := h.webhookService.GetByID(r.Context(), webhookID)
	if err != nil || wh.MailboxID != mailboxID {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	stats, _ := h.webhookService.GetDeliveryStats(r.Context(), webhookID)
	wh.DeliveryStats = stats

	allMailboxes := h.getAllMailboxesWithDomain(r)

	h.inertia.Render(w, r, "Webhooks/Show", gonertia.Props{
		"mailbox":      mailbox,
		"allMailboxes": allMailboxes,
		"webhook":      wh,
	})
}

func (h *WebhookHandler) Edit(w http.ResponseWriter, r *http.Request) {
	mailboxID, ok := h.checkMailboxAccess(w, r)
	if !ok {
		return
	}

	webhookID, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	mailbox, _ := h.mailboxService.GetByID(r.Context(), mailboxID)
	if mailbox.DomainID != nil {
		domain, _ := h.domainService.GetByID(r.Context(), *mailbox.DomainID)
		mailbox.Domain = domain
	}
	wh, err := h.webhookService.GetByID(r.Context(), webhookID)
	if err != nil || wh.MailboxID != mailboxID {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	allMailboxes := h.getAllMailboxesWithDomain(r)

	h.inertia.Render(w, r, "Webhooks/Edit", gonertia.Props{
		"mailbox":      mailbox,
		"allMailboxes": allMailboxes,
		"webhook":      wh,
	})
}

func (h *WebhookHandler) Update(w http.ResponseWriter, r *http.Request) {
	mailboxID, ok := h.checkMailboxAccess(w, r)
	if !ok {
		return
	}

	webhookID, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	var req struct {
		Name               string            `json:"name"`
		URL                string            `json:"url"`
		HMACSecret         string            `json:"hmac_secret"`
		Headers            map[string]string `json:"headers"`
		TimeoutSec         int               `json:"timeout_sec"`
		MaxRetries         int               `json:"max_retries"`
		IncludeBody        bool              `json:"include_body"`
		IncludeAttachments bool              `json:"include_attachments"`
		IsActive           bool              `json:"is_active"`
		Rules              []struct {
			RuleGroup  int    `json:"rule_group"`
			Field      string `json:"field"`
			Operator   string `json:"operator"`
			Value      string `json:"value"`
			HeaderName string `json:"header_name"`
		} `json:"rules"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.inertia.Render(w, r, "Errors/ServerError", nil)
		return
	}

	_, err = h.webhookService.Update(r.Context(), service.UpdateWebhookParams{
		ID:                 webhookID,
		Name:               req.Name,
		URL:                req.URL,
		Headers:            req.Headers,
		HMACSecret:         req.HMACSecret,
		TimeoutSec:         req.TimeoutSec,
		MaxRetries:         req.MaxRetries,
		IncludeBody:        req.IncludeBody,
		IncludeAttachments: req.IncludeAttachments,
		IsActive:           req.IsActive,
	})
	if err != nil {
		mailbox, _ := h.mailboxService.GetByID(r.Context(), mailboxID)
		wh, _ := h.webhookService.GetByID(r.Context(), webhookID)
		h.inertia.Render(w, r, "Webhooks/Edit", gonertia.Props{
			"mailbox": mailbox,
			"webhook": wh,
			"error":   err.Error(),
		})
		return
	}

	h.webhookService.DeleteRulesByWebhook(r.Context(), webhookID)

	for _, rule := range req.Rules {
		h.webhookService.CreateRule(r.Context(), webhookID, rule.RuleGroup, rule.Field, rule.Operator, rule.Value, rule.HeaderName)
	}

	h.inertia.Location(w, r, "/mailboxes/"+strconv.FormatInt(mailboxID, 10)+"/webhooks/"+strconv.FormatInt(webhookID, 10))
}

func (h *WebhookHandler) Delete(w http.ResponseWriter, r *http.Request) {
	mailboxID, ok := h.checkMailboxAccess(w, r)
	if !ok {
		return
	}

	webhookID, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	if err := h.webhookService.Delete(r.Context(), webhookID); err != nil {
		h.inertia.Render(w, r, "Errors/ServerError", nil)
		return
	}

	h.inertia.Location(w, r, "/mailboxes/"+strconv.FormatInt(mailboxID, 10)+"/webhooks")
}

func (h *WebhookHandler) Test(w http.ResponseWriter, r *http.Request) {
	mailboxID, ok := h.checkMailboxAccess(w, r)
	if !ok {
		return
	}

	webhookID, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	wh, err := h.webhookService.GetByID(r.Context(), webhookID)
	if err != nil || wh.MailboxID != mailboxID {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	statusCode, response, err := webhook.TestWebhook(r.Context(), wh)

	result := map[string]interface{}{
		"status_code": statusCode,
		"response":    response,
	}
	if err != nil {
		result["error"] = err.Error()
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func (h *WebhookHandler) Deliveries(w http.ResponseWriter, r *http.Request) {
	mailboxID, ok := h.checkMailboxAccess(w, r)
	if !ok {
		return
	}

	webhookID, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	wh, err := h.webhookService.GetByID(r.Context(), webhookID)
	if err != nil || wh.MailboxID != mailboxID {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	page := 1
	if p := r.URL.Query().Get("page"); p != "" {
		if parsed, err := strconv.Atoi(p); err == nil && parsed > 0 {
			page = parsed
		}
	}

	perPage := int64(50)
	offset := int64((page - 1)) * perPage

	deliveries, _ := h.deliveryService.ListByWebhook(r.Context(), webhookID, perPage, offset)
	total, _ := h.deliveryService.CountByWebhook(r.Context(), webhookID)

	mailbox, _ := h.mailboxService.GetByID(r.Context(), mailboxID)
	if mailbox.DomainID != nil {
		domain, _ := h.domainService.GetByID(r.Context(), *mailbox.DomainID)
		mailbox.Domain = domain
	}

	allMailboxes := h.getAllMailboxesWithDomain(r)

	h.inertia.Render(w, r, "Webhooks/Deliveries", gonertia.Props{
		"mailbox":      mailbox,
		"allMailboxes": allMailboxes,
		"webhook":      wh,
		"deliveries":   deliveries,
		"pagination": map[string]interface{}{
			"current_page": page,
			"total":        total,
			"per_page":     perPage,
		},
	})
}

func (h *WebhookHandler) Retry(w http.ResponseWriter, r *http.Request) {
	deliveryID, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	delivery, err := h.deliveryService.GetByID(r.Context(), deliveryID)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	user := mw.GetUser(r)
	wh, _ := h.webhookService.GetByID(r.Context(), delivery.WebhookID)
	mailbox, _ := h.mailboxService.GetByID(r.Context(), wh.MailboxID)

	if !user.IsAdmin && (mailbox.OwnerID == nil || *mailbox.OwnerID != user.ID) {
		w.WriteHeader(http.StatusForbidden)
		return
	}

	h.dispatcher.ManualRetry(delivery.WebhookID, delivery.EmailID)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "queued"})
}
