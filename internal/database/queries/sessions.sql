-- name: GetSessionByToken :one
SELECT * FROM sessions WHERE token = ? AND expires_at > CURRENT_TIMESTAMP LIMIT 1;

-- name: CreateSession :one
INSERT INTO sessions (token, user_id, expires_at, created_at)
VALUES (?, ?, ?, CURRENT_TIMESTAMP)
RETURNING *;

-- name: DeleteSession :exec
DELETE FROM sessions WHERE token = ?;

-- name: DeleteSessionsByUser :exec
DELETE FROM sessions WHERE user_id = ?;

-- name: DeleteExpiredSessions :exec
DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP;
