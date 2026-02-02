import { useForm } from '@inertiajs/react';
import UserLayout from '@/layouts/UserLayout';
import { Card } from '@/components/Card';
import { Alert } from '@/components/Alert';
import { Button } from '@/components/Button';
import { FormGroup, Input } from '@/components/Input';
import { AvatarUpload } from '@/components/AvatarUpload';
import { User, PageProps } from '@/types';
import * as S from './styled';

interface Props extends PageProps {
  user: User;
  error?: string;
}

export default function UserShow({ user, error }: Props) {
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
    <UserLayout user={user}>
      <S.PageTitle>Personal</S.PageTitle>

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

            <S.FormActions>
              <Button type="submit" disabled={processing}>
                {processing ? 'Saving...' : 'Save Changes'}
              </Button>
            </S.FormActions>
          </S.Form>
        </S.FormCard>
      </Card>
    </UserLayout>
  );
}
