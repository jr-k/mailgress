package domain

import (
	"encoding/json"
	"time"
)

type Webhook struct {
	ID                 int64             `json:"id"`
	MailboxID          int64             `json:"mailbox_id"`
	Name               string            `json:"name"`
	URL                string            `json:"url"`
	Method             string            `json:"method"`
	Headers            map[string]string `json:"headers"`
	PayloadType        string            `json:"payload_type"`
	CustomPayload      string            `json:"custom_payload,omitempty"`
	HMACSecret         string            `json:"hmac_secret,omitempty"`
	TimeoutSec         int               `json:"timeout_sec"`
	MaxRetries         int               `json:"max_retries"`
	IncludeBody        bool              `json:"include_body"`
	IncludeAttachments bool              `json:"include_attachments"`
	IsActive           bool              `json:"is_active"`
	CreatedAt          time.Time         `json:"created_at"`
	UpdatedAt          time.Time         `json:"updated_at"`

	Rules         []WebhookRule         `json:"rules,omitempty"`
	DeliveryStats *WebhookDeliveryStats `json:"delivery_stats,omitempty"`
}

func (w *Webhook) HeadersJSON() string {
	if w.Headers == nil {
		return "{}"
	}
	data, _ := json.Marshal(w.Headers)
	return string(data)
}

type WebhookRule struct {
	ID         int64     `json:"id"`
	WebhookID  int64     `json:"webhook_id"`
	RuleGroup  int       `json:"rule_group"`
	Field      string    `json:"field"`
	Operator   string    `json:"operator"`
	Value      string    `json:"value"`
	HeaderName string    `json:"header_name,omitempty"`
	CreatedAt  time.Time `json:"created_at"`
}

type WebhookDelivery struct {
	ID           int64     `json:"id"`
	WebhookID    int64     `json:"webhook_id"`
	EmailID      int64     `json:"email_id"`
	Attempt      int       `json:"attempt"`
	Status       string    `json:"status"`
	StatusCode   *int      `json:"status_code"`
	RequestBody  string    `json:"request_body,omitempty"`
	ResponseBody string    `json:"response_body,omitempty"`
	ErrorMessage string    `json:"error_message,omitempty"`
	DurationMs   *int      `json:"duration_ms"`
	CreatedAt    time.Time `json:"created_at"`

	Email   *Email   `json:"email,omitempty"`
	Webhook *Webhook `json:"webhook,omitempty"`
}

type WebhookDeliveryStats struct {
	Total        int64 `json:"total"`
	SuccessCount int64 `json:"success_count"`
	FailedCount  int64 `json:"failed_count"`
	PendingCount int64 `json:"pending_count"`
}

const (
	DeliveryStatusPending  = "pending"
	DeliveryStatusRetrying = "retrying"
	DeliveryStatusSuccess  = "success"
	DeliveryStatusFailed   = "failed"
)

const (
	RuleFieldSubject        = "subject"
	RuleFieldFrom           = "from"
	RuleFieldTo             = "to"
	RuleFieldHeader         = "header"
	RuleFieldHasAttachments = "has_attachments"
	RuleFieldSize           = "size"
)

const (
	RuleOperatorContains    = "contains"
	RuleOperatorNotContains = "not_contains"
	RuleOperatorEquals      = "equals"
	RuleOperatorRegex       = "regex"
	RuleOperatorGt          = "gt"
	RuleOperatorLt          = "lt"
)
