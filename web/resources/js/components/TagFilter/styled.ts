import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
`;

export const FilterInput = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  min-width: 200px;
  min-height: 38px;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  background: ${({ theme }) => theme.colors.surface.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.border.secondary};
  }

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.border.focus};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary[500]}30;
  }
`;

export const Placeholder = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  flex: 1;
`;

export const SelectedTags = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  flex: 1;
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const TagWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

export const ModeButton = styled.button<{ $mode: 'AND' | 'OR' }>`
  padding: 1px 4px;
  font-size: 10px;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.tertiary};
  background: ${({ theme }) => theme.colors.interactive.hover};
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;
  text-transform: uppercase;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.text.secondary};
    background: ${({ theme }) => theme.colors.interactive.active};
  }
`;

export const TagWithRemove = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 2px;
`;

export const RemoveTagButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  padding: 0;
  background: ${({ theme }) => theme.colors.interactive.active};
  color: ${({ theme }) => theme.colors.text.secondary};
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 10px;
  line-height: 1;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.border.secondary};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export const ClearButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  background: ${({ theme }) => theme.colors.interactive.active};
  color: ${({ theme }) => theme.colors.text.secondary};
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 12px;
  line-height: 1;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.border.secondary};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export const DropdownArrow = styled.span<{ $open: boolean }>`
  display: flex;
  color: ${({ theme }) => theme.colors.text.muted};
  transition: transform ${({ theme }) => theme.transitions.fast};
  transform: ${({ $open }) => $open ? 'rotate(180deg)' : 'rotate(0)'};
`;

export const Dropdown = styled.div`
  position: fixed;
  z-index: 9999;
  max-height: 300px;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.surface.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

export const DropdownHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[5]};
  padding: ${({ theme }) => theme.spacing[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

export const DropdownTitle = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.tertiary};
  text-transform: uppercase;
`;

export const ModeToggle = styled.div`
  display: flex;
  gap: 2px;
  padding: 2px;
  background: ${({ theme }) => theme.colors.interactive.hover};
  border-radius: ${({ theme }) => theme.radii.md};
`;

export const ModeOption = styled.button<{ $active: boolean }>`
  padding: 4px 8px;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme, $active }) => $active ? theme.colors.text.primary : theme.colors.text.tertiary};
  background: ${({ theme, $active }) => $active ? theme.colors.surface.primary : 'transparent'};
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  box-shadow: ${({ $active, theme }) => $active ? theme.shadows.sm : 'none'};

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export const TagList = styled.div`
  padding: ${({ theme }) => theme.spacing[2]};
`;

export const TagOption = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  width: 100%;
  padding: ${({ theme }) => theme.spacing[2]};
  background: ${({ theme, $selected }) => $selected ? theme.colors.interactive.hover : 'transparent'};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  text-align: left;
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.interactive.hover};
  }
`;

export const CheckboxIndicator = styled.div<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 2px solid ${({ theme, $checked }) => $checked ? theme.colors.primary[500] : theme.colors.border.secondary};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme, $checked }) => $checked ? theme.colors.primary[500] : 'transparent'};
  color: white;
  flex-shrink: 0;
  transition: all ${({ theme }) => theme.transitions.fast};
`;

export const EmptyMessage = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  text-align: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;
