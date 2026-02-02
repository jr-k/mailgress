package webhook

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/jr-k/mailgress/internal/domain"
)

var httpClient = &http.Client{
	Timeout: 60 * time.Second,
	Transport: &http.Transport{
		MaxIdleConns:        100,
		MaxIdleConnsPerHost: 10,
		IdleConnTimeout:     90 * time.Second,
	},
}

func SendWebhook(ctx context.Context, webhook *domain.Webhook, payload []byte, timeout time.Duration) (statusCode int, responseBody string, err error) {
	ctx, cancel := context.WithTimeout(ctx, timeout)
	defer cancel()

	req, err := http.NewRequestWithContext(ctx, "POST", webhook.URL, bytes.NewReader(payload))
	if err != nil {
		return 0, "", fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("User-Agent", "Mailgress/1.0")
	req.Header.Set("X-Mailgress-Event", "email.received")

	if webhook.HMACSecret != "" {
		signature := SignPayload(payload, webhook.HMACSecret)
		req.Header.Set("X-Mailgress-Signature", signature)
	}

	for key, value := range webhook.Headers {
		req.Header.Set(key, value)
	}

	resp, err := httpClient.Do(req)
	if err != nil {
		return 0, "", fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(io.LimitReader(resp.Body, 10*1024))
	if err != nil {
		return resp.StatusCode, "", fmt.Errorf("failed to read response: %w", err)
	}

	return resp.StatusCode, string(body), nil
}

func TestWebhook(ctx context.Context, webhook *domain.Webhook) (statusCode int, responseBody string, err error) {
	payload := BuildTestPayload()
	payloadBytes, err := payload.JSON()
	if err != nil {
		return 0, "", err
	}

	return SendWebhook(ctx, webhook, payloadBytes, time.Duration(webhook.TimeoutSec)*time.Second)
}
