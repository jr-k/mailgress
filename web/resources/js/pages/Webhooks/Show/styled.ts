import styled from 'styled-components';

export const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const TitleSection = styled.div``;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

export const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const TestResult = styled.div<{ $success?: boolean }>`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ $success, theme }) =>
    $success ? theme.colors.green[50] : theme.colors.red[50]};
  border: 1px solid
    ${({ $success, theme }) => ($success ? theme.colors.green[200] : theme.colors.red[200])};
`;

export const TestResultTitle = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const TestResultBody = styled.pre`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  overflow: auto;
  max-height: 8rem;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const CardContent = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
`;

export const CardTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const DefinitionList = styled.dl`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const DefinitionTerm = styled.dt`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

export const DefinitionValue = styled.dd`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[900]};
  word-break: break-all;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const StatCard = styled.div<{ $variant?: 'default' | 'success' | 'error' | 'warning' }>`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ $variant = 'default', theme }) => {
    switch ($variant) {
      case 'success':
        return theme.colors.green[50];
      case 'error':
        return theme.colors.red[50];
      case 'warning':
        return '#fefce8';
      default:
        return theme.colors.gray[50];
    }
  }};
`;

export const StatValue = styled.div<{ $variant?: 'default' | 'success' | 'error' | 'warning' }>`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ $variant = 'default', theme }) => {
    switch ($variant) {
      case 'success':
        return theme.colors.green[800];
      case 'error':
        return theme.colors.red[600];
      case 'warning':
        return '#ca8a04';
      default:
        return theme.colors.gray[900];
    }
  }};
`;

export const StatLabel = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

export const RulesCard = styled.div`
  margin-top: ${({ theme }) => theme.spacing[6]};
`;

export const RulesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const RuleItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const RuleField = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

export const RuleOperator = styled.span`
  color: ${({ theme }) => theme.colors.gray[500]};
`;

export const RuleValue = styled.span`
  color: ${({ theme }) => theme.colors.gray[900]};
`;

export const EmptyText = styled.p`
  color: ${({ theme }) => theme.colors.gray[500]};
`;
