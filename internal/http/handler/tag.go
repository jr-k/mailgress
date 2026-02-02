package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/jessym/mailgress/internal/service"
	"github.com/romsar/gonertia"
)

type TagHandler struct {
	inertia    *gonertia.Inertia
	tagService *service.TagService
}

func NewTagHandler(inertia *gonertia.Inertia, tagService *service.TagService) *TagHandler {
	return &TagHandler{
		inertia:    inertia,
		tagService: tagService,
	}
}

func (h *TagHandler) Index(w http.ResponseWriter, r *http.Request) {
	tags, err := h.tagService.List(r.Context())
	if err != nil {
		h.inertia.Render(w, r, "Errors/ServerError", nil)
		return
	}

	// Get usage counts for each tag
	type TagWithUsage struct {
		ID        int64  `json:"id"`
		Name      string `json:"name"`
		Color     string `json:"color"`
		UsageCount int64 `json:"usage_count"`
		CreatedAt string `json:"created_at"`
	}

	tagsWithUsage := make([]TagWithUsage, len(tags))
	for i, tag := range tags {
		count, _ := h.tagService.CountUsage(r.Context(), tag.ID)
		tagsWithUsage[i] = TagWithUsage{
			ID:         tag.ID,
			Name:       tag.Name,
			Color:      tag.Color,
			UsageCount: count,
			CreatedAt:  tag.CreatedAt.Format("2006-01-02"),
		}
	}

	h.inertia.Render(w, r, "Tags/Index", gonertia.Props{
		"tags": tagsWithUsage,
	})
}

func (h *TagHandler) Create(w http.ResponseWriter, r *http.Request) {
	h.inertia.Render(w, r, "Tags/Create", nil)
}

func (h *TagHandler) Store(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name  string `json:"name"`
		Color string `json:"color"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.inertia.Render(w, r, "Tags/Create", gonertia.Props{
			"error": "Invalid request",
		})
		return
	}

	if req.Name == "" {
		h.inertia.Render(w, r, "Tags/Create", gonertia.Props{
			"error": "Name is required",
		})
		return
	}

	if req.Color == "" {
		req.Color = "#6366f1" // Default color
	}

	_, err := h.tagService.Create(r.Context(), req.Name, req.Color)
	if err != nil {
		h.inertia.Render(w, r, "Tags/Create", gonertia.Props{
			"error": "Failed to create tag: " + err.Error(),
			"name":  req.Name,
			"color": req.Color,
		})
		return
	}

	h.inertia.Location(w, r, "/tags")
}

func (h *TagHandler) Edit(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	tag, err := h.tagService.GetByID(r.Context(), id)
	if err != nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	h.inertia.Render(w, r, "Tags/Edit", gonertia.Props{
		"tag": tag,
	})
}

func (h *TagHandler) Update(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	var req struct {
		Name  string `json:"name"`
		Color string `json:"color"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.inertia.Render(w, r, "Errors/ServerError", nil)
		return
	}

	if req.Name == "" {
		tag, _ := h.tagService.GetByID(r.Context(), id)
		h.inertia.Render(w, r, "Tags/Edit", gonertia.Props{
			"tag":   tag,
			"error": "Name is required",
		})
		return
	}

	_, err = h.tagService.Update(r.Context(), id, req.Name, req.Color)
	if err != nil {
		tag, _ := h.tagService.GetByID(r.Context(), id)
		h.inertia.Render(w, r, "Tags/Edit", gonertia.Props{
			"tag":   tag,
			"error": "Failed to update tag: " + err.Error(),
		})
		return
	}

	h.inertia.Location(w, r, "/tags")
}

func (h *TagHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	if err := h.tagService.Delete(r.Context(), id); err != nil {
		h.inertia.Render(w, r, "Errors/ServerError", nil)
		return
	}

	h.inertia.Location(w, r, "/tags")
}

// API endpoint to list all tags (for tag selector component)
func (h *TagHandler) ListAPI(w http.ResponseWriter, r *http.Request) {
	tags, err := h.tagService.List(r.Context())
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to fetch tags"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tags)
}
