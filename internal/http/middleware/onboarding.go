package middleware

import (
	"net/http"
	"strings"

	"github.com/jr-k/mailgress/internal/service"
)

type OnboardingMiddleware struct {
	settingsService *service.SettingsService
}

func NewOnboardingMiddleware(settingsService *service.SettingsService) *OnboardingMiddleware {
	return &OnboardingMiddleware{settingsService: settingsService}
}

func (m *OnboardingMiddleware) RequireOnboarding(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Skip for static assets
		if strings.HasPrefix(r.URL.Path, "/assets/") || r.URL.Path == "/favicon.ico" {
			next.ServeHTTP(w, r)
			return
		}

		// Skip for onboarding routes
		if strings.HasPrefix(r.URL.Path, "/onboarding") {
			next.ServeHTTP(w, r)
			return
		}

		// Check if onboarding is completed
		if !m.settingsService.IsOnboardingCompleted(r.Context()) {
			http.Redirect(w, r, "/onboarding", http.StatusFound)
			return
		}

		next.ServeHTTP(w, r)
	})
}
