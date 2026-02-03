import styled from 'styled-components';

export const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const BackLink = styled.a`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
  display: inline-block;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const TableWrapper = styled.div`
  overflow: hidden;
  overflow-x: auto;
`;

export const Table = styled.table`
  min-width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background-color: ${({ theme }) => theme.colors.surface.secondary};
`;

export const TableBody = styled.tbody`
  background-color: ${({ theme }) => theme.colors.surface.primary};
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.surface.secondary};
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const TableHeader = styled.th<{ $align?: 'left' | 'right' }>`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[6]}`};
  text-align: ${({ $align = 'left' }) => $align};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.tertiary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const TableCell = styled.td<{ $align?: 'left' | 'right' }>`
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[6]}`};
  text-align: ${({ $align = 'left' }) => $align};
`;

export const EmptyCell = styled.td`
  padding: ${({ theme }) => `${theme.spacing[8]} ${theme.spacing[6]}`};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

export const WebhookLink = styled.a`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.primary[600]};
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[800]};
  }
`;

export const UrlText = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 20rem;
`;

export const DeliveryStats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const SuccessCount = styled.span`
  color: ${({ theme }) => theme.colors.green[500]};
`;

export const FailedCount = styled.span`
  color: ${({ theme }) => theme.colors.red[600]};
`;

export const PendingCount = styled.span`
  color: ${({ theme }) => theme.colors.yellow[800]};
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const ActionLink = styled.a`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.primary[600]};
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[800]};
  }
`;

export const DeleteButton = styled.button`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.red[600]};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.red[800]};
  }
`;

export const IconLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.interactive.hover};
    color: ${({ theme }) => theme.colors.primary[600]};
  }

  svg {
    width: 1.125rem;
    height: 1.125rem;
  }
`;

export const IconButton = styled.button<{ $variant?: 'default' | 'danger' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: ${({ theme }) => theme.radii.md};
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme, $variant }) =>
      $variant === 'danger'
        ? theme.mode === 'dark' ? `${theme.colors.red[500]}15` : theme.colors.red[50]
        : theme.colors.interactive.hover};
    color: ${({ theme, $variant }) =>
      $variant === 'danger' ? theme.colors.red[500] : theme.colors.primary[500]};
  }

  svg {
    width: 1.125rem;
    height: 1.125rem;
  }
`;
