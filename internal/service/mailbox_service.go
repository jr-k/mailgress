package service

import (
	"context"
	"database/sql"
	"errors"
	"regexp"
	"strings"
	"time"

	"github.com/jessym/mailgress/internal/database/db"
	"github.com/jessym/mailgress/internal/domain"
)

var (
	ErrMailboxNotFound = errors.New("mailbox not found")
	ErrInvalidSlug     = errors.New("invalid slug format")
	slugPattern        = regexp.MustCompile(`^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$`)
)

type MailboxService struct {
	queries *db.Queries
}

func NewMailboxService(queries *db.Queries) *MailboxService {
	return &MailboxService{queries: queries}
}

func (s *MailboxService) GetByID(ctx context.Context, id int64) (*domain.Mailbox, error) {
	dbMailbox, err := s.queries.GetMailboxByID(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrMailboxNotFound
		}
		return nil, err
	}
	return s.toDomain(dbMailbox), nil
}

func (s *MailboxService) GetBySlug(ctx context.Context, slug string) (*domain.Mailbox, error) {
	dbMailbox, err := s.queries.GetMailboxBySlug(ctx, slug)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrMailboxNotFound
		}
		return nil, err
	}
	return s.toDomain(dbMailbox), nil
}

func (s *MailboxService) ExistsBySlug(ctx context.Context, slug string) (bool, error) {
	exists, err := s.queries.MailboxExistsBySlug(ctx, slug)
	if err != nil {
		return false, err
	}
	return exists != 0, nil
}

func (s *MailboxService) List(ctx context.Context) ([]*domain.Mailbox, error) {
	dbMailboxes, err := s.queries.ListMailboxes(ctx)
	if err != nil {
		return nil, err
	}

	mailboxes := make([]*domain.Mailbox, len(dbMailboxes))
	for i, dbMailbox := range dbMailboxes {
		mailboxes[i] = s.toDomain(dbMailbox)
	}
	return mailboxes, nil
}

func (s *MailboxService) ListByOwner(ctx context.Context, ownerID int64) ([]*domain.Mailbox, error) {
	dbMailboxes, err := s.queries.ListMailboxesByOwner(ctx, sql.NullInt64{Int64: ownerID, Valid: true})
	if err != nil {
		return nil, err
	}

	mailboxes := make([]*domain.Mailbox, len(dbMailboxes))
	for i, dbMailbox := range dbMailboxes {
		mailboxes[i] = s.toDomain(dbMailbox)
	}
	return mailboxes, nil
}

func (s *MailboxService) Create(ctx context.Context, slug string, ownerID *int64, domainID *int64, description string) (*domain.Mailbox, error) {
	slug = strings.ToLower(strings.TrimSpace(slug))
	if !slugPattern.MatchString(slug) {
		return nil, ErrInvalidSlug
	}

	var ownerIDVal sql.NullInt64
	if ownerID != nil {
		ownerIDVal = sql.NullInt64{Int64: *ownerID, Valid: true}
	}

	var domainIDVal sql.NullInt64
	if domainID != nil {
		domainIDVal = sql.NullInt64{Int64: *domainID, Valid: true}
	}

	dbMailbox, err := s.queries.CreateMailbox(ctx, db.CreateMailboxParams{
		Slug:        slug,
		OwnerID:     ownerIDVal,
		DomainID:    domainIDVal,
		Description: sql.NullString{String: description, Valid: description != ""},
		IsActive:    1,
	})
	if err != nil {
		return nil, err
	}

	return s.toDomain(dbMailbox), nil
}

