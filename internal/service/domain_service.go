package service

import (
	"context"
	"database/sql"
	"errors"
	"regexp"
	"strings"

	"github.com/jr-k/mailgress/internal/database/db"
	"github.com/jr-k/mailgress/internal/domain"
)

var (
	ErrDomainNotFound      = errors.New("domain not found")
	ErrDomainAlreadyExists = errors.New("domain already exists")
	ErrInvalidDomainName   = errors.New("invalid domain name")
	domainPattern          = regexp.MustCompile(`^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$`)
)

type DomainService struct {
	queries *db.Queries
}

func NewDomainService(queries *db.Queries) *DomainService {
	return &DomainService{queries: queries}
}

func (s *DomainService) GetByID(ctx context.Context, id int64) (*domain.Domain, error) {
	dbDomain, err := s.queries.GetDomainByID(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrDomainNotFound
		}
		return nil, err
	}
	return s.toDomain(dbDomain), nil
}

func (s *DomainService) GetByName(ctx context.Context, name string) (*domain.Domain, error) {
	name = strings.ToLower(strings.TrimSpace(name))
	dbDomain, err := s.queries.GetDomainByName(ctx, name)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrDomainNotFound
		}
		return nil, err
	}
	return s.toDomain(dbDomain), nil
}

func (s *DomainService) List(ctx context.Context) ([]*domain.Domain, error) {
	dbDomains, err := s.queries.ListDomains(ctx)
	if err != nil {
		return nil, err
	}

	domains := make([]*domain.Domain, len(dbDomains))
	for i, dbDomain := range dbDomains {
		domains[i] = s.toDomain(dbDomain)
	}
	return domains, nil
}

func (s *DomainService) ListActive(ctx context.Context) ([]*domain.Domain, error) {
	dbDomains, err := s.queries.ListActiveDomains(ctx)
	if err != nil {
		return nil, err
	}

	domains := make([]*domain.Domain, len(dbDomains))
	for i, dbDomain := range dbDomains {
		domains[i] = s.toDomain(dbDomain)
	}
	return domains, nil
}

func (s *DomainService) Create(ctx context.Context, name string) (*domain.Domain, error) {
	name = strings.ToLower(strings.TrimSpace(name))
	if !domainPattern.MatchString(name) {
		return nil, ErrInvalidDomainName
	}

	exists, err := s.queries.DomainExistsByName(ctx, name)
	if err != nil {
		return nil, err
	}
	if exists > 0 {
		return nil, ErrDomainAlreadyExists
	}

	dbDomain, err := s.queries.CreateDomain(ctx, db.CreateDomainParams{
		Name:       name,
		IsVerified: 0,
		IsActive:   1,
	})
	if err != nil {
		return nil, err
	}

	return s.toDomain(dbDomain), nil
}

func (s *DomainService) Update(ctx context.Context, id int64, name string, isVerified, isActive bool) (*domain.Domain, error) {
	name = strings.ToLower(strings.TrimSpace(name))
	if !domainPattern.MatchString(name) {
		return nil, ErrInvalidDomainName
	}

	var verifiedFlag, activeFlag int64
	if isVerified {
		verifiedFlag = 1
	}
	if isActive {
		activeFlag = 1
	}

	dbDomain, err := s.queries.UpdateDomain(ctx, db.UpdateDomainParams{
		ID:         id,
		Name:       name,
		IsVerified: verifiedFlag,
		IsActive:   activeFlag,
	})
	if err != nil {
		return nil, err
	}

	return s.toDomain(dbDomain), nil
}

func (s *DomainService) Delete(ctx context.Context, id int64) error {
	return s.queries.DeleteDomain(ctx, id)
}

func (s *DomainService) Count(ctx context.Context) (int64, error) {
	return s.queries.CountDomains(ctx)
}

func (s *DomainService) GetDNSRecords(d *domain.Domain) []domain.DNSRecord {
	return d.GetDNSRecords()
}

func (s *DomainService) toDomain(dbDomain db.Domain) *domain.Domain {
	return &domain.Domain{
		ID:         dbDomain.ID,
		Name:       dbDomain.Name,
		IsVerified: dbDomain.IsVerified != 0,
		IsActive:   dbDomain.IsActive != 0,
		CreatedAt:  dbDomain.CreatedAt,
		UpdatedAt:  dbDomain.UpdatedAt,
	}
}
