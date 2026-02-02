package service

import (
	"context"
	"database/sql"
	"errors"

	"github.com/jr-k/mailgress/internal/database/db"
)

const (
	SettingOnboardingCompleted = "onboarding_completed"
	SettingAppName             = "app_name"
)

var ErrSettingNotFound = errors.New("setting not found")

type SettingsService struct {
	queries *db.Queries
}

func NewSettingsService(queries *db.Queries) *SettingsService {
	return &SettingsService{queries: queries}
}

func (s *SettingsService) Get(ctx context.Context, key string) (string, error) {
	setting, err := s.queries.GetSetting(ctx, key)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return "", ErrSettingNotFound
		}
		return "", err
	}
	return setting.Value, nil
}

func (s *SettingsService) GetWithDefault(ctx context.Context, key, defaultValue string) string {
	value, err := s.Get(ctx, key)
	if err != nil {
		return defaultValue
	}
	return value
}

func (s *SettingsService) Set(ctx context.Context, key, value string) error {
	_, err := s.queries.UpsertSetting(ctx, db.UpsertSettingParams{
		Key:   key,
		Value: value,
	})
	return err
}

func (s *SettingsService) GetAll(ctx context.Context) (map[string]string, error) {
	settings, err := s.queries.GetSettings(ctx)
	if err != nil {
		return nil, err
	}

	result := make(map[string]string)
	for _, setting := range settings {
		result[setting.Key] = setting.Value
	}
	return result, nil
}

func (s *SettingsService) IsOnboardingCompleted(ctx context.Context) bool {
	value := s.GetWithDefault(ctx, SettingOnboardingCompleted, "false")
	return value == "true"
}

func (s *SettingsService) CompleteOnboarding(ctx context.Context) error {
	return s.Set(ctx, SettingOnboardingCompleted, "true")
}

func (s *SettingsService) GetAppName(ctx context.Context) string {
	return s.GetWithDefault(ctx, SettingAppName, "Mailgress")
}
