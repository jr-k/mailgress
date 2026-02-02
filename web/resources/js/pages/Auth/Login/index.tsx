import { useForm } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import { Alert } from '@/components/Alert';
import { Button } from '@/components/Button';
import { FormGroup, Input } from '@/components/Input';
import * as S from './styled';

interface Props {
  error?: string;
  email?: string;
}

export default function Login({ error, email }: Props) {
  const { data, setData, post, processing } = useForm({
    email: email || '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/login');
  };

  return (
    <GuestLayout>
      <S.Header>
        <S.Subtitle>Sign in to your account</S.Subtitle>
      </S.Header>

      {error && <Alert variant="error">{error}</Alert>}

      <S.Form onSubmit={handleSubmit}>
        <S.Fields>
          <FormGroup label="Email address" htmlFor="email">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
            />
          </FormGroup>

          <FormGroup label="Password" htmlFor="password">
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
            />
          </FormGroup>
        </S.Fields>

        <Button type="submit" disabled={processing} fullWidth>
          {processing ? 'Signing in...' : 'Sign in'}
        </Button>
      </S.Form>
    </GuestLayout>
  );
}
