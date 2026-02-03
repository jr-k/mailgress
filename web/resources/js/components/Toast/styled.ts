import styled, { css, keyframes } from 'styled-components';
import type { ToastVariant } from '../../contexts/ToastContext';

const slideIn = keyframes`
  from {
    transform: translateX(calc(100% + 1rem));
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

export const ToastContainer = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.spacing[6]};
  right: ${({ theme }) => theme.spacing[6]};
  z-index: 99999;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
`;

interface ToastItemProps {
  $variant: ToastVariant;
  $exiting?: boolean;
}

export const ToastIcon = styled.div`
  flex-shrink: 0;
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const variants = {
  success: css`
    border-color: ${({ theme }) => theme.colors.green[500]};
    ${ToastIcon} {
      color: ${({ theme }) => theme.colors.green[500]};
    }
  `,
  error: css`
    border-color: ${({ theme }) => theme.colors.red[500]};
    ${ToastIcon} {
      color: ${({ theme }) => theme.colors.red[500]};
    }
  `,
  warning: css`
    border-color: ${({ theme }) => theme.colors.yellow[500]};
    ${ToastIcon} {
      color: ${({ theme }) => theme.colors.yellow[600]};
    }
  `,
  info: css`
    border-color: ${({ theme }) => theme.colors.blue[500]};
    ${ToastIcon} {
      color: ${({ theme }) => theme.colors.blue[500]};
    }
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
  min-width: 280px;
  max-width: 420px;
  animation: ${slideIn} 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(4, 192, 45, 0.01);
  backdrop-filter: blur(12px);
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border: 1px solid;
  color: ${({ theme }) => theme.colors.gray[800]};
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -2px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(0, 0, 0, 0.02);

  ${({ $variant }) => variants[$variant]}
`;

export const ToastMessage = styled.div`
  flex: 1;
  line-height: 1.5;
`;

export const ToastClose = styled.button`
  flex-shrink: 0;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.gray[400]};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[1]};
  margin: -${({ theme }) => theme.spacing[1]};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.md};
  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.gray[100]};
    color: ${({ theme }) => theme.colors.gray[600]};
  }
`;
