package http

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/jr-k/mailgress/internal/config"
	"github.com/jr-k/mailgress/internal/http/handler"
	mw "github.com/jr-k/mailgress/internal/http/middleware"
	"github.com/jr-k/mailgress/internal/service"
	"github.com/jr-k/mailgress/internal/storage"
	"github.com/jr-k/mailgress/internal/vite"
	"github.com/jr-k/mailgress/internal/webhook"
	"github.com/romsar/gonertia"
)

type Server struct {
	server  *http.Server
	config  *config.Config
	inertia *gonertia.Inertia
}

func NewServer(
	cfg *config.Config,
	settingsService *service.SettingsService,
	authService *service.AuthService,
	userService *service.UserService,
	mailboxService *service.MailboxService,
	emailService *service.EmailService,
	webhookService *service.WebhookService,
	deliveryService *service.DeliveryService,
	domainService *service.DomainService,
	tagService *service.TagService,
	storage *storage.Storage,
	dispatcher *webhook.Dispatcher,
) (*Server, error) {
	viteHelper := vite.New(vite.Config{
		IsDev:        cfg.IsDevelopment(),
		DevServerURL: "http://localhost:5173",
		ManifestPath: "web/dist/.vite/manifest.json",
		BasePath:     "/assets",
	})

	template := fmt.Sprintf(baseTemplate, viteHelper.GenerateHTMLTags("resources/js/app.tsx"))

	inertia, err := gonertia.New(template)
	if err != nil {
		return nil, err
	}

	inertia.ShareProp("appName", "Mailgress")

	onboardingMiddleware := mw.NewOnboardingMiddleware(settingsService)
	authMiddleware := mw.NewAuthMiddleware(authService, userService, inertia, cfg.SafeMode)
	flashMiddleware := mw.NewFlashMiddleware()


	dnsService := service.NewDNSService()
	avatarService := service.NewAvatarService(cfg.StoragePath + "/avatars")
	totpService := service.NewTOTPService("Mailgress")

	onboardingHandler := handler.NewOnboardingHandler(inertia, settingsService, userService, domainService)
	authHandler := handler.NewAuthHandler(inertia, authService, userService, totpService)
	dashboardHandler := handler.NewDashboardHandler(inertia, mailboxService, emailService, domainService)
	userHandler := handler.NewUserHandler(inertia, userService, avatarService, totpService, authService, flashMiddleware)
	mailboxHandler := handler.NewMailboxHandler(inertia, mailboxService, emailService, userService, domainService, tagService)
	emailHandler := handler.NewEmailHandler(inertia, emailService, mailboxService, storage)
	webhookHandler := handler.NewWebhookHandler(inertia, webhookService, deliveryService, mailboxService, domainService, dispatcher)
	domainHandler := handler.NewDomainHandler(inertia, domainService, dnsService, tagService)
	tagHandler := handler.NewTagHandler(inertia, tagService, flashMiddleware)

	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Compress(5))
	r.Use(inertia.Middleware)
	r.Use(flashMiddleware.Handle)
	r.Use(onboardingMiddleware.RequireOnboarding)

	// Serve built assets (Vite outputs to dist/assets/)
	distFS := http.FileServer(http.Dir("web/dist"))
	r.Handle("/assets/*", distFS)
	r.Handle("/favicon.ico", distFS)
	r.Handle("/avatars/*", http.StripPrefix("/avatars/", http.FileServer(http.Dir(cfg.StoragePath+"/avatars"))))
	r.Handle("/img/*", http.StripPrefix("/img/", http.FileServer(http.Dir("web/public/img"))))

	r.Get("/onboarding", onboardingHandler.Show)
	r.Post("/onboarding", onboardingHandler.Complete)

	r.Get("/login", authHandler.ShowLogin)
	r.Post("/login", authHandler.Login)
	r.Get("/login/2fa", authHandler.Show2FA)
	r.Post("/login/2fa", authHandler.Verify2FA)

	r.Group(func(r chi.Router) {
		r.Use(authMiddleware.RequireAuth)

		r.Post("/logout", authHandler.Logout)

		r.Get("/", dashboardHandler.Index)
		r.Get("/dashboard", dashboardHandler.Index)

		r.Get("/profile", userHandler.Profile)
		r.Put("/profile", userHandler.UpdateProfile)
		r.Post("/profile/avatar", userHandler.UploadProfileAvatar)
		r.Delete("/profile/avatar", userHandler.DeleteProfileAvatar)

		// 2FA routes
		r.Get("/profile/2fa/setup", userHandler.Show2FASetup)
		r.Post("/profile/2fa/enable", userHandler.Enable2FA)
		r.Post("/profile/2fa/disable", userHandler.Disable2FA)
		r.Get("/profile/2fa/backup-codes", userHandler.ShowBackupCodes)
		r.Post("/profile/2fa/backup-codes/regenerate", userHandler.RegenerateBackupCodes)

		r.Get("/mailboxes", mailboxHandler.Index)
		r.Get("/mailboxes/create", mailboxHandler.Create)
		r.Post("/mailboxes", mailboxHandler.Store)
		r.Get("/mailboxes/{id}", mailboxHandler.Show)
		r.Get("/mailboxes/{id}/edit", mailboxHandler.Edit)
		r.Put("/mailboxes/{id}", mailboxHandler.Update)
		r.Delete("/mailboxes/{id}", mailboxHandler.Delete)
		r.Put("/mailboxes/{id}/tags", mailboxHandler.SetTags)
		r.Post("/mailboxes/{id}/emails/{emailId}/read", mailboxHandler.MarkEmailAsRead)
		r.Post("/mailboxes/{id}/emails/{emailId}/unread", mailboxHandler.MarkEmailAsUnread)
		r.Delete("/mailboxes/{id}/emails/{emailId}", mailboxHandler.DeleteEmail)

		r.Get("/mailboxes/{mailboxId}/emails/{id}", emailHandler.Show)
		r.Get("/attachments/{id}/download", emailHandler.DownloadAttachment)

		r.Get("/mailboxes/{mailboxId}/webhooks", webhookHandler.Index)
		r.Get("/mailboxes/{mailboxId}/webhooks/create", webhookHandler.Create)
		r.Post("/mailboxes/{mailboxId}/webhooks", webhookHandler.Store)
		r.Get("/mailboxes/{mailboxId}/webhooks/{id}", webhookHandler.Show)
		r.Get("/mailboxes/{mailboxId}/webhooks/{id}/edit", webhookHandler.Edit)
		r.Put("/mailboxes/{mailboxId}/webhooks/{id}", webhookHandler.Update)
		r.Delete("/mailboxes/{mailboxId}/webhooks/{id}", webhookHandler.Delete)
		r.Post("/mailboxes/{mailboxId}/webhooks/{id}/test", webhookHandler.Test)
		r.Get("/mailboxes/{mailboxId}/webhooks/{id}/deliveries", webhookHandler.Deliveries)
		r.Post("/deliveries/{id}/retry", webhookHandler.Retry)
		r.Post("/mailboxes/{mailboxId}/webhooks/{id}/deliveries/cancel-retrying", webhookHandler.CancelRetrying)
		r.Delete("/mailboxes/{mailboxId}/webhooks/{id}/deliveries", webhookHandler.DeleteAllDeliveries)

		r.Group(func(r chi.Router) {
			r.Use(authMiddleware.RequireAdmin)

			r.Get("/users", userHandler.Index)
			r.Get("/users/create", userHandler.Create)
			r.Post("/users", userHandler.Store)
			r.Get("/users/{id}", userHandler.Show)
			r.Get("/users/{id}/security", userHandler.Security)
			r.Get("/users/{id}/edit", userHandler.Edit)
			r.Put("/users/{id}", userHandler.Update)
			r.Delete("/users/{id}", userHandler.Delete)
			r.Post("/users/{id}/avatar", userHandler.UploadAvatar)
			r.Delete("/users/{id}/avatar", userHandler.DeleteAvatar)

			r.Get("/domains", domainHandler.Index)
			r.Get("/domains/create", domainHandler.Create)
			r.Post("/domains", domainHandler.Store)
			r.Get("/domains/{id}", domainHandler.Show)
			r.Get("/domains/{id}/edit", domainHandler.Edit)
			r.Put("/domains/{id}", domainHandler.Update)
			r.Delete("/domains/{id}", domainHandler.Delete)
			r.Post("/domains/{id}/verify", domainHandler.Verify)
			r.Put("/domains/{id}/tags", domainHandler.SetTags)

			r.Get("/tags", tagHandler.Index)
			r.Get("/tags/create", tagHandler.Create)
			r.Post("/tags", tagHandler.Store)
			r.Get("/tags/{id}/edit", tagHandler.Edit)
			r.Put("/tags/{id}", tagHandler.Update)
			r.Delete("/tags/{id}", tagHandler.Delete)
		})
	})

	server := &http.Server{
		Addr:         cfg.HTTPListenAddr,
		Handler:      r,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	return &Server{
		server:  server,
		config:  cfg,
		inertia: inertia,
	}, nil
}

func (s *Server) Start(ctx context.Context) error {
	log.Printf("Starting HTTP server on %s", s.config.HTTPListenAddr)

	errChan := make(chan error, 1)
	go func() {
		errChan <- s.server.ListenAndServe()
	}()

	select {
	case <-ctx.Done():
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		return s.server.Shutdown(shutdownCtx)
	case err := <-errChan:
		return err
	}
}

const baseTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mailgress</title>
    {{ .inertiaHead }}
    %s
</head>
<body>
    {{ .inertia }}
</body>
</html>`
