package handler

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/jr-k/mailgress/internal/domain"
	mw "github.com/jr-k/mailgress/internal/http/middleware"
	"github.com/jr-k/mailgress/internal/service"
	"github.com/romsar/gonertia"
)

type MailboxHandler struct {
	inertia        *gonertia.Inertia
	mailboxService *service.MailboxService
	emailService   *service.EmailService
	userService    *service.UserService
	domainService  *service.DomainService
	tagService     *service.TagService
}

func NewMailboxHandler(
	inertia *gonertia.Inertia,
	mailboxService *service.MailboxService,
	emailService *service.EmailService,
	userService *service.UserService,
	domainService *service.DomainService,
	tagService *service.TagService,
) *MailboxHandler {
	return &MailboxHandler{
		inertia:        inertia,
		mailboxService: mailboxService,
		emailService:   emailService,
		userService:    userService,
		domainService:  domainService,
		tagService:     tagService,
	}
}

func (h *MailboxHandler) Index(w http.ResponseWriter, r *http.Request) {
	user := mw.GetUser(r)

	var mailboxes interface{}
	var mailboxIDs []int64
	if user.IsAdmin {
		mbs, _ := h.mailboxService.List(r.Context())
		for _, mb := range mbs {
			mailboxIDs = append(mailboxIDs, mb.ID)
			stats, _ := h.mailboxService.GetStats(r.Context(), mb.ID)
			mb.Stats = stats
			if mb.OwnerID != nil {
				owner, _ := h.userService.GetByID(r.Context(), *mb.OwnerID)
				mb.Owner = owner
			}
			if mb.DomainID != nil {
				domain, _ := h.domainService.GetByID(r.Context(), *mb.DomainID)
				mb.Domain = domain
			}
		}
		mailboxes = mbs
	} else {
		mbs, _ := h.mailboxService.ListByOwner(r.Context(), user.ID)
		for _, mb := range mbs {
			mailboxIDs = append(mailboxIDs, mb.ID)
			stats, _ := h.mailboxService.GetStats(r.Context(), mb.ID)
			mb.Stats = stats
			if mb.DomainID != nil {
				domain, _ := h.domainService.GetByID(r.Context(), *mb.DomainID)
				mb.Domain = domain
			}
		}
		mailboxes = mbs
	}

	domains, _ := h.domainService.ListActive(r.Context())
	allTags, _ := h.tagService.List(r.Context())

	// Build a map of mailbox ID to tags
	mailboxTagsMap := make(map[int64]interface{})
	for _, mbID := range mailboxIDs {
		tags, _ := h.tagService.GetTagsForMailbox(r.Context(), mbID)
		mailboxTagsMap[mbID] = tags
	}

	h.inertia.Render(w, r, "Mailboxes/Index", gonertia.Props{
		"mailboxes":      mailboxes,
		"domains":        domains,
		"allTags":        allTags,
		"mailboxTagsMap": mailboxTagsMap,
	})
}

func (h *MailboxHandler) Create(w http.ResponseWriter, r *http.Request) {
	user := mw.GetUser(r)
	if !user.IsAdmin {
		h.inertia.Render(w, r, "Errors/Forbidden", nil)
		return
	}

	users, _ := h.userService.List(r.Context())
	domains, _ := h.domainService.ListActive(r.Context())

	h.inertia.Render(w, r, "Mailboxes/Create", gonertia.Props{
		"users":   users,
		"domains": domains,
	})
}

