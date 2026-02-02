import styled from 'styled-components';

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  letter-spacing: -0.02em;
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[6]}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[100]};
`;

export const ResultCount = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
`;

export const Table = styled.table`
  min-width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

export const TableBody = styled.tbody`
  background-color: ${({ theme }) => theme.colors.white};
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[100]};
  transition: background-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[50]};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const TableHeader = styled.th<{ $align?: 'left' | 'center' | 'right' }>`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[6]}`};
  text-align: ${({ $align = 'left' }) => $align};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[500]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
`;

export const TableCell = styled.td<{ $align?: 'left' | 'center' | 'right' }>`
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[6]}`};
  white-space: nowrap;
  text-align: ${({ $align = 'left' }) => $align};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

export const EmptyCell = styled.td`
  padding: ${({ theme }) => theme.spacing[16]};
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const MailboxLink = styled.a`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[900]};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

export const Description = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

export const SecondaryText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

export const IconButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: ${({ theme }) => theme.colors.gray[500]};
  text-decoration: none;
  border-radius: ${({ theme }) => theme.radii.md};
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.gray[700]};
    background-color: ${({ theme }) => theme.colors.gray[100]};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const IconDeleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: ${({ theme }) => theme.colors.gray[500]};
  background: none;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.red[600]};
    background-color: ${({ theme }) => theme.colors.red[50]};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[16]};
  text-align: center;
`;

export const EmptyIcon = styled.div`
  width: 48px;
  height: 48px;
  color: ${({ theme }) => theme.colors.gray[400]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  svg {
    width: 100%;
    height: 100%;
  }
`;

export const EmptyTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const EmptyDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;
