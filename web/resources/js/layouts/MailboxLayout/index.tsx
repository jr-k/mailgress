import { PropsWithChildren, useState, useRef, useEffect, useMemo } from 'react';
import { Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Mailbox, PageProps } from '@/types';
import * as S from './styled';

interface MailboxLayoutProps extends PropsWithChildren {
  mailbox: Mailbox;
  allMailboxes?: Mailbox[];
}

export default function MailboxLayout({ children, mailbox, allMailboxes = [] }: MailboxLayoutProps) {
  const page = usePage<PageProps>();
  const url = page.url;
  const { auth } = page.props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const switcherRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const getMailboxLabel = (m: Mailbox) => {
    return m.slug + (m.domain ? '@' + m.domain.name : '');
  };

  const filteredMailboxes = useMemo(() => {
    if (!searchQuery.trim()) return allMailboxes;
    const query = searchQuery.toLowerCase();
    return allMailboxes.filter((m) => getMailboxLabel(m).toLowerCase().includes(query));
  }, [allMailboxes, searchQuery]);

  const getMailboxHref = (m: Mailbox) => {
    // Extract the path after /mailboxes/{id}
    const currentPath = url.replace(/^\/mailboxes\/\d+/, '');

    // If we're on a specific webhook page (with webhook ID), redirect to webhooks list
    // to avoid 404 since webhook IDs are specific to each mailbox
    if (/^\/webhooks\/\d+/.test(currentPath)) {
      return `/mailboxes/${m.id}/webhooks`;
    }

    return `/mailboxes/${m.id}${currentPath}`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setSwitcherOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (switcherOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [switcherOpen]);

  const handleSwitcherToggle = () => {
    setSwitcherOpen(!switcherOpen);
    if (!switcherOpen) {
      setSearchQuery('');
    }
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <AppLayout>
      <S.Container>
        <S.SidebarOverlay $isOpen={sidebarOpen} onClick={closeSidebar} />

        <S.Sidebar $isOpen={sidebarOpen}>
          <S.BackLink as={Link} href="/mailboxes">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Mailboxes
          </S.BackLink>

          {allMailboxes.length > 0 && (
            <S.MailboxSwitcher ref={switcherRef}>
              <S.MailboxSwitcherButton onClick={handleSwitcherToggle}>
                <span>{getMailboxLabel(mailbox)}</span>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </S.MailboxSwitcherButton>
              <S.MailboxSwitcherDropdown $isOpen={switcherOpen}>
                <S.MailboxSearchInput
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search mailboxes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <S.MailboxList>
                  {filteredMailboxes.length === 0 ? (
                    <S.MailboxOptionEmpty>No mailboxes found</S.MailboxOptionEmpty>
                  ) : (
                    filteredMailboxes.map((m) => (
                      <S.MailboxOption
                        key={m.id}
                        as={Link}
                        href={getMailboxHref(m)}
                        $active={m.id === mailbox.id}
                        onClick={() => {
                          setSwitcherOpen(false);
                          setSearchQuery('');
                          closeSidebar();
                        }}
                      >
                        {getMailboxLabel(m)}
                      </S.MailboxOption>
                    ))
                  )}
                </S.MailboxList>
              </S.MailboxSwitcherDropdown>
            </S.MailboxSwitcher>
          )}

          <S.SidebarNav>
            <S.SidebarLink
              as={Link}
              href={`/mailboxes/${mailbox.id}`}
              $active={url === `/mailboxes/${mailbox.id}` || url.includes('/emails/')}
              onClick={closeSidebar}
            >
              Emails {mailbox.stats && <S.NavCount>({mailbox.stats.email_count})</S.NavCount>}
            </S.SidebarLink>
            <S.SidebarLink
              as={Link}
              href={`/mailboxes/${mailbox.id}/webhooks`}
              $active={url.includes('/webhooks')}
              onClick={closeSidebar}
            >
              Webhooks {mailbox.stats && <S.NavCount>({mailbox.stats.webhook_count})</S.NavCount>}
            </S.SidebarLink>
            {auth?.user.is_admin && (
              <S.SidebarLink
                as={Link}
                href={`/mailboxes/${mailbox.id}/edit`}
                $active={url === `/mailboxes/${mailbox.id}/edit`}
                onClick={closeSidebar}
              >
                Settings
              </S.SidebarLink>
            )}
          </S.SidebarNav>
        </S.Sidebar>

        <S.Content>
          <S.ContentSheet>
            <S.MobileMenuButton onClick={() => setSidebarOpen(true)}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Menu
            </S.MobileMenuButton>
            {children}
          </S.ContentSheet>
        </S.Content>
      </S.Container>
    </AppLayout>
  );
}
