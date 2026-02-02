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

-- name: CreateEmail :one
INSERT INTO emails (
    mailbox_id, message_id, from_address, to_address, subject,
    date, headers, text_body, html_body, raw_size, received_at
)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
RETURNING *;

-- name: DeleteEmail :exec
DELETE FROM emails WHERE id = ?;

-- name: DeleteOldEmails :exec
DELETE FROM emails WHERE received_at < ?;

-- name: CountEmailsByMailbox :one
SELECT COUNT(*) FROM emails WHERE mailbox_id = ?;

-- name: CountAllEmails :one
SELECT COUNT(*) FROM emails;

-- name: GetMailboxStats :one
SELECT
    COUNT(*) as email_count,
    MAX(received_at) as last_email_at
FROM emails WHERE mailbox_id = ?;
