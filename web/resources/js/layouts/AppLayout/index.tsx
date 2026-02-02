import { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { PageProps } from '@/types';
import { Alert } from '@/components/Alert';
import { Avatar } from '@/components/Avatar';
import * as S from './styled';

export default function AppLayout({ children }: PropsWithChildren) {
  const { auth, flash, appName, url } = usePage<PageProps>().props;
  const currentPath = typeof url === 'string' ? url : window.location.pathname;
  const [settingsOpen, setSettingsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return currentPath === '/' || currentPath === '/dashboard';
    }
    return currentPath.startsWith(path);
  };

  const isSettingsActive = () => {
    return (
      currentPath.startsWith('/domains') ||
      currentPath.startsWith('/users') ||
      currentPath.startsWith('/tags') ||
      currentPath.startsWith('/settings')
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <S.Container>
      <S.Nav>
        <S.NavInner>
          <S.NavLeft>
            <S.Logo as={Link} href="/dashboard">
              <S.LogoIcon>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </S.LogoIcon>
              {appName || 'Mailgress'}
            </S.Logo>
            <S.NavLinks>
              <S.NavLink as={Link} href="/dashboard" $active={isActive('/dashboard')}>
                Dashboard
              </S.NavLink>
              <S.NavLink as={Link} href="/mailboxes" $active={isActive('/mailboxes')}>
                Mailboxes
              </S.NavLink>
              {auth?.user.is_admin && (
                <S.DropdownContainer ref={dropdownRef}>
                  <S.DropdownTrigger
                    onClick={() => setSettingsOpen(!settingsOpen)}
                    $active={isSettingsActive()}
                  >
                    Settings
                    <S.DropdownIcon $open={settingsOpen}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M3 4.5L6 7.5L9 4.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </S.DropdownIcon>
                  </S.DropdownTrigger>
                  {settingsOpen && (
                    <S.DropdownMenu>
                      <S.DropdownItem
                        as={Link}
                        href="/domains"
                        $active={isActive('/domains')}
                        onClick={() => setSettingsOpen(false)}
                      >
                        Domains
                      </S.DropdownItem>
                      <S.DropdownItem
                        as={Link}
                        href="/users"
                        $active={isActive('/users')}
                        onClick={() => setSettingsOpen(false)}
                      >
                        Users
                      </S.DropdownItem>
                      <S.DropdownItem
                        as={Link}
                        href="/tags"
                        $active={isActive('/tags')}
                        onClick={() => setSettingsOpen(false)}
                      >
                        Tags
                      </S.DropdownItem>
                    </S.DropdownMenu>
                  )}
                </S.DropdownContainer>
              )}
            </S.NavLinks>
          </S.NavLeft>
          <S.NavRight>
            <S.ProfileLink as={Link} href="/profile">
              {auth?.user && (
                <Avatar
                  src={auth.user.avatar_url}
                  email={auth.user.email}
                  size="sm"
                />
              )}
              <S.UserInfo>
                <S.UserEmail>
                  {auth?.user.first_name || auth?.user.last_name
                    ? `${auth?.user.first_name || ''} ${auth?.user.last_name || ''}`.trim()
                    : auth?.user.email}
                </S.UserEmail>
                {auth?.user.is_admin && <S.AdminBadge>Admin</S.AdminBadge>}
              </S.UserInfo>
            </S.ProfileLink>
            <S.LogoutButton as={Link} href="/logout" method="post">
              Logout
            </S.LogoutButton>
          </S.NavRight>
        </S.NavInner>
      </S.Nav>

      {flash?.success && (
        <S.FlashContainer>
          <Alert variant="success">{flash.success}</Alert>
        </S.FlashContainer>
      )}

      {flash?.error && (
        <S.FlashContainer>
          <Alert variant="error">{flash.error}</Alert>
        </S.FlashContainer>
      )}

      <S.Main>{children}</S.Main>
    </S.Container>
  );
}
