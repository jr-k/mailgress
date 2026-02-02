-- name: GetSetting :one
SELECT * FROM settings WHERE key = ?;

-- name: GetSettings :many
SELECT * FROM settings ORDER BY key;

-- name: UpsertSetting :one
INSERT INTO settings (key, value, updated_at)
VALUES (?, ?, CURRENT_TIMESTAMP)
ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
RETURNING *;

-- name: DeleteSetting :exec
DELETE FROM settings WHERE key = ?;
