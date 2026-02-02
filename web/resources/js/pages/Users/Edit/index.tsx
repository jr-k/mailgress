import { useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Card } from '@/components/Card';
import { Alert } from '@/components/Alert';
import { Button, LinkButton } from '@/components/Button';
import { FormGroup, Input, Checkbox } from '@/components/Input';
import { AvatarUpload } from '@/components/AvatarUpload';
import { User, PageProps } from '@/types';
import * as S from './styled';

interface Props extends PageProps {
  user: User;
  error?: string;
}

export default function UserEdit({ user, error }: Props) {
  const { data, setData, put, processing } = useForm({
    email: user.email,
    password: '',
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    is_admin: user.is_admin,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(`/users/${user.id}`);
  };

  return (
    <AppLayout>
      <S.Container>
        <S.Header>
          <S.BackLink as={Link} href="/users">
            &larr; Back to Users
          </S.BackLink>
          <S.Title>Edit User</S.Title>
        </S.Header>

        {error && <Alert variant="error">{error}</Alert>}

        <Card>
          <S.FormCard>
            <S.Form onSubmit={handleSubmit}>
              <FormGroup label="Avatar">
                <AvatarUpload
                  userId={user.id}
                  currentAvatarUrl={user.avatar_url}
                  email={user.email}
                />
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

              <FormGroup label="Email" htmlFor="email">
                <Input
                  id="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  required
                />
              </FormGroup>

              <FormGroup label="New Password (leave blank to keep current)" htmlFor="password">
                <Input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                />
              </FormGroup>

              <div>
                <S.CheckboxWrapper>
                  <Checkbox
                    checked={data.is_admin}
                    onChange={(e) => setData('is_admin', e.target.checked)}
                  />
                  <S.CheckboxText>Administrator</S.CheckboxText>
                </S.CheckboxWrapper>
              </div>

              <S.FormActions>
                <LinkButton href="/users" variant="secondary">
                  Cancel
                </LinkButton>
                <Button type="submit" disabled={processing}>
                  {processing ? 'Saving...' : 'Save Changes'}
                </Button>
              </S.FormActions>
            </S.Form>
          </S.FormCard>
        </Card>
      </S.Container>
    </AppLayout>
  );
}
