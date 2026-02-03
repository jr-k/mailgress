import { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import MailboxLayout from '@/layouts/MailboxLayout';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ConfirmModal } from '@/components/ConfirmModal';
import { Mailbox, Email, Pagination, PageProps } from '@/types';
import * as S from './styled';

interface Props extends PageProps {
  mailbox: Mailbox;
  allMailboxes: Mailbox[];
  emails: Email[];
  pagination: Pagination;
  search: string;
  emailId?: string;
}

export default function MailboxShow({ mailbox, allMailboxes, emails: initialEmails, pagination, search, emailId }: Props) {
  const [emails, setEmails] = useState<Email[]>(initialEmails);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(() => {
    if (emailId) {
      const targetEmail = initialEmails?.find(e => e.id === parseInt(emailId, 10));
      if (targetEmail) return targetEmail;
    }
    return initialEmails?.[0] || null;
  });
  const [searchQuery, setSearchQuery] = useState(search || '');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    setEmails(initialEmails);
    if (emailId) {
      const targetEmail = initialEmails?.find(e => e.id === parseInt(emailId, 10));
      setSelectedEmail(targetEmail || initialEmails?.[0] || null);
    } else {
      setSelectedEmail(initialEmails?.[0] || null);
    }
  }, [initialEmails, emailId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(`/mailboxes/${mailbox.id}`, { search: searchQuery }, { preserveState: true });
  };

  const handleRefresh = () => {
    router.reload({ only: ['emails', 'pagination'] });
  };

  const handleSelectEmail = (email: Email) => {
    if (selectedEmail?.id === email.id) {
      setSelectedEmail(null);
    } else {
      setSelectedEmail(email);
      if (!email.is_read) {
        fetch(`/mailboxes/${mailbox.id}/emails/${email.id}/read`, { method: 'POST' });
        setEmails(emails.map(e => e.id === email.id ? { ...e, is_read: true } : e));
      }
    }
  };

  const handleMarkAsUnread = async () => {
    if (!selectedEmail) return;
    await fetch(`/mailboxes/${mailbox.id}/emails/${selectedEmail.id}/unread`, { method: 'POST' });
    setEmails(emails.map(e => e.id === selectedEmail.id ? { ...e, is_read: false } : e));
    setSelectedEmail({ ...selectedEmail, is_read: false });
  };

  const handleDeleteClick = () => {
    if (!selectedEmail) return;
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedEmail) return;
    await fetch(`/mailboxes/${mailbox.id}/emails/${selectedEmail.id}`, { method: 'DELETE' });
    const newEmails = emails.filter(e => e.id !== selectedEmail.id);
    setEmails(newEmails);
    setSelectedEmail(newEmails[0] || null);
    setDeleteModalOpen(false);
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
                <div key={email.id}>
                  <S.EmailItem
                    $selected={selectedEmail?.id === email.id}
                    $unread={!email.is_read}
                    onClick={() => handleSelectEmail(email)}
                  >
                    <S.EmailHeader>
                      <S.EmailFrom $unread={!email.is_read}><S.EmailClaim>From</S.EmailClaim> {email.from_address}</S.EmailFrom>
                      <S.EmailDate>{formatDate(email.received_at)}</S.EmailDate>
                    </S.EmailHeader>
                    <S.EmailSubject $unread={!email.is_read}><S.EmailClaim>Sub</S.EmailClaim> {email.subject || '(No subject)'}</S.EmailSubject>
                    {email.has_attachments && (
                      <S.AttachmentBadge>
                        <Badge variant="gray">Attachments</Badge>
                      </S.AttachmentBadge>
                    )}
                  </S.EmailItem>
                  {selectedEmail?.id === email.id && (
                    <S.MobileEmailDetail>
                      <S.MobileEmailDetailContent>
                        <S.MobileEmailMeta>
                          <div><S.MetaLabel>To:</S.MetaLabel> <S.MetaValue>{email.to_address}</S.MetaValue></div>
                          <div><S.MetaLabel>Date:</S.MetaLabel> <S.MetaValue>{email.date ? formatDate(email.date) : formatDate(email.received_at)}</S.MetaValue></div>
                          <div><S.MetaLabel>Size:</S.MetaLabel> <S.MetaValue>{formatSize(email.raw_size)}</S.MetaValue></div>
                        </S.MobileEmailMeta>
                        {email.attachments && email.attachments.length > 0 && (
                          <S.AttachmentsSection>
                            <S.AttachmentsTitle>Attachments</S.AttachmentsTitle>
                            <S.AttachmentsList>
                              {email.attachments.map((att) => (
                                <S.AttachmentLink key={att.id} href={att.download_url}>
                                  {att.filename} ({formatSize(att.size)})
                                </S.AttachmentLink>
                              ))}
                            </S.AttachmentsList>
                          </S.AttachmentsSection>
                        )}
                        <S.MobileEmailBody>
                          {email.html_body ? (
                            <S.HtmlBody dangerouslySetInnerHTML={{ __html: email.html_body }} />
                          ) : (
                            <S.TextBody>{email.text_body || '(No content)'}</S.TextBody>
                          )}
                        </S.MobileEmailBody>
                      </S.MobileEmailDetailContent>
                    </S.MobileEmailDetail>
                  )}
                </div>
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
                <S.EmailDetailTitleRow>
                  <S.EmailDetailSubject>
                    {selectedEmail.subject || '(No subject)'}
                  </S.EmailDetailSubject>
                  <S.EmailActions>
                    {selectedEmail.is_read && (
                      <S.ActionButton onClick={handleMarkAsUnread} title="Mark as unread">
                        <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </S.ActionButton>
                    )}
                    <S.ActionButton onClick={handleDeleteClick} $danger title="Delete email">
                      <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </S.ActionButton>
                  </S.EmailActions>
                </S.EmailDetailTitleRow>
                <S.EmailMeta>
                  <S.MetaItem>
                    <S.MetaLabel>From:</S.MetaLabel> <S.MetaValue>{selectedEmail.from_address}</S.MetaValue>
                  </S.MetaItem>
                  <S.MetaItem>
                    <S.MetaLabel>To:</S.MetaLabel> <S.MetaValue>{selectedEmail.to_address}</S.MetaValue>
                  </S.MetaItem>
                  <S.MetaItem>
                    <S.MetaLabel>Date:</S.MetaLabel>{' '}
                    <S.MetaValue>
                      {selectedEmail.date
                        ? formatDate(selectedEmail.date)
                        : formatDate(selectedEmail.received_at)}
                    </S.MetaValue>
                  </S.MetaItem>
                  <S.MetaItem>
                    <S.MetaLabel>Size:</S.MetaLabel> <S.MetaValue>{formatSize(selectedEmail.raw_size)}</S.MetaValue>
                  </S.MetaItem>
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

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Email"
        description={`Are you sure you want to delete this email from "${selectedEmail?.from_address || ''}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </MailboxLayout>
  );
}
