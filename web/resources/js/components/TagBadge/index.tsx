import { Tag } from '@/types';
import * as S from './styled';

interface TagBadgeProps {
  tag: Tag;
  showDot?: boolean;
}

export function TagBadge({ tag, showDot = true }: TagBadgeProps) {
  return (
    <S.TagBadge $color={tag.color}>
      {showDot && <S.ColorDot $color={tag.color} />}
      {tag.name}
    </S.TagBadge>
  );
}

interface TagsListProps {
  tags: Tag[];
}

export function TagsList({ tags }: TagsListProps) {
  if (tags.length === 0) return null;

  return (
    <S.TagsContainer>
      {tags.map((tag) => (
        <TagBadge key={tag.id} tag={tag} />
      ))}
    </S.TagsContainer>
  );
}
