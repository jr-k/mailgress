package middleware

import (
	"context"
	"net/http"
	"sync"
)

type FlashData struct {
	Success string `json:"success,omitempty"`
	Error   string `json:"error,omitempty"`
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

func (m *FlashMiddleware) Handle(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
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
				r = r.WithContext(ctx)
			}
		}

		next.ServeHTTP(w, r)
	})
}
