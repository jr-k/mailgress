package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	mw "github.com/jessym/mailgress/internal/http/middleware"
	"github.com/jessym/mailgress/internal/service"
	"github.com/romsar/gonertia"
)

type DomainHandler struct {
	inertia       *gonertia.Inertia
	domainService *service.DomainService
	dnsService    *service.DNSService
	tagService    *service.TagService
}

func NewDomainHandler(
	inertia *gonertia.Inertia,
	domainService *service.DomainService,
	dnsService *service.DNSService,
	tagService *service.TagService,
) *DomainHandler {
	return &DomainHandler{
		inertia:       inertia,
		domainService: domainService,
		dnsService:    dnsService,
		tagService:    tagService,
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

	dnsRecords := h.domainService.GetDNSRecords(domain)

	h.inertia.Render(w, r, "Domains/Show", gonertia.Props{
		"domain":     domain,
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

	allTags, _ := h.tagService.List(r.Context())
	domainTags, _ := h.tagService.GetTagsForDomain(r.Context(), id)

	h.inertia.Render(w, r, "Domains/Edit", gonertia.Props{
		"domain":     domain,
		"allTags":    allTags,
		"domainTags": domainTags,
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

	h.inertia.Location(w, r, "/domains/"+strconv.FormatInt(id, 10))
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
