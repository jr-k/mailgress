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
                            <S.IconButton as={Link} href={`/users/${user.id}`} title="Edit">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                            </S.IconButton>
                            <S.IconDeleteButton onClick={() => handleDeleteClick(user)} title="Delete">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                <line x1="10" y1="11" x2="10" y2="17"/>
                                <line x1="14" y1="11" x2="14" y2="17"/>
                              </svg>
                            </S.IconDeleteButton>
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
