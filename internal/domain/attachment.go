package domain

import "time"

type Attachment struct {
	ID          int64     `json:"id"`
	EmailID     int64     `json:"email_id"`
	Filename    string    `json:"filename"`
	ContentType string    `json:"content_type"`
	Size        int64     `json:"size"`
	StoragePath string    `json:"-"`
	CreatedAt   time.Time `json:"created_at"`

	DownloadURL string `json:"download_url,omitempty"`
}
