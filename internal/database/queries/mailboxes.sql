-- name: GetMailboxByID :one
SELECT * FROM mailboxes WHERE id = ? LIMIT 1;

-- name: GetMailboxBySlug :one
SELECT * FROM mailboxes WHERE slug = ? LIMIT 1;

-- name: GetMailboxBySlugAndDomain :one
SELECT * FROM mailboxes WHERE slug = ? AND domain_id = ? LIMIT 1;

-- name: ListMailboxes :many
SELECT * FROM mailboxes ORDER BY created_at DESC;

-- name: ListMailboxesByOwner :many
SELECT * FROM mailboxes WHERE owner_id = ? ORDER BY created_at DESC;

-- name: ListMailboxesByDomain :many
SELECT * FROM mailboxes WHERE domain_id = ? ORDER BY created_at DESC;

-- name: CreateMailbox :one
INSERT INTO mailboxes (slug, owner_id, domain_id, description, is_active, max_email_size_mb, max_attachment_size_mb, retention_days, created_at, updated_at)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
RETURNING *;

-- name: UpdateMailbox :one
UPDATE mailboxes
SET slug = ?, owner_id = ?, domain_id = ?, description = ?, is_active = ?,
    max_email_size_mb = ?, max_attachment_size_mb = ?, retention_days = ?,
    updated_at = CURRENT_TIMESTAMP
WHERE id = ?
RETURNING *;

-- name: DeleteMailbox :exec
DELETE FROM mailboxes WHERE id = ?;

-- name: CountMailboxes :one
SELECT COUNT(*) FROM mailboxes;

-- name: MailboxExistsBySlug :one
SELECT EXISTS(SELECT 1 FROM mailboxes WHERE slug = ? AND is_active = 1);

-- name: MailboxExistsBySlugAndDomain :one
SELECT EXISTS(SELECT 1 FROM mailboxes WHERE slug = ? AND domain_id = ? AND is_active = 1);
