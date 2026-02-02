-- name: GetWebhookByID :one
SELECT * FROM webhooks WHERE id = ? LIMIT 1;

-- name: ListWebhooksByMailbox :many
SELECT * FROM webhooks WHERE mailbox_id = ? ORDER BY created_at DESC;

-- name: ListActiveWebhooksByMailbox :many
SELECT * FROM webhooks WHERE mailbox_id = ? AND is_active = 1 ORDER BY created_at DESC;

-- name: CreateWebhook :one
INSERT INTO webhooks (
    mailbox_id, name, url, headers, hmac_secret,
    timeout_sec, max_retries, include_body, include_attachments, is_active,
    created_at, updated_at
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
RETURNING *;

-- name: UpdateWebhook :one
UPDATE webhooks
SET name = ?, url = ?, headers = ?, hmac_secret = ?,
    timeout_sec = ?, max_retries = ?, include_body = ?, include_attachments = ?,
    is_active = ?, updated_at = CURRENT_TIMESTAMP
WHERE id = ?
RETURNING *;

-- name: DeleteWebhook :exec
DELETE FROM webhooks WHERE id = ?;

-- name: CountWebhooksByMailbox :one
SELECT COUNT(*) FROM webhooks WHERE mailbox_id = ?;
