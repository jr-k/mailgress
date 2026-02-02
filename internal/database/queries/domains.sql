-- name: GetDomainByID :one
SELECT * FROM domains WHERE id = ?;

-- name: GetDomainByName :one
SELECT * FROM domains WHERE name = ?;

-- name: ListDomains :many
SELECT * FROM domains ORDER BY name ASC;

-- name: ListActiveDomains :many
SELECT * FROM domains WHERE is_active = 1 ORDER BY name ASC;

-- name: CreateDomain :one
INSERT INTO domains (name, is_verified, is_active)
VALUES (?, ?, ?)
RETURNING *;

-- name: UpdateDomain :one
UPDATE domains
SET name = ?, is_verified = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
WHERE id = ?
RETURNING *;

-- name: DeleteDomain :exec
DELETE FROM domains WHERE id = ?;

-- name: CountDomains :one
SELECT COUNT(*) FROM domains;

-- name: DomainExistsByName :one
SELECT COUNT(*) FROM domains WHERE name = ?;
