import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/AppLayout';
import { Card } from '@/components/Card';
import { LinkButton } from '@/components/Button';
import { ConfirmModal } from '@/components/ConfirmModal';
import { SearchInput } from '@/components/SearchInput';
import { useFilter } from '@/hooks/useFilter';
import { TagWithUsage, PageProps } from '@/types';
import * as S from './styled';

interface Props extends PageProps {
  tags: TagWithUsage[];
}

export default function TagsIndex({ tags }: Props) {
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; tag: TagWithUsage | null }>({
    isOpen: false,
    tag: null,
  });

  const { searchTerm, setSearchTerm, filteredItems: filteredTags } = useFilter({
    items: tags,
    searchFields: ['name'],
  });

  const handleDeleteClick = (tag: TagWithUsage) => {
    setDeleteModal({ isOpen: true, tag });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.tag) {
      router.delete(`/tags/${deleteModal.tag.id}`, {
        onFinish: () => setDeleteModal({ isOpen: false, tag: null }),
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, tag: null });
  };

  return (
    <AppLayout>
      <S.Header>
        <S.Title>Tags</S.Title>
        <LinkButton href="/tags/create">Create Tag</LinkButton>
      </S.Header>

      <Card>
        {tags.length === 0 ? (
          <S.EmptyState>
            No tags found. Create a tag to organize your domains and mailboxes.
          </S.EmptyState>
        ) : (
          <>
            <S.Toolbar>
              <SearchInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Filter tags..."
              />
              <S.ResultCount>
                {filteredTags.length} of {tags.length} tag{tags.length !== 1 ? 's' : ''}
              </S.ResultCount>
            </S.Toolbar>
            <S.TableWrapper>
              <S.Table>
                <S.TableHead>
                  <tr>
                    <S.TableHeader>Name</S.TableHeader>
                    <S.TableHeader>Color</S.TableHeader>
                    <S.TableHeader>Usage</S.TableHeader>
                    <S.TableHeader $align="right">Actions</S.TableHeader>
                  </tr>
                </S.TableHead>
                <S.TableBody>
                  {filteredTags.length === 0 ? (
                    <tr>
                      <S.TableCell colSpan={4} style={{ textAlign: 'center', padding: '3rem' }}>
                        No tags match your search.
                      </S.TableCell>
                    </tr>
                  ) : (
                    filteredTags.map((tag) => (
                      <S.TableRow key={tag.id}>
                        <S.TableCell>
                          <S.TagName>
                            <S.ColorPreview $color={tag.color} />
                            {tag.name}
                          </S.TagName>
                        </S.TableCell>
                        <S.TableCell>
                          <code>{tag.color}</code>
                        </S.TableCell>
                        <S.TableCell>
                          <S.UsageCount>
                            {tag.usage_count} item{tag.usage_count !== 1 ? 's' : ''}
                          </S.UsageCount>
                        </S.TableCell>
                        <S.TableCell $align="right">
                          <S.Actions>
                            <S.IconButton as={Link} href={`/tags/${tag.id}/edit`} title="Edit">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                              </svg>
                            </S.IconButton>
                            <S.IconDeleteButton onClick={() => handleDeleteClick(tag)} title="Delete">
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
        title="Delete Tag"
        description={`Are you sure you want to delete "${deleteModal.tag?.name}"? This will remove the tag from all domains and mailboxes.`}
        confirmText="Delete"
        variant="danger"
      />
    </AppLayout>
  );
}
