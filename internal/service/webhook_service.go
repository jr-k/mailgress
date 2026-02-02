package service

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"

	"github.com/jr-k/mailgress/internal/database/db"
	"github.com/jr-k/mailgress/internal/domain"
)

var ErrWebhookNotFound = errors.New("webhook not found")

type WebhookService struct {
	queries *db.Queries
}

func NewWebhookService(queries *db.Queries) *WebhookService {
	return &WebhookService{queries: queries}
}

func (s *WebhookService) GetByID(ctx context.Context, id int64) (*domain.Webhook, error) {
	dbWebhook, err := s.queries.GetWebhookByID(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrWebhookNotFound
		}
		return nil, err
	}

	webhook := s.toDomain(dbWebhook)

	dbRules, err := s.queries.ListRulesByWebhook(ctx, id)
	if err != nil {
		return nil, err
	}
	webhook.Rules = make([]domain.WebhookRule, len(dbRules))
	for i, dbRule := range dbRules {
		webhook.Rules[i] = s.ruleToDomain(dbRule)
	}

	return webhook, nil
}

func (s *WebhookService) ListByMailbox(ctx context.Context, mailboxID int64) ([]*domain.Webhook, error) {
	dbWebhooks, err := s.queries.ListWebhooksByMailbox(ctx, mailboxID)
	if err != nil {
		return nil, err
	}

	webhooks := make([]*domain.Webhook, len(dbWebhooks))
	for i, dbWebhook := range dbWebhooks {
		webhooks[i] = s.toDomain(dbWebhook)
	}
	return webhooks, nil
}

func (s *WebhookService) ListActiveByMailbox(ctx context.Context, mailboxID int64) ([]*domain.Webhook, error) {
	dbWebhooks, err := s.queries.ListActiveWebhooksByMailbox(ctx, mailboxID)
	if err != nil {
		return nil, err
	}

	webhooks := make([]*domain.Webhook, len(dbWebhooks))
	for i, dbWebhook := range dbWebhooks {
		wh := s.toDomain(dbWebhook)

		dbRules, err := s.queries.ListRulesByWebhook(ctx, wh.ID)
		if err != nil {
			return nil, err
		}
		wh.Rules = make([]domain.WebhookRule, len(dbRules))
		for j, dbRule := range dbRules {
			wh.Rules[j] = s.ruleToDomain(dbRule)
		}

		webhooks[i] = wh
	}
	return webhooks, nil
}

type CreateWebhookParams struct {
	MailboxID          int64
	Name               string
	URL                string
	Method             string
	Headers            map[string]string
	PayloadType        string
	CustomPayload      string
	HMACSecret         string
	TimeoutSec         int
	MaxRetries         int
	IncludeBody        bool
	IncludeAttachments bool
}

func (s *WebhookService) Create(ctx context.Context, params CreateWebhookParams) (*domain.Webhook, error) {
	headersJSON := "{}"
	if params.Headers != nil {
		data, _ := json.Marshal(params.Headers)
		headersJSON = string(data)
	}

	var includeBody, includeAttachments int64
	if params.IncludeBody {
		includeBody = 1
	}
	if params.IncludeAttachments {
		includeAttachments = 1
	}

	method := params.Method
	if method == "" {
		method = "POST"
	}

	payloadType := params.PayloadType
	if payloadType == "" {
		payloadType = "default"
	}

	dbWebhook, err := s.queries.CreateWebhook(ctx, db.CreateWebhookParams{
		MailboxID:          params.MailboxID,
		Name:               params.Name,
		Url:                params.URL,
		Method:             method,
		Headers:            sql.NullString{String: headersJSON, Valid: true},
		PayloadType:        payloadType,
		CustomPayload:      sql.NullString{String: params.CustomPayload, Valid: params.CustomPayload != ""},
		HmacSecret:         sql.NullString{String: params.HMACSecret, Valid: params.HMACSecret != ""},
		TimeoutSec:         int64(params.TimeoutSec),
		MaxRetries:         int64(params.MaxRetries),
		IncludeBody:        includeBody,
		IncludeAttachments: includeAttachments,
		IsActive:           1,
	})
	if err != nil {
		return nil, err
	}

	return s.toDomain(dbWebhook), nil
}

type UpdateWebhookParams struct {
	ID                 int64
	Name               string
	URL                string
	Method             string
	Headers            map[string]string
	PayloadType        string
	CustomPayload      string
	HMACSecret         string
	TimeoutSec         int
	MaxRetries         int
	IncludeBody        bool
	IncludeAttachments bool
	IsActive           bool
}

