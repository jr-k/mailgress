import { useForm } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import { Alert } from '@/components/Alert';
import { Button } from '@/components/Button';
import { FormGroup, Input } from '@/components/Input';
import * as S from './styled';

interface Props {
  error?: string;
}

export default function TwoFactor({ error }: Props) {
  const { data, setData, post, processing } = useForm({
    code: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/login/2fa');
  };

  return (
    <GuestLayout>
      <S.Header>
        <S.Subtitle>Two-Factor Authentication</S.Subtitle>
        <S.Description>
          Enter the 6-digit code from your authenticator app
        </S.Description>
      </S.Header>

      {error && <Alert variant="error">{error}</Alert>}

      <S.Form onSubmit={handleSubmit}>
        <S.Fields>
          <FormGroup label="Verification Code" htmlFor="code">
            <Input
              id="code"
              name="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              maxLength={8}
              required
              value={data.code}
              onChange={(e) => setData('code', e.target.value.replace(/[^0-9A-Za-z]/g, ''))}
            />
          </FormGroup>
        </S.Fields>

        <Button type="submit" disabled={processing || data.code.length < 6} fullWidth>
          {processing ? 'Verifying...' : 'Verify'}
        </Button>

        <S.BackupHint>
          You can also use a backup code
        </S.BackupHint>
      </S.Form>
    </GuestLayout>
  );
}
