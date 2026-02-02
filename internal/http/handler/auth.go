package handler

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/jr-k/mailgress/internal/service"
	"github.com/romsar/gonertia"
)

type AuthHandler struct {
	inertia     *gonertia.Inertia
	authService *service.AuthService
	userService *service.UserService
	totpService *service.TOTPService
}

func NewAuthHandler(inertia *gonertia.Inertia, authService *service.AuthService, userService *service.UserService, totpService *service.TOTPService) *AuthHandler {
	return &AuthHandler{
		inertia:     inertia,
		authService: authService,
		userService: userService,
		totpService: totpService,
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

	result, err := h.authService.Login(r.Context(), email, password)
	if err != nil {
		h.inertia.Render(w, r, "Auth/Login", gonertia.Props{
			"error": "Invalid email or password",
			"email": email,
		})
		return
	}

	// Check if 2FA is required
	if result.Requires2FA {
		http.SetCookie(w, &http.Cookie{
			Name:     "pending_2fa_token",
			Value:    result.PendingToken,
			Path:     "/",
			MaxAge:   300, // 5 minutes
			HttpOnly: true,
			SameSite: http.SameSiteLaxMode,
		})
		h.inertia.Render(w, r, "Auth/TwoFactor", gonertia.Props{
			"email": email,
		})
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "session_token",
		Value:    result.Token,
		Path:     "/",
		Expires:  time.Now().Add(24 * 7 * time.Hour),
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})

	h.inertia.Location(w, r, "/dashboard")
}

func (h *AuthHandler) Show2FA(w http.ResponseWriter, r *http.Request) {
	cookie, err := r.Cookie("pending_2fa_token")
	if err != nil {
		h.inertia.Location(w, r, "/login")
		return
	}

	user, err := h.authService.GetPending2FAUser(r.Context(), cookie.Value)
	if err != nil {
		h.inertia.Location(w, r, "/login")
		return
	}

	h.inertia.Render(w, r, "Auth/TwoFactor", gonertia.Props{
		"email": user.Email,
	})
}

func (h *AuthHandler) Verify2FA(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Code string `json:"code"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.inertia.Render(w, r, "Auth/TwoFactor", gonertia.Props{
			"error": "Invalid request",
		})
		return
	}

	cookie, err := r.Cookie("pending_2fa_token")
	if err != nil {
		h.inertia.Render(w, r, "Auth/Login", gonertia.Props{
			"error": "2FA session expired. Please login again.",
		})
		return
	}

	// Get the pending user to validate the code
	user, err := h.authService.GetPending2FAUser(r.Context(), cookie.Value)
	if err != nil {
		h.inertia.Render(w, r, "Auth/Login", gonertia.Props{
			"error": "2FA session expired. Please login again.",
		})
		return
	}

	// Validate TOTP code
	secret, backupCodesStr, err := h.userService.GetTOTPInfo(r.Context(), user.ID)
	if err != nil {
		h.inertia.Render(w, r, "Auth/TwoFactor", gonertia.Props{
			"error": "Failed to verify code",
			"email": user.Email,
		})
		return
	}

	isValid := h.totpService.ValidateCode(secret, req.Code)

	// If TOTP code is invalid, try backup codes
	if !isValid {
		backupCodes := h.totpService.DecodeBackupCodes(backupCodesStr)
		remainingCodes, validBackup := h.totpService.ValidateBackupCode(backupCodes, req.Code)
		if validBackup {
			isValid = true
			// Update backup codes (remove used one)
			h.userService.UpdateBackupCodes(r.Context(), user.ID, h.totpService.EncodeBackupCodes(remainingCodes))
		}
	}

	if !isValid {
		h.inertia.Render(w, r, "Auth/TwoFactor", gonertia.Props{
			"error": "Invalid verification code",
			"email": user.Email,
		})
		return
	}

	// Complete login
	_, token, err := h.authService.Verify2FA(r.Context(), cookie.Value)
	if err != nil {
		h.inertia.Render(w, r, "Auth/Login", gonertia.Props{
			"error": "2FA session expired. Please login again.",
		})
		return
	}

	// Clear pending token cookie
	http.SetCookie(w, &http.Cookie{
		Name:   "pending_2fa_token",
		Value:  "",
		Path:   "/",
		MaxAge: -1,
	})

	// Set session cookie
	http.SetCookie(w, &http.Cookie{
		Name:     "session_token",
		Value:    token,
		Path:     "/",
		Expires:  time.Now().Add(24 * 7 * time.Hour),
		HttpOnly: true,
		SameSite: http.SameSiteLaxMode,
	})

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
