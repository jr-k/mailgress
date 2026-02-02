package smtp

import (
	"bytes"
	"context"
	"io"
	"log"
	"mime"
	"mime/multipart"
	"net/mail"
	"strings"
	"time"

	"github.com/emersion/go-smtp"
	"github.com/jr-k/mailgress/internal/service"
)

type Session struct {
	backend    *Backend
	ip         string
	from       string
	recipients []recipientInfo
}

type recipientInfo struct {
	address             string
	localPart           string
	slug                string
	mailboxID           int64
	domainID            int64
	maxEmailSizeBytes   int64
	maxAttachSizeBytes  int64
}

func (s *Session) AuthPlain(username, password string) error {
	return nil
}

func (s *Session) Mail(from string, opts *smtp.MailOptions) error {
	s.from = from
	s.recipients = nil
	return nil
}

func (s *Session) Rcpt(to string, opts *smtp.RcptOptions) error {
	localPart, domainName, err := parseAddress(to)
	if err != nil {
		return &smtp.SMTPError{
			Code:         550,
			EnhancedCode: smtp.EnhancedCode{5, 1, 1},
			Message:      "Invalid recipient address",
		}
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Look up the domain in the database
	domain, err := s.backend.domainService.GetByName(ctx, domainName)
	if err != nil {
		return &smtp.SMTPError{
			Code:         550,
			EnhancedCode: smtp.EnhancedCode{5, 1, 1},
			Message:      "Relay not permitted",
		}
	}

	if !domain.IsActive {
		return &smtp.SMTPError{
			Code:         550,
			EnhancedCode: smtp.EnhancedCode{5, 1, 1},
			Message:      "Domain is inactive",
		}
	}

	slug := service.ExtractSlug(localPart)

	mailbox, err := s.backend.mailboxService.GetBySlugAndDomain(ctx, slug, domain.ID)
	if err != nil {
		return &smtp.SMTPError{
			Code:         550,
			EnhancedCode: smtp.EnhancedCode{5, 1, 1},
			Message:      "Mailbox not found",
		}
	}

	if !mailbox.IsActive {
		return &smtp.SMTPError{
			Code:         550,
			EnhancedCode: smtp.EnhancedCode{5, 2, 1},
			Message:      "Mailbox is inactive",
		}
	}

	s.recipients = append(s.recipients, recipientInfo{
		address:            to,
		localPart:          localPart,
		slug:               slug,
		mailboxID:          mailbox.ID,
		domainID:           domain.ID,
		maxEmailSizeBytes:  mailbox.MaxEmailSizeBytes(),
		maxAttachSizeBytes: mailbox.MaxAttachmentSizeBytes(),
	})

	return nil
}

func (s *Session) Data(r io.Reader) error {
	// Use the minimum email size limit from all recipients
	maxEmailSize := int64(100 * 1024 * 1024) // 100MB default
	for _, rcpt := range s.recipients {
		if rcpt.maxEmailSizeBytes > 0 && rcpt.maxEmailSizeBytes < maxEmailSize {
			maxEmailSize = rcpt.maxEmailSizeBytes
		}
	}

	raw, err := io.ReadAll(io.LimitReader(r, maxEmailSize))
	if err != nil {
		return err
	}

	msg, err := mail.ReadMessage(bytes.NewReader(raw))
	if err != nil {
		return &smtp.SMTPError{
			Code:         550,
			EnhancedCode: smtp.EnhancedCode{5, 6, 0},
			Message:      "Invalid message format",
		}
	}

	headers := make(map[string]string)
	for k, v := range msg.Header {
		if len(v) > 0 {
			headers[k] = v[0]
		}
	}

	var date *time.Time
	if d, err := msg.Header.Date(); err == nil {
		date = &d
	}

	textBody, htmlBody := extractBodies(msg)

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	for _, rcpt := range s.recipients {
		email, err := s.backend.emailService.Create(ctx, service.CreateEmailParams{
			MailboxID:   rcpt.mailboxID,
			MessageID:   msg.Header.Get("Message-ID"),
			FromAddress: s.from,
			ToAddress:   rcpt.address,
			Subject:     msg.Header.Get("Subject"),
			Date:        date,
			Headers:     headers,
			TextBody:    textBody,
			HTMLBody:    htmlBody,
			RawSize:     int64(len(raw)),
		})
		if err != nil {
			log.Printf("Failed to store email for %s: %v", rcpt.address, err)
			continue
		}

		if err := s.processAttachments(ctx, email.ID, msg, rcpt.maxAttachSizeBytes); err != nil {
			log.Printf("Failed to process attachments for email %d: %v", email.ID, err)
		}

		fullEmail, err := s.backend.emailService.GetByID(ctx, email.ID)
		if err != nil {
			log.Printf("Failed to reload email %d: %v", email.ID, err)
			continue
		}

		s.backend.dispatcher.Dispatch(rcpt.mailboxID, fullEmail)
	}

	return nil
}

func (s *Session) Reset() {
	s.from = ""
	s.recipients = nil
}

func (s *Session) Logout() error {
	return nil
}

func parseAddress(addr string) (localPart, domain string, err error) {
	addr = strings.TrimSpace(addr)
	addr = strings.Trim(addr, "<>")

	parts := strings.Split(addr, "@")
	if len(parts) != 2 {
		return "", "", &smtp.SMTPError{Code: 550, Message: "Invalid address format"}
	}

	return parts[0], parts[1], nil
}

func extractBodies(msg *mail.Message) (textBody, htmlBody string) {
	contentType := msg.Header.Get("Content-Type")
	if contentType == "" {
		body, _ := io.ReadAll(msg.Body)
		return string(body), ""
	}

	mediaType, params, err := mime.ParseMediaType(contentType)
	if err != nil {
		body, _ := io.ReadAll(msg.Body)
		return string(body), ""
	}

	if strings.HasPrefix(mediaType, "text/plain") {
		body, _ := io.ReadAll(msg.Body)
		return string(body), ""
	}

	if strings.HasPrefix(mediaType, "text/html") {
		body, _ := io.ReadAll(msg.Body)
		return "", string(body)
	}

	if strings.HasPrefix(mediaType, "multipart/") {
		mr := multipart.NewReader(msg.Body, params["boundary"])
		for {
			part, err := mr.NextPart()
			if err != nil {
				break
			}

			partType := part.Header.Get("Content-Type")
			partMediaType, _, _ := mime.ParseMediaType(partType)

			body, _ := io.ReadAll(part)
			switch {
			case strings.HasPrefix(partMediaType, "text/plain") && textBody == "":
				textBody = string(body)
			case strings.HasPrefix(partMediaType, "text/html") && htmlBody == "":
				htmlBody = string(body)
			case strings.HasPrefix(partMediaType, "multipart/"):
				innerText, innerHTML := extractFromMultipart(body, partMediaType)
				if textBody == "" {
					textBody = innerText
				}
				if htmlBody == "" {
					htmlBody = innerHTML
				}
			}
		}
	}

	return textBody, htmlBody
}

func extractFromMultipart(body []byte, contentType string) (textBody, htmlBody string) {
	_, params, err := mime.ParseMediaType(contentType)
	if err != nil {
		return "", ""
	}

	mr := multipart.NewReader(bytes.NewReader(body), params["boundary"])
	for {
		part, err := mr.NextPart()
		if err != nil {
			break
		}

		partType := part.Header.Get("Content-Type")
		partMediaType, _, _ := mime.ParseMediaType(partType)

		partBody, _ := io.ReadAll(part)
		switch {
		case strings.HasPrefix(partMediaType, "text/plain") && textBody == "":
			textBody = string(partBody)
		case strings.HasPrefix(partMediaType, "text/html") && htmlBody == "":
			htmlBody = string(partBody)
		}
	}

	return textBody, htmlBody
}

func (s *Session) processAttachments(ctx context.Context, emailID int64, msg *mail.Message, maxAttachSize int64) error {
	contentType := msg.Header.Get("Content-Type")
	mediaType, params, err := mime.ParseMediaType(contentType)
	if err != nil || !strings.HasPrefix(mediaType, "multipart/") {
		return nil
	}

	mr := multipart.NewReader(msg.Body, params["boundary"])
	return s.processMultipartAttachments(ctx, emailID, mr, maxAttachSize)
}

func (s *Session) processMultipartAttachments(ctx context.Context, emailID int64, mr *multipart.Reader, maxAttachSize int64) error {
	for {
		part, err := mr.NextPart()
		if err != nil {
			break
		}

		filename := part.FileName()
		if filename == "" {
			contentType := part.Header.Get("Content-Type")
			mediaType, params, _ := mime.ParseMediaType(contentType)
			if strings.HasPrefix(mediaType, "multipart/") {
				innerMr := multipart.NewReader(part, params["boundary"])
				s.processMultipartAttachments(ctx, emailID, innerMr, maxAttachSize)
			}
			continue
		}

		contentType := part.Header.Get("Content-Type")
		if contentType == "" {
			contentType = "application/octet-stream"
		}
		mediaType, _, _ := mime.ParseMediaType(contentType)

		limitedReader := io.LimitReader(part, maxAttachSize)
		storagePath, size, err := s.backend.storage.Store(emailID, filename, limitedReader)
		if err != nil {
			log.Printf("Failed to store attachment %s: %v", filename, err)
			continue
		}

		_, err = s.backend.emailService.CreateAttachment(ctx, emailID, filename, mediaType, size, storagePath)
		if err != nil {
			log.Printf("Failed to record attachment %s: %v", filename, err)
		}
	}

	return nil
}
