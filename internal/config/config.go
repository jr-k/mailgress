package config

import (
	"os"
	"strconv"
	"time"
)

type Config struct {
	AppURL string
	AppEnv string
	AppKey string

	SMTPListenAddr string
	HTTPListenAddr string

	DBDriver string
	DBDsn    string

	MaxEmailSizeMB      int
	MaxAttachmentSizeMB int
	RetentionDays       int

	WebhookMaxRetries int
	WebhookTimeoutSec int
	WebhookWorkers    int

	StoragePath string
}

func Load() *Config {
	return &Config{
		AppURL: getEnv("APP_URL", "http://localhost:8080"),
		AppEnv: getEnv("APP_ENV", "development"),
		AppKey: getEnv("APP_KEY", "change-me-in-production-32chars!"),

		SMTPListenAddr: getEnv("SMTP_LISTEN_ADDR", ":2525"),
		HTTPListenAddr: getEnv("HTTP_LISTEN_ADDR", ":8080"),

		DBDriver: getEnv("DB_DRIVER", "sqlite"),
		DBDsn:    getEnv("DB_DSN", "mailgress.db"),

		MaxEmailSizeMB:      getEnvInt("MAX_EMAIL_SIZE_MB", 25),
		MaxAttachmentSizeMB: getEnvInt("MAX_ATTACHMENT_SIZE_MB", 10),
		RetentionDays:       getEnvInt("RETENTION_DAYS", 90),

		WebhookMaxRetries: getEnvInt("WEBHOOK_MAX_RETRIES", 3),
		WebhookTimeoutSec: getEnvInt("WEBHOOK_TIMEOUT_SEC", 30),
		WebhookWorkers:    getEnvInt("WEBHOOK_WORKERS", 5),

		StoragePath: getEnv("STORAGE_PATH", "./data/attachments"),
	}
}

func (c *Config) IsDevelopment() bool {
	return c.AppEnv == "development" || c.AppEnv == "dev"
}

func (c *Config) MaxEmailSizeBytes() int64 {
	return int64(c.MaxEmailSizeMB) * 1024 * 1024
}

func (c *Config) MaxAttachmentSizeBytes() int64 {
	return int64(c.MaxAttachmentSizeMB) * 1024 * 1024
}

func (c *Config) WebhookTimeout() time.Duration {
	return time.Duration(c.WebhookTimeoutSec) * time.Second
}

func getEnv(key, defaultVal string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return defaultVal
}

func getEnvInt(key string, defaultVal int) int {
	if val := os.Getenv(key); val != "" {
		if i, err := strconv.Atoi(val); err == nil {
			return i
		}
	}
	return defaultVal
}
