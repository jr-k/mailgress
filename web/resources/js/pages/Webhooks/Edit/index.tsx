import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import MailboxLayout from '@/layouts/MailboxLayout';
import { Card } from '@/components/Card';
import { Alert } from '@/components/Alert';
import { Button, LinkButton } from '@/components/Button';
import { FormGroup, Input, Checkbox } from '@/components/Input';
import { Mailbox, Webhook, PageProps, WebhookRule } from '@/types';
import * as S from './styled';

interface Props extends PageProps {
  mailbox: Mailbox;
  allMailboxes: Mailbox[];
  webhook: Webhook;
  error?: string;
}

export default function WebhookEdit({ mailbox, allMailboxes, webhook, error }: Props) {
  const [rules, setRules] = useState<Partial<WebhookRule>[]>(webhook.rules || []);

  const { data, setData, put, processing } = useForm({
    name: webhook.name,
    url: webhook.url,
    hmac_secret: webhook.hmac_secret || '',
    timeout_sec: webhook.timeout_sec,
    max_retries: webhook.max_retries,
    include_body: webhook.include_body,
    include_attachments: webhook.include_attachments,
    is_active: webhook.is_active,
    headers: JSON.stringify(webhook.headers || {}),
    rules: JSON.stringify(webhook.rules || []),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setData('rules', JSON.stringify(rules));
    put(`/mailboxes/${mailbox.id}/webhooks/${webhook.id}`);
  };

  const addRule = () => {
    setRules([...rules, { rule_group: 0, field: 'subject', operator: 'contains', value: '' }]);
  };

  const removeRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const updateRule = (index: number, updates: Partial<WebhookRule>) => {
    setRules(rules.map((rule, i) => (i === index ? { ...rule, ...updates } : rule)));
  };

  return (
    <MailboxLayout mailbox={mailbox} allMailboxes={allMailboxes}>
      <S.Container>
        <S.Header>
          <S.Title>Edit Webhook</S.Title>
        </S.Header>

        {error && <Alert variant="error">{error}</Alert>}

        <S.Form onSubmit={handleSubmit}>
          <Card>
            <S.Section>
              <S.SectionTitle>Basic Settings</S.SectionTitle>
              <S.Fields>
                <FormGroup label="Name" htmlFor="name">
                  <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    required
                  />
                </FormGroup>

                <FormGroup label="URL" htmlFor="url">
                  <Input
                    id="url"
                    type="url"
                    value={data.url}
                    onChange={(e) => setData('url', e.target.value)}
                    required
                  />
                </FormGroup>

                <FormGroup label="HMAC Secret" htmlFor="hmac_secret">
                  <Input
                    id="hmac_secret"
                    type="text"
                    value={data.hmac_secret}
                    onChange={(e) => setData('hmac_secret', e.target.value)}
                  />
                </FormGroup>

                <S.FieldRow>
                  <FormGroup label="Timeout (seconds)" htmlFor="timeout_sec">
                    <Input
                      id="timeout_sec"
                      type="number"
                      value={data.timeout_sec}
                      onChange={(e) => setData('timeout_sec', parseInt(e.target.value))}
                      min={1}
                      max={60}
                    />
                  </FormGroup>
                  <FormGroup label="Max Retries" htmlFor="max_retries">
                    <Input
                      id="max_retries"
                      type="number"
                      value={data.max_retries}
                      onChange={(e) => setData('max_retries', parseInt(e.target.value))}
                      min={0}
                      max={10}
                    />
                  </FormGroup>
                </S.FieldRow>

                <S.CheckboxList>
                  <S.CheckboxWrapper>
                    <Checkbox
                      checked={data.include_body}
                      onChange={(e) => setData('include_body', e.target.checked)}
                    />
                    <S.CheckboxText>Include email body</S.CheckboxText>
                  </S.CheckboxWrapper>
                  <S.CheckboxWrapper>
                    <Checkbox
                      checked={data.include_attachments}
                      onChange={(e) => setData('include_attachments', e.target.checked)}
                    />
                    <S.CheckboxText>Include attachments metadata</S.CheckboxText>
                  </S.CheckboxWrapper>
                  <S.CheckboxWrapper>
                    <Checkbox
                      checked={data.is_active}
                      onChange={(e) => setData('is_active', e.target.checked)}
                    />
                    <S.CheckboxText>Active</S.CheckboxText>
                  </S.CheckboxWrapper>
                </S.CheckboxList>
              </S.Fields>
            </S.Section>
          </Card>

          <Card>
            <S.Section>
              <S.RulesHeader>
                <S.SectionTitle style={{ marginBottom: 0 }}>Rules</S.SectionTitle>
                <Button type="button" variant="secondary" onClick={addRule}>
                  Add Rule
                </Button>
              </S.RulesHeader>

              {rules.length === 0 ? (
                <S.EmptyRules>No rules - webhook will trigger for all emails</S.EmptyRules>
              ) : (
                <S.RulesList>
                  {rules.map((rule, index) => (
                    <S.RuleItem key={index}>
                      <S.RuleSelect
                        value={rule.field}
                        onChange={(e) => updateRule(index, { field: e.target.value })}
                      >
                        <option value="subject">Subject</option>
                        <option value="from">From</option>
                        <option value="to">To</option>
                        <option value="has_attachments">Has attachments</option>
                        <option value="size">Size</option>
                      </S.RuleSelect>

                      <S.RuleSelect
                        value={rule.operator}
                        onChange={(e) => updateRule(index, { operator: e.target.value })}
                      >
                        <option value="contains">contains</option>
                        <option value="not_contains">not contains</option>
                        <option value="equals">equals</option>
                        {rule.field === 'size' && (
                          <>
                            <option value="gt">greater than</option>
                            <option value="lt">less than</option>
                          </>
                        )}
                      </S.RuleSelect>

                      <S.RuleInput
                        type="text"
                        value={rule.value}
                        onChange={(e) => updateRule(index, { value: e.target.value })}
                      />

                      <S.RemoveButton type="button" onClick={() => removeRule(index)}>
                        &times;
                      </S.RemoveButton>
                    </S.RuleItem>
                  ))}
                </S.RulesList>
              )}
            </S.Section>
          </Card>

          <S.FormActions>
            <LinkButton
              href={`/mailboxes/${mailbox.id}/webhooks/${webhook.id}`}
              variant="secondary"
            >
              Cancel
            </LinkButton>
            <Button type="submit" disabled={processing}>
              {processing ? 'Saving...' : 'Save Changes'}
            </Button>
          </S.FormActions>
        </S.Form>
      </S.Container>
    </MailboxLayout>
  );
}
