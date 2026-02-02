package service

import (
	"context"
	"crypto/rand"
	"database/sql"
	"encoding/hex"
	"errors"
	"time"

	"github.com/jr-k/mailgress/internal/database/db"
	"github.com/jr-k/mailgress/internal/domain"
	"golang.org/x/crypto/bcrypt"
)

var (
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrSessionNotFound    = errors.New("session not found")
)

type AuthService struct {
	queries *db.Queries
}

func NewAuthService(queries *db.Queries) *AuthService {
	return &AuthService{queries: queries}
}

func (s *AuthService) Login(ctx context.Context, email, password string) (*domain.User, string, error) {
	dbUser, err := s.queries.GetUserByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, "", ErrInvalidCredentials
		}
		return nil, "", err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(dbUser.PasswordHash), []byte(password)); err != nil {
		return nil, "", ErrInvalidCredentials
	}

	token, err := generateToken()
	if err != nil {
		return nil, "", err
	}

	expiresAt := time.Now().Add(24 * 7 * time.Hour)
	_, err = s.queries.CreateSession(ctx, db.CreateSessionParams{
		Token:     token,
		UserID:    dbUser.ID,
		ExpiresAt: expiresAt,
	})
	if err != nil {
		return nil, "", err
	}

	user := &domain.User{
		ID:        dbUser.ID,
		Email:     dbUser.Email,
		IsAdmin:   dbUser.IsAdmin != 0,
		FirstName: dbUser.FirstName.String,
		LastName:  dbUser.LastName.String,
		CreatedAt: dbUser.CreatedAt,
		UpdatedAt: dbUser.UpdatedAt,
	}

	if dbUser.AvatarPath.Valid && dbUser.AvatarPath.String != "" {
		user.AvatarPath = dbUser.AvatarPath.String
		// Construct the full URL for the avatar
		user.AvatarURL = "/avatars/" + dbUser.AvatarPath.String
	}

	return user, token, nil
}

func (s *AuthService) ValidateSession(ctx context.Context, token string) (*domain.User, error) {
	session, err := s.queries.GetSessionByToken(ctx, token)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrSessionNotFound
		}
		return nil, err
	}

	dbUser, err := s.queries.GetUserByID(ctx, session.UserID)
	if err != nil {
		return nil, err
	}

	user := &domain.User{
		ID:        dbUser.ID,
		Email:     dbUser.Email,
		IsAdmin:   dbUser.IsAdmin != 0,
		FirstName: dbUser.FirstName.String,
		LastName:  dbUser.LastName.String,
		CreatedAt: dbUser.CreatedAt,
		UpdatedAt: dbUser.UpdatedAt,
	}

	if dbUser.AvatarPath.Valid && dbUser.AvatarPath.String != "" {
		user.AvatarPath = dbUser.AvatarPath.String
		// Construct the full URL for the avatar
		user.AvatarURL = "/avatars/" + dbUser.AvatarPath.String
	}

	return user, nil
}

func (s *AuthService) Logout(ctx context.Context, token string) error {
	return s.queries.DeleteSession(ctx, token)
}

func (s *AuthService) CleanupExpiredSessions(ctx context.Context) error {
	return s.queries.DeleteExpiredSessions(ctx)
}

func generateToken() (string, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}
