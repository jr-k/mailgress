import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  min-height: calc(100vh - 64px);
`;

export const Sidebar = styled.aside<{ $isOpen?: boolean }>`
  width: 240px;
  padding: ${({ theme }) => theme.spacing[4]} 0;
  border-right: 1px solid ${({ theme }) => theme.colors.gray[200]};
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-direction: column;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    position: fixed;
    top: 64px;
    left: 0;
    bottom: 0;
    z-index: 40;
    transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '-100%')});
    transition: transform ${({ theme }) => theme.transitions.smooth};
    box-shadow: ${({ $isOpen, theme }) => ($isOpen ? theme.shadows.lg : 'none')};
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
    background: rgba(0, 0, 0, 0.3);
    z-index: 30;
  }
`;

export const MobileMenuButton = styled.button`
  display: none;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
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
  color: ${({ theme }) => theme.colors.gray[500]};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.gray[700]};
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

export const MailboxSwitcher = styled.div`
  position: relative;
  padding: 0 ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const MailboxSwitcherButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  background: ${({ theme }) => theme.colors.gray[50]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[900]};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
    border-color: ${({ theme }) => theme.colors.gray[300]};
  }

  svg {
    width: 1rem;
    height: 1rem;
    color: ${({ theme }) => theme.colors.gray[500]};
  }
`;

export const MailboxSwitcherDropdown = styled.div<{ $isOpen?: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  position: absolute;
  top: 100%;
  left: ${({ theme }) => theme.spacing[4]};
  right: ${({ theme }) => theme.spacing[4]};
  margin-top: ${({ theme }) => theme.spacing[1]};
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  z-index: 50;
  max-height: 300px;
  overflow: hidden;
  flex-direction: column;
`;

export const MailboxSearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`;

export const MailboxList = styled.div`
  overflow-y: auto;
  max-height: 250px;
`;

export const MailboxOption = styled.a<{ $active?: boolean }>`
  display: block;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme, $active }) => ($active ? theme.colors.primary[600] : theme.colors.gray[700])};
  background: ${({ theme, $active }) => ($active ? theme.colors.primary[50] : 'transparent')};
  text-decoration: none;
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
  }
`;

export const MailboxOptionEmpty = styled.div`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[3]}`};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[500]};
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
  color: ${({ theme, $active }) => $active ? theme.colors.primary[600] : theme.colors.gray[600]};
  background: ${({ theme, $active }) => $active ? theme.colors.primary[50] : 'transparent'};
  border-right: 3px solid ${({ theme, $active }) => $active ? theme.colors.primary[600] : 'transparent'};
  font-weight: ${({ theme, $active }) => $active ? theme.fontWeights.medium : theme.fontWeights.normal};
  text-decoration: none;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
    background: ${({ theme }) => theme.colors.primary[50]};
  }
`;

export const Content = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[6]};
  overflow-x: hidden;
  min-width: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing[4]};
  }
`;
