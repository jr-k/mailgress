import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export const Spinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid ${({ theme }) => theme.colors.border.secondary};
  border-top-color: ${({ theme }) => theme.colors.primary[500]};
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
`;

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
  color: ${({ theme }) => theme.colors.text.secondary};
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
  border-right: 1px solid ${({ theme }) => theme.colors.border.primary};
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
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

export const EmailListItems = styled.div`
  flex: 1;
  overflow-y: auto;
`;

export const EmailItem = styled.div<{ $selected?: boolean; $unread?: boolean }>`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.interactive.hover};
  cursor: pointer;
  transition: background-color 0.15s ease;
  border-left: 3px solid
    ${({ $selected, theme }) => ($selected ? theme.colors.primary[500] : 'transparent')};
  background-color: ${({ $selected, $unread, theme }) => {
    if ($selected) {
      return theme.mode === 'dark' ? `${theme.colors.primary[500]}20` : theme.colors.primary[50];
    }
    if ($unread) {
      return theme.mode === 'dark' ? `${theme.colors.gray[700]}` : theme.colors.gray[100];
    }
    return 'transparent';
  }};

  &:hover {
    background-color: ${({ $selected, theme }) =>
      $selected
        ? theme.mode === 'dark' ? `${theme.colors.primary[500]}25` : theme.colors.primary[100]
        : theme.colors.surface.secondary};
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
  color: ${({ theme }) => theme.colors.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
`;

export const EmailClaim = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-right: ${({ theme }) => theme.spacing[1]};
  background-color: ${({ theme }) => theme.colors.border.primary};
  padding: ${({ theme }) => `0 ${theme.spacing[1]}`};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
  opacity: 0.7;
`;

export const EmailDate = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-left: ${({ theme }) => theme.spacing[2]};
  white-space: nowrap;
`;

export const EmailSubject = styled.div<{ $unread?: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ $unread, theme }) => ($unread ? theme.fontWeights.semibold : theme.fontWeights.normal)};
  color: ${({ theme }) => theme.colors.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const EmailPreview = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.text.tertiary};
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
  border-top: 1px solid ${({ theme }) => theme.colors.border.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes.xs};
`;

export const PageInfo = styled.span`
  color: ${({ theme }) => theme.colors.text.tertiary};
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
  border: 1px solid ${({ theme }) => theme.colors.border.secondary};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ theme }) => theme.colors.surface.primary};
  color: ${({ $danger, theme }) => ($danger ? theme.colors.red[600] : theme.colors.text.secondary)};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ $danger, theme }) => ($danger
      ? theme.mode === 'dark' ? `${theme.colors.red[500]}15` : theme.colors.red[50]
      : theme.colors.interactive.hover)};
    border-color: ${({ $danger, theme }) => ($danger ? theme.colors.red[500] : theme.colors.text.muted)};
  }
`;

export const EmailDetailSubject = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const EmailMeta = styled.div`
  display: flex;
  flex-direction: column;
  font-size: ${({ theme }) => theme.fontSizes.sm};

  @media (max-width: 768px) {
    gap: ${({ theme }) => theme.spacing[2]};
  }
`;

export const MetaItem = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 10fr);
  gap: ${({ theme }) => theme.spacing[1]};
`;

export const MetaLabel = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

export const MetaValue = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const AttachmentsSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const AttachmentsTitle = styled.h3`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
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
  background-color: ${({ theme }) => theme.colors.interactive.hover};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.border.primary};
  }

  svg {
    width: 1rem;
    height: 1rem;
    margin-right: ${({ theme }) => theme.spacing[2]};
  }
`;

export const EmailBody = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border.primary};
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
  color: ${({ theme }) => theme.colors.text.primary};
  font-family: ${({ theme }) => theme.fonts.mono};
`;

export const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  text-align: center;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

export const NoEmailSelected = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

export const MobileEmailDetail = styled.div`
  display: none;
  background-color: ${({ theme }) => theme.colors.surface.secondary};
  border-bottom: 2px solid ${({ theme }) => theme.mode === 'dark' ? theme.colors.primary[700] : theme.colors.primary[200]};

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
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

export const MobileEmailBody = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;
