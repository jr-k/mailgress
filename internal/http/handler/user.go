package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	mw "github.com/jr-k/mailgress/internal/http/middleware"
	"github.com/jr-k/mailgress/internal/service"
	"github.com/romsar/gonertia"
)

type UserHandler struct {
	inertia       *gonertia.Inertia
	userService   *service.UserService
	avatarService *service.AvatarService
	totpService   *service.TOTPService
	authService   *service.AuthService
	flash         *mw.FlashMiddleware
}

func NewUserHandler(inertia *gonertia.Inertia, userService *service.UserService, avatarService *service.AvatarService, totpService *service.TOTPService, authService *service.AuthService, flash *mw.FlashMiddleware) *UserHandler {
	return &UserHandler{
		inertia:       inertia,
		userService:   userService,
		avatarService: avatarService,
		totpService:   totpService,
		authService:   authService,
		flash:         flash,
	}
}

func (h *UserHandler) Index(w http.ResponseWriter, r *http.Request) {
	users, err := h.userService.List(r.Context())
	if err != nil {
		h.inertia.Render(w, r, "Errors/ServerError", nil)
		return
	}

	h.inertia.Render(w, r, "Users/Index", gonertia.Props{
		"users": users,
	})
}

func (h *UserHandler) Create(w http.ResponseWriter, r *http.Request) {
	h.inertia.Render(w, r, "Users/Create", nil)
}

func (h *UserHandler) Store(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Email     string `json:"email"`
		Password  string `json:"password"`
		IsAdmin   bool   `json:"is_admin"`
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.inertia.Render(w, r, "Users/Create", gonertia.Props{
			"error": "Invalid request",
		})
		return
	}

	if req.Email == "" || req.Password == "" {
		h.inertia.Render(w, r, "Users/Create", gonertia.Props{
			"error": "Email and password are required",
			"email": req.Email,
		})
		return
	}

	_, err := h.userService.CreateWithName(r.Context(), req.Email, req.Password, req.IsAdmin, req.FirstName, req.LastName)
	if err != nil {
		h.inertia.Render(w, r, "Users/Create", gonertia.Props{
			"error": "Failed to create user: " + err.Error(),
			"email": req.Email,
		})
		return
	}

	h.inertia.Location(w, r, "/users")
}

func (h *UserHandler) Show(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	user, err := h.userService.GetByID(r.Context(), id)
	if err != nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	h.inertia.Render(w, r, "Users/Show", gonertia.Props{
		"user": user,
	})
}

func (h *UserHandler) Security(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	user, err := h.userService.GetByID(r.Context(), id)
	if err != nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	h.inertia.Render(w, r, "Users/Security", gonertia.Props{
		"user": user,
	})
}

func (h *UserHandler) Edit(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	user, err := h.userService.GetByID(r.Context(), id)
	if err != nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	h.inertia.Render(w, r, "Users/Edit", gonertia.Props{
		"user": user,
	})
}

func (h *UserHandler) Update(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	var req struct {
		Email     string `json:"email"`
		Password  string `json:"password"`
		IsAdmin   bool   `json:"is_admin"`
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.inertia.Render(w, r, "Errors/ServerError", nil)
		return
	}

	var passwordPtr *string
	if req.Password != "" {
		passwordPtr = &req.Password
	}

	_, err = h.userService.UpdateWithName(r.Context(), id, req.Email, passwordPtr, req.IsAdmin, req.FirstName, req.LastName)
	if err != nil {
		user, _ := h.userService.GetByID(r.Context(), id)
		h.inertia.Render(w, r, "Users/Edit", gonertia.Props{
			"user":  user,
			"error": "Failed to update user: " + err.Error(),
		})
		return
	}

	h.flash.SetSuccess(r, "User updated successfully")
	h.inertia.Back(w, r)
}

func (h *UserHandler) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	// Delete avatar file if exists
	user, err := h.userService.GetByID(r.Context(), id)
	if err == nil && user.AvatarPath != "" {
		h.avatarService.DeleteAvatar(user.AvatarPath)
	}

	if err := h.userService.Delete(r.Context(), id); err != nil {
		h.inertia.Render(w, r, "Errors/ServerError", nil)
		return
	}

	h.inertia.Location(w, r, "/users")
}

