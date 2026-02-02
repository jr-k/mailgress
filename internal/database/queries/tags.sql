-- name: GetTagByID :one
SELECT * FROM tags WHERE id = ? LIMIT 1;

-- name: GetTagByName :one
SELECT * FROM tags WHERE name = ? LIMIT 1;

-- name: ListTags :many
SELECT * FROM tags ORDER BY name ASC;

-- name: CreateTag :one
INSERT INTO tags (name, color, created_at, updated_at)
VALUES (?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
RETURNING *;

-- name: UpdateTag :one
UPDATE tags
SET name = ?, color = ?, updated_at = CURRENT_TIMESTAMP
WHERE id = ?
RETURNING *;

-- name: DeleteTag :exec
DELETE FROM tags WHERE id = ?;

-- name: GetTagsForDomain :many
SELECT t.* FROM tags t
JOIN domain_tags dt ON dt.tag_id = t.id
WHERE dt.domain_id = ?
ORDER BY t.name ASC;

-- name: GetTagsForMailbox :many
SELECT t.* FROM tags t
JOIN mailbox_tags mt ON mt.tag_id = t.id
WHERE mt.mailbox_id = ?
ORDER BY t.name ASC;

-- name: AddTagToDomain :exec
INSERT OR IGNORE INTO domain_tags (domain_id, tag_id) VALUES (?, ?);

-- name: RemoveTagFromDomain :exec
DELETE FROM domain_tags WHERE domain_id = ? AND tag_id = ?;

-- name: ClearDomainTags :exec
DELETE FROM domain_tags WHERE domain_id = ?;

-- name: AddTagToMailbox :exec
INSERT OR IGNORE INTO mailbox_tags (mailbox_id, tag_id) VALUES (?, ?);

-- name: RemoveTagFromMailbox :exec
DELETE FROM mailbox_tags WHERE mailbox_id = ? AND tag_id = ?;

-- name: ClearMailboxTags :exec
DELETE FROM mailbox_tags WHERE mailbox_id = ?;

-- name: CountTagUsage :one
SELECT
    (SELECT COUNT(*) FROM domain_tags dt WHERE dt.tag_id = ?) +
    (SELECT COUNT(*) FROM mailbox_tags mt WHERE mt.tag_id = ?) AS total;
