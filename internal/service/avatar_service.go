package service

import (
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"

	"github.com/google/uuid"
)

type AvatarService struct {
	uploadDir string
}

func NewAvatarService(uploadDir string) *AvatarService {
	return &AvatarService{uploadDir: uploadDir}
}

func (s *AvatarService) SaveAvatar(file multipart.File, header *multipart.FileHeader) (string, error) {
	// Validate file type
	ext := strings.ToLower(filepath.Ext(header.Filename))
	if ext != ".jpg" && ext != ".jpeg" && ext != ".png" && ext != ".gif" && ext != ".webp" {
		return "", fmt.Errorf("invalid file type: only jpg, png, gif, and webp are allowed")
	}

	// Validate file size (max 2MB)
	if header.Size > 2*1024*1024 {
		return "", fmt.Errorf("file too large: maximum size is 2MB")
	}

	// Ensure upload directory exists
	if err := os.MkdirAll(s.uploadDir, 0755); err != nil {
		return "", fmt.Errorf("failed to create upload directory: %w", err)
	}

	// Generate unique filename
	filename := uuid.New().String() + ext
	filepath := filepath.Join(s.uploadDir, filename)

	// Create destination file
	dst, err := os.Create(filepath)
	if err != nil {
		return "", fmt.Errorf("failed to create file: %w", err)
	}
	defer dst.Close()

	// Copy file contents
	if _, err := io.Copy(dst, file); err != nil {
		os.Remove(filepath)
		return "", fmt.Errorf("failed to save file: %w", err)
	}

	return filename, nil
}

func (s *AvatarService) DeleteAvatar(filename string) error {
	if filename == "" {
		return nil
	}
	filepath := filepath.Join(s.uploadDir, filename)
	if err := os.Remove(filepath); err != nil && !os.IsNotExist(err) {
		return fmt.Errorf("failed to delete avatar: %w", err)
	}
	return nil
}
