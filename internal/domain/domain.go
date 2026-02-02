package domain

import "time"

type Domain struct {
	ID         int64     `json:"id"`
	Name       string    `json:"name"`
	IsVerified bool      `json:"is_verified"`
	IsActive   bool      `json:"is_active"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`

	MailboxCount int64 `json:"mailbox_count,omitempty"`
}

type DNSRecord struct {
	Type     string `json:"type"`
	Name     string `json:"name"`
	Value    string `json:"value"`
	Priority int    `json:"priority,omitempty"`
	TTL      int    `json:"ttl"`
}

func (d *Domain) GetDNSRecords() []DNSRecord {
	smtpHost := "mail." + d.Name
	return []DNSRecord{
		{
			Type:     "MX",
			Name:     d.Name,
			Value:    smtpHost,
			Priority: 10,
			TTL:      3600,
		},
		{
			Type:  "TXT",
			Name:  d.Name,
			Value: "v=spf1 mx ~all",
			TTL:   3600,
		},
	}
}
