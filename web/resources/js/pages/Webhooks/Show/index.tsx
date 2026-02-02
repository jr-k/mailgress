import { useState } from 'react';
import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button, LinkButton } from '@/components/Button';
import { Mailbox, Webhook, PageProps } from '@/types';
import * as S from './styled';

interface Props extends PageProps {
  mailbox: Mailbox;
  webhook: Webhook;
}

export default function WebhookShow({ mailbox, webhook }: Props) {
  const [testResult, setTestResult] = useState<{
    loading: boolean;
    status_code?: number;
    response?: string;
    error?: string;
  }>({ loading: false });

  const handleTest = async () => {
    setTestResult({ loading: true });
    try {
      const response = await fetch(`/mailboxes/${mailbox.id}/webhooks/${webhook.id}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      setTestResult({ loading: false, ...data });
    } catch (error) {
      setTestResult({ loading: false, error: 'Failed to send test' });
    }
  };

  return (
    <AppLayout>
      <S.Header>
        <S.BackLink as={Link} href={`/mailboxes/${mailbox.id}/webhooks`}>
          &larr; Back to Webhooks
        </S.BackLink>
        <S.HeaderRow>
          <S.TitleSection>
            <S.Title>{webhook.name}</S.Title>
            <Badge variant={webhook.is_active ? 'success' : 'gray'}>
              {webhook.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </S.TitleSection>
          <S.Actions>
            <Button variant="secondary" onClick={handleTest} disabled={testResult.loading}>
              {testResult.loading ? 'Testing...' : 'Test Webhook'}
            </Button>
            <LinkButton
              href={`/mailboxes/${mailbox.id}/webhooks/${webhook.id}/deliveries`}
              variant="secondary"
            >
              View History
            </LinkButton>
            <LinkButton href={`/mailboxes/${mailbox.id}/webhooks/${webhook.id}/edit`}>
              Edit
            </LinkButton>
          </S.Actions>
        </S.HeaderRow>
      </S.Header>

      {testResult.status_code !== undefined && (
        <S.TestResult $success={!testResult.error && testResult.status_code < 400}>
          <S.TestResultTitle>
            Test Result: HTTP {testResult.status_code}
            {testResult.error && ` - ${testResult.error}`}
          </S.TestResultTitle>
          {testResult.response && <S.TestResultBody>{testResult.response}</S.TestResultBody>}
        </S.TestResult>
      )}

      <S.Grid>
        <Card>
          <S.CardContent>
            <S.CardTitle>Configuration</S.CardTitle>
            <S.DefinitionList>
              <div>
                <S.DefinitionTerm>URL</S.DefinitionTerm>
                <S.DefinitionValue>{webhook.url}</S.DefinitionValue>
              </div>
              <div>
                <S.DefinitionTerm>Timeout</S.DefinitionTerm>
                <S.DefinitionValue>{webhook.timeout_sec} seconds</S.DefinitionValue>
              </div>
              <div>
                <S.DefinitionTerm>Max Retries</S.DefinitionTerm>
                <S.DefinitionValue>{webhook.max_retries}</S.DefinitionValue>
              </div>
              <div>
                <S.DefinitionTerm>HMAC Secret</S.DefinitionTerm>
                <S.DefinitionValue>
                  {webhook.hmac_secret ? '(configured)' : '(not set)'}
                </S.DefinitionValue>
              </div>
              <div>
                <S.DefinitionTerm>Include Body</S.DefinitionTerm>
                <S.DefinitionValue>{webhook.include_body ? 'Yes' : 'No'}</S.DefinitionValue>
              </div>
              <div>
                <S.DefinitionTerm>Include Attachments</S.DefinitionTerm>
                <S.DefinitionValue>
                  {webhook.include_attachments ? 'Yes' : 'No'}
                </S.DefinitionValue>
              </div>
            </S.DefinitionList>
          </S.CardContent>
        </Card>

        <Card>
          <S.CardContent>
            <S.CardTitle>Delivery Stats</S.CardTitle>
            {webhook.delivery_stats ? (
              <S.StatsGrid>
                <S.StatCard>
                  <S.StatValue>{webhook.delivery_stats.total}</S.StatValue>
                  <S.StatLabel>Total</S.StatLabel>
                </S.StatCard>
                <S.StatCard $variant="success">
                  <S.StatValue $variant="success">
                    {webhook.delivery_stats.success_count}
                  </S.StatValue>
                  <S.StatLabel>Success</S.StatLabel>
                </S.StatCard>
                <S.StatCard $variant="error">
                  <S.StatValue $variant="error">{webhook.delivery_stats.failed_count}</S.StatValue>
                  <S.StatLabel>Failed</S.StatLabel>
                </S.StatCard>
                <S.StatCard $variant="warning">
                  <S.StatValue $variant="warning">
                    {webhook.delivery_stats.pending_count}
                  </S.StatValue>
                  <S.StatLabel>Pending</S.StatLabel>
                </S.StatCard>
              </S.StatsGrid>
            ) : (
              <S.EmptyText>No deliveries yet</S.EmptyText>
            )}
          </S.CardContent>
        </Card>
      </S.Grid>

      <S.RulesCard>
        <Card>
          <S.CardContent>
            <S.CardTitle>Rules</S.CardTitle>
            {webhook.rules && webhook.rules.length > 0 ? (
              <S.RulesList>
                {webhook.rules.map((rule, index) => (
                  <S.RuleItem key={index}>
                    <S.RuleField>{rule.field}</S.RuleField>
                    <S.RuleOperator>{rule.operator}</S.RuleOperator>
                    <S.RuleValue>"{rule.value}"</S.RuleValue>
                  </S.RuleItem>
                ))}
              </S.RulesList>
            ) : (
              <S.EmptyText>No rules - triggers for all emails</S.EmptyText>
            )}
          </S.CardContent>
        </Card>
      </S.RulesCard>
    </AppLayout>
  );
}
