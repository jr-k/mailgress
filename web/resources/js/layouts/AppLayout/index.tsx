import { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { PageProps } from '@/types';
import { Alert } from '@/components/Alert';
import { Avatar } from '@/components/Avatar';
import * as S from './styled';

export default function AppLayout({ children }: PropsWithChildren) {
  const { auth, flash, appName, url, safeMode } = usePage<PageProps>().props;
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
      {safeMode && (
        <S.SafeModeWarning>
          <strong>WARNING:</strong> Safe Mode is enabled. Authentication is bypassed. Do not use in production!
        </S.SafeModeWarning>
      )}
      <S.Nav>
        <S.NavInner>
          <S.NavLeft>
            <S.Logo as={Link} href="/dashboard">
              <S.LogoIcon>
                <img src="/img/mailgress-icon.png" alt="" width="32" height="32" />
              </S.LogoIcon>
              <S.LogoName>
                {appName || 'Mailgress'}
                <S.BrandDotWrapper>
                  <S.BrandDot />
                </S.BrandDotWrapper>
              </S.LogoName>
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
