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
  webhooks: Webhook[];
}

export default function WebhooksIndex({ mailbox, webhooks }: Props) {
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
    <MailboxLayout mailbox={mailbox}>
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
                        <S.ActionLink as={Link} href={`/mailboxes/${mailbox.id}/webhooks/${webhook.id}/deliveries`}>
                          History
                        </S.ActionLink>
                        <S.ActionLink as={Link} href={`/mailboxes/${mailbox.id}/webhooks/${webhook.id}/edit`}>
                          Edit
                        </S.ActionLink>
                        <S.DeleteButton onClick={() => handleDeleteClick(webhook)}>
                          Delete
                        </S.DeleteButton>
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
