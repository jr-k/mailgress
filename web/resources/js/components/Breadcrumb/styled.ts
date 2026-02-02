import styled from 'styled-components';

export const Container = styled.nav`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const Item = styled.div`
  display: flex;
  align-items: center;
`;

export const Separator = styled.span`
  margin: 0 ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.gray[400]};
`;

export const Link = styled.a`
  color: ${({ theme }) => theme.colors.gray[600]};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.gray[900]};
  }
`;

export const Current = styled.span`
  color: ${({ theme }) => theme.colors.gray[900]};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
`;

export const DropdownWrapper = styled.div`
  position: relative;
`;

export const DropdownTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  color: ${({ theme }) => theme.colors.gray[900]};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
  }
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 50;
  min-width: 200px;
  margin-top: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[1]};
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

export const DropdownItem = styled.a`
  display: block;
  padding: ${({ theme }) => theme.spacing[2]};
  color: ${({ theme }) => theme.colors.gray[700]};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
    color: ${({ theme }) => theme.colors.gray[900]};
  }
`;
