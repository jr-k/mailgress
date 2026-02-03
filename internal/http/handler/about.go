package handler

import (
	"net/http"

	"github.com/jr-k/mailgress/internal/buildinfo"
	"github.com/romsar/gonertia"
)

type AboutHandler struct {
	inertia *gonertia.Inertia
}

func NewAboutHandler(inertia *gonertia.Inertia) *AboutHandler {
	return &AboutHandler{
		inertia: inertia,
	}
}

func (h *AboutHandler) Show(w http.ResponseWriter, r *http.Request) {
	h.inertia.Render(w, r, "Settings/About/Index", gonertia.Props{
		"buildInfo": map[string]interface{}{
			"version":     buildinfo.Version,
			"author":      buildinfo.Author,
			"email":       buildinfo.Email,
			"website":     buildinfo.Website,
			"license":     buildinfo.License,
			"copyright":   buildinfo.Copyright,
			"description": buildinfo.Description,
			"features":    buildinfo.Features,
			"commit":      buildinfo.Commit,
			"date":        buildinfo.Date,
		},
	})
}
