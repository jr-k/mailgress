import styled from 'styled-components';

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

export const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
`;

export const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const SectionDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

export const InfoItem = styled.div``;

export const InfoLabel = styled.dt`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

export const InfoValue = styled.dd`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const Table = styled.table`
  min-width: 100%;
  border-collapse: collapse;
`;

export const TableHead = styled.thead`
  background-color: ${({ theme }) => theme.colors.gray[50]};
`;

export const TableBody = styled.tbody`
  background-color: ${({ theme }) => theme.colors.white};
`;

export const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};

  &:last-child {
    border-bottom: none;
  }
`;

export const TableHeader = styled.th<{ $align?: 'left' | 'right' }>`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  text-align: ${({ $align = 'left' }) => $align};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[500]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const TableCell = styled.td<{ $align?: 'left' | 'right' }>`
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  text-align: ${({ $align = 'left' }) => $align};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

export const CodeBlock = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.gray[900]};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.spacing[4]};
  overflow-x: auto;
`;

export const Code = styled.pre`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[100]};
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
`;

export const CopyButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing[2]};
  right: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[300]};
  background-color: ${({ theme }) => theme.colors.gray[800]};
  border: 1px solid ${({ theme }) => theme.colors.gray[700]};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

export const TabsContainer = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const Tabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[1]};
`;

export const Tab = styled.button<{ $active?: boolean }>`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme, $active }) => $active ? theme.colors.primary[600] : theme.colors.gray[500]};
  background: none;
  border: none;
  border-bottom: 2px solid ${({ theme, $active }) => $active ? theme.colors.primary[600] : 'transparent'};
  cursor: pointer;
  transition: all 0.15s ease;
  margin-bottom: -1px;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

export const VerificationSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing[6]};
  padding-top: ${({ theme }) => theme.spacing[6]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

export const VerificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const CheckButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.white};
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[500]}, ${({ theme }) => theme.colors.primary[600]});
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary[600]}, ${({ theme }) => theme.colors.primary[700]});
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const VerificationResults = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const VerificationCard = styled.div<{ $valid: boolean }>`
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme, $valid }) =>
    $valid ? theme.colors.green[50] : theme.colors.red[50]};
  border: 1px solid ${({ theme, $valid }) =>
    $valid ? theme.colors.green[200] : theme.colors.red[200]};
  border-radius: ${({ theme }) => theme.radii.lg};
`;

export const VerificationCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

export const VerificationIcon = styled.span<{ $valid: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${({ theme, $valid }) =>
    $valid ? theme.colors.green[500] : theme.colors.red[500]};
  color: white;
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const VerificationTitle = styled.span<{ $valid: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme, $valid }) =>
    $valid ? theme.colors.green[700] : theme.colors.red[700]};
`;

export const VerificationDetail = styled.div`
  margin-left: ${({ theme }) => theme.spacing[8]};
`;

export const DetailRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const DetailLabel = styled.span`
  color: ${({ theme }) => theme.colors.gray[500]};
  min-width: 80px;
`;

export const DetailValue = styled.span`
  color: ${({ theme }) => theme.colors.gray[700]};
  font-family: ${({ theme }) => theme.fonts.mono};
  word-break: break-all;
`;

export const ErrorMessage = styled.span`
  color: ${({ theme }) => theme.colors.red[600]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;
