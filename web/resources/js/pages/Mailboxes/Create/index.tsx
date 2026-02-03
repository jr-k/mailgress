import { useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Card } from '@/components/Card';
import { Alert } from '@/components/Alert';
import { Button, LinkButton } from '@/components/Button';
import { FormGroup, Input, Select } from '@/components/Input';
import { useToast } from '@/contexts/ToastContext';
import { User, Domain, PageProps } from '@/types';
import * as S from './styled';

const WORDS = [
  'apple', 'banana', 'cherry', 'dragon', 'eagle', 'forest', 'garden', 'harbor',
  'island', 'jungle', 'kitten', 'lemon', 'mango', 'nebula', 'ocean', 'panda',
  'quartz', 'river', 'sunset', 'tiger', 'umbrella', 'violet', 'willow', 'xenon',
  'yellow', 'zebra', 'amber', 'bronze', 'coral', 'dusk', 'ember', 'frost',
  'golden', 'haze', 'ivory', 'jade', 'karma', 'lunar', 'maple', 'nova',
  'olive', 'pearl', 'quiet', 'ruby', 'silver', 'thunder', 'urban', 'velvet',
  'winter', 'crystal', 'breeze', 'spark', 'flame', 'storm', 'cloud', 'shadow',
  'light', 'meadow', 'stone', 'wave', 'wind', 'rain', 'snow', 'star',
];

const generateRandomSlug = () => {
  const word1 = WORDS[Math.floor(Math.random() * WORDS.length)];
  const word2 = WORDS[Math.floor(Math.random() * WORDS.length)];
  return `${word1}-${word2}`;
};

interface Props extends PageProps {
  users: User[];
  domains: Domain[];
  error?: string;
  slug?: string;
  description?: string;
  presetDomainId?: string;
}

export default function MailboxCreate({ users, domains, error, slug, description, presetDomainId }: Props) {
  const getInitialDomainId = () => {
    if (presetDomainId && domains.some((d) => String(d.id) === presetDomainId)) {
      return presetDomainId;
    }
    return domains.length > 0 ? String(domains[0].id) : '';
  };

  const { showToast } = useToast();
  const { data, setData, post, processing } = useForm({
    slug: slug || '',
    description: description || '',
    owner_id: '',
    domain_id: getInitialDomainId(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/mailboxes', {
      onSuccess: () => showToast('Mailbox créée avec succès'),
    });
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
                  <S.GenerateButton type="button" onClick={() => setData('slug', generateRandomSlug())} title="Generate random slug">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </S.GenerateButton>
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
