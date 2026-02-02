package database

import (
	"database/sql"
	"embed"
	"fmt"
	"strings"

	"github.com/jessym/mailgress/internal/database/db"
	_ "modernc.org/sqlite"
)

//go:embed migrations/*.sql
var migrationsFS embed.FS

func NewConnection(driver, dsn string) (*sql.DB, *db.Queries, error) {
	switch driver {
	case "sqlite":
		database, err := sql.Open("sqlite", dsn+"?_pragma=journal_mode(WAL)&_pragma=foreign_keys(1)")
		if err != nil {
			return nil, nil, fmt.Errorf("failed to open sqlite: %w", err)
		}
		database.SetMaxOpenConns(1)
		return database, db.New(database), nil
	case "postgres":
		database, err := sql.Open("pgx", dsn)
		if err != nil {
			return nil, nil, fmt.Errorf("failed to open postgres: %w", err)
		}
		database.SetMaxOpenConns(25)
		database.SetMaxIdleConns(5)
		return database, db.New(database), nil
	default:
		return nil, nil, fmt.Errorf("unsupported driver: %s", driver)
	}
}

func RunMigrations(database *sql.DB, driver string) error {
	// Create migrations tracking table
	_, err := database.Exec(`CREATE TABLE IF NOT EXISTS schema_migrations (
		version TEXT PRIMARY KEY,
		applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
	)`)
	if err != nil {
		return fmt.Errorf("failed to create schema_migrations table: %w", err)
	}

	entries, err := migrationsFS.ReadDir("migrations")
	if err != nil {
		return fmt.Errorf("failed to read migrations directory: %w", err)
	}

	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".sql") {
			continue
		}

		// Check if migration was already applied
		var count int
		err := database.QueryRow("SELECT COUNT(*) FROM schema_migrations WHERE version = ?", entry.Name()).Scan(&count)
		if err != nil {
			return fmt.Errorf("failed to check migration status %s: %w", entry.Name(), err)
		}
		if count > 0 {
			continue // Already applied
		}

		content, err := migrationsFS.ReadFile("migrations/" + entry.Name())
		if err != nil {
			return fmt.Errorf("failed to read migration file %s: %w", entry.Name(), err)
		}

		migration := string(content)
		if driver == "postgres" {
			migration = convertToPostgres(migration)
		}

		statements := strings.Split(migration, ";")
		for _, stmt := range statements {
			stmt = strings.TrimSpace(stmt)
			if stmt == "" {
				continue
			}
			if _, err := database.Exec(stmt); err != nil {
				return fmt.Errorf("failed to execute migration %s: %w", entry.Name(), err)
			}
		}

		// Mark migration as applied
		_, err = database.Exec("INSERT INTO schema_migrations (version) VALUES (?)", entry.Name())
		if err != nil {
			return fmt.Errorf("failed to record migration %s: %w", entry.Name(), err)
		}
	}

	return nil
}

func convertToPostgres(sql string) string {
	sql = strings.ReplaceAll(sql, "INTEGER PRIMARY KEY AUTOINCREMENT", "SERIAL PRIMARY KEY")
	sql = strings.ReplaceAll(sql, "DATETIME", "TIMESTAMP")
	sql = strings.ReplaceAll(sql, "IF NOT EXISTS ", "")
	return sql
}
