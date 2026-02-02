import styled, { css } from 'styled-components';

type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'gray';

interface BadgeProps {
  $variant?: BadgeVariant;
  $dot?: boolean;
}

const variants = {
  success: css`
    background-color: ${({ theme }) => theme.colors.green[50]};
    color: ${({ theme }) => theme.colors.green[800]};
    border: 1px solid ${({ theme }) => theme.colors.green[200]};

    &::before {
      background-color: ${({ theme }) => theme.colors.green[500]};
    }
  `,
  error: css`
    background-color: ${({ theme }) => theme.colors.red[50]};
    color: ${({ theme }) => theme.colors.red[800]};
    border: 1px solid ${({ theme }) => theme.colors.red[200]};

    &::before {
      background-color: ${({ theme }) => theme.colors.red[500]};
    }
  `,
  warning: css`
    background-color: ${({ theme }) => theme.colors.yellow[50]};
    color: ${({ theme }) => theme.colors.yellow[800]};
    border: 1px solid ${({ theme }) => theme.colors.yellow[100]};

    &::before {
      background-color: ${({ theme }) => theme.colors.yellow[500]};
    }
  `,
  info: css`
    background-color: ${({ theme }) => theme.colors.blue[50]};
    color: ${({ theme }) => theme.colors.blue[800]};
    border: 1px solid ${({ theme }) => theme.colors.blue[100]};

    &::before {
      background-color: ${({ theme }) => theme.colors.blue[500]};
    }
  `,
  gray: css`
    background-color: ${({ theme }) => theme.colors.gray[50]};
    color: ${({ theme }) => theme.colors.gray[700]};
    border: 1px solid ${({ theme }) => theme.colors.gray[200]};

    &::before {
      background-color: ${({ theme }) => theme.colors.gray[400]};
    }
  `,
};

export const Badge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => `2px ${theme.spacing[2]}`};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  line-height: 1.25rem;
  border-radius: ${({ theme }) => theme.radii.md};
  white-space: nowrap;

  ${({ $variant = 'gray' }) => variants[$variant]}

  ${({ $dot }) =>
    $dot &&
    css`
      &::before {
        content: '';
        width: 6px;
        height: 6px;
        border-radius: 50%;
        flex-shrink: 0;
      }
    `}
`;
