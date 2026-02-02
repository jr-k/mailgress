import styled, { css } from 'styled-components';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps {
  $variant?: ButtonVariant;
  $fullWidth?: boolean;
  $size?: 'sm' | 'md';
}

const variants = {
  primary: css`
    background: linear-gradient(180deg, ${({ theme }) => theme.colors.primary[500]} 0%, ${({ theme }) => theme.colors.primary[600]} 100%);
    color: ${({ theme }) => theme.colors.white};
    border: 1px solid ${({ theme }) => theme.colors.primary[600]};
    box-shadow: ${({ theme }) => theme.shadows.button}, inset 0 1px 0 rgb(255 255 255 / 0.1);

    &:hover:not(:disabled) {
      background: linear-gradient(180deg, ${({ theme }) => theme.colors.primary[600]} 0%, ${({ theme }) => theme.colors.primary[700]} 100%);
      border-color: ${({ theme }) => theme.colors.primary[700]};
    }

    &:active:not(:disabled) {
      background: ${({ theme }) => theme.colors.primary[700]};
      box-shadow: inset 0 1px 2px rgb(0 0 0 / 0.1);
    }

    &:focus-visible {
      outline: none;
      box-shadow: ${({ theme }) => theme.shadows.focus} ${({ theme }) => theme.colors.primary[200]};
    }
  `,
  secondary: css`
    background-color: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.gray[700]};
    border: 1px solid ${({ theme }) => theme.colors.gray[300]};
    box-shadow: ${({ theme }) => theme.shadows.button};

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.gray[50]};
      border-color: ${({ theme }) => theme.colors.gray[400]};
    }

    &:active:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.gray[100]};
      box-shadow: inset 0 1px 2px rgb(0 0 0 / 0.05);
    }

    &:focus-visible {
      outline: none;
      box-shadow: ${({ theme }) => theme.shadows.focus} ${({ theme }) => theme.colors.primary[200]};
    }
  `,
  danger: css`
    background: linear-gradient(180deg, ${({ theme }) => theme.colors.red[500]} 0%, ${({ theme }) => theme.colors.red[600]} 100%);
    color: ${({ theme }) => theme.colors.white};
    border: 1px solid ${({ theme }) => theme.colors.red[600]};
    box-shadow: ${({ theme }) => theme.shadows.button}, inset 0 1px 0 rgb(255 255 255 / 0.1);

    &:hover:not(:disabled) {
      background: linear-gradient(180deg, ${({ theme }) => theme.colors.red[600]} 0%, ${({ theme }) => theme.colors.red[700]} 100%);
      border-color: ${({ theme }) => theme.colors.red[700]};
    }

    &:active:not(:disabled) {
      background: ${({ theme }) => theme.colors.red[700]};
      box-shadow: inset 0 1px 2px rgb(0 0 0 / 0.1);
    }

    &:focus-visible {
      outline: none;
      box-shadow: ${({ theme }) => theme.shadows.focus} ${({ theme }) => theme.colors.red[200]};
    }
  `,
  ghost: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.gray[600]};
    border: 1px solid transparent;

    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.gray[100]};
      color: ${({ theme }) => theme.colors.gray[900]};
    }

    &:active:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.gray[200]};
    }

    &:focus-visible {
      outline: none;
      box-shadow: ${({ theme }) => theme.shadows.focus} ${({ theme }) => theme.colors.primary[200]};
    }
  `,
};

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme, $size = 'md' }) =>
    $size === 'sm'
      ? `${theme.spacing[1]} ${theme.spacing[3]}`
      : `${theme.spacing[2]} ${theme.spacing[4]}`
  };
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  line-height: 1.25rem;
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  user-select: none;

  ${({ $variant = 'primary' }) => variants[$variant]}

  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const LinkButton = styled.a<{ $variant?: 'primary' | 'secondary' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  line-height: 1.25rem;
  border-radius: ${({ theme }) => theme.radii.md};
  text-decoration: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  user-select: none;

  ${({ $variant = 'primary', theme }) =>
    $variant === 'primary'
      ? css`
          background: linear-gradient(180deg, ${theme.colors.primary[500]} 0%, ${theme.colors.primary[600]} 100%);
          color: ${theme.colors.white};
          border: 1px solid ${theme.colors.primary[600]};
          box-shadow: ${theme.shadows.button}, inset 0 1px 0 rgb(255 255 255 / 0.1);

          &:hover {
            background: linear-gradient(180deg, ${theme.colors.primary[600]} 0%, ${theme.colors.primary[700]} 100%);
            border-color: ${theme.colors.primary[700]};
          }
        `
      : css`
          background-color: ${theme.colors.white};
          color: ${theme.colors.gray[700]};
          border: 1px solid ${theme.colors.gray[300]};
          box-shadow: ${theme.shadows.button};

          &:hover {
            background-color: ${theme.colors.gray[50]};
            border-color: ${theme.colors.gray[400]};
          }
        `}
`;

export const TextLink = styled.a<{ $variant?: 'default' | 'danger' }>`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-decoration: none;
  transition: color ${({ theme }) => theme.transitions.fast};

  ${({ $variant = 'default', theme }) =>
    $variant === 'default'
      ? css`
          color: ${theme.colors.primary[600]};
          &:hover {
            color: ${theme.colors.primary[700]};
          }
        `
      : css`
          color: ${theme.colors.red[600]};
          &:hover {
            color: ${theme.colors.red[700]};
          }
        `}
`;
