import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.gray[50]};
`;

export const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 40;
  background-color: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  box-shadow: ${({ theme }) => theme.shadows.xs};
`;

export const NavInner = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing[4]};
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 ${({ theme }) => theme.spacing[6]};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: 0 ${({ theme }) => theme.spacing[8]};
  }
`;

export const NavLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[8]};
`;

export const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

export const Logo = styled.a`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
  text-decoration: none;
  letter-spacing: -0.02em;
`;

export const LogoIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]} 0%, ${({ theme }) => theme.colors.primary[600]} 100%);
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.white};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const NavLink = styled.a<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.radii.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  color: ${({ theme, $active }) => $active ? theme.colors.gray[900] : theme.colors.gray[600]};
  background-color: ${({ theme, $active }) => $active ? theme.colors.gray[100] : 'transparent'};

  &:hover {
    color: ${({ theme }) => theme.colors.gray[900]};
    background-color: ${({ theme }) => theme.colors.gray[100]};
  }
`;

export const DropdownContainer = styled.div`
  position: relative;
`;

export const DropdownTrigger = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.radii.md};
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  color: ${({ theme, $active }) => $active ? theme.colors.gray[900] : theme.colors.gray[600]};
  background-color: ${({ theme, $active }) => $active ? theme.colors.gray[100] : 'transparent'};

  &:hover {
    color: ${({ theme }) => theme.colors.gray[900]};
    background-color: ${({ theme }) => theme.colors.gray[100]};
  }
`;

export const DropdownIcon = styled.span<{ $open?: boolean }>`
  display: inline-flex;
  transition: transform ${({ theme }) => theme.transitions.fast};
  transform: ${({ $open }) => $open ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 50;
  min-width: 160px;
  margin-top: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]};
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

export const DropdownItem = styled.a<{ $active?: boolean }>`
  display: block;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.radii.md};
  transition: all ${({ theme }) => theme.transitions.fast};
  color: ${({ theme, $active }) => $active ? theme.colors.primary[700] : theme.colors.gray[700]};
  background-color: ${({ theme, $active }) => $active ? theme.colors.primary[50] : 'transparent'};

  &:hover {
    color: ${({ theme }) => theme.colors.primary[700]};
    background-color: ${({ theme }) => theme.colors.primary[50]};
  }
`;

export const NavRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
`;

export const ProfileLink = styled.a`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  text-decoration: none;
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
  border-radius: ${({ theme }) => theme.radii.md};
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[100]};
  }
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const UserEmail = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

export const AdminBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => `2px ${theme.spacing[2]}`};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  border-radius: ${({ theme }) => theme.radii.full};
  background-color: ${({ theme }) => theme.colors.primary[50]};
  color: ${({ theme }) => theme.colors.primary[700]};
  border: 1px solid ${({ theme }) => theme.colors.primary[200]};
`;

export const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[600]};
  background: none;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.gray[900]};
    background-color: ${({ theme }) => theme.colors.gray[100]};
  }
`;

export const FlashContainer = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing[4]};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[6]}`};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[8]}`};
  }
`;

export const Main = styled.main`
  max-width: 80rem;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing[8]} ${theme.spacing[4]}`};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => `${theme.spacing[8]} ${theme.spacing[6]}`};
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => `${theme.spacing[8]} ${theme.spacing[8]}`};
  }
`;
