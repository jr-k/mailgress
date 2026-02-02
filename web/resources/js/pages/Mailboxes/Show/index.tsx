import { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import MailboxLayout from '@/layouts/MailboxLayout';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Mailbox, Email, Pagination, PageProps } from '@/types';
import * as S from './styled';

interface Props extends PageProps {
  mailbox: Mailbox;
  allMailboxes: Mailbox[];
  emails: Email[];
  pagination: Pagination;
  search: string;
}

export default function MailboxShow({ mailbox, allMailboxes, emails, pagination, search }: Props) {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(emails?.[0] || null);
  const [searchQuery, setSearchQuery] = useState(search || '');

  useEffect(() => {
    setSelectedEmail(emails?.[0] || null);
  }, [emails]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(`/mailboxes/${mailbox.id}`, { search: searchQuery }, { preserveState: true });
  };

  const handleRefresh = () => {
    router.reload({ only: ['emails', 'pagination'] });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <MailboxLayout mailbox={mailbox} allMailboxes={allMailboxes}>
      <S.Header>
        <S.HeaderRow>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Emails</h2>
          </div>
          <Button onClick={handleRefresh}>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh Inbox
          </Button>
        </S.HeaderRow>
      </S.Header>

      <S.SplitView>
        <S.EmailList>
          <S.SearchBox>
            <form onSubmit={handleSearch}>
              <Input
                type="text"
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </S.SearchBox>
          <S.EmailListItems>
            {emails.length === 0 ? (
              <S.EmptyState>No emails found</S.EmptyState>
            ) : (
              emails.map((email) => (
                <S.EmailItem
                  key={email.id}
                  $selected={selectedEmail?.id === email.id}
                  onClick={() => setSelectedEmail(email)}
                >
                  <S.EmailHeader>
                    <S.EmailFrom><S.EmailClaim>From</S.EmailClaim> {email.from_address}</S.EmailFrom>
                    <S.EmailDate>{formatDate(email.received_at)}</S.EmailDate>
                  </S.EmailHeader>
                  <S.EmailSubject><S.EmailClaim>Subj</S.EmailClaim> {email.subject || '(No subject)'}</S.EmailSubject>
                  <S.EmailPreview>
                    {email.text_body?.substring(0, 100) ||
                      email.html_body?.substring(0, 100) ||
                      '(No content)'}
                  </S.EmailPreview>
                  {email.has_attachments && (
                    <S.AttachmentBadge>
                      <Badge variant="gray">Attachments</Badge>
                    </S.AttachmentBadge>
                  )}
                </S.EmailItem>
              ))
            )}
          </S.EmailListItems>
          {pagination.total > pagination.per_page && (
            <S.Pagination>
              <S.PageInfo>
                Page {pagination.current_page} of{' '}
                {Math.ceil(pagination.total / pagination.per_page)}
              </S.PageInfo>
              <S.PageLinks>
                {pagination.current_page > 1 && (
                  <S.PageLink
                    as={Link}
                    href={`/mailboxes/${mailbox.id}?page=${pagination.current_page - 1}&search=${
                      search || ''
                    }`}
                  >
                    Previous
                  </S.PageLink>
                )}
                {pagination.current_page < Math.ceil(pagination.total / pagination.per_page) && (
                  <S.PageLink
                    as={Link}
                    href={`/mailboxes/${mailbox.id}?page=${pagination.current_page + 1}&search=${
                      search || ''
                    }`}
                  >
                    Next
                  </S.PageLink>
                )}
              </S.PageLinks>
            </S.Pagination>
          )}
        </S.EmailList>

        <S.EmailDetail>
          {selectedEmail ? (
            <S.EmailDetailContent>
              <S.EmailDetailHeader>
                <S.EmailDetailSubject>
                  {selectedEmail.subject || '(No subject)'}
                </S.EmailDetailSubject>
                <S.EmailMeta>
                  <div>
                    <S.MetaLabel>From:</S.MetaLabel> <S.MetaValue>{selectedEmail.from_address}</S.MetaValue>
                  </div>
                  <div>
                    <S.MetaLabel>To:</S.MetaLabel> <S.MetaValue>{selectedEmail.to_address}</S.MetaValue>
                  </div>
                  <div>
                    <S.MetaLabel>Date:</S.MetaLabel>{' '}
                    <S.MetaValue>
                      {selectedEmail.date
                        ? formatDate(selectedEmail.date)
                        : formatDate(selectedEmail.received_at)}
                    </S.MetaValue>
                  </div>
                  <div>
                    <S.MetaLabel>Size:</S.MetaLabel> <S.MetaValue>{formatSize(selectedEmail.raw_size)}</S.MetaValue>
                  </div>
                </S.EmailMeta>
              </S.EmailDetailHeader>

              {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                <S.AttachmentsSection>
                  <S.AttachmentsTitle>Attachments</S.AttachmentsTitle>
                  <S.AttachmentsList>
                    {selectedEmail.attachments.map((att) => (
                      <S.AttachmentLink key={att.id} href={att.download_url}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                          />
                        </svg>
                        {att.filename} ({formatSize(att.size)})
                      </S.AttachmentLink>
                    ))}
                  </S.AttachmentsList>
                </S.AttachmentsSection>
              )}

              <S.EmailBody>
                {selectedEmail.html_body ? (
                  <S.HtmlBody dangerouslySetInnerHTML={{ __html: selectedEmail.html_body }} />
                ) : (
                  <S.TextBody>{selectedEmail.text_body || '(No content)'}</S.TextBody>
                )}
              </S.EmailBody>
            </S.EmailDetailContent>
          ) : (
            <S.NoEmailSelected>Select an email to view</S.NoEmailSelected>
          )}
        </S.EmailDetail>
      </S.SplitView>
    </MailboxLayout>
  );
}