func (s *WebhookService) Update(ctx context.Context, params UpdateWebhookParams) (*domain.Webhook, error) {
	headersJSON := "{}"
	if params.Headers != nil {
		data, _ := json.Marshal(params.Headers)
		headersJSON = string(data)
	}

	var includeBody, includeAttachments, isActive int64
	if params.IncludeBody {
		includeBody = 1
	}
	if params.IncludeAttachments {
		includeAttachments = 1
	}
	if params.IsActive {
		isActive = 1
	}

	method := params.Method
	if method == "" {
		method = "POST"
	}

	payloadType := params.PayloadType
	if payloadType == "" {
		payloadType = "default"
	}

	dbWebhook, err := s.queries.UpdateWebhook(ctx, db.UpdateWebhookParams{
		ID:                 params.ID,
		Name:               params.Name,
		Url:                params.URL,
		Method:             method,
		Headers:            sql.NullString{String: headersJSON, Valid: true},
		PayloadType:        payloadType,
		CustomPayload:      sql.NullString{String: params.CustomPayload, Valid: params.CustomPayload != ""},
		HmacSecret:         sql.NullString{String: params.HMACSecret, Valid: params.HMACSecret != ""},
		TimeoutSec:         int64(params.TimeoutSec),
		MaxRetries:         int64(params.MaxRetries),
		IncludeBody:        includeBody,
		IncludeAttachments: includeAttachments,
		IsActive:           isActive,
	})
	if err != nil {
		return nil, err
	}

	return s.toDomain(dbWebhook), nil
}

func (s *WebhookService) Delete(ctx context.Context, id int64) error {
	return s.queries.DeleteWebhook(ctx, id)
}

func (s *WebhookService) CreateRule(ctx context.Context, webhookID int64, ruleGroup int, field, operator, value, headerName string) (*domain.WebhookRule, error) {
	dbRule, err := s.queries.CreateWebhookRule(ctx, db.CreateWebhookRuleParams{
		WebhookID:  webhookID,
		RuleGroup:  int64(ruleGroup),
		Field:      field,
		Operator:   operator,
		Value:      value,
		HeaderName: sql.NullString{String: headerName, Valid: headerName != ""},
	})
	if err != nil {
		return nil, err
	}

	rule := s.ruleToDomain(dbRule)
	return &rule, nil
}

func (s *WebhookService) DeleteRule(ctx context.Context, id int64) error {
	return s.queries.DeleteWebhookRule(ctx, id)
}

func (s *WebhookService) DeleteRulesByWebhook(ctx context.Context, webhookID int64) error {
	return s.queries.DeleteRulesByWebhook(ctx, webhookID)
}

func (s *WebhookService) GetDeliveryStats(ctx context.Context, webhookID int64) (*domain.WebhookDeliveryStats, error) {
	stats, err := s.queries.GetWebhookDeliveryStats(ctx, webhookID)
	if err != nil {
		return nil, err
	}

	var successCount, failedCount, pendingCount int64
	if stats.SuccessCount.Valid {
		successCount = int64(stats.SuccessCount.Float64)
	}
	if stats.FailedCount.Valid {
		failedCount = int64(stats.FailedCount.Float64)
	}
	if stats.PendingCount.Valid {
		pendingCount = int64(stats.PendingCount.Float64)
	}

	return &domain.WebhookDeliveryStats{
		Total:        stats.Total,
		SuccessCount: successCount,
		FailedCount:  failedCount,
		PendingCount: pendingCount,
	}, nil
}

func (s *WebhookService) toDomain(dbWebhook db.Webhook) *domain.Webhook {
	method := dbWebhook.Method
	if method == "" {
		method = "POST"
	}
	payloadType := dbWebhook.PayloadType
	if payloadType == "" {
		payloadType = "default"
	}
	webhook := &domain.Webhook{
		ID:                 dbWebhook.ID,
		MailboxID:          dbWebhook.MailboxID,
		Name:               dbWebhook.Name,
		URL:                dbWebhook.Url,
		Method:             method,
		PayloadType:        payloadType,
		TimeoutSec:         int(dbWebhook.TimeoutSec),
		MaxRetries:         int(dbWebhook.MaxRetries),
		IncludeBody:        dbWebhook.IncludeBody != 0,
		IncludeAttachments: dbWebhook.IncludeAttachments != 0,
		IsActive:           dbWebhook.IsActive != 0,
		CreatedAt:          dbWebhook.CreatedAt,
		UpdatedAt:          dbWebhook.UpdatedAt,
	}
	if dbWebhook.Headers.Valid {
		json.Unmarshal([]byte(dbWebhook.Headers.String), &webhook.Headers)
	}
	if dbWebhook.CustomPayload.Valid {
		webhook.CustomPayload = dbWebhook.CustomPayload.String
	}
	if dbWebhook.HmacSecret.Valid {
		webhook.HMACSecret = dbWebhook.HmacSecret.String
	}
	return webhook
}

func (s *WebhookService) ruleToDomain(dbRule db.WebhookRule) domain.WebhookRule {
	rule := domain.WebhookRule{
		ID:        dbRule.ID,
		WebhookID: dbRule.WebhookID,
		RuleGroup: int(dbRule.RuleGroup),
		Field:     dbRule.Field,
		Operator:  dbRule.Operator,
		Value:     dbRule.Value,
		CreatedAt: dbRule.CreatedAt,
	}
	if dbRule.HeaderName.Valid {
		rule.HeaderName = dbRule.HeaderName.String
	}
	return rule
}
