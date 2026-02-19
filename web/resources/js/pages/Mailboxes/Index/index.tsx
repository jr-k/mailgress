import { useState, useMemo } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Card } from '@/components/Card';
import { LinkButton } from '@/components/Button';
import { ConfirmModal } from '@/components/ConfirmModal';
import { SearchInput } from '@/components/SearchInput';
import { InlineTagSelector } from '@/components/TagSelector';
import { TagFilter, FilterMode } from '@/components/TagFilter';
import { ToggleSwitch } from '@/components/ToggleSwitch';
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
  const [togglingId, setTogglingId] = useState<number | null>(null);
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

  const handleToggleActive = (mailbox: Mailbox) => {
    setTogglingId(mailbox.id);
    router.post(`/mailboxes/${mailbox.id}/toggle`, {}, {
      preserveScroll: true,
      onFinish: () => setTogglingId(null),
    });
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
                          {auth?.user.is_admin ? (
                            <ToggleSwitch
                              active={mailbox.is_active}
                              disabled={togglingId === mailbox.id}
                              onClick={() => handleToggleActive(mailbox)}
                            />
                          ) : (
                            <ToggleSwitch
                              active={mailbox.is_active}
                              disabled
                              onClick={() => {}}
                            />
                          )}
                        </S.TableCell>
                        <S.TableCell $align="right">
                          <S.Actions>
                            <S.IconButton as={Link} href={`/mailboxes/${mailbox.id}`} title="View Inbox">
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </S.IconButton>
                            <S.IconButton as={Link} href={`/mailboxes/${mailbox.id}/webhooks`} title="Webhooks">
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                              </svg>
                            </S.IconButton>
                            {auth?.user.is_admin && (
                              <>
                                <S.IconButton as={Link} href={`/mailboxes/${mailbox.id}/edit`} title="Edit">
                                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </S.IconButton>
                                <S.IconDeleteButton onClick={() => handleDeleteClick(mailbox)} title="Delete">
                                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </S.IconDeleteButton>
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
