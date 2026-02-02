import { useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Card } from '@/components/Card';
import { Alert } from '@/components/Alert';
import { Button, LinkButton } from '@/components/Button';
import { FormGroup, Input, Select } from '@/components/Input';
import { User, Domain, PageProps } from '@/types';
import * as S from './styled';

interface Props extends PageProps {
  users: User[];
  domains: Domain[];
  error?: string;
  slug?: string;
  description?: string;
}

export default function MailboxCreate({ users, domains, error, slug, description }: Props) {
  const { data, setData, post, processing } = useForm({
    slug: slug || '',
    description: description || '',
    owner_id: '',
    domain_id: domains.length > 0 ? String(domains[0].id) : '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/mailboxes');
  };

  const selectedDomain = domains.find((d) => String(d.id) === data.domain_id);

  return (
    <AppLayout>
      <S.Container>
        <S.Header>
          <S.BackLink as={Link} href="/mailboxes">
            &larr; Back to Mailboxes
          </S.BackLink>
          <S.Title>Create Mailbox</S.Title>
        </S.Header>

        {error && <Alert variant="error">{error}</Alert>}

        {domains.length === 0 && (
          <Alert variant="warning">
            No domains configured. <Link href="/domains/create">Add a domain</Link> first.
          </Alert>
        )}

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
                      placeholder="my-mailbox"
                      required
                    />
                  </S.InputNoRightRadius>
                  <S.InputAddon>@{selectedDomain?.name || 'domain.com'}</S.InputAddon>
                </S.InputGroup>
                <S.HelperText>Only lowercase letters, numbers, and hyphens allowed.</S.HelperText>
              </FormGroup>

              <FormGroup label="Description (optional)" htmlFor="description">
                <Input
                  id="description"
                  type="text"
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  placeholder="A short description"
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

              <S.FormActions>
                <LinkButton href="/mailboxes" variant="secondary">
                  Cancel
                </LinkButton>
                <Button type="submit" disabled={processing || domains.length === 0}>
                  {processing ? 'Creating...' : 'Create Mailbox'}
                </Button>
              </S.FormActions>
            </S.Form>
          </S.FormCard>
        </Card>
      </S.Container>
    </AppLayout>
  );
}