func (h *UserHandler) UploadAvatar(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "User not found"})
		return
	}

	// Get existing user to delete old avatar
	user, err := h.userService.GetByID(r.Context(), id)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "User not found"})
		return
	}

	// Parse multipart form
	if err := r.ParseMultipartForm(2 << 20); err != nil { // 2MB max
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "File too large"})
		return
	}

	file, header, err := r.FormFile("avatar")
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "No file uploaded"})
		return
	}
	defer file.Close()

	// Save avatar file
	filename, err := h.avatarService.SaveAvatar(file, header)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	// Delete old avatar
	if user.AvatarPath != "" {
		h.avatarService.DeleteAvatar(user.AvatarPath)
	}

	// Update user with new avatar path
	updatedUser, err := h.userService.UpdateAvatar(r.Context(), id, filename)
	if err != nil {
		h.avatarService.DeleteAvatar(filename)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to update user"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"avatar_url": updatedUser.AvatarURL,
	})
}

func (h *UserHandler) DeleteAvatar(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "User not found"})
		return
	}

	user, err := h.userService.GetByID(r.Context(), id)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "User not found"})
		return
	}

	// Delete avatar file
	if user.AvatarPath != "" {
		if err := h.avatarService.DeleteAvatar(user.AvatarPath); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": "Failed to delete avatar"})
			return
		}
	}

	// Update user to remove avatar path
	if _, err := h.userService.UpdateAvatar(r.Context(), id, ""); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to update user"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

func (h *UserHandler) Profile(w http.ResponseWriter, r *http.Request) {
	user := mw.GetUser(r)
	if user == nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	h.inertia.Render(w, r, "Profile/Index", gonertia.Props{
		"user": user,
	})
}

func (h *UserHandler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	user := mw.GetUser(r)
	if user == nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	var req struct {
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.inertia.Render(w, r, "Profile/Index", gonertia.Props{
			"user":  user,
			"error": "Invalid request",
		})
		return
	}

	// Keep the existing email, password, and is_admin
	_, err := h.userService.UpdateWithName(r.Context(), user.ID, user.Email, nil, user.IsAdmin, req.FirstName, req.LastName)
	if err != nil {
		h.inertia.Render(w, r, "Profile/Index", gonertia.Props{
			"user":  user,
			"error": "Failed to update profile: " + err.Error(),
		})
		return
	}

	h.inertia.Location(w, r, "/profile")
}

func (h *UserHandler) UploadProfileAvatar(w http.ResponseWriter, r *http.Request) {
	user := mw.GetUser(r)
	if user == nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "User not found"})
		return
	}

	// Parse multipart form
	if err := r.ParseMultipartForm(2 << 20); err != nil { // 2MB max
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "File too large"})
		return
	}

	file, header, err := r.FormFile("avatar")
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "No file uploaded"})
		return
	}
	defer file.Close()

	// Save avatar file
	filename, err := h.avatarService.SaveAvatar(file, header)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
		return
	}

	// Delete old avatar
	if user.AvatarPath != "" {
		h.avatarService.DeleteAvatar(user.AvatarPath)
	}

	// Update user with new avatar path
	updatedUser, err := h.userService.UpdateAvatar(r.Context(), user.ID, filename)
	if err != nil {
		h.avatarService.DeleteAvatar(filename)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to update user"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"avatar_url": updatedUser.AvatarURL,
	})
}

func (h *UserHandler) DeleteProfileAvatar(w http.ResponseWriter, r *http.Request) {
	user := mw.GetUser(r)
	if user == nil {
		w.WriteHeader(http.StatusNotFound)
		json.NewEncoder(w).Encode(map[string]string{"error": "User not found"})
		return
	}

	// Delete avatar file
	if user.AvatarPath != "" {
		if err := h.avatarService.DeleteAvatar(user.AvatarPath); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": "Failed to delete avatar"})
			return
		}
	}

	// Update user to remove avatar path
	if _, err := h.userService.UpdateAvatar(r.Context(), user.ID, ""); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to update user"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

// 2FA Setup Handlers

