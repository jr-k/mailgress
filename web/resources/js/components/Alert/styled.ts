import styled, { css } from 'styled-components';

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  $variant?: AlertVariant;
}

const variants = {
  success: css`
    background-color: ${({ theme }) => theme.mode === 'dark' ? `${theme.colors.green[500]}15` : theme.colors.green[50]};
    border-color: ${({ theme }) => theme.mode === 'dark' ? `${theme.colors.green[500]}30` : theme.colors.green[200]};
    color: ${({ theme }) => theme.mode === 'dark' ? theme.colors.green[500] : theme.colors.green[800]};
  `,
  error: css`
    background-color: ${({ theme }) => theme.mode === 'dark' ? `${theme.colors.red[500]}15` : theme.colors.red[50]};
    border-color: ${({ theme }) => theme.mode === 'dark' ? `${theme.colors.red[500]}30` : theme.colors.red[200]};
    color: ${({ theme }) => theme.mode === 'dark' ? theme.colors.red[500] : theme.colors.red[800]};
  `,
  warning: css`
    background-color: ${({ theme }) => theme.mode === 'dark' ? `${theme.colors.yellow[500]}15` : theme.colors.yellow[50]};
    border-color: ${({ theme }) => theme.mode === 'dark' ? `${theme.colors.yellow[500]}30` : theme.colors.yellow[100]};
    color: ${({ theme }) => theme.mode === 'dark' ? theme.colors.yellow[500] : theme.colors.yellow[800]};
  `,
  info: css`
    background-color: ${({ theme }) => theme.mode === 'dark' ? `${theme.colors.blue[500]}15` : theme.colors.blue[50]};
    border-color: ${({ theme }) => theme.mode === 'dark' ? `${theme.colors.blue[500]}30` : theme.colors.blue[100]};
    color: ${({ theme }) => theme.mode === 'dark' ? theme.colors.blue[500] : theme.colors.blue[800]};
  `,
};

export const Alert = styled.div<AlertProps>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border: 1px solid;
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: 1.5;

  ${({ $variant = 'info' }) => variants[$variant]}
`;

export const AlertIcon = styled.div`
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
`;

export const AlertContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const AlertTitle = styled.div`
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

export const AlertDescription = styled.div`
  opacity: 0.9;
`;
