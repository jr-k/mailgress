import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import MailboxLayout from '@/layouts/MailboxLayout';
import { Card } from '@/components/Card';
import { Alert } from '@/components/Alert';
import { Button, LinkButton } from '@/components/Button';
import { FormGroup, Input, Checkbox, Select } from '@/components/Input';
import { Mailbox, PageProps, WebhookRule } from '@/types';
import * as S from './styled';

interface Props extends PageProps {
  mailbox: Mailbox;
  allMailboxes: Mailbox[];
  error?: string;
}

export default function WebhookCreate({ mailbox, allMailboxes, error }: Props) {
  const [rules, setRules] = useState<Partial<WebhookRule>[]>([]);
  const [customHeaders, setCustomHeaders] = useState<{ key: string; value: string }[]>([]);
  const [payloadType, setPayloadType] = useState<'default' | 'json' | 'key_value'>('default');
  const [jsonBody, setJsonBody] = useState('{\n  "email": "{{email.address}}",\n  "subject": "{{email.subject}}"\n}');
  const [keyValueBody, setKeyValueBody] = useState<{ key: string; value: string }[]>([{ key: '', value: '' }]);

  const { data, setData, post, processing, transform } = useForm({
    name: '',
    url: '',
    method: 'POST',
    hmac_secret: '',
    timeout_sec: 30,
    max_retries: 3,
    include_body: true,
    include_attachments: false,
    payload_type: 'default', // Added field, though backend might ignore initially
    custom_payload: '',      // Added field
  });

  // Transform data before sending
  transform((formData) => ({
    ...formData,
    payload_type: payloadType,
    custom_payload: payloadType === 'json' ? jsonBody : JSON.stringify(keyValueBody),
    headers: customHeaders.reduce((acc, h) => {
      if (h.key) acc[h.key] = h.value;
      return acc;
    }, {} as Record<string, string>),
    rules: rules.map((r) => ({
      rule_group: r.rule_group || 0,
      field: r.field || 'subject',
      operator: r.operator || 'contains',
      value: r.value || '',
      header_name: r.header_name || '',
    })),
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`/mailboxes/${mailbox.id}/webhooks`);
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

  const handleAddKeyValue = () => setKeyValueBody([...keyValueBody, { key: '', value: '' }]);
  const handleRemoveKeyValue = (index: number) => setKeyValueBody(keyValueBody.filter((_, i) => i !== index));
  const handleUpdateKeyValue = (index: number, field: 'key' | 'value', val: string) => {
    setKeyValueBody(keyValueBody.map((item, i) => (i === index ? { ...item, [field]: val } : item)));
  };

  const addHeader = () => {
    setCustomHeaders([...customHeaders, { key: '', value: '' }]);
  };

  const removeHeader = (index: number) => {
    setCustomHeaders(customHeaders.filter((_, i) => i !== index));
  };

  const updateHeader = (index: number, updates: Partial<{ key: string; value: string }>) => {
    setCustomHeaders(customHeaders.map((h, i) => (i === index ? { ...h, ...updates } : h)));
  };

  return (
    <MailboxLayout mailbox={mailbox} allMailboxes={allMailboxes}>
      <S.Container>
        <S.Header>
          <S.Title>Create Webhook</S.Title>
        </S.Header>

        {error && <Alert variant="error">{error}</Alert>}

        <S.Form onSubmit={handleSubmit}>
          <S.CardWrapper>
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

                  <S.MethodUrlRow>
                    <FormGroup label="Method" htmlFor="method">
                      <Select
                        id="method"
                        value={data.method}
                        onChange={(e) => setData('method', e.target.value)}
                      >
                        <option value="POST">POST</option>
                        <option value="GET">GET</option>
                      </Select>
                    </FormGroup>
                    <S.UrlField>
                      <FormGroup label="URL" htmlFor="url">
                        <Input
                          id="url"
                          type="url"
                          value={data.url}
                          onChange={(e) => setData('url', e.target.value)}
                          placeholder="https://example.com/webhook"
                          required
                        />
                      </FormGroup>
                    </S.UrlField>
                  </S.MethodUrlRow>

                  <FormGroup label="HMAC Secret (optional)" htmlFor="hmac_secret">
                    <Input
                      id="hmac_secret"
                      type="text"
                      value={data.hmac_secret}
                      onChange={(e) => setData('hmac_secret', e.target.value)}
                      placeholder="Leave empty to disable signature"
                    />
                    <S.HelperText>
                      Used to sign the payload. Header: X-Mailgress-Signature
                    </S.HelperText>
                  </FormGroup>

                  <S.CheckboxList>
                    {payloadType === 'default' && (
                      <>
                        <S.CheckboxWrapper>
                          <Checkbox
                            checked={data.include_body}
                            onChange={(e) => setData('include_body', e.target.checked)}
                          />
                          <S.CheckboxText>Include email body in payload</S.CheckboxText>
                        </S.CheckboxWrapper>
                        <S.CheckboxWrapper>
                          <Checkbox
                            checked={data.include_attachments}
                            onChange={(e) => setData('include_attachments', e.target.checked)}
                          />
                          <S.CheckboxText>Include attachment metadata</S.CheckboxText>
                        </S.CheckboxWrapper>
                      </>
                    )}
                  </S.CheckboxList>

                  {data.method === 'POST' && (
                    <S.TabsContainer>
                      <FormGroup label="Metadata" htmlFor="body_type">
                        <S.TabList>
                          <S.TabButton
                            type="button"
                            $active={payloadType === 'default'}
                            onClick={() => setPayloadType('default')}
                          >
                            Default (Email)
                          </S.TabButton>
                          <S.TabButton
                            type="button"
                            $active={payloadType === 'key_value'}
                            onClick={() => setPayloadType('key_value')}
                          >
                            Key-Value
                          </S.TabButton>
                          <S.TabButton
                            type="button"
                            $active={payloadType === 'json'}
                            onClick={() => setPayloadType('json')}
                          >
                            Raw JSON
                          </S.TabButton>
                        </S.TabList>
                        
                        {payloadType === 'key_value' && (
                          <div>
                            {keyValueBody.map((item, index) => (
                              <S.KeyValueRow key={index}>
                                <S.KeyInput 
                                  placeholder="Key" 
                                  value={item.key} 
                                  onChange={(e) => handleUpdateKeyValue(index, 'key', e.target.value)}
                                />
                                <S.ValueInput 
                                  placeholder="Value" 
                                  value={item.value} 
                                  onChange={(e) => handleUpdateKeyValue(index, 'value', e.target.value)}
                                />
                                <S.RemoveButton type="button" onClick={() => handleRemoveKeyValue(index)}>&times;</S.RemoveButton>
                              </S.KeyValueRow>
                            ))}
                            <Button type="button" size="sm" variant="secondary" onClick={handleAddKeyValue}>+ Add Field</Button>
                          </div>
                        )}

                        {payloadType === 'json' && (
                          <S.CodeEditor
                            value={jsonBody}
                            onChange={(e) => setJsonBody(e.target.value)}
                            spellCheck={false}
                          />
                        )}
                      </FormGroup>
                    </S.TabsContainer>
                  )}
                </S.Fields>
              </S.Section>
            </Card>
          </S.CardWrapper>

          <S.CardWrapper>
            <Card>
              <S.Section>
                <S.SectionTitle>Advanced</S.SectionTitle>
                <S.Fields>
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
                </S.Fields>
              </S.Section>
            </Card>
          </S.CardWrapper>

          <S.CardWrapper>
            <Card>
              <S.Section>
                <S.RulesHeader>
                  <S.SectionTitle style={{ marginBottom: 0 }}>Custom Headers</S.SectionTitle>
                  <Button type="button" variant="secondary" onClick={addHeader}>
                    Add Header
                  </Button>
                </S.RulesHeader>

                {customHeaders.length === 0 ? (
                  <S.EmptyRules>No custom headers</S.EmptyRules>
                ) : (
                  <S.RulesList>
                    {customHeaders.map((header, index) => (
                      <S.RuleItem key={index}>
                        <S.RuleInput
                          type="text"
                          value={header.key}
                          onChange={(e) => updateHeader(index, { key: e.target.value })}
                          placeholder="Header name"
                          style={{ flex: 1 }}
                        />
                        <S.RuleInput
                          type="text"
                          value={header.value}
                          onChange={(e) => updateHeader(index, { value: e.target.value })}
                          placeholder="Header value"
                          style={{ flex: 2 }}
                        />
                        <S.RemoveButton type="button" onClick={() => removeHeader(index)}>
                          &times;
                        </S.RemoveButton>
                      </S.RuleItem>
                    ))}
                  </S.RulesList>
                )}
              </S.Section>
            </Card>
          </S.CardWrapper>

          <S.CardWrapper>
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
                          placeholder={rule.field === 'has_attachments' ? 'true or false' : 'Value'}
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
          </S.CardWrapper>

          <S.FormActions>
            <LinkButton href={`/mailboxes/${mailbox.id}/webhooks`} variant="secondary">
              Cancel
            </LinkButton>
            <Button type="submit" disabled={processing}>
              {processing ? 'Creating...' : 'Create Webhook'}
            </Button>
          </S.FormActions>
        </S.Form>
      </S.Container>
    </MailboxLayout>
  );
}
