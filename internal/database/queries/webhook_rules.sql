-- name: GetWebhookRuleByID :one
SELECT * FROM webhook_rules WHERE id = ? LIMIT 1;

-- name: ListRulesByWebhook :many
SELECT * FROM webhook_rules WHERE webhook_id = ? ORDER BY rule_group, id;

-- name: CreateWebhookRule :one
INSERT INTO webhook_rules (webhook_id, rule_group, field, operator, value, header_name, created_at)
VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
RETURNING *;

-- name: DeleteWebhookRule :exec
DELETE FROM webhook_rules WHERE id = ?;

-- name: DeleteRulesByWebhook :exec
DELETE FROM webhook_rules WHERE webhook_id = ?;
