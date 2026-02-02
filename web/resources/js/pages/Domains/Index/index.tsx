import { useState, useMemo } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { LinkButton } from '@/components/Button';
import { ConfirmModal } from '@/components/ConfirmModal';
import { SearchInput } from '@/components/SearchInput';
import { InlineTagSelector } from '@/components/TagSelector';
import { TagFilter, FilterMode } from '@/components/TagFilter';
import { Domain, Tag, PageProps } from '@/types';
import * as S from './styled';

interface Props extends PageProps {
  domains: Domain[];
  allTags: Tag[];
  domainTagsMap: Record<number, Tag[]>;
}

export default function DomainsIndex({ domains, allTags, domainTagsMap }: Props) {
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; domain: Domain | null }>({
    isOpen: false,
    domain: null,
  });
  const [tagsMap, setTagsMap] = useState(domainTagsMap);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [tagFilterMode, setTagFilterMode] = useState<FilterMode>('AND');

  const filteredDomains = useMemo(() => {
    let filtered = domains;

    // Text search filter
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((domain) =>
        domain.name.toLowerCase().includes(lowerSearch)
      );
    }

    // Tag filter
    if (selectedTagIds.length > 0) {
      filtered = filtered.filter((domain) => {
        const domainTags = tagsMap[domain.id] || [];
        const domainTagIds = domainTags.map((t) => t.id);

        if (tagFilterMode === 'AND') {
          return selectedTagIds.every((tagId) => domainTagIds.includes(tagId));
        } else {
          return selectedTagIds.some((tagId) => domainTagIds.includes(tagId));
        }
      });
    }

    return filtered;
  }, [domains, searchTerm, selectedTagIds, tagFilterMode, tagsMap]);

  const handleDeleteClick = (domain: Domain) => {
    setDeleteModal({ isOpen: true, domain });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.domain) {
      router.delete(`/domains/${deleteModal.domain.id}`, {
        onFinish: () => setDeleteModal({ isOpen: false, domain: null }),
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, domain: null });
  };

  const handleTagsUpdate = (domainId: number, tags: Tag[]) => {
    setTagsMap((prev) => ({ ...prev, [domainId]: tags }));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <AppLayout>
      <S.Header>
        <S.Title>Domains</S.Title>
        <LinkButton href="/domains/create">Add Domain</LinkButton>
      </S.Header>

      <Card>
        {domains.length === 0 ? (
          <S.EmptyState>
            <S.EmptyStateText>
              No domains configured. Add a domain to start receiving emails.
            </S.EmptyStateText>
            <LinkButton href="/domains/create">Add Domain</LinkButton>
          </S.EmptyState>
        ) : (
          <>
            <S.Toolbar>
              <S.FilterGroup>
                <SearchInput
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Filter domains..."
                />
                {allTags.length > 0 && (
                  <TagFilter
                    allTags={allTags}
                    selectedTagIds={selectedTagIds}
                    filterMode={tagFilterMode}
                    onTagsChange={setSelectedTagIds}
                    onModeChange={setTagFilterMode}
                    placeholder="Filter by tags..."
                  />
                )}
              </S.FilterGroup>
              <S.ResultCount>
                {filteredDomains.length} of {domains.length} domain{domains.length !== 1 ? 's' : ''}
              </S.ResultCount>
            </S.Toolbar>
            <S.TableWrapper>
              <S.Table>
                <S.TableHead>
                  <tr>
                    <S.TableHeader>Domain</S.TableHeader>
                    <S.TableHeader>Tags</S.TableHeader>
                    <S.TableHeader>Status</S.TableHeader>
                    <S.TableHeader>Verified</S.TableHeader>
                    <S.TableHeader>Created</S.TableHeader>
                    <S.TableHeader $align="right">Actions</S.TableHeader>
                  </tr>
                </S.TableHead>
                <S.TableBody>
                  {filteredDomains.length === 0 ? (
                    <tr>
                      <S.TableCell colSpan={6} style={{ textAlign: 'center', padding: '3rem' }}>
                        No domains match your search.
                      </S.TableCell>
                    </tr>
                  ) : (
                    filteredDomains.map((domain) => (
                      <S.TableRow key={domain.id}>
                        <S.TableCell>
                          <S.DomainLink as={Link} href={`/domains/${domain.id}`}>
                            {domain.name}
                          </S.DomainLink>
                        </S.TableCell>
                        <S.TableCell>
                          <InlineTagSelector
                            entityType="domain"
                            entityId={domain.id}
                            allTags={allTags}
                            currentTags={tagsMap[domain.id] || []}
                            onUpdate={(tags) => handleTagsUpdate(domain.id, tags)}
                          />
                        </S.TableCell>
                        <S.TableCell>
                          <Badge variant={domain.is_active ? 'success' : 'gray'} dot>
                            {domain.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </S.TableCell>
                        <S.TableCell>
                          <Badge variant={domain.is_verified ? 'success' : 'warning'} dot>
                            {domain.is_verified ? 'Verified' : 'Pending'}
                          </Badge>
                        </S.TableCell>
                        <S.TableCell>
                          <S.DateText>{formatDate(domain.created_at)}</S.DateText>
                        </S.TableCell>
                        <S.TableCell $align="right">
                          <S.Actions>
                            <S.IconButton as={Link} href={`/domains/${domain.id}`} title="DNS">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                                <line x1="8" y1="21" x2="16" y2="21"/>
                                <line x1="12" y1="17" x2="12" y2="21"/>
                              </svg>
                            </S.IconButton>
                            <S.IconButton as={Link} href={`/domains/${domain.id}/edit`} title="Edit">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                            </S.IconButton>
                            <S.IconDeleteButton onClick={() => handleDeleteClick(domain)} title="Delete">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                <line x1="10" y1="11" x2="10" y2="17"/>
                                <line x1="14" y1="11" x2="14" y2="17"/>
                              </svg>
                            </S.IconDeleteButton>
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
        title="Delete Domain"
        description={`Are you sure you want to delete "${deleteModal.domain?.name}"? All associated mailboxes will be affected.`}
        confirmText="Delete"
        variant="danger"
      />
    </AppLayout>
  );
}
