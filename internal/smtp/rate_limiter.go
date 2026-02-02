package smtp

import (
	"strings"
	"sync"
	"time"
)

type RateLimiter struct {
	maxRequests int
	windowSec   int
	requests    map[string][]time.Time
	mu          sync.Mutex
}

func NewRateLimiter(maxRequests, windowSec int) *RateLimiter {
	rl := &RateLimiter{
		maxRequests: maxRequests,
		windowSec:   windowSec,
		requests:    make(map[string][]time.Time),
	}

	go rl.cleanup()

	return rl
}

func (r *RateLimiter) Allow(ip string) bool {
	r.mu.Lock()
	defer r.mu.Unlock()

	ip = extractIP(ip)
	now := time.Now()
	windowStart := now.Add(-time.Duration(r.windowSec) * time.Second)

	times := r.requests[ip]
	var validTimes []time.Time
	for _, t := range times {
		if t.After(windowStart) {
			validTimes = append(validTimes, t)
		}
	}

	if len(validTimes) >= r.maxRequests {
		r.requests[ip] = validTimes
		return false
	}

	r.requests[ip] = append(validTimes, now)
	return true
}

func (r *RateLimiter) cleanup() {
	ticker := time.NewTicker(time.Minute)
	for range ticker.C {
		r.mu.Lock()
		now := time.Now()
		windowStart := now.Add(-time.Duration(r.windowSec) * time.Second)

		for ip, times := range r.requests {
			var validTimes []time.Time
			for _, t := range times {
				if t.After(windowStart) {
					validTimes = append(validTimes, t)
				}
			}
			if len(validTimes) == 0 {
				delete(r.requests, ip)
			} else {
				r.requests[ip] = validTimes
			}
		}
		r.mu.Unlock()
	}
}

func extractIP(addr string) string {
	if idx := strings.LastIndex(addr, ":"); idx != -1 {
		return addr[:idx]
	}
	return addr
}