func (s *MailboxService) Update(ctx context.Context, id int64, slug string, ownerID *int64, domainID *int64, description string, isActive bool) (*domain.Mailbox, error) {
	slug = strings.ToLower(strings.TrimSpace(slug))
	if !slugPattern.MatchString(slug) {
		return nil, ErrInvalidSlug
	}

	var activeFlag int64
	if isActive {
		activeFlag = 1
	}

	var ownerIDVal sql.NullInt64
	if ownerID != nil {
		ownerIDVal = sql.NullInt64{Int64: *ownerID, Valid: true}
	}

	var domainIDVal sql.NullInt64
	if domainID != nil {
		domainIDVal = sql.NullInt64{Int64: *domainID, Valid: true}
	}

	dbMailbox, err := s.queries.UpdateMailbox(ctx, db.UpdateMailboxParams{
		ID:          id,
		Slug:        slug,
		OwnerID:     ownerIDVal,
		DomainID:    domainIDVal,
		Description: sql.NullString{String: description, Valid: description != ""},
		IsActive:    activeFlag,
	})
	if err != nil {
		return nil, err
	}

	return s.toDomain(dbMailbox), nil
}

func (s *MailboxService) Delete(ctx context.Context, id int64) error {
	return s.queries.DeleteMailbox(ctx, id)
}

func (s *MailboxService) Count(ctx context.Context) (int64, error) {
	return s.queries.CountMailboxes(ctx)
}

func (s *MailboxService) GetStats(ctx context.Context, mailboxID int64) (*domain.MailboxStats, error) {
	stats, err := s.queries.GetMailboxStats(ctx, mailboxID)
	if err != nil {
		return nil, err
	}
	result := &domain.MailboxStats{
		EmailCount: stats.EmailCount,
	}
	if stats.LastEmailAt != nil {
		if t, ok := stats.LastEmailAt.(time.Time); ok {
			result.LastEmailAt = &t
		}
	}
	return result, nil
}

func (s *MailboxService) GetBySlugAndDomain(ctx context.Context, slug string, domainID int64) (*domain.Mailbox, error) {
	dbMailbox, err := s.queries.GetMailboxBySlugAndDomain(ctx, db.GetMailboxBySlugAndDomainParams{
		Slug:     slug,
		DomainID: sql.NullInt64{Int64: domainID, Valid: true},
	})
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrMailboxNotFound
		}
		return nil, err
	}
	return s.toDomain(dbMailbox), nil
}

func (s *MailboxService) ExistsBySlugAndDomain(ctx context.Context, slug string, domainID int64) (bool, error) {
	exists, err := s.queries.MailboxExistsBySlugAndDomain(ctx, db.MailboxExistsBySlugAndDomainParams{
		Slug:     slug,
		DomainID: sql.NullInt64{Int64: domainID, Valid: true},
	})
	if err != nil {
		return false, err
	}
	return exists != 0, nil
}

func (s *MailboxService) ListByDomain(ctx context.Context, domainID int64) ([]*domain.Mailbox, error) {
	dbMailboxes, err := s.queries.ListMailboxesByDomain(ctx, sql.NullInt64{Int64: domainID, Valid: true})
	if err != nil {
		return nil, err
	}

	mailboxes := make([]*domain.Mailbox, len(dbMailboxes))
	for i, dbMailbox := range dbMailboxes {
		mailboxes[i] = s.toDomain(dbMailbox)
	}
	return mailboxes, nil
}

func (s *MailboxService) toDomain(dbMailbox db.Mailbox) *domain.Mailbox {
	mailbox := &domain.Mailbox{
		ID:        dbMailbox.ID,
		Slug:      dbMailbox.Slug,
		IsActive:  dbMailbox.IsActive != 0,
		CreatedAt: dbMailbox.CreatedAt,
		UpdatedAt: dbMailbox.UpdatedAt,
	}
	if dbMailbox.OwnerID.Valid {
		mailbox.OwnerID = &dbMailbox.OwnerID.Int64
	}
	if dbMailbox.DomainID.Valid {
		mailbox.DomainID = &dbMailbox.DomainID.Int64
	}
	if dbMailbox.Description.Valid {
		mailbox.Description = dbMailbox.Description.String
	}
	return mailbox
}


func ExtractSlug(localPart string) string {
	if idx := strings.Index(localPart, "+"); idx != -1 {
		return strings.ToLower(localPart[:idx])
	}
	return strings.ToLower(localPart)
}
