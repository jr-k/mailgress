import { Link } from '@inertiajs/react';
import MailboxLayout from '@/layouts/MailboxLayout';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
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
  const handleRetry = async (deliveryId: number) => {
    await fetch(`/deliveries/${deliveryId}/retry`, { method: 'POST' });
    window.location.reload();
  };

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
        <S.Title>Delivery History</S.Title>
        <S.Subtitle>{webhook.name}</S.Subtitle>
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
                      {delivery.status === 'failed' && (
                        <S.RetryButton onClick={() => handleRetry(delivery.id)}>
                          Retry
                        </S.RetryButton>
                      )}
                    </S.TableCell>
                  </S.TableRow>
                ))
              )}
            </S.TableBody>
          </S.Table>

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
                    href={`/mailboxes/${mailbox.id}/webhooks/${webhook.id}/deliveries?page=${
                      pagination.current_page - 1
                    }`}
                  >
                    Previous
                  </S.PageLink>
                )}
                {pagination.current_page < Math.ceil(pagination.total / pagination.per_page) && (
                  <S.PageLink
                    as={Link}
                    href={`/mailboxes/${mailbox.id}/webhooks/${webhook.id}/deliveries?page=${
                      pagination.current_page + 1
                    }`}
                  >
                    Next
                  </S.PageLink>
                )}
              </S.PageLinks>
            </S.Pagination>
          )}
        </S.TableWrapper>
      </Card>
    </MailboxLayout>
  );
}
