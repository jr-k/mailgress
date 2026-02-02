package handler

import (
	"encoding/json"
	"net/http"

	"github.com/jessym/mailgress/internal/service"
	"github.com/romsar/gonertia"
)

type OnboardingHandler struct {
	inertia         *gonertia.Inertia
	settingsService *service.SettingsService
	userService     *service.UserService
	domainService   *service.DomainService
}

func NewOnboardingHandler(
	inertia *gonertia.Inertia,
	settingsService *service.SettingsService,
	userService *service.UserService,
	domainService *service.DomainService,
) *OnboardingHandler {
	return &OnboardingHandler{
		inertia:         inertia,
		settingsService: settingsService,
		userService:     userService,
		domainService:   domainService,
	}
}

func (h *OnboardingHandler) Show(w http.ResponseWriter, r *http.Request) {
	if h.settingsService.IsOnboardingCompleted(r.Context()) {
		http.Redirect(w, r, "/login", http.StatusFound)
		return
	}

	h.inertia.Render(w, r, "Onboarding/Index", nil)
}

func (h *OnboardingHandler) Complete(w http.ResponseWriter, r *http.Request) {
	if h.settingsService.IsOnboardingCompleted(r.Context()) {
		http.Redirect(w, r, "/login", http.StatusFound)
		return
	}

	var req struct {
		AdminEmail    string `json:"admin_email"`
		AdminPassword string `json:"admin_password"`
		DomainName    string `json:"domain_name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.inertia.Render(w, r, "Onboarding/Index", gonertia.Props{
			"error": "Invalid request",
		})
		return
	}

	adminEmail := req.AdminEmail
	adminPassword := req.AdminPassword
	domainName := req.DomainName

	// Validate
	if adminEmail == "" || adminPassword == "" || domainName == "" {
		h.inertia.Render(w, r, "Onboarding/Index", gonertia.Props{
			"error":       "All fields are required",
			"admin_email": adminEmail,
			"domain_name": domainName,
		})
		return
	}

	// Create admin user
	if err := h.userService.EnsureAdmin(r.Context(), adminEmail, adminPassword); err != nil {
		h.inertia.Render(w, r, "Onboarding/Index", gonertia.Props{
			"error":       "Failed to create admin user: " + err.Error(),
			"admin_email": adminEmail,
			"domain_name": domainName,
		})
		return
	}

	// Create first domain
	_, err := h.domainService.Create(r.Context(), domainName)
	if err != nil && err != service.ErrDomainAlreadyExists {
		h.inertia.Render(w, r, "Onboarding/Index", gonertia.Props{
			"error":       "Failed to create domain: " + err.Error(),
			"admin_email": adminEmail,
			"domain_name": domainName,
		})
		return
	}

	// Mark onboarding as complete
	if err := h.settingsService.CompleteOnboarding(r.Context()); err != nil {
		h.inertia.Render(w, r, "Onboarding/Index", gonertia.Props{
			"error": "Failed to complete onboarding",
		})
		return
	}

	h.inertia.Location(w, r, "/login")
}
