-- Add method column to webhooks table
ALTER TABLE webhooks ADD COLUMN method TEXT NOT NULL DEFAULT 'POST';
