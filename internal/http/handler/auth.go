package handler

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/jessym/mailgress/internal/service"
	"github.com/romsar/gonertia"
)

type AuthHandler struct {
	inertia     *gonertia.Inertia
	authService *service.AuthService
}

func NewAuthHandler(inertia *gonertia.Inertia, authService *service.AuthService) *AuthHandler {
	return &AuthHandler{
		inertia:     inertia,
		authService: authService,
	}
}

func (h *AuthHandler) ShowLogin(w http.ResponseWriter, r *http.Request) {
	cookie, _ := r.Cookie("session_token")
	if cookie != nil {
		if _, err := h.authService.ValidateSession(r.Context(), cookie.Value); err == nil {
			h.inertia.Location(w, r, "/dashboard")
			return
		}
	}

	h.inertia.Render(w, r, "Auth/Login", nil)
}

func (h *AuthHandler) Login(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.inertia.Render(w, r, "Auth/Login", gonertia.Props{
			"error": "Invalid request",
		})
		return
	}

	email := req.Email
	password := req.Password

	user, token, err := h.authService.Login(r.Context(), email, password)
	if err != nil {
		h.inertia.Render(w, r, "Auth/Login", gonertia.Props{
			"error": "Invalid email or password",
			"email": email,
		})
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "session_token",
		Value:    token,
		Path:     "/",
		Expires:  time.Now().Add(24 * 7 * time.Hour),
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})

	_ = user
	h.inertia.Location(w, r, "/dashboard")
}

func (h *AuthHandler) Logout(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("session_token")
	if err == nil {
		h.authService.Logout(r.Context(), cookie.Value)
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "session_token",
		Value:    "",
		Path:     "/",
		MaxAge:   -1,
		HttpOnly: true,
	})

	h.inertia.Location(w, r, "/login")
}
