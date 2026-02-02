package handler

import (
	"net/http"

	mw "github.com/jr-k/mailgress/internal/http/middleware"
	"github.com/jr-k/mailgress/internal/service"
	"github.com/romsar/gonertia"
)

type DashboardHandler struct {
	inertia        *gonertia.Inertia
	mailboxService *service.MailboxService
	emailService   *service.EmailService
	domainService  *service.DomainService
}

func NewDashboardHandler(
	inertia *gonertia.Inertia,
	mailboxService *service.MailboxService,
	emailService *service.EmailService,
	domainService *service.DomainService,
) *DashboardHandler {
	return &DashboardHandler{
		inertia:        inertia,
		mailboxService: mailboxService,
		emailService:   emailService,
		domainService:  domainService,
	}
}

func (h *DashboardHandler) Index(w http.ResponseWriter, r *http.Request) {
	user := mw.GetUser(r)

	var mailboxes interface{}
	var mailboxCount int64
	var emailCount int64
	var domainCount int64

	if user.IsAdmin {
		mbs, _ := h.mailboxService.List(r.Context())
		for _, mb := range mbs {
			if mb.DomainID != nil {
				domain, _ := h.domainService.GetByID(r.Context(), *mb.DomainID)
				mb.Domain = domain
			}
		}
		mailboxes = mbs
		mailboxCount, _ = h.mailboxService.Count(r.Context())
		emailCount, _ = h.emailService.CountAll(r.Context())
		domainCount, _ = h.domainService.Count(r.Context())
	} else {
		mbs, _ := h.mailboxService.ListByOwner(r.Context(), user.ID)
		for _, mb := range mbs {
			if mb.DomainID != nil {
				domain, _ := h.domainService.GetByID(r.Context(), *mb.DomainID)
				mb.Domain = domain
			}
		}
		mailboxes = mbs
		mailboxCount = int64(len(mbs))

		for _, mb := range mbs {
			count, _ := h.emailService.CountByMailbox(r.Context(), mb.ID)
			emailCount += count
		}
	}

	h.inertia.Render(w, r, "Dashboard/Index", gonertia.Props{
		"mailboxes":    mailboxes,
		"mailboxCount": mailboxCount,
		"emailCount":   emailCount,
		"domainCount":  domainCount,
	})
}
