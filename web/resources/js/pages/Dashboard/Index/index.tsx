import { Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Card } from '@/components/Card';
import { LinkButton } from '@/components/Button';
import { Mailbox, PageProps } from '@/types';
import * as S from './styled';

interface Props extends PageProps {
  mailboxes: Mailbox[];
  mailboxCount: number;
  emailCount: number;
  domainCount: number;
}

export default function Dashboard({ mailboxes, mailboxCount, emailCount, domainCount }: Props) {
  const { auth } = usePage<Props>().props;

  const getEmailAddress = (mailbox: Mailbox) => {
    if (mailbox.domain) {
      return `${mailbox.slug}@${mailbox.domain.name}`;
    }
    return mailbox.slug;
  };

  return (
    <AppLayout>
      <S.Header>
        <S.Title>Dashboard</S.Title>
        <S.Welcome>Welcome back, {auth?.user.email}</S.Welcome>
      </S.Header>

      <S.StatsGrid>
        <Card>
          <S.StatCardLink as={Link} href="/mailboxes">
            <S.StatLabel>Mailboxes</S.StatLabel>
            <S.StatValue>{mailboxCount}</S.StatValue>
          </S.StatCardLink>
        </Card>
        <Card>
          <S.StatCard>
            <S.StatLabel>Emails</S.StatLabel>
            <S.StatValue>{emailCount}</S.StatValue>
          </S.StatCard>
        </Card>
        <Card>
          <S.StatCardLink as={Link} href="/domains">
            <S.StatLabel>Domains</S.StatLabel>
            <S.StatValue>{domainCount}</S.StatValue>
          </S.StatCardLink>
        </Card>
      </S.StatsGrid>

      <Card>
        <S.CardHeader>
          <S.CardTitle>
            {auth?.user.is_admin ? 'All Mailboxes' : 'Your Mailboxes'}
          </S.CardTitle>
          {auth?.user.is_admin && (
            <LinkButton href="/mailboxes/create">Create Mailbox</LinkButton>
          )}
        </S.CardHeader>
        <S.MailboxList>
          {mailboxes.length === 0 ? (
            <S.EmptyState>No mailboxes found</S.EmptyState>
          ) : (
            mailboxes.slice(0, 5).map((mailbox) => (
              <S.MailboxItem as={Link} key={mailbox.id} href={`/mailboxes/${mailbox.id}`}>
                <S.MailboxRow>
                  <S.MailboxInfo>
                    <S.MailboxName>{getEmailAddress(mailbox)}</S.MailboxName>
                    {mailbox.description && (
                      <S.MailboxDescription>{mailbox.description}</S.MailboxDescription>
                    )}
                  </S.MailboxInfo>
                  <S.MailboxStats>
                    {mailbox.stats?.email_count || 0} emails
                  </S.MailboxStats>
                </S.MailboxRow>
              </S.MailboxItem>
            ))
          )}
        </S.MailboxList>
        {mailboxes.length > 5 && (
          <S.CardFooter>
            <S.ViewAllLink as={Link} href="/mailboxes">
              View all mailboxes
            </S.ViewAllLink>
          </S.CardFooter>
        )}
      </Card>
    </AppLayout>
  );
}
