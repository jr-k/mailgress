import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import MailboxLayout from '@/layouts/MailboxLayout';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { LinkButton } from '@/components/Button';
import { ConfirmModal } from '@/components/ConfirmModal';
import { Mailbox, Webhook, PageProps } from '@/types';
import * as S from './styled';

interface Props extends PageProps {
  mailbox: Mailbox;
  allMailboxes: Mailbox[];
  webhooks: Webhook[];
}

export default function WebhooksIndex({ mailbox, allMailboxes, webhooks }: Props) {
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; webhook: Webhook | null }>({
    isOpen: false,
    webhook: null,
  });

  const handleDeleteClick = (webhook: Webhook) => {
    setDeleteModal({ isOpen: true, webhook });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.webhook) {
      router.delete(`/mailboxes/${mailbox.id}/webhooks/${deleteModal.webhook.id}`, {
        onFinish: () => setDeleteModal({ isOpen: false, webhook: null }),
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, webhook: null });
  };

  return (
    <MailboxLayout mailbox={mailbox} allMailboxes={allMailboxes}>
      <S.Header>
        <S.HeaderRow>
          <S.Title>Webhooks</S.Title>
          <LinkButton href={`/mailboxes/${mailbox.id}/webhooks/create`}>Create Webhook</LinkButton>
        </S.HeaderRow>
      </S.Header>

      <Card>
        <S.TableWrapper>
          <S.Table>
            <S.TableHead>
              <tr>
                <S.TableHeader>Name</S.TableHeader>
                <S.TableHeader>URL</S.TableHeader>
                <S.TableHeader>Status</S.TableHeader>
                <S.TableHeader>Deliveries</S.TableHeader>
                <S.TableHeader $align="right">Actions</S.TableHeader>
              </tr>
            </S.TableHead>
            <S.TableBody>
              {webhooks.length === 0 ? (
                <tr>
                  <S.EmptyCell colSpan={5}>No webhooks configured</S.EmptyCell>
                </tr>
              ) : (
                webhooks.map((webhook) => (
                  <S.TableRow key={webhook.id}>
                    <S.TableCell>
                      <S.WebhookLink as={Link} href={`/mailboxes/${mailbox.id}/webhooks/${webhook.id}`}>
                        {webhook.name}
                      </S.WebhookLink>
                    </S.TableCell>
                    <S.TableCell>
                      <S.UrlText title={webhook.url}>{webhook.url}</S.UrlText>
                    </S.TableCell>
                    <S.TableCell>
                      <Badge variant={webhook.is_active ? 'success' : 'gray'} dot>
                        {webhook.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </S.TableCell>
                    <S.TableCell>
                      {webhook.delivery_stats && (
                        <S.DeliveryStats>
                          <S.SuccessCount>{webhook.delivery_stats.success_count} ok</S.SuccessCount>
                          <S.FailedCount>{webhook.delivery_stats.failed_count} failed</S.FailedCount>
                          {webhook.delivery_stats.pending_count > 0 && (
                            <S.PendingCount>{webhook.delivery_stats.pending_count} pending</S.PendingCount>
                          )}
                        </S.DeliveryStats>
                      )}
                    </S.TableCell>
                    <S.TableCell $align="right">
                      <S.Actions>
                        <S.IconLink as={Link} href={`/mailboxes/${mailbox.id}/webhooks/${webhook.id}`} title="View">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </S.IconLink>
                        <S.IconLink as={Link} href={`/mailboxes/${mailbox.id}/webhooks/${webhook.id}/deliveries`} title="History">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </S.IconLink>
                        <S.IconLink as={Link} href={`/mailboxes/${mailbox.id}/webhooks/${webhook.id}/edit`} title="Edit">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </S.IconLink>
                        <S.IconButton onClick={() => handleDeleteClick(webhook)} title="Delete" $variant="danger">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </S.IconButton>
                      </S.Actions>
                    </S.TableCell>
                  </S.TableRow>
                ))
              )}
            </S.TableBody>
          </S.Table>
        </S.TableWrapper>
      </Card>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Webhook"
        description={`Are you sure you want to delete the webhook "${deleteModal.webhook?.name}"? All delivery history will be lost.`}
        confirmText="Delete"
        variant="danger"
      />
    </MailboxLayout>
  );
}
