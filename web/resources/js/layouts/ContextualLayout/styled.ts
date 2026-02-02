import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  min-height: calc(100vh - 64px);
  margin: -${({ theme }) => theme.spacing[8]} -${({ theme }) => theme.spacing[4]};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin: -${({ theme }) => theme.spacing[8]} -${({ theme }) => theme.spacing[6]};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    margin: -${({ theme }) => theme.spacing[8]} -${({ theme }) => theme.spacing[8]};
  }
`;

export const Sidebar = styled.aside<{ $isOpen?: boolean }>`
  position: fixed;
  top: 64px;
  left: 0;
  bottom: 0;
  width: 240px;
  padding: ${({ theme }) => theme.spacing[6]} 0;
  border-right: 1px solid ${({ theme }) => theme.colors.border.primary};
  //background: ${({ theme }) => theme.colors.surface.primary};
  display: flex;
  flex-direction: column;
  z-index: 39;
  transition: background-color 0.2s ease, border-color 0.2s ease;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '-100%')});
    transition: transform ${({ theme }) => theme.transitions.smooth}, background-color 0.2s ease;
    box-shadow: ${({ $isOpen, theme }) => ($isOpen ? theme.shadows.lg : 'none')};
    width: 280px;
  }
`;

export const SidebarOverlay = styled.div<{ $isOpen?: boolean }>`
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.3)'};
    z-index: 30;
  }
`;

export const MobileMenuButton = styled.button`
  display: none;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  background: ${({ theme }) => theme.colors.surface.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  &:hover {
    background: ${({ theme }) => theme.colors.interactive.hover};
  }

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
  }
`;

export const BackLink = styled.a`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

export const Switcher = styled.div`
  position: relative;
  padding: 0 ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const SwitcherButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  background: ${({ theme }) => theme.colors.surface.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.interactive.hover};
    border-color: ${({ theme }) => theme.colors.border.secondary};
  }

  svg {
    width: 1rem;
    height: 1rem;
    color: ${({ theme }) => theme.colors.text.tertiary};
  }
`;

export const SwitcherDropdown = styled.div<{ $isOpen?: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  position: absolute;
  top: 100%;
  left: ${({ theme }) => theme.spacing[4]};
  right: ${({ theme }) => theme.spacing[4]};
  margin-top: ${({ theme }) => theme.spacing[1]};
  background: ${({ theme }) => theme.colors.surface.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  z-index: 50;
  max-height: 300px;
  overflow: hidden;
  flex-direction: column;
`;

export const SwitcherSearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  outline: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.primary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }
`;

export const SwitcherList = styled.div`
  overflow-y: auto;
  max-height: 250px;
`;

export const SwitcherOption = styled.a<{ $active?: boolean }>`
  display: block;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme, $active }) => ($active ? theme.colors.primary[500] : theme.colors.text.secondary)};
  background: ${({ theme, $active }) => ($active ? theme.colors.interactive.selected : 'transparent')};
  text-decoration: none;
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.interactive.hover};
  }
`;

export const SwitcherOptionEmpty = styled.div`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[3]}`};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
  text-align: center;
`;

export const SidebarNav = styled.nav`
  flex: 1;
`;

export const SidebarLink = styled.a<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[6]}`};
  color: ${({ theme, $active }) => $active ? theme.colors.primary[500] : theme.colors.text.secondary};
  background: ${({ theme, $active }) => $active ? theme.colors.interactive.selected : 'transparent'};
  border-right: 3px solid ${({ theme, $active }) => $active ? theme.colors.primary[500] : 'transparent'};
  font-weight: ${({ theme, $active }) => $active ? theme.fontWeights.medium : theme.fontWeights.normal};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary[500]};
    background: ${({ theme }) => theme.colors.interactive.selected};
  }
`;

export const Content = styled.div`
  flex: 1;
  margin-left: 240px;
  padding: ${({ theme }) => theme.spacing[8]};
  overflow-x: hidden;
  min-width: 0;
  background: ${({ theme }) => theme.colors.background.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: background-color 0.2s ease;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-left: 0;
    padding: ${({ theme }) => theme.spacing[4]};
  }
`;

export const ContentSheet = styled.div`
  width: 100%;
  max-width: 1000px;
`;
