package service

import (
	"context"
	"database/sql"
	"errors"

	"github.com/jessym/mailgress/internal/database/db"
	"github.com/jessym/mailgress/internal/domain"
)

var ErrUserNotFound = errors.New("user not found")

type UserService struct {
	queries *db.Queries
}

func NewUserService(queries *db.Queries) *UserService {
	return &UserService{queries: queries}
}

func (s *UserService) GetByID(ctx context.Context, id int64) (*domain.User, error) {
	dbUser, err := s.queries.GetUserByID(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}
	return s.toDomain(dbUser), nil
}

func (s *UserService) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	dbUser, err := s.queries.GetUserByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrUserNotFound
		}
		return nil, err
	}
	return s.toDomain(dbUser), nil
}

func (s *UserService) List(ctx context.Context) ([]*domain.User, error) {
	dbUsers, err := s.queries.ListUsers(ctx)
	if err != nil {
		return nil, err
	}

	users := make([]*domain.User, len(dbUsers))
	for i, dbUser := range dbUsers {
		users[i] = s.toDomain(dbUser)
	}
	return users, nil
}

func (s *UserService) Create(ctx context.Context, email, password string, isAdmin bool) (*domain.User, error) {
	return s.CreateWithName(ctx, email, password, isAdmin, "", "")
}

func (s *UserService) CreateWithName(ctx context.Context, email, password string, isAdmin bool, firstName, lastName string) (*domain.User, error) {
	hash, err := HashPassword(password)
	if err != nil {
		return nil, err
	}

	var adminFlag int64
	if isAdmin {
		adminFlag = 1
	}

	dbUser, err := s.queries.CreateUser(ctx, db.CreateUserParams{
		Email:        email,
		PasswordHash: hash,
		IsAdmin:      adminFlag,
		FirstName:    sql.NullString{String: firstName, Valid: true},
		LastName:     sql.NullString{String: lastName, Valid: true},
	})
	if err != nil {
		return nil, err
	}

	return s.toDomain(dbUser), nil
}

func (s *UserService) Update(ctx context.Context, id int64, email string, password *string, isAdmin bool) (*domain.User, error) {
	existing, err := s.queries.GetUserByID(ctx, id)
	if err != nil {
		return nil, err
	}
	firstName := ""
	lastName := ""
	if existing.FirstName.Valid {
		firstName = existing.FirstName.String
	}
	if existing.LastName.Valid {
		lastName = existing.LastName.String
	}
	return s.UpdateWithName(ctx, id, email, password, isAdmin, firstName, lastName)
}

func (s *UserService) UpdateWithName(ctx context.Context, id int64, email string, password *string, isAdmin bool, firstName, lastName string) (*domain.User, error) {
	existing, err := s.queries.GetUserByID(ctx, id)
	if err != nil {
		return nil, err
	}

	passwordHash := existing.PasswordHash
	if password != nil && *password != "" {
		passwordHash, err = HashPassword(*password)
		if err != nil {
			return nil, err
		}
	}

	var adminFlag int64
	if isAdmin {
		adminFlag = 1
	}

	dbUser, err := s.queries.UpdateUser(ctx, db.UpdateUserParams{
		ID:           id,
		Email:        email,
		PasswordHash: passwordHash,
		IsAdmin:      adminFlag,
		FirstName:    sql.NullString{String: firstName, Valid: true},
		LastName:     sql.NullString{String: lastName, Valid: true},
	})
	if err != nil {
		return nil, err
	}

	return s.toDomain(dbUser), nil
}

func (s *UserService) Delete(ctx context.Context, id int64) error {
	return s.queries.DeleteUser(ctx, id)
}

func (s *UserService) UpdateAvatar(ctx context.Context, id int64, avatarPath string) (*domain.User, error) {
	dbUser, err := s.queries.UpdateUserAvatar(ctx, db.UpdateUserAvatarParams{
		ID:         id,
		AvatarPath: sql.NullString{String: avatarPath, Valid: avatarPath != ""},
	})
	if err != nil {
		return nil, err
	}
	return s.toDomain(dbUser), nil
}

func (s *UserService) Count(ctx context.Context) (int64, error) {
	return s.queries.CountUsers(ctx)
}

func (s *UserService) EnsureAdmin(ctx context.Context, email, password string) error {
	existing, err := s.queries.GetUserByEmail(ctx, email)
	if err == nil {
		// User exists, ensure they are admin
		if existing.IsAdmin == 0 {
			_, err = s.Update(ctx, existing.ID, email, &password, true)
			return err
		}
		return nil
	}
	if !errors.Is(err, sql.ErrNoRows) {
		return err
	}

	_, err = s.Create(ctx, email, password, true)
	return err
}

func (s *UserService) toDomain(dbUser db.User) *domain.User {
	user := &domain.User{
		ID:        dbUser.ID,
		Email:     dbUser.Email,
		IsAdmin:   dbUser.IsAdmin != 0,
		CreatedAt: dbUser.CreatedAt,
		UpdatedAt: dbUser.UpdatedAt,
	}
	if dbUser.FirstName.Valid {
		user.FirstName = dbUser.FirstName.String
	}
	if dbUser.LastName.Valid {
		user.LastName = dbUser.LastName.String
	}
	if dbUser.AvatarPath.Valid && dbUser.AvatarPath.String != "" {
		user.AvatarPath = dbUser.AvatarPath.String
		user.AvatarURL = "/avatars/" + dbUser.AvatarPath.String
	}
	return user
}
