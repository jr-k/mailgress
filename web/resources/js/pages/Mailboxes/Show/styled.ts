import styled from 'styled-components';

export const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const BackLink = styled.a`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[500]};
  display: inline-block;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.gray[700]};
  }
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.gray[900]};
`;

export const Description = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
`;

export const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const SplitView = styled.div`
  display: flex;
  height: calc(100vh - 220px);
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
`;

export const EmailList = styled.div`
  width: 33.333%;
  border-right: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  flex-direction: column;
`;

export const SearchBox = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

export const EmailListItems = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const EmailItem = styled.div<{ $selected?: boolean }>`
  padding: ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[100]};
  cursor: pointer;
  transition: background-color 0.15s ease;
  background-color: ${({ $selected, theme }) =>
    $selected ? theme.colors.primary[50] : 'transparent'};

  &:hover {
    background-color: ${({ $selected, theme }) =>
      $selected ? theme.colors.primary[50] : theme.colors.gray[50]};
  }
`;

export const EmailHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

export const EmailFrom = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[900]};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`;

export const EmailDate = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-left: ${({ theme }) => theme.spacing[2]};
  white-space: nowrap;
`;

export const EmailSubject = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[900]};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const EmailPreview = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

export const AttachmentBadge = styled.div`
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

export const Pagination = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const PageInfo = styled.span`
  color: ${({ theme }) => theme.colors.gray[500]};
`;

export const PageLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const PageLink = styled.a`
  color: ${({ theme }) => theme.colors.primary[600]};
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[800]};
  }
`;

export const EmailDetail = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const EmailDetailContent = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
`;

export const EmailDetailHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const EmailDetailSubject = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[900]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const EmailMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const MetaLabel = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

export const MetaValue = styled.span`
  color: ${({ theme }) => theme.colors.gray[900]};
`;

export const AttachmentsSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const AttachmentsTitle = styled.h3`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const AttachmentsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const AttachmentLink = styled.a`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  background-color: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[200]};
  }

  svg {
    width: 1rem;
    height: 1rem;
    margin-right: ${({ theme }) => theme.spacing[2]};
  }
`;

export const EmailBody = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding-top: ${({ theme }) => theme.spacing[6]};
`;

export const HtmlBody = styled.div`
  max-width: none;

  p {
    margin-bottom: 1em;
  }

  a {
    color: ${({ theme }) => theme.colors.primary[600]};
  }
`;

export const TextBody = styled.pre`
  white-space: pre-wrap;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[800]};
  font-family: ${({ theme }) => theme.fonts.mono};
`;

export const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  text-align: center;
  color: ${({ theme }) => theme.colors.gray[500]};
`;

export const NoEmailSelected = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme }) => theme.colors.gray[500]};
`;
