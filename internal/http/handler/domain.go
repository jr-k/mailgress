package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	mw "github.com/jr-k/mailgress/internal/http/middleware"
	"github.com/jr-k/mailgress/internal/service"
	"github.com/romsar/gonertia"
)

type DomainHandler struct {
	inertia        *gonertia.Inertia
	domainService  *service.DomainService
	dnsService     *service.DNSService
	tagService     *service.TagService
	mailboxService *service.MailboxService
}

func NewDomainHandler(
	inertia *gonertia.Inertia,
	domainService *service.DomainService,
	dnsService *service.DNSService,
	tagService *service.TagService,
	mailboxService *service.MailboxService,
) *DomainHandler {
	return &DomainHandler{
		inertia:        inertia,
		domainService:  domainService,
		dnsService:     dnsService,
		tagService:     tagService,
		mailboxService: mailboxService,
	}
}

func (h *DomainHandler) Index(w http.ResponseWriter, r *http.Request) {
	user := mw.GetUser(r)
	if !user.IsAdmin {
		h.inertia.Render(w, r, "Errors/Forbidden", nil)
		return
	}

	domains, _ := h.domainService.List(r.Context())
	allTags, _ := h.tagService.List(r.Context())

	// Build a map of domain ID to tags
	domainTagsMap := make(map[int64]interface{})
	for _, d := range domains {
		tags, _ := h.tagService.GetTagsForDomain(r.Context(), d.ID)
		domainTagsMap[d.ID] = tags
	}

	h.inertia.Render(w, r, "Domains/Index", gonertia.Props{
		"domains":       domains,
		"allTags":       allTags,
		"domainTagsMap": domainTagsMap,
	})
}

func (h *DomainHandler) Create(w http.ResponseWriter, r *http.Request) {
	user := mw.GetUser(r)
	if !user.IsAdmin {
		h.inertia.Render(w, r, "Errors/Forbidden", nil)
		return
	}

	h.inertia.Render(w, r, "Domains/Create", nil)
}

