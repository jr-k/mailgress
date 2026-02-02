import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Avatar } from '@/components/Avatar';
import { LinkButton } from '@/components/Button';
import { ConfirmModal } from '@/components/ConfirmModal';
import { SearchInput } from '@/components/SearchInput';
import { useFilter } from '@/hooks/useFilter';
import { User, PageProps } from '@/types';
import * as S from './styled';

interface Props extends PageProps {
  users: User[];
}

export default function UsersIndex({ users }: Props) {
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; user: User | null }>({
    isOpen: false,
    user: null,
  });

  const { searchTerm, setSearchTerm, filteredItems: filteredUsers } = useFilter({
    items: users,
    searchFields: ['email', 'first_name', 'last_name'],
  });

  const handleDeleteClick = (user: User) => {
    setDeleteModal({ isOpen: true, user });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.user) {
      router.delete(`/users/${deleteModal.user.id}`, {
        onFinish: () => setDeleteModal({ isOpen: false, user: null }),
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, user: null });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <AppLayout>
      <S.Header>
        <S.Title>Users</S.Title>
        <LinkButton href="/users/create">Create User</LinkButton>
      </S.Header>

      <Card>
        {users.length === 0 ? (
          <S.TableCell as="div" style={{ display: 'block', textAlign: 'center', padding: '3rem' }}>
            No users found
          </S.TableCell>
        ) : (
          <>
            <S.Toolbar>
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Filter users..."
              />
              <S.ResultCount>
                {filteredUsers.length} of {users.length} user{users.length !== 1 ? 's' : ''}
              </S.ResultCount>
            </S.Toolbar>
            <S.TableWrapper>
              <S.Table>
                <S.TableHead>
                  <tr>
                    <S.TableHeader>Email</S.TableHeader>
                    <S.TableHeader>First Name</S.TableHeader>
                    <S.TableHeader>Last Name</S.TableHeader>
                    <S.TableHeader>Role</S.TableHeader>
                    <S.TableHeader>Created</S.TableHeader>
                    <S.TableHeader $align="right">Actions</S.TableHeader>
                  </tr>
                </S.TableHead>
                <S.TableBody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <S.TableCell colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                        No users match your search.
                      </S.TableCell>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <S.TableRow key={user.id}>
                        <S.TableCell>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Avatar src={user.avatar_url} email={user.email} size="sm" />
                            <S.Email>{user.email}</S.Email>
                          </div>
                        </S.TableCell>
                        <S.TableCell>{user.first_name || '-'}</S.TableCell>
                        <S.TableCell>{user.last_name || '-'}</S.TableCell>
                        <S.TableCell>
                          <Badge variant={user.is_admin ? 'info' : 'gray'} dot>
                            {user.is_admin ? 'Admin' : 'User'}
                          </Badge>
                        </S.TableCell>
                        <S.TableCell>
                          <S.DateText>{formatDate(user.created_at)}</S.DateText>
                        </S.TableCell>
                        <S.TableCell $align="right">
                          <S.Actions>
                            <S.ActionLink as={Link} href={`/users/${user.id}/edit`}>
                              Edit
                            </S.ActionLink>
                            <S.DeleteButton onClick={() => handleDeleteClick(user)}>
                              Delete
                            </S.DeleteButton>
                          </S.Actions>
                        </S.TableCell>
                      </S.TableRow>
                    ))
                  )}
                </S.TableBody>
              </S.Table>
            </S.TableWrapper>
          </>
        )}
      </Card>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete User"
        description={`Are you sure you want to delete "${deleteModal.user?.email}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </AppLayout>
  );
}
