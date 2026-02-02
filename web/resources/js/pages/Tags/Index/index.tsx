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
                            <S.ActionLink as={Link} href={`/tags/${tag.id}/edit`}>
                              Edit
                            </S.ActionLink>
                            <S.DeleteButton onClick={() => handleDeleteClick(tag)}>
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
        title="Delete Tag"
        description={`Are you sure you want to delete "${deleteModal.tag?.name}"? This will remove the tag from all domains and mailboxes.`}
        confirmText="Delete"
        variant="danger"
      />
    </AppLayout>
  );
}