func (h *DomainHandler) Store(w http.ResponseWriter, r *http.Request) {
	user := mw.GetUser(r)
	if !user.IsAdmin {
		h.inertia.Render(w, r, "Errors/Forbidden", nil)
		return
	}

	var req struct {
		Name string `json:"name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.inertia.Render(w, r, "Domains/Create", gonertia.Props{
			"error": "Invalid request",
		})
		return
	}

	domain, err := h.domainService.Create(r.Context(), req.Name)
	if err != nil {
		h.inertia.Render(w, r, "Domains/Create", gonertia.Props{
			"error": err.Error(),
			"name":  req.Name,
		})
		return
	}

	h.inertia.Location(w, r, "/domains/"+strconv.FormatInt(domain.ID, 10))
}

func (h *DomainHandler) Show(w http.ResponseWriter, r *http.Request) {
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

	domain, err := h.domainService.GetByID(r.Context(), id)
	if err != nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	// Load mailbox count for sidebar
	mailboxes, _ := h.mailboxService.ListByDomain(r.Context(), id)
	domain.MailboxCount = int64(len(mailboxes))

	allDomains, _ := h.domainService.List(r.Context())
	dnsRecords := h.domainService.GetDNSRecords(domain)

	h.inertia.Render(w, r, "Domains/Show", gonertia.Props{
		"domain":     domain,
		"allDomains": allDomains,
		"dnsRecords": dnsRecords,
	})
}

func (h *DomainHandler) Edit(w http.ResponseWriter, r *http.Request) {
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

	domain, err := h.domainService.GetByID(r.Context(), id)
	if err != nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	// Load mailbox count for sidebar
	mailboxesForCount, _ := h.mailboxService.ListByDomain(r.Context(), id)
	domain.MailboxCount = int64(len(mailboxesForCount))

	allDomains, _ := h.domainService.List(r.Context())
	allTags, _ := h.tagService.List(r.Context())
	domainTags, _ := h.tagService.GetTagsForDomain(r.Context(), id)

	h.inertia.Render(w, r, "Domains/Edit", gonertia.Props{
		"domain":     domain,
		"allDomains": allDomains,
		"allTags":    allTags,
		"domainTags": domainTags,
	})
}

func (h *DomainHandler) Mailboxes(w http.ResponseWriter, r *http.Request) {
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

	domain, err := h.domainService.GetByID(r.Context(), id)
	if err != nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	allDomains, _ := h.domainService.List(r.Context())
	mailboxes, _ := h.mailboxService.ListByDomain(r.Context(), id)

	// Load mailbox count for sidebar
	domain.MailboxCount = int64(len(mailboxes))

	// Enrich mailboxes with stats and owner info
	type enrichedMailbox struct {
		ID                  int64                  `json:"id"`
		Slug                string                 `json:"slug"`
		OwnerID             *int64                 `json:"owner_id"`
		DomainID            *int64                 `json:"domain_id"`
		Description         string                 `json:"description"`
		IsActive            bool                   `json:"is_active"`
		CreatedAt           string                 `json:"created_at"`
		UpdatedAt           string                 `json:"updated_at"`
		MaxEmailSizeMB      int                    `json:"max_email_size_mb"`
		MaxAttachmentSizeMB int                    `json:"max_attachment_size_mb"`
		RetentionDays       int                    `json:"retention_days"`
		Owner               map[string]interface{} `json:"owner,omitempty"`
		Stats               map[string]interface{} `json:"stats,omitempty"`
	}

	enrichedMailboxes := make([]enrichedMailbox, len(mailboxes))
	for i, mb := range mailboxes {
		enrichedMailboxes[i] = enrichedMailbox{
			ID:                  mb.ID,
			Slug:                mb.Slug,
			OwnerID:             mb.OwnerID,
			DomainID:            mb.DomainID,
			Description:         mb.Description,
			IsActive:            mb.IsActive,
			CreatedAt:           mb.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
			UpdatedAt:           mb.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
			MaxEmailSizeMB:      mb.MaxEmailSizeMB,
			MaxAttachmentSizeMB: mb.MaxAttachmentSizeMB,
			RetentionDays:       mb.RetentionDays,
		}

		// Get stats
		if stats, err := h.mailboxService.GetStats(r.Context(), mb.ID); err == nil {
			enrichedMailboxes[i].Stats = map[string]interface{}{
				"email_count":   stats.EmailCount,
				"webhook_count": stats.WebhookCount,
			}
			if stats.LastEmailAt != nil {
				enrichedMailboxes[i].Stats["last_email_at"] = stats.LastEmailAt.Format("2006-01-02T15:04:05Z07:00")
			}
		}
	}

	h.inertia.Render(w, r, "Domains/Mailboxes", gonertia.Props{
		"domain":     domain,
		"allDomains": allDomains,
		"mailboxes":  enrichedMailboxes,
	})
}

func (h *DomainHandler) Update(w http.ResponseWriter, r *http.Request) {
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
		Name       string `json:"name"`
		IsVerified bool   `json:"is_verified"`
		IsActive   bool   `json:"is_active"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.inertia.Render(w, r, "Errors/ServerError", nil)
		return
	}

	_, err = h.domainService.Update(r.Context(), id, req.Name, req.IsVerified, req.IsActive)
	if err != nil {
		domain, _ := h.domainService.GetByID(r.Context(), id)
		h.inertia.Render(w, r, "Domains/Edit", gonertia.Props{
			"domain": domain,
			"error":  err.Error(),
		})
		return
	}

	h.inertia.Location(w, r, "/domains/"+strconv.FormatInt(id, 10)+"/edit")
}

func (h *DomainHandler) Delete(w http.ResponseWriter, r *http.Request) {
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

	if err := h.domainService.Delete(r.Context(), id); err != nil {
		h.inertia.Render(w, r, "Errors/ServerError", nil)
		return
	}

	h.inertia.Location(w, r, "/domains")
}

func (h *DomainHandler) Verify(w http.ResponseWriter, r *http.Request) {
	user := mw.GetUser(r)
	if !user.IsAdmin {
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(map[string]string{"error": "Forbidden"})
		return
	}

	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "Domain not found"})
		return
	}

	domain, err := h.domainService.GetByID(r.Context(), id)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "Domain not found"})
		return
	}

	result, err := h.dnsService.VerifyDomain(r.Context(), domain)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to verify DNS"})
		return
	}

	// If all DNS checks pass, automatically mark domain as verified
	if result.MX.Valid && result.TXT.Valid && !domain.IsVerified {
		h.domainService.Update(r.Context(), id, domain.Name, true, domain.IsActive)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func (h *DomainHandler) SetTags(w http.ResponseWriter, r *http.Request) {
	user := mw.GetUser(r)
	if !user.IsAdmin {
		w.WriteHeader(http.StatusForbidden)
		json.NewEncoder(w).Encode(map[string]string{"error": "Forbidden"})
		return
	}

	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "Domain not found"})
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

	if err := h.tagService.SetDomainTags(r.Context(), id, req.TagIDs); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to update tags"})
		return
	}

	tags, _ := h.tagService.GetTagsForDomain(r.Context(), id)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"success": true,
		"tags":    tags,
	})
}