func (h *MailboxHandler) Store(w http.ResponseWriter, r *http.Request) {
	user := mw.GetUser(r)
	if !user.IsAdmin {
		h.inertia.Render(w, r, "Errors/Forbidden", nil)
		return
	}

	var req struct {
		Slug        string `json:"slug"`
		Description string `json:"description"`
		OwnerID     string `json:"owner_id"`
		DomainID    string `json:"domain_id"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.inertia.Render(w, r, "Mailboxes/Create", gonertia.Props{
			"error": "Invalid request",
		})
		return
	}

	var ownerID *int64
	if req.OwnerID != "" {
		if id, err := strconv.ParseInt(req.OwnerID, 10, 64); err == nil {
			ownerID = &id
		}
	}

	var domainID *int64
	if req.DomainID != "" {
		if id, err := strconv.ParseInt(req.DomainID, 10, 64); err == nil {
			domainID = &id
		}
	}

	mailbox, err := h.mailboxService.Create(r.Context(), req.Slug, ownerID, domainID, req.Description)
	if err != nil {
		users, _ := h.userService.List(r.Context())
		domains, _ := h.domainService.ListActive(r.Context())
		h.inertia.Render(w, r, "Mailboxes/Create", gonertia.Props{
			"error":       err.Error(),
			"slug":        req.Slug,
			"description": req.Description,
			"users":       users,
			"domains":     domains,
		})
		return
	}

	h.inertia.Location(w, r, "/mailboxes/"+strconv.FormatInt(mailbox.ID, 10))
}

func (h *MailboxHandler) Show(w http.ResponseWriter, r *http.Request) {
	user := mw.GetUser(r)

	identifier := chi.URLParam(r, "id")
	var mailbox *domain.Mailbox
	var err error

	// Try to parse as ID first
	if id, parseErr := strconv.ParseInt(identifier, 10, 64); parseErr == nil {
		mailbox, err = h.mailboxService.GetByID(r.Context(), id)
	} else {
		// Try to parse as email address (slug@domain)
		mailbox, err = h.mailboxService.GetByEmail(r.Context(), identifier)
	}

	if err != nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	if !user.IsAdmin && (mailbox.OwnerID == nil || *mailbox.OwnerID != user.ID) {
		h.inertia.Render(w, r, "Errors/Forbidden", nil)
		return
	}

	if mailbox.DomainID != nil {
		domain, _ := h.domainService.GetByID(r.Context(), *mailbox.DomainID)
		mailbox.Domain = domain
	}

	// Get all mailboxes for the switcher
	var allMailboxes interface{}
	if user.IsAdmin {
		mbs, _ := h.mailboxService.List(r.Context())
		for _, mb := range mbs {
			if mb.DomainID != nil {
				domain, _ := h.domainService.GetByID(r.Context(), *mb.DomainID)
				mb.Domain = domain
			}
		}
		allMailboxes = mbs
	} else {
		mbs, _ := h.mailboxService.ListByOwner(r.Context(), user.ID)
		for _, mb := range mbs {
			if mb.DomainID != nil {
				domain, _ := h.domainService.GetByID(r.Context(), *mb.DomainID)
				mb.Domain = domain
			}
		}
		allMailboxes = mbs
	}

	page := 1
	if p := r.URL.Query().Get("page"); p != "" {
		if parsed, err := strconv.Atoi(p); err == nil && parsed > 0 {
			page = parsed
		}
	}

	search := r.URL.Query().Get("search")
	perPage := int64(50)
	offset := int64((page - 1)) * perPage

	var emails interface{} = []*domain.Email{}
	var total int64

	if search != "" {
		result, err := h.emailService.Search(r.Context(), mailbox.ID, search, perPage, offset)
		if err != nil {
			log.Printf("Error searching emails for mailbox %d: %v", mailbox.ID, err)
		} else if result != nil {
			emails = result
		}
		total, _ = h.emailService.SearchCount(r.Context(), mailbox.ID, search)
	} else {
		result, err := h.emailService.ListByMailbox(r.Context(), mailbox.ID, perPage, offset)
		if err != nil {
			log.Printf("Error listing emails for mailbox %d: %v", mailbox.ID, err)
		} else if result != nil {
			emails = result
		}
		total, _ = h.emailService.CountByMailbox(r.Context(), mailbox.ID)
		log.Printf("DEBUG: Mailbox ID=%d, perPage=%d, offset=%d, emails found=%d, total=%d", mailbox.ID, perPage, offset, len(result), total)
	}

	h.inertia.Render(w, r, "Mailboxes/Show", gonertia.Props{
		"mailbox":      mailbox,
		"allMailboxes": allMailboxes,
		"emails":       emails,
		"pagination": map[string]interface{}{
			"current_page": page,
			"total":        total,
			"per_page":     perPage,
		},
		"search": search,
	})
}

func (h *MailboxHandler) Edit(w http.ResponseWriter, r *http.Request) {
	user := mw.GetUser(r)
	if !user.IsAdmin {
		h.inertia.Render(w, r, "Errors/Forbidden", nil)
		return
	}

	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	mailbox, err := h.mailboxService.GetByID(r.Context(), id)
	if err != nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	if mailbox.DomainID != nil {
		domain, _ := h.domainService.GetByID(r.Context(), *mailbox.DomainID)
		mailbox.Domain = domain
	}

	users, _ := h.userService.List(r.Context())
	domains, _ := h.domainService.ListActive(r.Context())
	allTags, _ := h.tagService.List(r.Context())
	mailboxTags, _ := h.tagService.GetTagsForMailbox(r.Context(), id)
	allMailboxes, _ := h.mailboxService.List(r.Context())

	// Load domain for each mailbox in allMailboxes
	for _, mb := range allMailboxes {
		if mb.DomainID != nil {
			domain, _ := h.domainService.GetByID(r.Context(), *mb.DomainID)
			mb.Domain = domain
		}
	}

	h.inertia.Render(w, r, "Mailboxes/Edit", gonertia.Props{
		"mailbox":      mailbox,
		"allMailboxes": allMailboxes,
		"users":        users,
		"domains":      domains,
		"allTags":      allTags,
		"mailboxTags":  mailboxTags,
	})
}

func (h *MailboxHandler) Update(w http.ResponseWriter, r *http.Request) {
	user := mw.GetUser(r)
	if !user.IsAdmin {
		h.inertia.Render(w, r, "Errors/Forbidden", nil)
		return
	}

	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	var req struct {
		Slug                string `json:"slug"`
		Description         string `json:"description"`
		OwnerID             string `json:"owner_id"`
		DomainID            string `json:"domain_id"`
		IsActive            bool   `json:"is_active"`
		MaxEmailSizeMB      int    `json:"max_email_size_mb"`
		MaxAttachmentSizeMB int    `json:"max_attachment_size_mb"`
		RetentionDays       int    `json:"retention_days"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.inertia.Render(w, r, "Errors/ServerError", nil)
		return
	}

	var ownerID *int64
	if req.OwnerID != "" {
		if oid, err := strconv.ParseInt(req.OwnerID, 10, 64); err == nil {
			ownerID = &oid
		}
	}

	var domainID *int64
	if req.DomainID != "" {
		if did, err := strconv.ParseInt(req.DomainID, 10, 64); err == nil {
			domainID = &did
		}
	}

	_, err = h.mailboxService.Update(r.Context(), id, service.UpdateMailboxParams{
		Slug:                req.Slug,
		OwnerID:             ownerID,
		DomainID:            domainID,
		Description:         req.Description,
		IsActive:            req.IsActive,
		MaxEmailSizeMB:      req.MaxEmailSizeMB,
		MaxAttachmentSizeMB: req.MaxAttachmentSizeMB,
		RetentionDays:       req.RetentionDays,
	})
	if err != nil {
		mailbox, _ := h.mailboxService.GetByID(r.Context(), id)
		users, _ := h.userService.List(r.Context())
		domains, _ := h.domainService.ListActive(r.Context())
		h.inertia.Render(w, r, "Mailboxes/Edit", gonertia.Props{
			"mailbox": mailbox,
			"users":   users,
			"domains": domains,
			"error":   err.Error(),
		})
		return
	}

	h.inertia.Location(w, r, "/mailboxes/"+strconv.FormatInt(id, 10)+"/edit")
}

func (h *MailboxHandler) Delete(w http.ResponseWriter, r *http.Request) {
	user := mw.GetUser(r)
	if !user.IsAdmin {
		h.inertia.Render(w, r, "Errors/Forbidden", nil)
		return
	}

	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	if err := h.mailboxService.Delete(r.Context(), id); err != nil {
		h.inertia.Render(w, r, "Errors/ServerError", nil)
		return
	}

	h.inertia.Location(w, r, "/mailboxes")
}

func (h *MailboxHandler) SetTags(w http.ResponseWriter, r *http.Request) {
	user := mw.GetUser(r)
	if !user.IsAdmin {
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(map[string]string{"error": "Forbidden"})
		return
	}

	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "Mailbox not found"})
		return
	}

	var req struct {
		TagIDs []int64 `json:"tag_ids"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request"})
		return
	}

	if err := h.tagService.SetMailboxTags(r.Context(), id, req.TagIDs); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to update tags"})
		return
	}

	tags, _ := h.tagService.GetTagsForMailbox(r.Context(), id)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"tags":    tags,
	})
}
