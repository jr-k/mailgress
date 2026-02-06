package webhook

import (
	"regexp"
	"strconv"
	"strings"

	"github.com/jr-k/mailgress/internal/domain"
)

type RuleEvaluator struct{}

func NewRuleEvaluator() *RuleEvaluator {
	return &RuleEvaluator{}
}

func (e *RuleEvaluator) Evaluate(rules []domain.WebhookRule, email *domain.Email) bool {
	if len(rules) == 0 {
		return true
	}

	groups := make(map[int][]domain.WebhookRule)
	for _, rule := range rules {
		groups[rule.RuleGroup] = append(groups[rule.RuleGroup], rule)
	}

	for _, groupRules := range groups {
		if e.evaluateGroup(groupRules, email) {
			return true
		}
	}

	return false
}

func (e *RuleEvaluator) evaluateGroup(rules []domain.WebhookRule, email *domain.Email) bool {
	for _, rule := range rules {
		if !e.evaluateRule(rule, email) {
			return false
		}
	}
	return true
}

func (e *RuleEvaluator) evaluateRule(rule domain.WebhookRule, email *domain.Email) bool {
	var fieldValue string

	switch rule.Field {
	case domain.RuleFieldSubject:
		fieldValue = email.Subject
	case domain.RuleFieldFrom:
		fieldValue = email.FromAddress
	case domain.RuleFieldTo:
		fieldValue = email.ToAddress
	case domain.RuleFieldBody:
		fieldValue = email.TextBody
		if fieldValue == "" {
			fieldValue = email.HTMLBody
		}
	case domain.RuleFieldHeader:
		if email.Headers != nil {
			fieldValue = email.Headers[rule.HeaderName]
		}
	case domain.RuleFieldHasAttachments:
		hasAttachments := email.HasAttachments || len(email.Attachments) > 0
		expected := strings.ToLower(rule.Value) == "true"
		return hasAttachments == expected
	case domain.RuleFieldSize:
		size := email.RawSize
		threshold, err := strconv.ParseInt(rule.Value, 10, 64)
		if err != nil {
			return false
		}
		switch rule.Operator {
		case domain.RuleOperatorGt:
			return size > threshold
		case domain.RuleOperatorLt:
			return size < threshold
		default:
			return false
		}
	default:
		return false
	}

	switch rule.Operator {
	case domain.RuleOperatorContains:
		return strings.Contains(strings.ToLower(fieldValue), strings.ToLower(rule.Value))
	case domain.RuleOperatorNotContains:
		return !strings.Contains(strings.ToLower(fieldValue), strings.ToLower(rule.Value))
	case domain.RuleOperatorEquals:
		return strings.EqualFold(fieldValue, rule.Value)
	case domain.RuleOperatorRegex:
		matched, err := regexp.MatchString(rule.Value, fieldValue)
		if err != nil {
			return false
		}
		return matched
	default:
		return false
	}
}
