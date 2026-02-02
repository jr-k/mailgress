-- name: GetDeliveryByID :one
SELECT * FROM webhook_deliveries WHERE id = ? LIMIT 1;

-- name: ListDeliveriesByWebhook :many
SELECT * FROM webhook_deliveries
WHERE webhook_id = ?
ORDER BY created_at DESC
LIMIT ? OFFSET ?;

-- name: ListDeliveriesByEmail :many
SELECT * FROM webhook_deliveries
WHERE email_id = ?
ORDER BY created_at DESC;

-- name: ListPendingDeliveries :many
SELECT * FROM webhook_deliveries
WHERE status = 'pending' OR status = 'retrying'
ORDER BY created_at ASC
LIMIT ?;

-- name: CreateDelivery :one
INSERT INTO webhook_deliveries (
    webhook_id, email_id, attempt, status,
    request_body, created_at
)
VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
RETURNING *;

-- name: UpdateDelivery :one
UPDATE webhook_deliveries
SET status = ?, status_code = ?, response_body = ?, error_message = ?, duration_ms = ?
WHERE id = ?
RETURNING *;

-- name: CountDeliveriesByWebhook :one
SELECT COUNT(*) FROM webhook_deliveries WHERE webhook_id = ?;

-- name: CountDeliveriesByStatus :one
SELECT COUNT(*) FROM webhook_deliveries WHERE webhook_id = ? AND status = ?;

-- name: GetWebhookDeliveryStats :one
SELECT
    COUNT(*) as total,
    SUM(CASE WHEN status = 'success' THEN 1 ELSE 0 END) as success_count,
    SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed_count,
    SUM(CASE WHEN status = 'pending' OR status = 'retrying' THEN 1 ELSE 0 END) as pending_count
FROM webhook_deliveries WHERE webhook_id = ?;

-- name: CancelRetryingByWebhook :exec
UPDATE webhook_deliveries
SET status = 'failed', error_message = 'Cancelled by user'
WHERE webhook_id = ? AND status = 'retrying';

-- name: DeleteAllByWebhook :exec
DELETE FROM webhook_deliveries WHERE webhook_id = ?;
