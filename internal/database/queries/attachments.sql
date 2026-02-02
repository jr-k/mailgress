-- name: GetAttachmentByID :one
SELECT * FROM attachments WHERE id = ? LIMIT 1;

-- name: ListAttachmentsByEmail :many
SELECT * FROM attachments WHERE email_id = ? ORDER BY id;

-- name: CreateAttachment :one
INSERT INTO attachments (email_id, filename, content_type, size, storage_path, created_at)
VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
RETURNING *;

-- name: DeleteAttachment :exec
DELETE FROM attachments WHERE id = ?;

-- name: DeleteAttachmentsByEmail :exec
DELETE FROM attachments WHERE email_id = ?;
