import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Tag } from '@/types';
import { TagBadge } from '@/components/TagBadge';
import * as S from './styled';

interface TagSelectorProps {
  allTags: Tag[];
  selectedTags: Tag[];
  onChange: (tagIds: number[]) => void;
  disabled?: boolean;
}

export function TagSelector({ allTags, selectedTags, onChange, disabled }: TagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedIds = new Set(selectedTags.map((t) => t.id));

  const handleToggle = (tagId: number) => {
    const newIds = selectedIds.has(tagId)
      ? Array.from(selectedIds).filter((id) => id !== tagId)
      : [...Array.from(selectedIds), tagId];
    onChange(newIds);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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
      <S.SelectedTags>
        {selectedTags.map((tag) => (
          <TagBadge key={tag.id} tag={tag} />
        ))}
        {!disabled && (
          <S.AddButton onClick={() => setIsOpen(!isOpen)} type="button">
            + Add Tag
          </S.AddButton>
        )}
      </S.SelectedTags>

      {isOpen && !disabled && (
        <S.Dropdown>
          {allTags.length === 0 ? (
            <S.EmptyMessage>No tags available</S.EmptyMessage>
          ) : (
            allTags.map((tag) => (
              <S.DropdownItem
                key={tag.id}
                type="button"
                onClick={() => handleToggle(tag.id)}
                $selected={selectedIds.has(tag.id)}
              >
                <S.CheckboxIndicator $checked={selectedIds.has(tag.id)}>
                  {selectedIds.has(tag.id) && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </S.CheckboxIndicator>
                <TagBadge tag={tag} />
              </S.DropdownItem>
            ))
          )}
        </S.Dropdown>
      )}
    </S.Container>
  );
}

interface InlineTagSelectorProps {
  entityType: 'domain' | 'mailbox';
  entityId: number;
  allTags: Tag[];
  currentTags: Tag[];
  onUpdate?: (tags: Tag[]) => void;
}

export function InlineTagSelector({
  entityType,
  entityId,
  allTags,
  currentTags,
  onUpdate,
}: InlineTagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tags, setTags] = useState(currentTags);
  const [saving, setSaving] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedIds = new Set(tags.map((t) => t.id));

  const handleToggle = async (tagId: number) => {
    const newIds = selectedIds.has(tagId)
      ? Array.from(selectedIds).filter((id) => id !== tagId)
      : [...Array.from(selectedIds), tagId];

    setSaving(true);
    try {
      // Get CSRF token from cookie
      const token = document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1];

      const endpoint = entityType === 'mailbox' ? 'mailboxes' : 'domains';
      const response = await fetch(`/${endpoint}/${entityId}/tags`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': token ? decodeURIComponent(token) : '',
        },
        body: JSON.stringify({ tag_ids: newIds }),
      });

      if (response.ok) {
        const data = await response.json();
        setTags(data.tags || []);
        onUpdate?.(data.tags || []);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleOpenDropdown = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
      });
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
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
    <S.InlineContainer>
      {tags.map((tag) => (
        <TagBadge key={tag.id} tag={tag} />
      ))}
      <S.InlineAddButton
        ref={buttonRef}
        onClick={handleOpenDropdown}
        type="button"
        disabled={saving}
      >
        +
      </S.InlineAddButton>

      {isOpen && createPortal(
        <S.PortalDropdown
          ref={dropdownRef}
          style={{ top: dropdownPosition.top, left: dropdownPosition.left }}
          onMouseDown={(e) => e.nativeEvent.stopImmediatePropagation()}
        >
          {allTags.length === 0 ? (
            <S.EmptyMessage>No tags</S.EmptyMessage>
          ) : (
            allTags.map((tag) => (
              <S.DropdownItem
                key={tag.id}
                type="button"
                onClick={() => handleToggle(tag.id)}
                $selected={selectedIds.has(tag.id)}
              >
                <S.CheckboxIndicator $checked={selectedIds.has(tag.id)}>
                  {selectedIds.has(tag.id) && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </S.CheckboxIndicator>
                <TagBadge tag={tag} />
              </S.DropdownItem>
            ))
          )}
        </S.PortalDropdown>,
        document.body
      )}
    </S.InlineContainer>
  );
}
