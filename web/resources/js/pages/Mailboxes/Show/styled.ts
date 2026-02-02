import styled from 'styled-components';

export const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};

  @media (max-width: 768px) {
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }
`;

export const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[2]};

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const Description = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
`;

export const SplitView = styled.div`
  display: flex;
  height: calc(100vh - 220px);
  background-color: ${({ theme }) => theme.colors.surface.primary};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    max-height: calc(100vh - 180px);
  }
`;

export const EmailList = styled.div`
  width: 380px;
  min-width: 380px;
  border-right: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
    min-width: 100%;
    border-right: none;
    flex: 1;
    overflow: hidden;
  }
`;

export const SearchBox = styled.div`
  padding: ${({ theme }) => theme.spacing[2]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

export const EmailListItems = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const EmailItem = styled.div<{ $selected?: boolean; $unread?: boolean }>`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[100]};
  cursor: pointer;
  transition: background-color 0.15s ease;
  background-color: ${({ $selected, $unread, theme }) =>
    $selected ? theme.colors.primary[50] : $unread ? theme.colors.blue[50] : 'transparent'};

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

export const EmailFrom = styled.div<{ $unread?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ $unread, theme }) => ($unread ? theme.fontWeights.bold : theme.fontWeights.medium)};
  color: ${({ theme }) => theme.colors.gray[900]};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`;

export const EmailClaim = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-right: ${({ theme }) => theme.spacing[1]};
  background-color: ${({ theme }) => theme.colors.gray[200]};
  padding: ${({ theme }) => `0 ${theme.spacing[1]}`};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[700]};
  opacity: 0.7;
`;

export const EmailDate = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-left: ${({ theme }) => theme.spacing[2]};
  white-space: nowrap;
`;

export const EmailSubject = styled.div<{ $unread?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ $unread, theme }) => ($unread ? theme.fontWeights.semibold : theme.fontWeights.normal)};
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
  padding: ${({ theme }) => theme.spacing[2]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.xs};
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

  @media (max-width: 768px) {
    display: none;
  }
`;

export const EmailDetailContent = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing[4]};
  }
`;

export const EmailDetailHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const EmailDetailTitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const EmailActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  flex-shrink: 0;
`;

export const ActionButton = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[2]};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.surface.primary};
  color: ${({ $danger, theme }) => ($danger ? theme.colors.red[600] : theme.colors.gray[600])};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ $danger, theme }) => ($danger ? theme.colors.red[50] : theme.colors.gray[100])};
    border-color: ${({ $danger, theme }) => ($danger ? theme.colors.red[500] : theme.colors.gray[400])};
  }
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

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing[2]};
  }
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

export const MobileEmailDetail = styled.div`
  display: none;
  background-color: ${({ theme }) => theme.colors.gray[50]};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary[200]};

  @media (max-width: 768px) {
    display: block;
  }
`;

export const MobileEmailDetailContent = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
`;

export const MobileEmailMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  padding-bottom: ${({ theme }) => theme.spacing[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

export const MobileEmailBody = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;
