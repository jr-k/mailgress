import { useState } from 'react';
import { Link } from '@inertiajs/react';
import MailboxLayout from '@/layouts/MailboxLayout';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { LinkButton } from '@/components/Button';
import { Mailbox, Webhook, WebhookDelivery, Pagination, PageProps } from '@/types';
import * as S from './styled';

interface Props extends PageProps {
  mailbox: Mailbox;
  allMailboxes: Mailbox[];
  webhook: Webhook;
  deliveries: WebhookDelivery[];
  pagination: Pagination;
}

export default function WebhookDeliveries({ mailbox, allMailboxes, webhook, deliveries, pagination }: Props) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleRetry = async (deliveryId: number) => {
    await fetch(`/deliveries/${deliveryId}/retry`, { method: 'POST' });
    window.location.reload();
  };

  const handleCancelRetrying = async () => {
    if (!confirm('Are you sure you want to cancel all retrying deliveries?')) return;
    setLoading('cancel');
    await fetch(`/mailboxes/${mailbox.id}/webhooks/${webhook.id}/deliveries/cancel-retrying`, { method: 'POST' });
    window.location.reload();
  };

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to delete ALL delivery history? This cannot be undone.')) return;
    setLoading('delete');
    await fetch(`/mailboxes/${mailbox.id}/webhooks/${webhook.id}/deliveries`, { method: 'DELETE' });
    window.location.reload();
  };

  const hasRetrying = deliveries.some(d => d.status === 'retrying');

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  const getStatusVariant = (status: string): 'success' | 'error' | 'warning' | 'gray' => {
    switch (status) {
      case 'success':
        return 'success';
      case 'failed':
        return 'error';
      case 'pending':
      case 'retrying':
        return 'warning';
      default:
        return 'gray';
    }
  };

  return (
    <MailboxLayout mailbox={mailbox} allMailboxes={allMailboxes}>
      <S.Header>
        <div>
          <S.Title>Delivery History</S.Title>
          <S.Subtitle>{webhook.name}</S.Subtitle>
        </div>
        <S.HeaderActions>
          {hasRetrying && (
            <S.WarningButton onClick={handleCancelRetrying} disabled={loading !== null}>
              {loading === 'cancel' ? 'Cancelling...' : 'Cancel Retrying'}
            </S.WarningButton>
          )}
          {deliveries.length > 0 && (
            <S.DangerButton onClick={handleDeleteAll} disabled={loading !== null}>
              {loading === 'delete' ? 'Deleting...' : 'Delete All'}
            </S.DangerButton>
          )}
          <LinkButton href={`/mailboxes/${mailbox.id}/webhooks/${webhook.id}`} variant="secondary">
            Back to Information
          </LinkButton>
        </S.HeaderActions>
      </S.Header>

      <Card>
        <S.TableWrapper>
          <S.Table>
            <S.TableHead>
              <tr>
                <S.TableHeader>Date</S.TableHeader>
                <S.TableHeader>Status</S.TableHeader>
                <S.TableHeader>HTTP Code</S.TableHeader>
                <S.TableHeader>Duration</S.TableHeader>
                <S.TableHeader>Attempt</S.TableHeader>
                <S.TableHeader $align="right">Actions</S.TableHeader>
              </tr>
            </S.TableHead>
            <S.TableBody>
              {deliveries.length === 0 ? (
                <tr>
                  <S.EmptyCell colSpan={6}>No deliveries yet</S.EmptyCell>
                </tr>
              ) : (
                deliveries.map((delivery) => (
                  <S.TableRow key={delivery.id}>
                    <S.TableCell>{formatDate(delivery.created_at)}</S.TableCell>
                    <S.TableCell>
                      <Badge variant={getStatusVariant(delivery.status)}>{delivery.status}</Badge>
                    </S.TableCell>
                    <S.TableCell>
                      <S.GrayText>{delivery.status_code || '-'}</S.GrayText>
                    </S.TableCell>
                    <S.TableCell>
                      <S.GrayText>
                        {delivery.duration_ms ? `${delivery.duration_ms}ms` : '-'}
                      </S.GrayText>
                    </S.TableCell>
                    <S.TableCell>
                      <S.GrayText>{delivery.attempt}</S.GrayText>
                    </S.TableCell>
                    <S.TableCell $align="right">
                      <S.ActionLinks>
                        <S.ViewEmailLink href={`/mailboxes/${mailbox.id}?email_id=${delivery.email_id}`}>
                          View Email
                        </S.ViewEmailLink>
                        {delivery.status === 'failed' && (
                          <S.RetryButton onClick={() => handleRetry(delivery.id)}>
                            Retry
                          </S.RetryButton>
                        )}
                      </S.ActionLinks>
                    </S.TableCell>
                  </S.TableRow>
                ))
              )}
            </S.TableBody>
          </S.Table>

          {pagination.total > pagination.per_page && (() => {
            const totalPages = Math.ceil(pagination.total / pagination.per_page);
            const current = pagination.current_page;
            const baseUrl = `/mailboxes/${mailbox.id}/webhooks/${webhook.id}/deliveries`;
            const from = (current - 1) * pagination.per_page + 1;
            const to = Math.min(current * pagination.per_page, pagination.total);

            const pages: (number | 'ellipsis')[] = [];
            pages.push(1);
            if (current > 3) pages.push('ellipsis');
            for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) {
              pages.push(i);
            }
            if (current < totalPages - 2) pages.push('ellipsis');
            if (totalPages > 1) pages.push(totalPages);

            return (
              <S.Pagination>
                <S.PageInfo>
                  {from}-{to} of {pagination.total.toLocaleString()}
                </S.PageInfo>
                <S.PageLinks>
                  {current > 1 && (
                    <S.PageLink as={Link} href={`${baseUrl}?page=${current - 1}`}>
                      &laquo;
                    </S.PageLink>
                  )}
                  {pages.map((page, idx) =>
                    page === 'ellipsis' ? (
                      <S.PageEllipsis key={`ellipsis-${idx}`}>&hellip;</S.PageEllipsis>
                    ) : (
                      <S.PageLink
                        key={page}
                        as={Link}
                        href={`${baseUrl}?page=${page}`}
                        $active={page === current}
                      >
                        {page}
                      </S.PageLink>
                    )
                  )}
                  {current < totalPages && (
                    <S.PageLink as={Link} href={`${baseUrl}?page=${current + 1}`}>
                      &raquo;
                    </S.PageLink>
                  )}
                </S.PageLinks>
              </S.Pagination>
            );
          })()}
        </S.TableWrapper>
      </Card>
    </MailboxLayout>
  );
}
