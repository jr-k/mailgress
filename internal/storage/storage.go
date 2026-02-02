package storage

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
	"regexp"
	"time"

	"github.com/google/uuid"
)

var safeFilename = regexp.MustCompile(`[^a-zA-Z0-9._-]`)

type Storage struct {
	basePath string
}

func NewStorage(basePath string) (*Storage, error) {
	if err := os.MkdirAll(basePath, 0755); err != nil {
		return nil, fmt.Errorf("failed to create storage directory: %w", err)
	}
	return &Storage{basePath: basePath}, nil
}

func (s *Storage) Store(emailID int64, filename string, content io.Reader) (string, int64, error) {
	now := time.Now()
	dir := filepath.Join(
		s.basePath,
		fmt.Sprintf("%d", now.Year()),
		fmt.Sprintf("%02d", now.Month()),
		fmt.Sprintf("%02d", now.Day()),
		fmt.Sprintf("%d", emailID),
	)

	if err := os.MkdirAll(dir, 0755); err != nil {
		return "", 0, fmt.Errorf("failed to create directory: %w", err)
	}

	safeName := safeFilename.ReplaceAllString(filename, "_")
	if len(safeName) > 100 {
		safeName = safeName[:100]
	}
	uniqueName := fmt.Sprintf("%s_%s", uuid.New().String()[:8], safeName)
	fullPath := filepath.Join(dir, uniqueName)

	file, err := os.Create(fullPath)
	if err != nil {
		return "", 0, fmt.Errorf("failed to create file: %w", err)
	}
	defer file.Close()

	size, err := io.Copy(file, content)
	if err != nil {
		os.Remove(fullPath)
		return "", 0, fmt.Errorf("failed to write file: %w", err)
	}

	relPath, _ := filepath.Rel(s.basePath, fullPath)
	return relPath, size, nil
}

func (s *Storage) Get(path string) (io.ReadCloser, error) {
	fullPath := filepath.Join(s.basePath, path)
	return os.Open(fullPath)
}

func (s *Storage) Delete(path string) error {
	fullPath := filepath.Join(s.basePath, path)
	return os.Remove(fullPath)
}

func (s *Storage) FullPath(path string) string {
	return filepath.Join(s.basePath, path)
}
