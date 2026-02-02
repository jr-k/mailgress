package domain

import "time"

type Mailbox struct {
	ID          int64     `json:"id"`
	Slug        string    `json:"slug"`
	OwnerID     *int64    `json:"owner_id"`
	DomainID    *int64    `json:"domain_id"`
	Description string    `json:"description"`
	IsActive    bool      `json:"is_active"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`

	// Advanced settings
	MaxEmailSizeMB      int `json:"max_email_size_mb"`
	MaxAttachmentSizeMB int `json:"max_attachment_size_mb"`
	RetentionDays       int `json:"retention_days"`

	Owner      *User         `json:"owner,omitempty"`
	Domain     *Domain       `json:"domain,omitempty"`
	EmailCount int64         `json:"email_count,omitempty"`
	Stats      *MailboxStats `json:"stats,omitempty"`
}

type MailboxStats struct {
	EmailCount  int64      `json:"email_count"`
	LastEmailAt *time.Time `json:"last_email_at"`
}

func (m *Mailbox) EmailAddress() string {
	if m.Domain != nil {
		return m.Slug + "@" + m.Domain.Name
	}
	return m.Slug
}

func (m *Mailbox) MaxEmailSizeBytes() int64 {
	return int64(m.MaxEmailSizeMB) * 1024 * 1024
}

func (m *Mailbox) MaxAttachmentSizeBytes() int64 {
	return int64(m.MaxAttachmentSizeMB) * 1024 * 1024
}

// Default values for advanced settings
const (
	DefaultMaxEmailSizeMB      = 25
	DefaultMaxAttachmentSizeMB = 10
	DefaultRetentionDays       = 90
)
