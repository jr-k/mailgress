import styled from 'styled-components';

export const Container = styled.div`
  max-width: 56rem;
  margin: 0 auto;
`;

export const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
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

export const EmailCard = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const MetaGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const MetaItem = styled.div<{ $fullWidth?: boolean }>`
  ${({ $fullWidth }) => $fullWidth && 'grid-column: span 2;'}
`;

export const MetaLabel = styled.span`
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

export const MetaValue = styled.span`
  color: ${({ theme }) => theme.colors.gray[900]};
`;

export const MessageId = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  word-break: break-all;
`;

export const AttachmentsSection = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding-top: ${({ theme }) => theme.spacing[4]};
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

export const BodySection = styled.div`
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
