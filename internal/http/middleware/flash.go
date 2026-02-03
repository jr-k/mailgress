package middleware

import (
	"context"
	"net/http"
	"strings"
	"sync"

	"github.com/romsar/gonertia"
)

type FlashData struct {
	Success string `json:"success,omitempty"`
	Error   string `json:"error,omitempty"`
}

func GetFlash(r *http.Request) *FlashData {
	flash, _ := r.Context().Value(flashContextKey).(*FlashData)
	return flash
}

type FlashMiddleware struct {
	flashes map[string]*FlashData
	mu      sync.RWMutex
}

func NewFlashMiddleware() *FlashMiddleware {
	return &FlashMiddleware{
		flashes: make(map[string]*FlashData),
	}
}

func (m *FlashMiddleware) SetSuccess(r *http.Request, message string) {
	cookie, _ := r.Cookie("session_token")
	if cookie == nil {
		return
	}

	m.mu.Lock()
	defer m.mu.Unlock()
	m.flashes[cookie.Value] = &FlashData{Success: message}
}

func (m *FlashMiddleware) SetError(r *http.Request, message string) {
	cookie, _ := r.Cookie("session_token")
	if cookie == nil {
		return
	}

	m.mu.Lock()
	defer m.mu.Unlock()
	m.flashes[cookie.Value] = &FlashData{Error: message}
}

func (m *FlashMiddleware) Handle(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Skip flash handling for static assets to prevent consuming flash before page load
		path := r.URL.Path
		if strings.HasPrefix(path, "/assets/") || strings.HasPrefix(path, "/avatars/") || strings.HasPrefix(path, "/img/") || path == "/favicon.ico" {
			next.ServeHTTP(w, r)
			return
		}

		cookie, _ := r.Cookie("session_token")
		var sessionID string
		if cookie != nil {
			sessionID = cookie.Value
		}

		if sessionID != "" {
			m.mu.RLock()
			flash := m.flashes[sessionID]
			m.mu.RUnlock()

			if flash != nil {
				m.mu.Lock()
				delete(m.flashes, sessionID)
				m.mu.Unlock()

				ctx := context.WithValue(r.Context(), flashContextKey, flash)
				ctx = gonertia.SetProps(ctx, gonertia.Props{
					"flash": flash,
				})
				r = r.WithContext(ctx)
			}
		}

		next.ServeHTTP(w, r)
	})
}
