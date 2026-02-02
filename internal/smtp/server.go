package smtp

import (
	"context"
	"log"
	"time"

	"github.com/emersion/go-smtp"
	"github.com/jessym/mailgress/internal/config"
	"github.com/jessym/mailgress/internal/service"
	"github.com/jessym/mailgress/internal/storage"
	"github.com/jessym/mailgress/internal/webhook"
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
	server.Domain = "localhost"
	server.ReadTimeout = 30 * time.Second
	server.WriteTimeout = 30 * time.Second
	server.MaxMessageBytes = cfg.MaxEmailSizeBytes()
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
