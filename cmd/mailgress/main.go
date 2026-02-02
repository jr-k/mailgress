package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/jr-k/mailgress/internal/config"
	"github.com/jr-k/mailgress/internal/database"
	httpserver "github.com/jr-k/mailgress/internal/http"
	"github.com/jr-k/mailgress/internal/service"
	smtpserver "github.com/jr-k/mailgress/internal/smtp"
	"github.com/jr-k/mailgress/internal/storage"
	"github.com/jr-k/mailgress/internal/webhook"
)

func main() {
	cfg := config.Load()

	log.Printf("Starting Mailgress in %s mode", cfg.AppEnv)

	if cfg.SafeMode {
		log.Println("WARNING: SAFE_MODE is enabled! Authentication is bypassed.")
		log.Println("WARNING: DO NOT use this in production environments!")
	}

	db, queries, err := database.NewConnection(cfg.DBDriver, cfg.DBDsn)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	if err := database.RunMigrations(db, cfg.DBDriver); err != nil {
		log.Fatalf("Failed to run migrations: %v", err)
	}
	log.Println("Database migrations completed")

	store, err := storage.NewStorage(cfg.StoragePath)
	if err != nil {
		log.Fatalf("Failed to initialize storage: %v", err)
	}

	settingsService := service.NewSettingsService(queries)
	authService := service.NewAuthService(queries)
	userService := service.NewUserService(queries)
	mailboxService := service.NewMailboxService(queries)
	emailService := service.NewEmailService(queries)
	webhookService := service.NewWebhookService(queries)
	deliveryService := service.NewDeliveryService(queries)
	domainService := service.NewDomainService(queries)
	tagService := service.NewTagService(queries)

	dispatcher := webhook.NewDispatcher(cfg, webhookService, deliveryService)
	dispatcher.Start()

	smtpServer := smtpserver.NewServer(cfg, mailboxService, emailService, domainService, store, dispatcher)

	httpServer, err := httpserver.NewServer(
		cfg,
		settingsService,
		authService,
		userService,
		mailboxService,
		emailService,
		webhookService,
		deliveryService,
		domainService,
		tagService,
		store,
		dispatcher,
	)
	if err != nil {
		log.Fatalf("Failed to create HTTP server: %v", err)
	}

	ctx, cancel := context.WithCancel(context.Background())

	go func() {
		if err := smtpServer.Start(ctx); err != nil {
			log.Printf("SMTP server error: %v", err)
		}
	}()

	go func() {
		if err := httpServer.Start(ctx); err != nil {
			log.Printf("HTTP server error: %v", err)
		}
	}()

	// Email retention cleanup per mailbox
	go func() {
		ticker := time.NewTicker(24 * time.Hour)
		defer ticker.Stop()

		cleanup := func() {
			mailboxes, err := mailboxService.List(context.Background())
			if err != nil {
				log.Printf("Failed to list mailboxes for cleanup: %v", err)
				return
			}

			for _, mb := range mailboxes {
				if mb.RetentionDays <= 0 {
					continue
				}
				before := time.Now().AddDate(0, 0, -mb.RetentionDays)
				if err := emailService.DeleteOldEmailsByMailbox(context.Background(), mb.ID, before); err != nil {
					log.Printf("Failed to cleanup old emails for mailbox %d: %v", mb.ID, err)
				}
			}
			log.Println("Email retention cleanup completed")
		}

		cleanup()

		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				cleanup()
			}
		}
	}()

	go func() {
		ticker := time.NewTicker(time.Hour)
		defer ticker.Stop()

		for {
			select {
			case <-ctx.Done():
				return
			case <-ticker.C:
				authService.CleanupExpiredSessions(context.Background())
			}
		}
	}()

	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)

	log.Println("Mailgress is ready")
	log.Printf("HTTP: %s", cfg.HTTPListenAddr)
	log.Printf("SMTP: %s", cfg.SMTPListenAddr)

	<-sigChan
	log.Println("Shutting down...")

	cancel()
	dispatcher.Stop()

	log.Println("Goodbye!")
}
