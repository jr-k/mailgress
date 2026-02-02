package handler

import (
	"fmt"
	"io"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	mw "github.com/jr-k/mailgress/internal/http/middleware"
	"github.com/jr-k/mailgress/internal/service"
	"github.com/jr-k/mailgress/internal/storage"
	"github.com/romsar/gonertia"
)

type EmailHandler struct {
	inertia        *gonertia.Inertia
	emailService   *service.EmailService
	mailboxService *service.MailboxService
	storage        *storage.Storage
}

func NewEmailHandler(
	inertia *gonertia.Inertia,
	emailService *service.EmailService,
	mailboxService *service.MailboxService,
	storage *storage.Storage,
) *EmailHandler {
	return &EmailHandler{
		inertia:        inertia,
		emailService:   emailService,
		mailboxService: mailboxService,
		storage:        storage,
	}
}

func (h *EmailHandler) Show(w http.ResponseWriter, r *http.Request) {
	user := mw.GetUser(r)

	mailboxID, err := strconv.ParseInt(chi.URLParam(r, "mailboxId"), 10, 64)
	if err != nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	emailID, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	mailbox, err := h.mailboxService.GetByID(r.Context(), mailboxID)
	if err != nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	if !user.IsAdmin && (mailbox.OwnerID == nil || *mailbox.OwnerID != user.ID) {
		h.inertia.Render(w, r, "Errors/Forbidden", nil)
		return
	}

	email, err := h.emailService.GetByID(r.Context(), emailID)
	if err != nil {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	if email.MailboxID != mailboxID {
		h.inertia.Render(w, r, "Errors/NotFound", nil)
		return
	}

	for i := range email.Attachments {
		email.Attachments[i].DownloadURL = fmt.Sprintf("/attachments/%d/download", email.Attachments[i].ID)
	}

	h.inertia.Render(w, r, "Emails/Show", gonertia.Props{
		"email":   email,
		"mailbox": mailbox,
	})
}

func (h *EmailHandler) DownloadAttachment(w http.ResponseWriter, r *http.Request) {
	user := mw.GetUser(r)

	attachmentID, err := strconv.ParseInt(chi.URLParam(r, "id"), 10, 64)
	if err != nil {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}

	email, err := h.findEmailByAttachment(r, attachmentID)
	if err != nil {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}

	mailbox, err := h.mailboxService.GetByID(r.Context(), email.MailboxID)
	if err != nil {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}

	if !user.IsAdmin && (mailbox.OwnerID == nil || *mailbox.OwnerID != user.ID) {
		http.Error(w, "Forbidden", http.StatusForbidden)
		return
	}

	var attachment *struct {
		filename    string
		contentType string
		storagePath string
	}

	for _, att := range email.Attachments {
		if att.ID == attachmentID {
			attachment = &struct {
				filename    string
				contentType string
				storagePath string
			}{
				filename:    att.Filename,
				contentType: att.ContentType,
				storagePath: att.StoragePath,
			}
			break
		}
	}

	if attachment == nil {
		http.Error(w, "Not found", http.StatusNotFound)
		return
	}

	file, err := h.storage.Get(attachment.storagePath)
	if err != nil {
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}
	defer file.Close()

	w.Header().Set("Content-Type", attachment.contentType)
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", attachment.filename))

	io.Copy(w, file)
}

func (h *EmailHandler) findEmailByAttachment(r *http.Request, attachmentID int64) (*struct {
	MailboxID   int64
	Attachments []struct {
		ID          int64
		Filename    string
		ContentType string
		StoragePath string
	}
}, error) {
	return nil, fmt.Errorf("not implemented - need to add query")
}
