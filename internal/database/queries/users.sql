-- name: GetUserByID :one
SELECT * FROM users WHERE id = ? LIMIT 1;

-- name: GetUserByEmail :one
SELECT * FROM users WHERE email = ? LIMIT 1;

-- name: ListUsers :many
SELECT * FROM users ORDER BY created_at DESC;

-- name: CreateUser :one
INSERT INTO users (email, password_hash, is_admin, first_name, last_name, created_at, updated_at)
VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
RETURNING *;

-- name: UpdateUser :one
UPDATE users
SET email = ?, password_hash = ?, is_admin = ?, first_name = ?, last_name = ?, updated_at = CURRENT_TIMESTAMP
WHERE id = ?
RETURNING *;

-- name: UpdateUserAvatar :one
UPDATE users
SET avatar_path = ?, updated_at = CURRENT_TIMESTAMP
WHERE id = ?
RETURNING *;

-- name: DeleteUser :exec
DELETE FROM users WHERE id = ?;

-- name: CountUsers :one
SELECT COUNT(*) FROM users;

-- name: UpdateUserTOTP :one
UPDATE users
SET totp_secret = ?, totp_enabled = ?, totp_backup_codes = ?, updated_at = CURRENT_TIMESTAMP
WHERE id = ?
RETURNING *;

-- name: DisableUserTOTP :one
UPDATE users
SET totp_secret = '', totp_enabled = 0, totp_backup_codes = '', updated_at = CURRENT_TIMESTAMP
WHERE id = ?
RETURNING *;
