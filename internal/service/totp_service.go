package service

import (
	"crypto/rand"
	"encoding/base32"
	"encoding/json"
	"strings"

	"github.com/pquerna/otp"
	"github.com/pquerna/otp/totp"
)

type TOTPService struct {
	issuer string
}

func NewTOTPService(issuer string) *TOTPService {
	return &TOTPService{issuer: issuer}
}

// GenerateSecret creates a new TOTP secret for a user
func (s *TOTPService) GenerateSecret(email string) (*otp.Key, error) {
	return totp.Generate(totp.GenerateOpts{
		Issuer:      s.issuer,
		AccountName: email,
		Algorithm:   otp.AlgorithmSHA1,
		Digits:      otp.DigitsSix,
		Period:      30,
	})
}

// ValidateCode validates a TOTP code against a secret
func (s *TOTPService) ValidateCode(secret, code string) bool {
	return totp.Validate(code, secret)
}

// GenerateBackupCodes creates 10 random backup codes
func (s *TOTPService) GenerateBackupCodes() ([]string, error) {
	codes := make([]string, 10)
	for i := 0; i < 10; i++ {
		bytes := make([]byte, 5)
		if _, err := rand.Read(bytes); err != nil {
			return nil, err
		}
		codes[i] = strings.ToUpper(base32.StdEncoding.EncodeToString(bytes))[:8]
	}
	return codes, nil
}

// ValidateBackupCode checks if code matches and returns remaining codes
func (s *TOTPService) ValidateBackupCode(codes []string, code string) ([]string, bool) {
	code = strings.ToUpper(strings.ReplaceAll(code, "-", ""))
	for i, c := range codes {
		if c == code {
			// Remove used code
			return append(codes[:i], codes[i+1:]...), true
		}
	}
	return codes, false
}

// EncodeBackupCodes serializes backup codes for storage
func (s *TOTPService) EncodeBackupCodes(codes []string) string {
	data, _ := json.Marshal(codes)
	return string(data)
}

// DecodeBackupCodes deserializes backup codes from storage
func (s *TOTPService) DecodeBackupCodes(data string) []string {
	if data == "" {
		return nil
	}
	var codes []string
	json.Unmarshal([]byte(data), &codes)
	return codes
}
