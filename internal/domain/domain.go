package domain

import (
	"time"
)

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
			Type:  "A",
			Name:  smtpHost,
			Value: "X.X.X.X",
			TTL:   3600,
		},
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
		// TODO: Add DMARC support later
		// {
		// 	Type:  "TXT",
		// 	Name:  "_dmarc." + d.Name,
		// 	Value: "v=DMARC1; p=none; rua=mailto:" + d.GetDMARCEmail() + "; adkim=s; aspf=s",
		// 	TTL:   3600,
		// },
	}
}

// TODO: Uncomment when DMARC support is added
// func (d *Domain) GetDMARCEmail() string {
// 	parts := strings.Split(d.Name, ".")
// 	if len(parts) > 2 {
// 		// Subdomain: hr.kapside.com -> dmarc-hr@kapside.com
// 		subdomain := parts[0]
// 		baseDomain := strings.Join(parts[1:], ".")
// 		return "dmarc-" + subdomain + "@" + baseDomain
// 	}
// 	// Main domain: kapside.com -> dmarc@kapside.com
// 	return "dmarc@" + d.Name
// }
