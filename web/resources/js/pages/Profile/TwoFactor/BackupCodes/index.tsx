import AppLayout from '@/layouts/AppLayout';
import { Alert } from '@/components/Alert';
import { Button, LinkButton } from '@/components/Button';
import { User, PageProps } from '@/types';
import * as S from './styled';

interface Props extends PageProps {
  user: User;
  backupCodes: string[];
  viewOnly?: boolean;
}

export default function BackupCodes({ user, backupCodes, viewOnly }: Props) {
  const handleDownload = () => {
    const content = `Mailgress Backup Codes for ${user.email}\n\n${backupCodes.join('\n')}\n\nEach code can only be used once.`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mailgress-backup-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
  };

  return (
    <AppLayout>
      <S.Container>
        <S.Header>
          <S.Title>
            {viewOnly ? 'Your Backup Codes' : 'Save Your Backup Codes'}
          </S.Title>
          <S.Subtitle>
            {viewOnly
              ? 'These codes can be used to access your account if you lose your authenticator device.'
              : 'Store these codes in a safe place. You can use them to access your account if you lose your authenticator device.'}
          </S.Subtitle>
        </S.Header>

        {!viewOnly && (
          <Alert variant="warning">
            Each backup code can only be used once. After using all codes, you will need to regenerate new ones.
          </Alert>
        )}

        <S.Card>
          <S.CodesGrid>
            {backupCodes.map((code, index) => (
              <S.Code key={index}>{code}</S.Code>
            ))}
          </S.CodesGrid>

          <S.Actions>
            <Button variant="secondary" onClick={handleCopy}>
              Copy Codes
            </Button>
            <Button variant="secondary" onClick={handleDownload}>
              Download
            </Button>
            <LinkButton href="/profile">
              {viewOnly ? 'Back to Profile' : 'Done'}
            </LinkButton>
          </S.Actions>
        </S.Card>

        {backupCodes.length === 0 && (
          <Alert variant="warning">
            No backup codes remaining. Consider regenerating new backup codes.
          </Alert>
        )}
      </S.Container>
    </AppLayout>
  );
}
