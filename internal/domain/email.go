package domain

import (
	"encoding/json"
	"time"
)

type Email struct {
	ID          int64             `json:"id"`
	MailboxID   int64             `json:"mailbox_id"`
	MessageID   string            `json:"message_id"`
	FromAddress string            `json:"from_address"`
	ToAddress   string            `json:"to_address"`
	Subject     string            `json:"subject"`
	Date        *time.Time        `json:"date"`
	Headers     map[string]string `json:"headers"`
	TextBody    string            `json:"text_body"`
	HTMLBody    string            `json:"html_body"`
	RawSize     int64             `json:"raw_size"`
	ReceivedAt  time.Time         `json:"received_at"`
	IsRead      bool              `json:"is_read"`

	Attachments    []Attachment `json:"attachments,omitempty"`
	HasAttachments bool         `json:"has_attachments"`
}

func (e *Email) HeadersJSON() string {
	if e.Headers == nil {
		return "{}"
	}
	data, _ := json.Marshal(e.Headers)
	return string(data)
}
