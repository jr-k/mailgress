import { PropsWithChildren } from 'react';
import ContextualLayout from '@/layouts/ContextualLayout';
import { User } from '@/types';

interface UserLayoutProps extends PropsWithChildren {
  user: User;
}

export default function UserLayout({ children, user }: UserLayoutProps) {
  const getUserDisplayName = () => {
    if (user.first_name || user.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }
    return user.email;
  };

  const navItems = [
    {
      label: 'Personal',
      href: `/users/${user.id}`,
      isActive: (currentUrl: string) => currentUrl === `/users/${user.id}`,
    },
    {
      label: 'Roles & Security',
      href: `/users/${user.id}/security`,
      isActive: (currentUrl: string) => currentUrl.includes('/security'),
    },
  ];

  return (
    <ContextualLayout
      backLink={{ href: '/users', label: 'Back to Users' }}
      title={getUserDisplayName()}
      navItems={navItems}
    >
      {children}
    </ContextualLayout>
  );
}
