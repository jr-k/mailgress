package webhook

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"time"
)

func SignPayload(payload []byte, secret string) string {
	if secret == "" {
		return ""
	}

	timestamp := time.Now().Unix()
	signedPayload := fmt.Sprintf("%d.%s", timestamp, string(payload))

	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(signedPayload))
	signature := hex.EncodeToString(mac.Sum(nil))

	return fmt.Sprintf("t=%d,v1=%s", timestamp, signature)
}

func VerifySignature(payload []byte, signature, secret string, tolerance time.Duration) bool {
	if secret == "" || signature == "" {
		return true
	}

	var timestamp int64
	var providedSig string

	_, err := fmt.Sscanf(signature, "t=%d,v1=%s", &timestamp, &providedSig)
	if err != nil {
		return false
	}

	if time.Since(time.Unix(timestamp, 0)) > tolerance {
		return false
	}

	signedPayload := fmt.Sprintf("%d.%s", timestamp, string(payload))
	mac := hmac.New(sha256.New, []byte(secret))
	mac.Write([]byte(signedPayload))
	expectedSig := hex.EncodeToString(mac.Sum(nil))

	return hmac.Equal([]byte(providedSig), []byte(expectedSig))
}
