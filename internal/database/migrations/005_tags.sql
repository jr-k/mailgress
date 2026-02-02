-- Tags table
CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    color TEXT NOT NULL DEFAULT '#6366f1',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Domain tags junction table
CREATE TABLE IF NOT EXISTS domain_tags (
    domain_id INTEGER NOT NULL REFERENCES domains(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (domain_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_domain_tags_domain_id ON domain_tags(domain_id);
CREATE INDEX IF NOT EXISTS idx_domain_tags_tag_id ON domain_tags(tag_id);

-- Mailbox tags junction table
CREATE TABLE IF NOT EXISTS mailbox_tags (
    mailbox_id INTEGER NOT NULL REFERENCES mailboxes(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (mailbox_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_mailbox_tags_mailbox_id ON mailbox_tags(mailbox_id);
CREATE INDEX IF NOT EXISTS idx_mailbox_tags_tag_id ON mailbox_tags(tag_id);
