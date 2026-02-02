package config

import (
	"os"
	"strconv"
)

type Config struct {
	AppURL string
	AppEnv string
	AppKey string

	SMTPListenAddr string
	HTTPListenAddr string

	DBDriver string
	DBDsn    string

	WebhookWorkers int

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

		WebhookWorkers: getEnvInt("WEBHOOK_WORKERS", 5),

		StoragePath: getEnv("STORAGE_PATH", "./data/attachments"),
	}
}

func (c *Config) IsDevelopment() bool {
	return c.AppEnv == "development" || c.AppEnv == "dev"
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
