import styled, { css } from 'styled-components';

// Page Layout
export const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const PageHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PageHeaderStart = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
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

export const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const PageSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const PageActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

// Tables
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
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.interactive.hover};
  }
`;

interface TableCellProps {
  $align?: 'left' | 'center' | 'right';
}

export const TableHeader = styled.th<TableCellProps>`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[6]}`};
  text-align: ${({ $align = 'left' }) => $align};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.tertiary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const TableCell = styled.td<TableCellProps>`
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[6]}`};
  white-space: nowrap;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: ${({ $align = 'left' }) => $align};
`;

export const TableEmptyCell = styled.td`
  padding: ${({ theme }) => `${theme.spacing[8]} ${theme.spacing[6]}`};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

// Forms
export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

export const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[3]};
`;

export const FormActionsBetween = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const InputGroup = styled.div`
  display: flex;
`;

export const InputAddon = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
  background-color: ${({ theme }) => theme.colors.surface.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-left: none;
  border-radius: 0 ${({ theme }) => theme.radii.md} ${({ theme }) => theme.radii.md} 0;
`;

// Links
export const TextLink = styled.a`
  color: ${({ theme }) => theme.colors.primary[500]};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

export const DangerLink = styled.button`
  color: ${({ theme }) => theme.colors.red[500]};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  background: none;
  border: none;
  cursor: pointer;
  font-size: inherit;
  padding: 0;
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.red[600]};
  }
`;

// Layout helpers
export const Container = styled.div<{ $maxWidth?: string }>`
  ${({ $maxWidth }) =>
    $maxWidth &&
    css`
      max-width: ${$maxWidth};
      margin: 0 auto;
    `}
`;

export const Grid = styled.div<{ $cols?: number; $gap?: string }>`
  display: grid;
  grid-template-columns: repeat(${({ $cols = 1 }) => $cols}, minmax(0, 1fr));
  gap: ${({ $gap, theme }) => $gap || theme.spacing[6]};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(${({ $cols = 1 }) => $cols}, minmax(0, 1fr));
  }
`;

export const Flex = styled.div<{ $gap?: string; $align?: string; $justify?: string; $wrap?: boolean }>`
  display: flex;
  gap: ${({ $gap, theme }) => $gap || theme.spacing[2]};
  align-items: ${({ $align }) => $align || 'center'};
  justify-content: ${({ $justify }) => $justify || 'flex-start'};
  ${({ $wrap }) => $wrap && 'flex-wrap: wrap;'}
`;

export const Stack = styled.div<{ $gap?: string }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap, theme }) => $gap || theme.spacing[4]};
`;

// Text styles
export const Text = styled.span<{ $size?: string; $color?: string; $weight?: string }>`
  font-size: ${({ $size, theme }) => $size || theme.fontSizes.base};
  color: ${({ $color, theme }) => $color || theme.colors.text.primary};
  font-weight: ${({ $weight, theme }) => $weight || theme.fontWeights.normal};
`;

export const Label = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

export const Value = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const SmallText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

export const TruncatedText = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const PreText = styled.pre`
  white-space: pre-wrap;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-family: ${({ theme }) => theme.fonts.mono};
`;

// Definition list
export const DefinitionList = styled.dl`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const DefinitionTerm = styled.dt`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

export const DefinitionValue = styled.dd`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;
