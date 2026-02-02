import styled from 'styled-components';

export const AvatarWrapper = styled.div<{ $size: 'sm' | 'md' | 'lg' }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary[100]},
    ${({ theme }) => theme.colors.primary[200]}
  );

  ${({ $size, theme }) => {
    switch ($size) {
      case 'sm':
        return `
          width: 32px;
          height: 32px;
          font-size: ${theme.fontSizes.sm};
        `;
      case 'lg':
        return `
          width: 64px;
          height: 64px;
          font-size: ${theme.fontSizes['2xl']};
        `;
      default:
        return `
          width: 40px;
          height: 40px;
          font-size: ${theme.fontSizes.base};
        `;
    }
  }}
`;

export const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const AvatarFallback = styled.span`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-transform: uppercase;
`;
