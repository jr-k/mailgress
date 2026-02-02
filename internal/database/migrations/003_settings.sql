-- Application settings (key-value store)
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Insert default onboarding status
INSERT OR IGNORE INTO settings (key, value) VALUES ('onboarding_completed', 'false');
