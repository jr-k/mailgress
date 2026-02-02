import { Link } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Card } from '@/components/Card';
import { Email, Mailbox, PageProps } from '@/types';
import * as S from './styled';

interface Props extends PageProps {
  email: Email;
  mailbox: Mailbox;
}

export default function EmailShow({ email, mailbox }: Props) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <AppLayout>
      <S.Container>
        <S.Header>
          <S.BackLink as={Link} href={`/mailboxes/${mailbox.id}`}>
            &larr; Back to Inbox
          </S.BackLink>
          <S.Title>{email.subject || '(No subject)'}</S.Title>
        </S.Header>

        <Card>
          <S.EmailCard>
            <S.MetaGrid>
              <S.MetaItem>
                <S.MetaLabel>From:</S.MetaLabel> <S.MetaValue>{email.from_address}</S.MetaValue>
              </S.MetaItem>
              <S.MetaItem>
                <S.MetaLabel>To:</S.MetaLabel> <S.MetaValue>{email.to_address}</S.MetaValue>
              </S.MetaItem>
              <S.MetaItem>
                <S.MetaLabel>Date:</S.MetaLabel>{' '}
                <S.MetaValue>
                  {email.date ? formatDate(email.date) : formatDate(email.received_at)}
                </S.MetaValue>
              </S.MetaItem>
              <S.MetaItem>
                <S.MetaLabel>Size:</S.MetaLabel> <S.MetaValue>{formatSize(email.raw_size)}</S.MetaValue>
              </S.MetaItem>
              {email.message_id && (
                <S.MetaItem $fullWidth>
                  <S.MetaLabel>Message-ID:</S.MetaLabel>{' '}
                  <S.MessageId>{email.message_id}</S.MessageId>
                </S.MetaItem>
              )}
            </S.MetaGrid>

            {email.attachments && email.attachments.length > 0 && (
              <S.AttachmentsSection>
                <S.AttachmentsTitle>Attachments</S.AttachmentsTitle>
                <S.AttachmentsList>
                  {email.attachments.map((att) => (
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

            <S.BodySection>
              {email.html_body ? (
                <S.HtmlBody dangerouslySetInnerHTML={{ __html: email.html_body }} />
              ) : (
                <S.TextBody>{email.text_body || '(No content)'}</S.TextBody>
              )}
            </S.BodySection>
          </S.EmailCard>
        </Card>
      </S.Container>
    </AppLayout>
  );
}
