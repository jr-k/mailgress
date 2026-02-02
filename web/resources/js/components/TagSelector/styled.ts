import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
`;

export const SelectedTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
  align-items: center;
`;

export const SelectedTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

export const RemoveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: none;
  background: ${({ theme }) => theme.colors.gray[200]};
  color: ${({ theme }) => theme.colors.gray[600]};
  border-radius: 50%;
  cursor: pointer;
  font-size: 12px;
  line-height: 1;
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[300]};
    color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

export const AddButton = styled.button`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  background: transparent;
  border: 1px dashed ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.gray[400]};
    color: ${({ theme }) => theme.colors.gray[600]};
  }
`;

export const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  min-width: 200px;
  max-height: 240px;
  overflow-y: auto;
  margin-top: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[2]};
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

export const PortalDropdown = styled.div`
  position: fixed;
  z-index: 9999;
  min-width: 180px;
  max-height: 200px;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing[1]};
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

export const DropdownItem = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  width: 100%;
  padding: ${({ theme }) => theme.spacing[2]};
  background: ${({ theme, $selected }) => ($selected ? theme.colors.gray[50] : 'transparent')};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.fast};
  text-align: left;

  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
  }
`;

export const CheckboxIndicator = styled.div<{ $checked: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: 2px solid ${({ theme, $checked }) => $checked ? theme.colors.primary[500] : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme, $checked }) => $checked ? theme.colors.primary[500] : 'transparent'};
  color: white;
  flex-shrink: 0;
  transition: all ${({ theme }) => theme.transitions.fast};
`;

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

export const EmptyMessage = styled.div`
  padding: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[500]};
  text-align: center;
`;

export const InlineContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

export const InlineAddButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[400]};
  background: transparent;
  border: 1px dashed ${({ theme }) => theme.colors.gray[300]};
  border-radius: 50%;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.gray[400]};
    color: ${({ theme }) => theme.colors.gray[600]};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const InlineDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  min-width: 180px;
  max-height: 200px;
  overflow-y: auto;
  margin-top: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]};
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;
