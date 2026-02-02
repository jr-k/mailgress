import { PropsWithChildren } from 'react';
import { Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Breadcrumb, BreadcrumbItem } from '@/components/Breadcrumb';
import { Mailbox } from '@/types';
import * as S from './styled';

interface MailboxLayoutProps extends PropsWithChildren {
  mailbox: Mailbox;
  breadcrumbs?: BreadcrumbItem[];
}

export default function MailboxLayout({ children, mailbox, breadcrumbs = [] }: MailboxLayoutProps) {
  const { url } = usePage();

  const defaultBreadcrumbs: BreadcrumbItem[] = [
    { label: 'Mailboxes', href: '/mailboxes' },
    { 
      label: mailbox.slug + (mailbox.domain ? '@' + mailbox.domain.name : ''),
      href: `/mailboxes/${mailbox.id}`,
      // In a real implementation, we'd pass sibling mailboxes here for the dropdown
    },
    ...breadcrumbs
  ];

  return (
    <AppLayout>
      <S.Container>
        <S.Sidebar>
          <S.SidebarLink 
            as={Link} 
            href={`/mailboxes/${mailbox.id}`} 
            $active={url === `/mailboxes/${mailbox.id}` || url.includes('/emails/')}
          >
            Emails
          </S.SidebarLink>
          <S.SidebarLink 
            as={Link} 
            href={`/mailboxes/${mailbox.id}/webhooks`} 
            $active={url.includes('/webhooks')}
          >
            Webhooks
          </S.SidebarLink>
          <S.SidebarLink 
            as={Link} 
            href={`/mailboxes/${mailbox.id}/edit`} 
            $active={url.endsWith('/edit')}
          >
            Settings
          </S.SidebarLink>
        </S.Sidebar>
        
        <S.Content>
          <Breadcrumb items={defaultBreadcrumbs} />
          {children}
        </S.Content>
      </S.Container>
    </AppLayout>
  );
}
