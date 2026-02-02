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
                    <S.TableHeader>Emails</S.TableHeader>
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
                        <S.TableCell>
                          <S.EmailCount>{mailbox.stats?.email_count || 0}</S.EmailCount>
                        </S.TableCell>
                        <S.TableCell>
                          <Badge variant={mailbox.is_active ? 'success' : 'gray'} dot>
                            {mailbox.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </S.TableCell>
                        <S.TableCell $align="right">
                          <S.Actions>
                            <S.IconButton as={Link} href={`/mailboxes/${mailbox.id}`} title="View">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                              </svg>
                            </S.IconButton>
                            <S.IconButton as={Link} href={`/mailboxes/${mailbox.id}/webhooks`} title="Webhooks">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                              </svg>
                            </S.IconButton>
                            {auth?.user.is_admin && (
                              <>
                                <S.IconButton as={Link} href={`/mailboxes/${mailbox.id}/edit`} title="Settings">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="3"/>
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                                  </svg>
                                </S.IconButton>
                                <S.IconDeleteButton onClick={() => handleDeleteClick(mailbox)} title="Delete">
                                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"/>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                    <line x1="10" y1="11" x2="10" y2="17"/>
                                    <line x1="14" y1="11" x2="14" y2="17"/>
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
