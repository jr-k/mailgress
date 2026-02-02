import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Tag } from '@/types';
import { TagBadge } from '@/components/TagBadge';
import * as S from './styled';

export type FilterMode = 'AND' | 'OR';

interface TagFilterProps {
  allTags: Tag[];
  selectedTagIds: number[];
  filterMode: FilterMode;
  onTagsChange: (tagIds: number[]) => void;
  onModeChange: (mode: FilterMode) => void;
  placeholder?: string;
}

export function TagFilter({
  allTags,
  selectedTagIds,
  filterMode,
  onTagsChange,
  onModeChange,
  placeholder = 'Filter by tags...',
}: TagFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedTags = allTags.filter((t) => selectedTagIds.includes(t.id));

  const handleToggleTag = (tagId: number) => {
    if (selectedTagIds.includes(tagId)) {
      onTagsChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onTagsChange([...selectedTagIds, tagId]);
    }
  };

  const handleClear = () => {
    onTagsChange([]);
  };

  const handleOpenDropdown = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <S.Container ref={containerRef}>
      <S.FilterInput onClick={handleOpenDropdown}>
        {selectedTags.length === 0 ? (
          <S.Placeholder>{placeholder}</S.Placeholder>
        ) : (
          <S.SelectedTags>
            {selectedTags.map((tag, index) => (
              <S.TagWrapper key={tag.id}>
                {index > 0 && (
                  <S.ModeButton
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onModeChange(filterMode === 'AND' ? 'OR' : 'AND');
                    }}
                    $mode={filterMode}
                  >
                    {filterMode}
                  </S.ModeButton>
                )}
                <TagBadge tag={tag} />
              </S.TagWrapper>
            ))}
          </S.SelectedTags>
        )}
        {selectedTags.length > 0 && (
          <S.ClearButton
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
          >
            &times;
          </S.ClearButton>
        )}
        <S.DropdownArrow $open={isOpen}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </S.DropdownArrow>
      </S.FilterInput>

      {isOpen && createPortal(
        <S.Dropdown
          ref={dropdownRef}
          style={{ top: dropdownPosition.top, left: dropdownPosition.left, minWidth: dropdownPosition.width }}
        >
          {allTags.length === 0 ? (
            <S.EmptyMessage>No tags available</S.EmptyMessage>
          ) : (
            <>
              <S.DropdownHeader>
                <S.DropdownTitle>Filter by tags</S.DropdownTitle>
                <S.ModeToggle>
                  <S.ModeOption
                    type="button"
                    $active={filterMode === 'AND'}
                    onClick={() => onModeChange('AND')}
                  >
                    AND
                  </S.ModeOption>
                  <S.ModeOption
                    type="button"
                    $active={filterMode === 'OR'}
                    onClick={() => onModeChange('OR')}
                  >
                    OR
                  </S.ModeOption>
                </S.ModeToggle>
              </S.DropdownHeader>
              <S.TagList>
                {allTags.map((tag) => (
                  <S.TagOption
                    key={tag.id}
                    type="button"
                    onClick={() => handleToggleTag(tag.id)}
                    $selected={selectedTagIds.includes(tag.id)}
                  >
                    <S.CheckboxIndicator $checked={selectedTagIds.includes(tag.id)}>
                      {selectedTagIds.includes(tag.id) && (
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </S.CheckboxIndicator>
                    <TagBadge tag={tag} />
                  </S.TagOption>
                ))}
              </S.TagList>
            </>
          )}
        </S.Dropdown>,
        document.body
      )}
    </S.Container>
  );
}
