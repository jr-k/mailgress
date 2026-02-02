package webhook

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/jr-k/mailgress/internal/domain"
)

type Payload struct {
	Event     string                 `json:"event"`
	Timestamp string                 `json:"timestamp"`
	Email     EmailPayload           `json:"email"`
	Metadata  map[string]interface{} `json:"metadata,omitempty"`
}

type EmailPayload struct {
	ID          int64                 `json:"id"`
	MailboxID   int64                 `json:"mailbox_id"`
	MessageID   string                `json:"message_id,omitempty"`
	From        string                `json:"from"`
	To          string                `json:"to"`
	Subject     string                `json:"subject"`
	Date        *time.Time            `json:"date,omitempty"`
	ReceivedAt  time.Time             `json:"received_at"`
	Size        int64                 `json:"size"`
	TextBody    string                `json:"text_body,omitempty"`
	HTMLBody    string                `json:"html_body,omitempty"`
	Headers     map[string]string     `json:"headers,omitempty"`
	Attachments []AttachmentPayload   `json:"attachments,omitempty"`
}

type AttachmentPayload struct {
	ID          int64  `json:"id"`
	Filename    string `json:"filename"`
	ContentType string `json:"content_type"`
	Size        int64  `json:"size"`
}

func BuildPayload(email *domain.Email, webhook *domain.Webhook) *Payload {
	payload := &Payload{
		Event:     "email.received",
		Timestamp: time.Now().UTC().Format(time.RFC3339),
		Email: EmailPayload{
			ID:         email.ID,
			MailboxID:  email.MailboxID,
			MessageID:  email.MessageID,
			From:       email.FromAddress,
			To:         email.ToAddress,
			Subject:    email.Subject,
			Date:       email.Date,
			ReceivedAt: email.ReceivedAt,
			Size:       email.RawSize,
		},
	}

	if webhook.IncludeBody {
		payload.Email.TextBody = email.TextBody
		payload.Email.HTMLBody = email.HTMLBody
		payload.Email.Headers = email.Headers
	}

	if webhook.IncludeAttachments && len(email.Attachments) > 0 {
		payload.Email.Attachments = make([]AttachmentPayload, len(email.Attachments))
		for i, att := range email.Attachments {
			payload.Email.Attachments[i] = AttachmentPayload{
				ID:          att.ID,
				Filename:    att.Filename,
				ContentType: att.ContentType,
				Size:        att.Size,
			}
		}
	}

	// Parse and inject metadata
	if webhook.CustomPayload != "" {
		payload.Metadata = parseMetadata(webhook.PayloadType, webhook.CustomPayload, email)
	}

	return payload
}

func parseMetadata(payloadType string, customPayload string, email *domain.Email) map[string]interface{} {
	metadata := make(map[string]interface{})

	switch payloadType {
	case "json":
		// Parse raw JSON
		if err := json.Unmarshal([]byte(customPayload), &metadata); err != nil {
			return nil
		}
	case "key_value":
		// Parse key-value array: [{"key": "foo", "value": "bar"}, ...]
		var kvPairs []struct {
			Key   string `json:"key"`
			Value string `json:"value"`
		}
		if err := json.Unmarshal([]byte(customPayload), &kvPairs); err != nil {
			return nil
		}
		for _, kv := range kvPairs {
			if kv.Key != "" {
				metadata[kv.Key] = kv.Value
			}
		}
	default:
		return nil
	}

	// Apply template substitution for string values
	if email != nil {
		metadata = substituteTemplateVars(metadata, email)
	}

	if len(metadata) == 0 {
		return nil
	}

	return metadata
}

func substituteTemplateVars(metadata map[string]interface{}, email *domain.Email) map[string]interface{} {
	replacer := map[string]string{
		"{{email.id}}":          fmt.Sprintf("%d", email.ID),
		"{{email.mailbox_id}}":  fmt.Sprintf("%d", email.MailboxID),
		"{{email.message_id}}":  email.MessageID,
		"{{email.from}}":        email.FromAddress,
		"{{email.to}}":          email.ToAddress,
		"{{email.subject}}":     email.Subject,
		"{{email.address}}":     email.ToAddress,
		"{{email.size}}":        fmt.Sprintf("%d", email.RawSize),
		"{{email.text_body}}":   email.TextBody,
		"{{email.html_body}}":   email.HTMLBody,
	}

	for key, value := range metadata {
		if strVal, ok := value.(string); ok {
			for placeholder, replacement := range replacer {
				strVal = replaceAll(strVal, placeholder, replacement)
			}
			metadata[key] = strVal
		}
	}

	return metadata
}

func replaceAll(s, old, new string) string {
	for {
		idx := indexOf(s, old)
		if idx == -1 {
			return s
		}
		s = s[:idx] + new + s[idx+len(old):]
	}
}

func indexOf(s, substr string) int {
	for i := 0; i <= len(s)-len(substr); i++ {
		if s[i:i+len(substr)] == substr {
			return i
		}
	}
	return -1
}

func (p *Payload) JSON() ([]byte, error) {
	return json.Marshal(p)
}

func BuildTestPayload(webhook *domain.Webhook) *Payload {
	now := time.Now()
	testEmail := &domain.Email{
		ID:          0,
		MailboxID:   0,
		MessageID:   "<test@mailgress.local>",
		FromAddress: "test@example.com",
		ToAddress:   "mailbox@mailgress.local",
		Subject:     "Test webhook delivery",
		Date:        &now,
		ReceivedAt:  now,
		RawSize:     1024,
		TextBody:    "This is a test webhook delivery from Mailgress.",
		HTMLBody:    "<p>This is a test webhook delivery from Mailgress.</p>",
	}

	payload := &Payload{
		Event:     "test",
		Timestamp: now.UTC().Format(time.RFC3339),
		Email: EmailPayload{
			ID:         testEmail.ID,
			MailboxID:  testEmail.MailboxID,
			MessageID:  testEmail.MessageID,
			From:       testEmail.FromAddress,
			To:         testEmail.ToAddress,
			Subject:    testEmail.Subject,
			Date:       testEmail.Date,
			ReceivedAt: testEmail.ReceivedAt,
			Size:       testEmail.RawSize,
			TextBody:   testEmail.TextBody,
			HTMLBody:   testEmail.HTMLBody,
			Headers: map[string]string{
				"Content-Type": "text/plain",
			},
		},
	}

	// Parse and inject metadata with test email data
	if webhook != nil && webhook.CustomPayload != "" {
		payload.Metadata = parseMetadata(webhook.PayloadType, webhook.CustomPayload, testEmail)
	}

	return payload
}
