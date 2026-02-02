package smtp

import (
	"github.com/emersion/go-smtp"
	"github.com/jessym/mailgress/internal/config"
	"github.com/jessym/mailgress/internal/service"
	"github.com/jessym/mailgress/internal/storage"
	"github.com/jessym/mailgress/internal/webhook"
)

type Backend struct {
	config         *config.Config
	mailboxService *service.MailboxService
	emailService   *service.EmailService
	domainService  *service.DomainService
	storage        *storage.Storage
	dispatcher     *webhook.Dispatcher
	rateLimiter    *RateLimiter
}

func NewBackend(
	cfg *config.Config,
	mailboxService *service.MailboxService,
	emailService *service.EmailService,
	domainService *service.DomainService,
	storage *storage.Storage,
	dispatcher *webhook.Dispatcher,
) *Backend {
	return &Backend{
		config:         cfg,
		mailboxService: mailboxService,
		emailService:   emailService,
		domainService:  domainService,
		storage:        storage,
		dispatcher:     dispatcher,
		rateLimiter:    NewRateLimiter(100, 60),
	}
}

func (b *Backend) NewSession(c *smtp.Conn) (smtp.Session, error) {
	ip := c.Conn().RemoteAddr().String()
	if !b.rateLimiter.Allow(ip) {
		return nil, &smtp.SMTPError{
			Code:         421,
			EnhancedCode: smtp.EnhancedCode{4, 7, 0},
			Message:      "Too many connections, try again later",
		}
	}

	return &Session{
		backend: b,
		ip:      ip,
	}, nil
}
