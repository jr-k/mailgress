-- Domains table
CREATE TABLE IF NOT EXISTS domains (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    is_verified INTEGER NOT NULL DEFAULT 0,
    is_active INTEGER NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_domains_name ON domains(name);

-- Add domain_id to mailboxes
ALTER TABLE mailboxes ADD COLUMN domain_id INTEGER REFERENCES domains(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_mailboxes_domain_id ON mailboxes(domain_id);
