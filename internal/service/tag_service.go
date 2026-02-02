package service

import (
	"context"
	"database/sql"
	"errors"

	"github.com/jessym/mailgress/internal/database/db"
	"github.com/jessym/mailgress/internal/domain"
)

var ErrTagNotFound = errors.New("tag not found")

type TagService struct {
	queries *db.Queries
}

func NewTagService(queries *db.Queries) *TagService {
	return &TagService{queries: queries}
}

func (s *TagService) GetByID(ctx context.Context, id int64) (*domain.Tag, error) {
	dbTag, err := s.queries.GetTagByID(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrTagNotFound
		}
		return nil, err
	}
	return s.toDomain(dbTag), nil
}

func (s *TagService) List(ctx context.Context) ([]*domain.Tag, error) {
	dbTags, err := s.queries.ListTags(ctx)
	if err != nil {
		return nil, err
	}

	tags := make([]*domain.Tag, len(dbTags))
	for i, dbTag := range dbTags {
		tags[i] = s.toDomain(dbTag)
	}
	return tags, nil
}

func (s *TagService) Create(ctx context.Context, name, color string) (*domain.Tag, error) {
	dbTag, err := s.queries.CreateTag(ctx, db.CreateTagParams{
		Name:  name,
		Color: color,
	})
	if err != nil {
		return nil, err
	}
	return s.toDomain(dbTag), nil
}

func (s *TagService) Update(ctx context.Context, id int64, name, color string) (*domain.Tag, error) {
	dbTag, err := s.queries.UpdateTag(ctx, db.UpdateTagParams{
		ID:    id,
		Name:  name,
		Color: color,
	})
	if err != nil {
		return nil, err
	}
	return s.toDomain(dbTag), nil
}

func (s *TagService) Delete(ctx context.Context, id int64) error {
	return s.queries.DeleteTag(ctx, id)
}

func (s *TagService) GetTagsForDomain(ctx context.Context, domainID int64) ([]*domain.Tag, error) {
	dbTags, err := s.queries.GetTagsForDomain(ctx, domainID)
	if err != nil {
		return nil, err
	}

	tags := make([]*domain.Tag, len(dbTags))
	for i, dbTag := range dbTags {
		tags[i] = s.toDomain(dbTag)
	}
	return tags, nil
}

func (s *TagService) GetTagsForMailbox(ctx context.Context, mailboxID int64) ([]*domain.Tag, error) {
	dbTags, err := s.queries.GetTagsForMailbox(ctx, mailboxID)
	if err != nil {
		return nil, err
	}

	tags := make([]*domain.Tag, len(dbTags))
	for i, dbTag := range dbTags {
		tags[i] = s.toDomain(dbTag)
	}
	return tags, nil
}

func (s *TagService) SetDomainTags(ctx context.Context, domainID int64, tagIDs []int64) error {
	// Clear existing tags
	if err := s.queries.ClearDomainTags(ctx, domainID); err != nil {
		return err
	}

	// Add new tags
	for _, tagID := range tagIDs {
		if err := s.queries.AddTagToDomain(ctx, db.AddTagToDomainParams{
			DomainID: domainID,
			TagID:    tagID,
		}); err != nil {
			return err
		}
	}
	return nil
}

func (s *TagService) SetMailboxTags(ctx context.Context, mailboxID int64, tagIDs []int64) error {
	// Clear existing tags
	if err := s.queries.ClearMailboxTags(ctx, mailboxID); err != nil {
		return err
	}

	// Add new tags
	for _, tagID := range tagIDs {
		if err := s.queries.AddTagToMailbox(ctx, db.AddTagToMailboxParams{
			MailboxID: mailboxID,
			TagID:     tagID,
		}); err != nil {
			return err
		}
	}
	return nil
}

func (s *TagService) CountUsage(ctx context.Context, tagID int64) (int64, error) {
	return s.queries.CountTagUsage(ctx, db.CountTagUsageParams{
		TagID:   tagID,
		TagID_2: tagID,
	})
}

func (s *TagService) toDomain(dbTag db.Tag) *domain.Tag {
	return &domain.Tag{
		ID:        dbTag.ID,
		Name:      dbTag.Name,
		Color:     dbTag.Color,
		CreatedAt: dbTag.CreatedAt,
		UpdatedAt: dbTag.UpdatedAt,
	}
}
