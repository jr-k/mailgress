-- Add read status to emails
ALTER TABLE emails ADD COLUMN is_read INTEGER NOT NULL DEFAULT 0;
