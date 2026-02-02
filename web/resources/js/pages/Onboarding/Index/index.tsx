import { useForm } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import { Alert } from '@/components/Alert';
import { Button } from '@/components/Button';
import { FormGroup, Input } from '@/components/Input';
import * as S from './styled';

interface Props {
  error?: string;
  admin_email?: string;
  domain_name?: string;
}

export default function Onboarding({ error, admin_email, domain_name }: Props) {
  const { data, setData, post, processing } = useForm({
    admin_email: admin_email || 'test@sa.test',
    admin_password: 'admin',
    domain_name: domain_name || 'sa.test',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/onboarding');
  };

  return (
    <GuestLayout>
      <S.Header>
        <S.Title>Welcome to Mailgress</S.Title>
        <S.Subtitle>Let's set up your email server</S.Subtitle>
      </S.Header>

      {error && <Alert variant="error">{error}</Alert>}

      <S.Form onSubmit={handleSubmit}>
        <S.Section>
          <S.SectionTitle>Admin Account</S.SectionTitle>
          <S.Fields>
            <FormGroup label="Admin Email" htmlFor="admin_email">
              <Input
                id="admin_email"
                name="admin_email"
                type="email"
                autoComplete="email"
                required
                value={data.admin_email}
                onChange={(e) => setData('admin_email', e.target.value)}
              />
            </FormGroup>

            <FormGroup label="Admin Password" htmlFor="admin_password">
              <Input
                id="admin_password"
                name="admin_password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={data.admin_password}
                onChange={(e) => setData('admin_password', e.target.value)}
              />
            </FormGroup>
          </S.Fields>
        </S.Section>

        <S.Section>
          <S.SectionTitle>First Domain</S.SectionTitle>
          <S.Fields>
            <FormGroup
              label="Domain Name"
              htmlFor="domain_name"
              helper="The domain you want to receive emails for (e.g., example.com)"
            >
              <Input
                id="domain_name"
                name="domain_name"
                type="text"
                placeholder="example.com"
                required
                value={data.domain_name}
                onChange={(e) => setData('domain_name', e.target.value)}
              />
            </FormGroup>
          </S.Fields>
        </S.Section>

        <Button type="submit" disabled={processing} fullWidth>
          {processing ? 'Setting up...' : 'Complete Setup'}
        </Button>
      </S.Form>
    </GuestLayout>
  );
}
