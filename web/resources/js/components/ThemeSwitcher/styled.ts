import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  background: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.interactive.hover};
    border-color: ${({ theme }) => theme.colors.border.secondary};
  }

  &:focus {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus} ${({ theme }) => theme.colors.primary[500]}40;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

export const Dropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 50;
  min-width: 140px;
  margin-top: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]};
  background: ${({ theme }) => theme.colors.surface.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

export const Option = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  background: ${({ theme, $active }) => $active ? theme.colors.interactive.selected : 'transparent'};
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme, $active }) => $active ? theme.colors.primary[500] : theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  text-align: left;

  &:hover {
    background: ${({ theme }) => theme.colors.interactive.hover};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  svg {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }
`;