func (h *UserHandler) Show2FASetup(w http.ResponseWriter, r *http.Request) {
	user := mw.GetUser(r)
	if user == nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	// Generate new TOTP secret
	key, err := h.totpService.GenerateSecret(user.Email)
	if err != nil {
		h.inertia.Render(w, r, "Profile/TwoFactor/Setup", gonertia.Props{
			"error": "Failed to generate 2FA secret",
			"user":  user,
		})
		return
	}

	h.inertia.Render(w, r, "Profile/TwoFactor/Setup", gonertia.Props{
		"secret": key.Secret(),
		"qrUrl":  key.URL(),
		"user":   user,
	})
}

func (h *UserHandler) Enable2FA(w http.ResponseWriter, r *http.Request) {
	user := mw.GetUser(r)
	if user == nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	var req struct {
		Secret string `json:"secret"`
		Code   string `json:"code"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.inertia.Render(w, r, "Profile/TwoFactor/Setup", gonertia.Props{
			"error":  "Invalid request",
			"secret": req.Secret,
			"user":   user,
		})
		return
	}

	// Validate the code against the secret
	if !h.totpService.ValidateCode(req.Secret, req.Code) {
		// Regenerate QR code for the same secret
		key, _ := h.totpService.GenerateSecret(user.Email)
		h.inertia.Render(w, r, "Profile/TwoFactor/Setup", gonertia.Props{
			"error":  "Invalid verification code. Please try again.",
			"secret": key.Secret(),
			"qrUrl":  key.URL(),
			"user":   user,
		})
		return
	}

	// Generate backup codes
	backupCodes, err := h.totpService.GenerateBackupCodes()
	if err != nil {
		h.inertia.Render(w, r, "Profile/TwoFactor/Setup", gonertia.Props{
			"error":  "Failed to generate backup codes",
			"secret": req.Secret,
			"user":   user,
		})
		return
	}

	// Enable 2FA
	encodedCodes := h.totpService.EncodeBackupCodes(backupCodes)
	_, err = h.userService.EnableTOTP(r.Context(), user.ID, req.Secret, encodedCodes)
	if err != nil {
		h.inertia.Render(w, r, "Profile/TwoFactor/Setup", gonertia.Props{
			"error":  "Failed to enable 2FA",
			"secret": req.Secret,
			"user":   user,
		})
		return
	}

	h.inertia.Render(w, r, "Profile/TwoFactor/BackupCodes", gonertia.Props{
		"backupCodes": backupCodes,
		"user":        user,
	})
}

func (h *UserHandler) Disable2FA(w http.ResponseWriter, r *http.Request) {
	user := mw.GetUser(r)
	if user == nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	var req struct {
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request"})
		return
	}

	// Verify password by attempting login
	_, err := h.authService.Login(r.Context(), user.Email, req.Password)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid password"})
		return
	}

	_, err = h.userService.DisableTOTP(r.Context(), user.ID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to disable 2FA"})
		return
	}

	h.flash.SetSuccess(r, "Two-factor authentication has been disabled")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}

func (h *UserHandler) ShowBackupCodes(w http.ResponseWriter, r *http.Request) {
	user := mw.GetUser(r)
	if user == nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	_, backupCodesStr, err := h.userService.GetTOTPInfo(r.Context(), user.ID)
	if err != nil {
		h.inertia.Render(w, r, "Errors/ServerError", nil)
		return
	}

	backupCodes := h.totpService.DecodeBackupCodes(backupCodesStr)

	h.inertia.Render(w, r, "Profile/TwoFactor/BackupCodes", gonertia.Props{
		"backupCodes": backupCodes,
		"user":        user,
		"viewOnly":    true,
	})
}

func (h *UserHandler) RegenerateBackupCodes(w http.ResponseWriter, r *http.Request) {
	user := mw.GetUser(r)
	if user == nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	var req struct {
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request"})
		return
	}

	// Verify password
	_, err := h.authService.Login(r.Context(), user.Email, req.Password)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid password"})
		return
	}

	// Generate new backup codes
	backupCodes, err := h.totpService.GenerateBackupCodes()
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to generate backup codes"})
		return
	}

	// Update backup codes
	encodedCodes := h.totpService.EncodeBackupCodes(backupCodes)
	err = h.userService.UpdateBackupCodes(r.Context(), user.ID, encodedCodes)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Failed to save backup codes"})
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"status":      "ok",
		"backupCodes": backupCodes,
	})
}
