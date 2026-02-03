package buildinfo

var (
	Version     = "master"
	Author      = "jr-k"
	Email       = "jrk@jierka.com"
	Website     = "https://github.com/jr-k/mailgress"
	License     = "Mailgress"
	Copyright   = "2026 jr-k"
	Description = "Make email programmable: receive messages, normalize payloads, and dispatch webhooks to your domain."
	Features    = []string{
		"Unlimited mailboxes on your domains",
		"Plus-addressing support (inbox+tag@domain.com)",
		"Webhook notifications with custom filters",
		"Signed payloads for secure integrations",
		"Attachment support",
		"Automatic retention policies",
		"Multi-user with role management",
		"Two-factor authentication",
	}
	Commit = "none"
	Date   = "unknown"
)

func Long() string {
	return "Version: " + Version + "\nCommit:  " + Commit + "\nBuilt:   " + Date
}
