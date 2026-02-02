-- Add advanced settings to mailboxes
ALTER TABLE mailboxes ADD COLUMN max_email_size_mb INTEGER NOT NULL DEFAULT 25;
ALTER TABLE mailboxes ADD COLUMN max_attachment_size_mb INTEGER NOT NULL DEFAULT 10;
ALTER TABLE mailboxes ADD COLUMN retention_days INTEGER NOT NULL DEFAULT 90;
