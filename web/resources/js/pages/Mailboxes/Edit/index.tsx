import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import MailboxLayout from '@/layouts/MailboxLayout';
import { Card } from '@/components/Card';
import { Alert } from '@/components/Alert';
import { Button, LinkButton } from '@/components/Button';
import { FormGroup, Input, Select, Checkbox, Label } from '@/components/Input';
import { TagSelector } from '@/components/TagSelector';
import { Mailbox, User, Domain, Tag, PageProps } from '@/types';
import * as S from './styled';

interface Props extends PageProps {
  mailbox: Mailbox;
  users: User[];
  domains: Domain[];
  allTags: Tag[];
  mailboxTags: Tag[];
  error?: string;
}

export default function MailboxEdit({ mailbox, users, domains, allTags, mailboxTags, error }: Props) {
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(mailboxTags.map((t) => t.id));
  const [tagsSaving, setTagsSaving] = useState(false);

  const { data, setData, put, processing } = useForm({
    slug: mailbox.slug,
    description: mailbox.description || '',
    owner_id: mailbox.owner_id?.toString() || '',
    domain_id: mailbox.domain_id?.toString() || '',
    is_active: mailbox.is_active,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Save tags first
    setTagsSaving(true);
    try {
      await fetch(`/mailboxes/${mailbox.id}/tags`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tag_ids: selectedTagIds }),
      });
    } finally {
      setTagsSaving(false);
    }

    put(`/mailboxes/${mailbox.id}`);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this mailbox? All emails will be lost.')) {
      router.delete(`/mailboxes/${mailbox.id}`);
    }
  };

  const selectedDomain = domains.find((d) => String(d.id) === data.domain_id);
  const selectedTags = allTags.filter((t) => selectedTagIds.includes(t.id));

  return (
    <MailboxLayout mailbox={mailbox} breadcrumbs={[{ label: 'Settings' }]}>
      <S.Container>
        <S.Header>
          <S.Title>Settings</S.Title>
        </S.Header>

        {error && <Alert variant="error">{error}</Alert>}

        <Card>
          <S.FormCard>
            <S.Form onSubmit={handleSubmit}>
              <FormGroup label="Domain" htmlFor="domain_id">
                <Select
                  id="domain_id"
                  value={data.domain_id}
                  onChange={(e) => setData('domain_id', e.target.value)}
                  required
                >
                  {domains.map((domain) => (
                    <option key={domain.id} value={domain.id}>
                      {domain.name}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <FormGroup label="Slug" htmlFor="slug">
                <S.InputGroup>
                  <S.InputNoRightRadius>
                    <Input
                      id="slug"
                      type="text"
                      value={data.slug}
                      onChange={(e) =>
                        setData('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
                      }
                      required
                    />
                  </S.InputNoRightRadius>
                  <S.InputAddon>@{selectedDomain?.name || 'domain.com'}</S.InputAddon>
                </S.InputGroup>
              </FormGroup>

              <FormGroup label="Description (optional)" htmlFor="description">
                <Input
                  id="description"
                  type="text"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                />
              </FormGroup>

              <FormGroup label="Owner" htmlFor="owner_id">
                <Select
                  id="owner_id"
                  value={data.owner_id}
                  onChange={(e) => setData('owner_id', e.target.value)}
                >
                  <option value="">No owner</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.email} {user.is_admin && '(Admin)'}
                    </option>
                  ))}
                </Select>
              </FormGroup>

              <div>
                <Label>Tags</Label>
                <S.TagsWrapper>
                  <TagSelector
                    allTags={allTags}
                    selectedTags={selectedTags}
                    onChange={setSelectedTagIds}
                    disabled={processing || tagsSaving}
                  />
                </S.TagsWrapper>
              </div>

              <div>
                <S.CheckboxWrapper>
                  <Checkbox
                    checked={data.is_active}
                    onChange={(e) => setData('is_active', e.target.checked)}
                  />
                  <S.CheckboxText>Active</S.CheckboxText>
                </S.CheckboxWrapper>
                <S.HelperText>Inactive mailboxes will reject incoming emails.</S.HelperText>
              </div>

              <S.FormActions>
                <Button type="button" variant="danger" onClick={handleDelete}>
                  Delete Mailbox
                </Button>
                <S.FormActionsRight>
                  <LinkButton href={`/mailboxes/${mailbox.id}`} variant="secondary">
                    Cancel
                  </LinkButton>
                  <Button type="submit" disabled={processing || tagsSaving}>
                    {processing || tagsSaving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </S.FormActionsRight>
              </S.FormActions>
            </S.Form>
          </S.FormCard>
        </Card>
      </S.Container>
    </MailboxLayout>
  );
}
