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
	ErrInvalid2FACode     = errors.New("invalid 2FA code")
)

type LoginResult struct {
	User         *domain.User
	Token        string
	Requires2FA  bool
	PendingToken string
}

type AuthService struct {
	queries *db.Queries
}

func NewAuthService(queries *db.Queries) *AuthService {
	return &AuthService{queries: queries}
}

func (s *AuthService) Login(ctx context.Context, email, password string) (*LoginResult, error) {
	dbUser, err := s.queries.GetUserByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrInvalidCredentials
		}
		return nil, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(dbUser.PasswordHash), []byte(password)); err != nil {
		return nil, ErrInvalidCredentials
	}

	user := s.dbUserToDomain(dbUser)

	// Check if 2FA is enabled
	if dbUser.TotpEnabled != 0 {
		pendingToken, err := generateToken()
		if err != nil {
			return nil, err
		}

		// Create a pending session (5 minutes expiry)
		expiresAt := time.Now().Add(5 * time.Minute)
		_, err = s.queries.CreateSession(ctx, db.CreateSessionParams{
			Token:     "2fa_" + pendingToken,
			UserID:    dbUser.ID,
			ExpiresAt: expiresAt,
		})
		if err != nil {
			return nil, err
		}

		return &LoginResult{
			User:         user,
			Requires2FA:  true,
			PendingToken: pendingToken,
		}, nil
	}

	// No 2FA, create full session
	token, err := generateToken()
	if err != nil {
		return nil, err
	}

	expiresAt := time.Now().Add(24 * 7 * time.Hour)
	_, err = s.queries.CreateSession(ctx, db.CreateSessionParams{
		Token:     token,
		UserID:    dbUser.ID,
		ExpiresAt: expiresAt,
	})
	if err != nil {
		return nil, err
	}

	return &LoginResult{
		User:  user,
		Token: token,
	}, nil
}

func (s *AuthService) Verify2FA(ctx context.Context, pendingToken string) (*domain.User, string, error) {
	// Get pending session
	session, err := s.queries.GetSessionByToken(ctx, "2fa_"+pendingToken)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, "", ErrSessionNotFound
		}
		return nil, "", err
	}

	// Delete pending session
	s.queries.DeleteSession(ctx, "2fa_"+pendingToken)

	// Get user
	dbUser, err := s.queries.GetUserByID(ctx, session.UserID)
	if err != nil {
		return nil, "", err
	}

	// Create full session
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

	return s.dbUserToDomain(dbUser), token, nil
}

func (s *AuthService) GetPending2FAUser(ctx context.Context, pendingToken string) (*domain.User, error) {
	session, err := s.queries.GetSessionByToken(ctx, "2fa_"+pendingToken)
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

	return s.dbUserToDomain(dbUser), nil
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

	return s.dbUserToDomain(dbUser), nil
}

func (s *AuthService) dbUserToDomain(dbUser db.User) *domain.User {
	user := &domain.User{
		ID:          dbUser.ID,
		Email:       dbUser.Email,
		IsAdmin:     dbUser.IsAdmin != 0,
		FirstName:   dbUser.FirstName.String,
		LastName:    dbUser.LastName.String,
		TOTPEnabled: dbUser.TotpEnabled != 0,
		CreatedAt:   dbUser.CreatedAt,
		UpdatedAt:   dbUser.UpdatedAt,
	}

	if dbUser.AvatarPath.Valid && dbUser.AvatarPath.String != "" {
		user.AvatarPath = dbUser.AvatarPath.String
		user.AvatarURL = "/avatars/" + dbUser.AvatarPath.String
	}

	if dbUser.TotpSecret.Valid {
		user.TOTPSecret = dbUser.TotpSecret.String
	}

	return user
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
