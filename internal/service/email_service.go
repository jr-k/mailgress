package service

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"time"

	"github.com/jessym/mailgress/internal/database/db"
	"github.com/jessym/mailgress/internal/domain"
)

var ErrEmailNotFound = errors.New("email not found")

type EmailService struct {
	queries *db.Queries
}

func NewEmailService(queries *db.Queries) *EmailService {
	return &EmailService{queries: queries}
}

func (s *EmailService) GetByID(ctx context.Context, id int64) (*domain.Email, error) {
	dbEmail, err := s.queries.GetEmailByID(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrEmailNotFound
		}
		return nil, err
	}

	email := s.toDomain(dbEmail)

	dbAttachments, err := s.queries.ListAttachmentsByEmail(ctx, id)
	if err != nil {
		return nil, err
	}
	email.Attachments = make([]domain.Attachment, len(dbAttachments))
	for i, dbAtt := range dbAttachments {
		email.Attachments[i] = domain.Attachment{
			ID:          dbAtt.ID,
			EmailID:     dbAtt.EmailID,
			Filename:    dbAtt.Filename,
			ContentType: dbAtt.ContentType,
			Size:        dbAtt.Size,
			StoragePath: dbAtt.StoragePath,
			CreatedAt:   dbAtt.CreatedAt,
		}
	}
	email.HasAttachments = len(email.Attachments) > 0

	return email, nil
}

func (s *EmailService) ListByMailbox(ctx context.Context, mailboxID int64, limit, offset int64) ([]*domain.Email, error) {
	dbEmails, err := s.queries.ListEmailsByMailbox(ctx, db.ListEmailsByMailboxParams{
		MailboxID: mailboxID,
		Limit:     limit,
		Offset:    offset,
	})
	if err != nil {
		return nil, err
	}

	emails := make([]*domain.Email, len(dbEmails))
	for i, dbEmail := range dbEmails {
		emails[i] = s.toDomain(dbEmail)
	}
	return emails, nil
}

func (s *EmailService) Search(ctx context.Context, mailboxID int64, query string, limit, offset int64) ([]*domain.Email, error) {
	searchPattern := "%" + query + "%"
	dbEmails, err := s.queries.SearchEmails(ctx, db.SearchEmailsParams{
		MailboxID:   mailboxID,
		Subject:     sql.NullString{String: searchPattern, Valid: true},
		FromAddress: searchPattern,
		Limit:       limit,
		Offset:      offset,
	})
	if err != nil {
		return nil, err
	}

	emails := make([]*domain.Email, len(dbEmails))
	for i, dbEmail := range dbEmails {
		emails[i] = s.toDomain(dbEmail)
	}
	return emails, nil
}

func (s *EmailService) CountByMailbox(ctx context.Context, mailboxID int64) (int64, error) {
	return s.queries.CountEmailsByMailbox(ctx, mailboxID)
}

func (s *EmailService) CountAll(ctx context.Context) (int64, error) {
	return s.queries.CountAllEmails(ctx)
}

type CreateEmailParams struct {
	MailboxID   int64
	MessageID   string
	FromAddress string
	ToAddress   string
	Subject     string
	Date        *time.Time
	Headers     map[string]string
	TextBody    string
	HTMLBody    string
	RawSize     int64
}

func (s *EmailService) Create(ctx context.Context, params CreateEmailParams) (*domain.Email, error) {
	headersJSON := "{}"
	if params.Headers != nil {
		data, _ := json.Marshal(params.Headers)
		headersJSON = string(data)
	}

	var dateVal sql.NullTime
	if params.Date != nil {
		dateVal = sql.NullTime{Time: *params.Date, Valid: true}
	}

	dbEmail, err := s.queries.CreateEmail(ctx, db.CreateEmailParams{
		MailboxID:   params.MailboxID,
		MessageID:   sql.NullString{String: params.MessageID, Valid: params.MessageID != ""},
		FromAddress: params.FromAddress,
		ToAddress:   params.ToAddress,
		Subject:     sql.NullString{String: params.Subject, Valid: params.Subject != ""},
		Date:        dateVal,
		Headers:     sql.NullString{String: headersJSON, Valid: true},
		TextBody:    sql.NullString{String: params.TextBody, Valid: params.TextBody != ""},
		HtmlBody:    sql.NullString{String: params.HTMLBody, Valid: params.HTMLBody != ""},
		RawSize:     params.RawSize,
	})
	if err != nil {
		return nil, err
	}

	return s.toDomain(dbEmail), nil
}

func (s *EmailService) CreateAttachment(ctx context.Context, emailID int64, filename, contentType string, size int64, storagePath string) (*domain.Attachment, error) {
	dbAtt, err := s.queries.CreateAttachment(ctx, db.CreateAttachmentParams{
		EmailID:     emailID,
		Filename:    filename,
		ContentType: contentType,
		Size:        size,
		StoragePath: storagePath,
	})
	if err != nil {
		return nil, err
	}

	return &domain.Attachment{
		ID:          dbAtt.ID,
		EmailID:     dbAtt.EmailID,
		Filename:    dbAtt.Filename,
		ContentType: dbAtt.ContentType,
		Size:        dbAtt.Size,
		StoragePath: dbAtt.StoragePath,
		CreatedAt:   dbAtt.CreatedAt,
	}, nil
}

func (s *EmailService) Delete(ctx context.Context, id int64) error {
	return s.queries.DeleteEmail(ctx, id)
}

func (s *EmailService) DeleteOldEmails(ctx context.Context, before time.Time) error {
	return s.queries.DeleteOldEmails(ctx, before)
}

func (s *EmailService) toDomain(dbEmail db.Email) *domain.Email {
	email := &domain.Email{
		ID:          dbEmail.ID,
		MailboxID:   dbEmail.MailboxID,
		FromAddress: dbEmail.FromAddress,
		ToAddress:   dbEmail.ToAddress,
		RawSize:     dbEmail.RawSize,
		ReceivedAt:  dbEmail.ReceivedAt,
	}
	if dbEmail.MessageID.Valid {
		email.MessageID = dbEmail.MessageID.String
	}
	if dbEmail.Subject.Valid {
		email.Subject = dbEmail.Subject.String
	}
	if dbEmail.Date.Valid {
		email.Date = &dbEmail.Date.Time
	}
	if dbEmail.Headers.Valid {
		json.Unmarshal([]byte(dbEmail.Headers.String), &email.Headers)
	}
	if dbEmail.TextBody.Valid {
		email.TextBody = dbEmail.TextBody.String
	}
	if dbEmail.HtmlBody.Valid {
		email.HTMLBody = dbEmail.HtmlBody.String
	}
	return email
}
