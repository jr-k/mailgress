package webhook

import (
	"encoding/json"
	"time"

	"github.com/jr-k/mailgress/internal/domain"
)

type Payload struct {
	Event     string        `json:"event"`
	Timestamp string        `json:"timestamp"`
	Email     EmailPayload  `json:"email"`
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

	return payload
}

func (p *Payload) JSON() ([]byte, error) {
	return json.Marshal(p)
}

func BuildTestPayload() *Payload {
	now := time.Now()
	return &Payload{
		Event:     "test",
		Timestamp: now.UTC().Format(time.RFC3339),
		Email: EmailPayload{
			ID:         0,
			MailboxID:  0,
			MessageID:  "<test@mailgress.local>",
			From:       "test@example.com",
			To:         "mailbox@mailgress.local",
			Subject:    "Test webhook delivery",
			Date:       &now,
			ReceivedAt: now,
			Size:       1024,
			TextBody:   "This is a test webhook delivery from Mailgress.",
			HTMLBody:   "<p>This is a test webhook delivery from Mailgress.</p>",
			Headers: map[string]string{
				"Content-Type": "text/plain",
			},
		},
	}
}
