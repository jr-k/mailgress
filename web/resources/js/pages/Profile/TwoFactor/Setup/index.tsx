import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Alert } from '@/components/Alert';
import { Button, LinkButton } from '@/components/Button';
import { FormGroup, Input } from '@/components/Input';
import { PageProps } from '@/types';
import * as S from './styled';

interface Props extends PageProps {
  secret: string;
  qrUrl: string;
  error?: string;
}

export default function TwoFactorSetup({ secret, qrUrl, error }: Props) {
  const [copied, setCopied] = useState(false);
  const { data, setData, post, processing } = useForm({
    secret: secret,
    code: '',
  });

  const handleCopy = async () => {
    await navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/profile/2fa/enable');
  };

  return (
    <AppLayout>
      <S.Container>
        <S.Header>
          <S.Title>Set Up Two-Factor Authentication</S.Title>
          <S.Subtitle>
            Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.)
          </S.Subtitle>
        </S.Header>

        {error && <Alert variant="error">{error}</Alert>}

        <S.Card>
          <S.QRContainer>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUrl)}`}
              alt="2FA QR Code"
              width={200}
              height={200}
            />
          </S.QRContainer>

          <S.ManualEntry>
            <S.ManualLabel>Or enter this code manually:</S.ManualLabel>
            <S.SecretCodeWrapper>
              <S.SecretCode>{secret}</S.SecretCode>
              <S.CopyButton type="button" onClick={handleCopy}>
                {copied ? 'Copied!' : 'Copy'}
              </S.CopyButton>
            </S.SecretCodeWrapper>
          </S.ManualEntry>

          <S.Form onSubmit={handleSubmit}>
            <FormGroup label="Verify Setup" htmlFor="code">
              <Input
                id="code"
                type="text"
                inputMode="numeric"
                placeholder="Enter 6-digit code"
                maxLength={6}
                value={data.code}
                onChange={(e) => setData('code', e.target.value.replace(/\D/g, ''))}
              />
              <S.HelpText>
                Enter the code from your authenticator app to verify setup
              </S.HelpText>
            </FormGroup>

            <S.FormActions>
              <LinkButton variant="secondary" href="/profile">
                Cancel
              </LinkButton>
              <Button type="submit" disabled={processing || data.code.length !== 6}>
                {processing ? 'Verifying...' : 'Enable 2FA'}
              </Button>
            </S.FormActions>
          </S.Form>
        </S.Card>
      </S.Container>
    </AppLayout>
  );
}
