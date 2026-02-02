package service

import (
	"context"
	"database/sql"
	"errors"

	"github.com/jr-k/mailgress/internal/database/db"
	"github.com/jr-k/mailgress/internal/domain"
)

var ErrDeliveryNotFound = errors.New("delivery not found")

type DeliveryService struct {
	queries *db.Queries
}

func NewDeliveryService(queries *db.Queries) *DeliveryService {
	return &DeliveryService{queries: queries}
}

func (s *DeliveryService) GetByID(ctx context.Context, id int64) (*domain.WebhookDelivery, error) {
	dbDelivery, err := s.queries.GetDeliveryByID(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrDeliveryNotFound
		}
		return nil, err
	}
	return s.toDomain(dbDelivery), nil
}

func (s *DeliveryService) ListByWebhook(ctx context.Context, webhookID int64, limit, offset int64) ([]*domain.WebhookDelivery, error) {
	dbDeliveries, err := s.queries.ListDeliveriesByWebhook(ctx, db.ListDeliveriesByWebhookParams{
		WebhookID: webhookID,
		Limit:     limit,
		Offset:    offset,
	})
	if err != nil {
		return nil, err
	}

	deliveries := make([]*domain.WebhookDelivery, len(dbDeliveries))
	for i, dbDelivery := range dbDeliveries {
		deliveries[i] = s.toDomain(dbDelivery)
	}
	return deliveries, nil
}

func (s *DeliveryService) ListByEmail(ctx context.Context, emailID int64) ([]*domain.WebhookDelivery, error) {
	dbDeliveries, err := s.queries.ListDeliveriesByEmail(ctx, emailID)
	if err != nil {
		return nil, err
	}

	deliveries := make([]*domain.WebhookDelivery, len(dbDeliveries))
	for i, dbDelivery := range dbDeliveries {
		deliveries[i] = s.toDomain(dbDelivery)
	}
	return deliveries, nil
}

func (s *DeliveryService) ListPending(ctx context.Context, limit int64) ([]*domain.WebhookDelivery, error) {
	dbDeliveries, err := s.queries.ListPendingDeliveries(ctx, limit)
	if err != nil {
		return nil, err
	}

	deliveries := make([]*domain.WebhookDelivery, len(dbDeliveries))
	for i, dbDelivery := range dbDeliveries {
		deliveries[i] = s.toDomain(dbDelivery)
	}
	return deliveries, nil
}

func (s *DeliveryService) Create(ctx context.Context, webhookID, emailID int64, attempt int, requestBody string) (*domain.WebhookDelivery, error) {
	dbDelivery, err := s.queries.CreateDelivery(ctx, db.CreateDeliveryParams{
		WebhookID:   webhookID,
		EmailID:     emailID,
		Attempt:     int64(attempt),
		Status:      domain.DeliveryStatusPending,
		RequestBody: sql.NullString{String: requestBody, Valid: requestBody != ""},
	})
	if err != nil {
		return nil, err
	}
	return s.toDomain(dbDelivery), nil
}

func (s *DeliveryService) UpdateStatus(ctx context.Context, id int64, status string, statusCode *int, responseBody, errorMessage string, durationMs *int) (*domain.WebhookDelivery, error) {
	var dbStatusCode sql.NullInt64
	if statusCode != nil {
		dbStatusCode = sql.NullInt64{Int64: int64(*statusCode), Valid: true}
	}

	var dbDurationMs sql.NullInt64
	if durationMs != nil {
		dbDurationMs = sql.NullInt64{Int64: int64(*durationMs), Valid: true}
	}

	dbDelivery, err := s.queries.UpdateDelivery(ctx, db.UpdateDeliveryParams{
		ID:           id,
		Status:       status,
		StatusCode:   dbStatusCode,
		ResponseBody: sql.NullString{String: responseBody, Valid: responseBody != ""},
		ErrorMessage: sql.NullString{String: errorMessage, Valid: errorMessage != ""},
		DurationMs:   dbDurationMs,
	})
	if err != nil {
		return nil, err
	}
	return s.toDomain(dbDelivery), nil
}

func (s *DeliveryService) CountByWebhook(ctx context.Context, webhookID int64) (int64, error) {
	return s.queries.CountDeliveriesByWebhook(ctx, webhookID)
}

func (s *DeliveryService) toDomain(dbDelivery db.WebhookDelivery) *domain.WebhookDelivery {
	delivery := &domain.WebhookDelivery{
		ID:        dbDelivery.ID,
		WebhookID: dbDelivery.WebhookID,
		EmailID:   dbDelivery.EmailID,
		Attempt:   int(dbDelivery.Attempt),
		Status:    dbDelivery.Status,
		CreatedAt: dbDelivery.CreatedAt,
	}
	if dbDelivery.StatusCode.Valid {
		v := int(dbDelivery.StatusCode.Int64)
		delivery.StatusCode = &v
	}
	if dbDelivery.RequestBody.Valid {
		delivery.RequestBody = dbDelivery.RequestBody.String
	}
	if dbDelivery.ResponseBody.Valid {
		delivery.ResponseBody = dbDelivery.ResponseBody.String
	}
	if dbDelivery.ErrorMessage.Valid {
		delivery.ErrorMessage = dbDelivery.ErrorMessage.String
	}
	if dbDelivery.DurationMs.Valid {
		v := int(dbDelivery.DurationMs.Int64)
		delivery.DurationMs = &v
	}
	return delivery
}
