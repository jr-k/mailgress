import styled, { css, keyframes } from 'styled-components';
import type { ToastVariant } from '../../contexts/ToastContext';

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

export const ToastContainer = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.spacing[4]};
  right: ${({ theme }) => theme.spacing[4]};
  z-index: 99999;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

interface ToastItemProps {
  $variant: ToastVariant;
  $exiting?: boolean;
}

const variants = {
  success: css`
    background-color: ${({ theme }) => theme.colors.green[600]};
    color: white;
  `,
  error: css`
    background-color: ${({ theme }) => theme.colors.red[600]};
    color: white;
  `,
  warning: css`
    background-color: ${({ theme }) => theme.colors.yellow[500]};
    color: ${({ theme }) => theme.colors.yellow[800]};
  `,
  info: css`
    background-color: ${({ theme }) => theme.colors.blue[500]};
    color: white;
  `,
};

export const ToastItem = styled.div<ToastItemProps>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border-radius: ${({ theme }) => theme.radii.lg};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 250px;
  max-width: 400px;
  animation: ${slideIn} 0.3s ease-out;

  ${({ $variant }) => variants[$variant]}
`;

export const ToastIcon = styled.div`
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ToastMessage = styled.div`
  flex: 1;
  line-height: 1.4;
`;

export const ToastClose = styled.button`
  flex-shrink: 0;
  background: none;
  border: none;
  color: inherit;
  opacity: 0.7;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[1]};
  margin: -${({ theme }) => theme.spacing[1]};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 1;
  }
`;
