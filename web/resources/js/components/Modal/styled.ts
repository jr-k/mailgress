import styled, { css, keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.mode === 'dark' ? 'rgb(0 0 0 / 0.7)' : 'rgb(0 0 0 / 0.5)'};
  backdrop-filter: blur(2px);
  animation: ${fadeIn} 0.15s ease-out;
`;

export const Content = styled.div<{ $size?: 'sm' | 'md' | 'lg' }>`
  position: relative;
  width: 100%;
  max-height: calc(100vh - ${({ theme }) => theme.spacing[8]});
  background-color: ${({ theme }) => theme.colors.surface.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  overflow: hidden;
  animation: ${slideIn} 0.2s ease-out;

  ${({ $size = 'md' }) => {
    switch ($size) {
      case 'sm':
        return css`
          max-width: 24rem;
        `;
      case 'lg':
        return css`
          max-width: 42rem;
        `;
      default:
        return css`
          max-width: 32rem;
        `;
    }
  }}
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[6]}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};
`;

export const Title = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
  margin-top: ${({ theme }) => theme.spacing[1]};
`;

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text.muted};
  background: none;
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.text.secondary};
    background-color: ${({ theme }) => theme.colors.interactive.hover};
  }

  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus} ${({ theme }) => theme.colors.primary[500]}40;
  }
`;

export const Body = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
  overflow-y: auto;
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[6]}`};
  border-top: 1px solid ${({ theme }) => theme.colors.border.primary};
  background-color: ${({ theme }) => theme.colors.surface.secondary};
`;

export const IconWrapper = styled.div<{ $variant?: 'danger' | 'warning' | 'info' | 'success' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${({ theme }) => theme.radii.full};
  margin-bottom: ${({ theme }) => theme.spacing[4]};

  ${({ $variant = 'info', theme }) => {
    const isDark = theme.mode === 'dark';
    switch ($variant) {
      case 'danger':
        return css`
          background-color: ${isDark ? `${theme.colors.red[500]}20` : theme.colors.red[100]};
          color: ${theme.colors.red[500]};
        `;
      case 'warning':
        return css`
          background-color: ${isDark ? `${theme.colors.yellow[500]}20` : theme.colors.yellow[100]};
          color: ${isDark ? theme.colors.yellow[500] : theme.colors.yellow[800]};
        `;
      case 'success':
        return css`
          background-color: ${isDark ? `${theme.colors.green[500]}20` : theme.colors.green[100]};
          color: ${theme.colors.green[500]};
        `;
      default:
        return css`
          background-color: ${isDark ? `${theme.colors.blue[500]}20` : theme.colors.blue[100]};
          color: ${theme.colors.blue[500]};
        `;
    }
  }}
`;
