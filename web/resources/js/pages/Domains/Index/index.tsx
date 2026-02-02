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
                            <S.ActionLink as={Link} href={`/domains/${domain.id}`}>
                              DNS
                            </S.ActionLink>
                            <S.ActionLink as={Link} href={`/domains/${domain.id}/edit`}>
                              Edit
                            </S.ActionLink>
                            <S.DeleteButton onClick={() => handleDeleteClick(domain)}>
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
