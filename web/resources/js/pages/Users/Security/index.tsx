import { useForm } from '@inertiajs/react';
import UserLayout from '@/layouts/UserLayout';
import { Card } from '@/components/Card';
import { Alert } from '@/components/Alert';
import { Button } from '@/components/Button';
import { FormGroup, Input, Select } from '@/components/Input';
import { User, PageProps } from '@/types';
import * as S from './styled';

interface Props extends PageProps {
  user: User;
  error?: string;
}

export default function UserSecurity({ user, error }: Props) {
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
      <S.PageTitle>Roles & Security</S.PageTitle>

      {error && <Alert variant="error">{error}</Alert>}

      <Card>
        <S.FormCard>
          <S.Form onSubmit={handleSubmit}>
            <FormGroup label="Role" htmlFor="role">
              <Select
                id="role"
                value={data.is_admin ? 'admin' : 'member'}
                onChange={(e) => setData('is_admin', e.target.value === 'admin')}
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </Select>
              <S.HelpText>
                Admins have full access to manage users, domains, and settings.
              </S.HelpText>
            </FormGroup>

            <FormGroup label="New Password" htmlFor="password">
              <Input
                id="password"
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                placeholder="Leave blank to keep current password"
              />
              <S.HelpText>
                Only fill this if you want to change the user's password.
              </S.HelpText>
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
