-- Add payload_type and custom_payload columns to webhooks table
ALTER TABLE webhooks ADD COLUMN payload_type TEXT NOT NULL DEFAULT 'default';
ALTER TABLE webhooks ADD COLUMN custom_payload TEXT;
