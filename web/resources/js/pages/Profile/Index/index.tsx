import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Card } from '@/components/Card';
import { Alert } from '@/components/Alert';
import { Button, LinkButton } from '@/components/Button';
import { FormGroup, Input } from '@/components/Input';
import { Avatar } from '@/components/Avatar';
import { useToast } from '@/contexts/ToastContext';
import { User, PageProps } from '@/types';
import * as S from './styled';

interface Props extends PageProps {
  user: User;
  error?: string;
}

export default function Profile({ user, error }: Props) {
  const { showToast } = useToast();
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [disablePassword, setDisablePassword] = useState('');
  const [disableError, setDisableError] = useState('');
  const [disabling, setDisabling] = useState(false);

  const { data, setData, put, processing } = useForm({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
  });

  const handleDisable2FA = async () => {
    setDisabling(true);
    setDisableError('');

    try {
      const response = await fetch('/profile/2fa/disable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: disablePassword }),
      });

      if (response.ok) {
        setShowDisableModal(false);
        setDisablePassword('');
        router.reload();
      } else {
        const data = await response.json();
        setDisableError(data.error || 'Failed to disable 2FA');
      }
    } catch {
      setDisableError('An error occurred');
    } finally {
      setDisabling(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put('/profile', {
      onSuccess: () => {
        showToast('Changes saved');
        router.reload({ only: ['auth'] });
      },
    });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    const token = document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1];

    const response = await fetch('/profile/avatar', {
      method: 'POST',
      headers: {
        'X-XSRF-TOKEN': token ? decodeURIComponent(token) : '',
      },
      body: formData,
    });

    if (response.ok) {
      router.reload({ only: ['auth'] });
      router.reload();
    }
  };

  const handleAvatarDelete = async () => {
    const token = document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1];

    const response = await fetch('/profile/avatar', {
      method: 'DELETE',
      headers: {
        'X-XSRF-TOKEN': token ? decodeURIComponent(token) : '',
      },
    });

    if (response.ok) {
      router.reload({ only: ['auth'] });
      router.reload();
    }
  };

  return (
    <AppLayout>
      <S.Container>
        <S.Header>
          <S.Title>Profile</S.Title>
          <S.Subtitle>Manage your account settings</S.Subtitle>
        </S.Header>

        {error && <Alert variant="error">{error}</Alert>}

        <Card>
          <S.FormCard>
            <S.Form onSubmit={handleSubmit}>
              <FormGroup label="Avatar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Avatar
                    src={user.avatar_url}
                    email={user.email}
                    size="lg"
                  />
                  <div>
                    <input
                      type="file"
                      id="avatar-input"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleAvatarChange}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => document.getElementById('avatar-input')?.click()}
                    >
                      Change Photo
                    </Button>
                    {user.avatar_url && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleAvatarDelete}
                        style={{ marginLeft: '0.5rem', color: '#dc2626' }}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </FormGroup>

              <S.FieldRow>
                <FormGroup label="First Name" htmlFor="first_name">
                  <Input
                    id="first_name"
                    type="text"
                    value={data.first_name}
                    onChange={(e) => setData('first_name', e.target.value)}
                  />
                </FormGroup>
                <FormGroup label="Last Name" htmlFor="last_name">
                  <Input
                    id="last_name"
                    type="text"
                    value={data.last_name}
                    onChange={(e) => setData('last_name', e.target.value)}
                  />
                </FormGroup>
              </S.FieldRow>

              <FormGroup label="Email">
                <S.EmailDisplay>{user.email}</S.EmailDisplay>
                <S.HelperText>Contact an administrator to change your email address.</S.HelperText>
              </FormGroup>

              <S.FormActions>
                <Button type="submit" disabled={processing}>
                  {processing ? 'Saving...' : 'Save Changes'}
                </Button>
              </S.FormActions>
            </S.Form>
          </S.FormCard>
        </Card>

        <S.SectionHeader>
          <S.SectionTitle>Security</S.SectionTitle>
        </S.SectionHeader>

        <Card>
          <S.SecurityCard>
            <S.SecurityHeader>
              <S.SecurityTitle>Two-Factor Authentication</S.SecurityTitle>
              {user.totp_enabled ? (
                <S.StatusBadge $enabled>Enabled</S.StatusBadge>
              ) : (
                <S.StatusBadge>Disabled</S.StatusBadge>
              )}
            </S.SecurityHeader>

            {user.totp_enabled ? (
              <>
                <S.SecurityDescription>
                  Your account is protected with two-factor authentication.
                </S.SecurityDescription>
                <S.SecurityActions>
                  <LinkButton variant="secondary" href="/profile/2fa/backup-codes">
                    View Backup Codes
                  </LinkButton>
                  <Button variant="danger" onClick={() => setShowDisableModal(true)}>
                    Disable 2FA
                  </Button>
                </S.SecurityActions>
              </>
            ) : (
              <>
                <S.SecurityDescription>
                  Add an extra layer of security to your account by enabling two-factor authentication.
                </S.SecurityDescription>
                <LinkButton href="/profile/2fa/setup">
                  Enable 2FA
                </LinkButton>
              </>
            )}
          </S.SecurityCard>
        </Card>

        {showDisableModal && (
          <S.ModalOverlay onClick={() => setShowDisableModal(false)}>
            <S.Modal onClick={(e) => e.stopPropagation()}>
              <S.ModalTitle>Disable Two-Factor Authentication</S.ModalTitle>
              <S.ModalDescription>
                Enter your password to confirm disabling 2FA. This will make your account less secure.
              </S.ModalDescription>

              {disableError && <Alert variant="error">{disableError}</Alert>}

              <FormGroup label="Password" htmlFor="disable-password">
                <Input
                  id="disable-password"
                  type="password"
                  value={disablePassword}
                  onChange={(e) => setDisablePassword(e.target.value)}
                  autoFocus
                />
              </FormGroup>

              <S.ModalActions>
                <Button variant="secondary" onClick={() => setShowDisableModal(false)}>
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDisable2FA}
                  disabled={disabling || !disablePassword}
                >
                  {disabling ? 'Disabling...' : 'Disable 2FA'}
                </Button>
              </S.ModalActions>
            </S.Modal>
          </S.ModalOverlay>
        )}
      </S.Container>
    </AppLayout>
  );
}
