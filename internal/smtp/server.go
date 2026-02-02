package smtp

import (
	"context"
	"log"
	"time"

	"github.com/emersion/go-smtp"
	"github.com/jr-k/mailgress/internal/config"
	"github.com/jr-k/mailgress/internal/service"
	"github.com/jr-k/mailgress/internal/storage"
	"github.com/jr-k/mailgress/internal/webhook"
)

type Server struct {
	server *smtp.Server
	config *config.Config
}

func NewServer(
	cfg *config.Config,
	mailboxService *service.MailboxService,
	emailService *service.EmailService,
	domainService *service.DomainService,
	storage *storage.Storage,
	dispatcher *webhook.Dispatcher,
) *Server {
	backend := NewBackend(cfg, mailboxService, emailService, domainService, storage, dispatcher)

	server := smtp.NewServer(backend)
	server.Addr = cfg.SMTPListenAddr
	server.Domain = "mailgress"
	server.ReadTimeout = 30 * time.Second
	server.WriteTimeout = 30 * time.Second
	server.MaxMessageBytes = 100 * 1024 * 1024 // 100MB absolute max, per-mailbox limits checked in session
	server.MaxRecipients = 50
	server.AllowInsecureAuth = true

	return &Server{
		server: server,
		config: cfg,
	}
}

func (s *Server) Start(ctx context.Context) error {
	log.Printf("Starting SMTP server on %s", s.config.SMTPListenAddr)

	errChan := make(chan error, 1)
	go func() {
		errChan <- s.server.ListenAndServe()
	}()

	select {
	case <-ctx.Done():
		return s.server.Close()
	case err := <-errChan:
		return err
	}
}

func (s *Server) Close() error {
	return s.server.Close()
}
