import { PropsWithChildren, useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import ContextualLayout from '@/layouts/ContextualLayout';
import { Domain } from '@/types';

interface DomainLayoutProps extends PropsWithChildren {
  domain: Domain;
  allDomains?: Domain[];
}

export default function DomainLayout({ children, domain, allDomains = [] }: DomainLayoutProps) {
  const { url } = usePage();

  const navItems = [
    {
      label: 'DNS Setup',
      href: `/domains/${domain.id}`,
      isActive: (currentUrl: string) => currentUrl === `/domains/${domain.id}`,
    },
    {
      label: 'Mailboxes',
      href: `/domains/${domain.id}/mailboxes`,
      isActive: (currentUrl: string) => currentUrl.includes('/mailboxes'),
      count: domain.mailbox_count,
    },
    {
      label: 'Settings',
      href: `/domains/${domain.id}/edit`,
      isActive: (currentUrl: string) => currentUrl.endsWith('/edit'),
    },
  ];

  const switcherItems = useMemo(() => {
    return allDomains.map((d) => {
      const currentPath = url.replace(`/domains/${domain.id}`, '');
      return {
        id: d.id,
        label: d.name,
        href: `/domains/${d.id}${currentPath}`,
      };
    });
  }, [allDomains, domain.id, url]);

  return (
    <ContextualLayout
      backLink={{ href: '/domains', label: 'Back to Domains' }}
      title={domain.name}
      navItems={navItems}
      switcherItems={switcherItems}
      currentSwitcherId={domain.id}
    >
      {children}
    </ContextualLayout>
  );
}
