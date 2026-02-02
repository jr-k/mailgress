-- name: GetEmailByID :one
SELECT * FROM emails WHERE id = ? LIMIT 1;

-- name: ListEmailsByMailbox :many
SELECT * FROM emails
WHERE mailbox_id = ?
ORDER BY received_at DESC
LIMIT ? OFFSET ?;

-- name: SearchEmails :many
SELECT * FROM emails
WHERE mailbox_id = ?
AND (subject LIKE ? OR from_address LIKE ?)
ORDER BY received_at DESC
LIMIT ? OFFSET ?;

-- name: CountSearchEmails :one
SELECT COUNT(*) FROM emails
WHERE mailbox_id = ?
AND (subject LIKE ? OR from_address LIKE ?);

-- name: CreateEmail :one
INSERT INTO emails (
    mailbox_id, message_id, from_address, to_address, subject,
    date, headers, text_body, html_body, raw_size, is_read, received_at
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, CURRENT_TIMESTAMP)
RETURNING *;

-- name: DeleteEmail :exec
DELETE FROM emails WHERE id = ?;

-- name: DeleteOldEmails :exec
DELETE FROM emails WHERE received_at < ?;

-- name: DeleteOldEmailsByMailbox :exec
DELETE FROM emails WHERE mailbox_id = ? AND received_at < ?;

-- name: CountEmailsByMailbox :one
SELECT COUNT(*) FROM emails WHERE mailbox_id = ?;

-- name: CountAllEmails :one
SELECT COUNT(*) FROM emails;

-- name: GetMailboxStats :one
SELECT
    COUNT(*) as email_count,
    MAX(received_at) as last_email_at,
    (SELECT COUNT(*) FROM webhooks WHERE mailbox_id = sqlc.arg(mailbox_id)) as webhook_count
FROM emails WHERE mailbox_id = sqlc.arg(mailbox_id);

-- name: MarkEmailAsRead :exec
UPDATE emails SET is_read = 1 WHERE id = ?;

-- name: MarkEmailAsUnread :exec
UPDATE emails SET is_read = 0 WHERE id = ?;

-- name: CountUnreadByMailbox :one
SELECT COUNT(*) FROM emails WHERE mailbox_id = ? AND is_read = 0;
