package middleware

import (
	"context"
	"net/http"

	"github.com/jr-k/mailgress/internal/domain"
	"github.com/jr-k/mailgress/internal/service"
	"github.com/romsar/gonertia"
)

type contextKey string

const (
	userContextKey  contextKey = "user"
	flashContextKey contextKey = "flash"
)

type AuthMiddleware struct {
	authService *service.AuthService
	inertia     *gonertia.Inertia
}

func NewAuthMiddleware(authService *service.AuthService, inertia *gonertia.Inertia) *AuthMiddleware {
	return &AuthMiddleware{
		authService: authService,
		inertia:     inertia,
	}
}

func (m *AuthMiddleware) RequireAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("session_token")
		if err != nil {
			http.Redirect(w, r, "/login", http.StatusFound)
			return
		}

		user, err := m.authService.ValidateSession(r.Context(), cookie.Value)
		if err != nil {
			http.SetCookie(w, &http.Cookie{
				Name:     "session_token",
				Value:    "",
				Path:     "/",
				MaxAge:   -1,
				HttpOnly: true,
			})
			http.Redirect(w, r, "/login", http.StatusFound)
			return
		}

		ctx := context.WithValue(r.Context(), userContextKey, user)
		// Share auth props with Inertia
		ctx = gonertia.SetProps(ctx, gonertia.Props{
			"auth": map[string]interface{}{
				"user": map[string]interface{}{
					"id":         user.ID,
					"email":      user.Email,
					"first_name": user.FirstName,
					"last_name":  user.LastName,
					"is_admin":   user.IsAdmin,
					"avatar_url": user.AvatarURL,
				},
			},
		})
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func (m *AuthMiddleware) RequireAdmin(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		user := GetUser(r)
		if user == nil || !user.IsAdmin {
			m.inertia.Render(w, r, "Errors/Forbidden", nil)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func GetUser(r *http.Request) *domain.User {
	user, ok := r.Context().Value(userContextKey).(*domain.User)
	if !ok {
		return nil
	}
	return user
}
