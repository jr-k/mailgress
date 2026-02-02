import { PropsWithChildren, useState, useRef, useEffect, useMemo, ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import * as S from './styled';

interface NavItem {
  label: string;
  href: string;
  isActive?: (url: string) => boolean;
  count?: number;
}

interface SwitcherItem {
  id: number;
  label: string;
  href: string;
}

interface ContextualLayoutProps extends PropsWithChildren {
  backLink: {
    href: string;
    label: string;
  };
  title: string;
  navItems: NavItem[];
  headerExtra?: ReactNode;
  switcherItems?: SwitcherItem[];
  currentSwitcherId?: number;
}

export default function ContextualLayout({
  children,
  backLink,
  title,
  navItems,
  headerExtra,
  switcherItems = [],
  currentSwitcherId,
}: ContextualLayoutProps) {
  const { url } = usePage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const switcherRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return switcherItems;
    const query = searchQuery.toLowerCase();
    return switcherItems.filter((item) => item.label.toLowerCase().includes(query));
  }, [switcherItems, searchQuery]);

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
          <S.BackLink as={Link} href={backLink.href}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {backLink.label}
          </S.BackLink>

          {switcherItems.length > 0 ? (
            <S.Switcher ref={switcherRef}>
              <S.SwitcherButton onClick={handleSwitcherToggle}>
                <span>{title}</span>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </S.SwitcherButton>
              <S.SwitcherDropdown $isOpen={switcherOpen}>
                <S.SwitcherSearchInput
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <S.SwitcherList>
                  {filteredItems.length === 0 ? (
                    <S.SwitcherOptionEmpty>No items found</S.SwitcherOptionEmpty>
                  ) : (
                    filteredItems.map((item) => (
                      <S.SwitcherOption
                        key={item.id}
                        as={Link}
                        href={item.href}
                        $active={item.id === currentSwitcherId}
                        onClick={() => {
                          setSwitcherOpen(false);
                          setSearchQuery('');
                          closeSidebar();
                        }}
                      >
                        {item.label}
                      </S.SwitcherOption>
                    ))
                  )}
                </S.SwitcherList>
              </S.SwitcherDropdown>
            </S.Switcher>
          ) : null}

          {headerExtra}

          <S.SidebarNav>
            {navItems.map((item) => {
              const isActive = item.isActive ? item.isActive(url) : url === item.href;
              return (
                <S.SidebarLink
                  key={item.href}
                  as={Link}
                  href={item.href}
                  $active={isActive}
                  onClick={closeSidebar}
                >
                  {item.label}
                  {item.count !== undefined && <S.NavCount>({item.count})</S.NavCount>}
                </S.SidebarLink>
              );
            })}
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

export { S as ContextualLayoutStyles };
