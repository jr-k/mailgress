import { useState, useMemo } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { LinkButton } from '@/components/Button';
import { ConfirmModal } from '@/components/ConfirmModal';
import { SearchInput } from '@/components/SearchInput';
import { InlineTagSelector } from '@/components/TagSelector';
import { TagFilter, FilterMode } from '@/components/TagFilter';
import { Mailbox, Tag, PageProps } from '@/types';
import * as S from './styled';

interface Props extends PageProps {
  mailboxes: Mailbox[];
  allTags: Tag[];
  mailboxTagsMap: Record<number, Tag[]>;
}

export default function MailboxesIndex({ mailboxes, allTags, mailboxTagsMap }: Props) {
  const { auth } = usePage<Props>().props;
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; mailbox: Mailbox | null }>({
    isOpen: false,
    mailbox: null,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [tagsMap, setTagsMap] = useState(mailboxTagsMap);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [tagFilterMode, setTagFilterMode] = useState<FilterMode>('OR');

  const getEmailAddress = (mailbox: Mailbox) => {
    if (mailbox.domain) {
      return `${mailbox.slug}@${mailbox.domain.name}`;
    }
    return mailbox.slug;
  };

  const filteredMailboxes = useMemo(() => {
    let filtered = mailboxes;

    // Filter by tags
    if (selectedTagIds.length > 0) {
      filtered = filtered.filter((mailbox) => {
        const mailboxTagIds = (tagsMap[mailbox.id] || []).map((t) => t.id);
        if (tagFilterMode === 'AND') {
          return selectedTagIds.every((tagId) => mailboxTagIds.includes(tagId));
        } else {
          return selectedTagIds.some((tagId) => mailboxTagIds.includes(tagId));
        }
      });
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((mailbox) => {
        const email = getEmailAddress(mailbox).toLowerCase();
        const owner = mailbox.owner?.email?.toLowerCase() || '';
        const description = mailbox.description?.toLowerCase() || '';
        return email.includes(lowerSearch) || owner.includes(lowerSearch) || description.includes(lowerSearch);
      });
    }

    return filtered;
  }, [mailboxes, searchTerm, selectedTagIds, tagFilterMode, tagsMap]);

  const handleDeleteClick = (mailbox: Mailbox) => {
    setDeleteModal({ isOpen: true, mailbox });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.mailbox) {
      router.delete(`/mailboxes/${deleteModal.mailbox.id}`, {
        onFinish: () => setDeleteModal({ isOpen: false, mailbox: null }),
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, mailbox: null });
  };

  const handleTagsUpdate = (mailboxId: number, tags: Tag[]) => {
    setTagsMap((prev) => ({ ...prev, [mailboxId]: tags }));
  };

  return (
    <AppLayout>
      <S.Header>
        <S.Title>Mailboxes</S.Title>
        {auth?.user.is_admin && (
          <LinkButton href="/mailboxes/create">Create Mailbox</LinkButton>
        )}
      </S.Header>

      <Card>
        {mailboxes.length === 0 ? (
          <S.EmptyCell as="div" style={{ display: 'block' }}>No mailboxes found</S.EmptyCell>
        ) : (
          <>
            <S.Toolbar>
              <S.FilterGroup>
                <SearchInput
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Filter mailboxes..."
                />
                {allTags && allTags.length > 0 && (
                  <TagFilter
                    allTags={allTags}
                    selectedTagIds={selectedTagIds}
                    onTagsChange={setSelectedTagIds}
                    filterMode={tagFilterMode}
                    onModeChange={setTagFilterMode}
                  />
                )}
              </S.FilterGroup>
              <S.ResultCount>
                {filteredMailboxes.length} of {mailboxes.length} mailbox{mailboxes.length !== 1 ? 'es' : ''}
              </S.ResultCount>
            </S.Toolbar>
            <S.TableWrapper>
              <S.Table>
                <S.TableHead>
                  <tr>
                    <S.TableHeader>Email Address</S.TableHeader>
                    <S.TableHeader>Tags</S.TableHeader>
                    <S.TableHeader>Owner</S.TableHeader>
                    <S.TableHeader $align="center">Emails</S.TableHeader>
                    <S.TableHeader>Status</S.TableHeader>
                    <S.TableHeader $align="right">Actions</S.TableHeader>
                  </tr>
                </S.TableHead>
                <S.TableBody>
                  {filteredMailboxes.length === 0 ? (
                    <tr>
                      <S.EmptyCell colSpan={6}>No mailboxes match your search.</S.EmptyCell>
                    </tr>
                  ) : (
                    filteredMailboxes.map((mailbox) => (
                      <S.TableRow key={mailbox.id}>
                        <S.TableCell>
                          <S.MailboxLink as={Link} href={`/mailboxes/${mailbox.id}`}>
                            {getEmailAddress(mailbox)}
                          </S.MailboxLink>
                          {mailbox.description && (
                            <S.Description>{mailbox.description}</S.Description>
                          )}
                        </S.TableCell>
                        <S.TableCell>
                          <InlineTagSelector
                            entityType="mailbox"
                            entityId={mailbox.id}
                            allTags={allTags || []}
                            currentTags={tagsMap?.[mailbox.id] || []}
                            onUpdate={(tags) => handleTagsUpdate(mailbox.id, tags)}
                          />
                        </S.TableCell>
                        <S.TableCell>
                          <S.EmailCount>{mailbox.owner?.email || '-'}</S.EmailCount>
                        </S.TableCell>
                        <S.TableCell $align="center">
                          <S.EmailCount>{mailbox.stats?.email_count || 0}</S.EmailCount>
                        </S.TableCell>
                        <S.TableCell>
                          <Badge variant={mailbox.is_active ? 'success' : 'gray'} dot>
                            {mailbox.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </S.TableCell>
                        <S.TableCell $align="right">
                          <S.Actions>
                            <S.ActionLink as={Link} href={`/mailboxes/${mailbox.id}`}>
                              View
                            </S.ActionLink>
                            <S.ActionLink as={Link} href={`/mailboxes/${mailbox.id}/webhooks`}>
                              Webhooks
                            </S.ActionLink>
                            {auth?.user.is_admin && (
                              <>
                                <S.ActionLink as={Link} href={`/mailboxes/${mailbox.id}/edit`}>
                                  Edit
                                </S.ActionLink>
                                <S.DeleteButton onClick={() => handleDeleteClick(mailbox)}>
                                  Delete
                                </S.DeleteButton>
                              </>
                            )}
                          </S.Actions>
                        </S.TableCell>
                      </S.TableRow>
                    ))
                  )}
                </S.TableBody>
              </S.Table>
            </S.TableWrapper>
          </>
        )}
      </Card>

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Mailbox"
        description={`Are you sure you want to delete "${deleteModal.mailbox ? getEmailAddress(deleteModal.mailbox) : ''}"? All emails and webhooks will be permanently deleted.`}
        confirmText="Delete"
        variant="danger"
      />
    </AppLayout>
  );
}
