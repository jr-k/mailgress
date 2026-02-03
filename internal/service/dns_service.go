package service

import (
	"context"
	"io"
	"net"
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/jr-k/mailgress/internal/domain"
)

var ipv4Regex = regexp.MustCompile(`^\d{1,3}(\.\d{1,3}){3}$`)

type DNSService struct{}

func NewDNSService() *DNSService {
	return &DNSService{}
}

func (s *DNSService) GetWanAddress() string {
	urls := []string{"https://4.ident.me", "https://4.tnedi.me"}
	client := &http.Client{Timeout: 5 * time.Second}

	for _, url := range urls {
		resp, err := client.Get(url)
		if err != nil {
			continue
		}
		defer resp.Body.Close()

		body, err := io.ReadAll(resp.Body)
		if err != nil {
			continue
		}

		ip := strings.TrimSpace(string(body))
		if ipv4Regex.MatchString(ip) {
			return ip
		}
	}

	return ""
}

type DNSCheckResult struct {
	MX  *DNSRecordCheck `json:"mx"`
	TXT *DNSRecordCheck `json:"txt"`
}

type DNSRecordCheck struct {
	Expected string   `json:"expected"`
	Found    []string `json:"found"`
	Valid    bool     `json:"valid"`
	Error    string   `json:"error,omitempty"`
}

func (s *DNSService) VerifyDomain(ctx context.Context, d *domain.Domain) (*DNSCheckResult, error) {
	result := &DNSCheckResult{
		MX:  &DNSRecordCheck{},
		TXT: &DNSRecordCheck{},
	}

	expectedRecords := d.GetDNSRecords()

	// Check MX record
	var expectedMX string
	for _, rec := range expectedRecords {
		if rec.Type == "MX" {
			expectedMX = rec.Value
			break
		}
	}
	result.MX.Expected = expectedMX
	result.MX = s.checkMX(d.Name, expectedMX)

	// Check TXT record (SPF)
	var expectedTXT string
	for _, rec := range expectedRecords {
		if rec.Type == "TXT" && strings.HasPrefix(rec.Value, "v=spf1") {
			expectedTXT = rec.Value
			break
		}
	}
	result.TXT.Expected = expectedTXT
	result.TXT = s.checkTXT(d.Name, expectedTXT)

	return result, nil
}

func (s *DNSService) checkMX(domainName, expected string) *DNSRecordCheck {
	check := &DNSRecordCheck{
		Expected: expected,
		Found:    []string{},
		Valid:    false,
	}

	mxRecords, err := net.LookupMX(domainName)
	if err != nil {
		check.Error = "No MX records found"
		return check
	}

	for _, mx := range mxRecords {
		host := strings.TrimSuffix(mx.Host, ".")
		check.Found = append(check.Found, host)
		if strings.EqualFold(host, expected) {
			check.Valid = true
		}
	}

	if !check.Valid && len(check.Found) > 0 {
		check.Error = "MX record does not match expected value"
	}

	return check
}

func (s *DNSService) checkTXT(domainName, expected string) *DNSRecordCheck {
	check := &DNSRecordCheck{
		Expected: expected,
		Found:    []string{},
		Valid:    false,
	}

	txtRecords, err := net.LookupTXT(domainName)
	if err != nil {
		check.Error = "No TXT records found"
		return check
	}

	for _, txt := range txtRecords {
		if strings.HasPrefix(txt, "v=spf1") {
			check.Found = append(check.Found, txt)
			if strings.Contains(txt, "mx") {
				check.Valid = true
			}
		}
	}

	if !check.Valid && len(check.Found) == 0 {
		check.Error = "No SPF record found"
	} else if !check.Valid {
		check.Error = "SPF record does not include MX"
	}

	return check
}
