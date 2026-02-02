import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing[8]} ${theme.spacing[4]}`};
  position: relative;
  overflow: hidden;
  background: ${({ theme }) => theme.mode === 'dark' ? theme.colors.gray[950] : theme.colors.gray[900]};

  /* Animated gradient orbs */
  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: ${({ theme }) => theme.mode === 'dark' ? 0.4 : 0.6};
    animation: ${float} 8s ease-in-out infinite;
  }

  &::before {
    width: 600px;
    height: 600px;
    background: ${({ theme }) => theme.colors.primary[500]};
    top: -200px;
    left: -200px;
    animation-delay: 0s;
  }

  &::after {
    width: 500px;
    height: 500px;
    background: ${({ theme }) => theme.colors.purple[600]};
    bottom: -150px;
    right: -150px;
    animation-delay: 4s;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => `${theme.spacing[12]} ${theme.spacing[6]}`};
  }
`;

export const Content = styled.div`
  max-width: 24rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[8]};
  animation: ${fadeIn} 0.8s ease-out;
  position: relative;
  z-index: 1;
`;

export const Branding = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
`;

export const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  width: 82px;
  height: 82px;
  border-radius: ${({ theme }) => theme.radii.xl};
  margin-top: -82px;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.1),
    0 8px 32px rgba(99, 102, 241, 0.4);
`;

export const LogoIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

export const BrandName = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: rgba(${({ theme }) => theme.colors.text.primary}, 0.9);
  letter-spacing: -0.02em;
  text-align: center;
`;

export const Card = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.mode === 'dark'
    ? `rgba(17, 24, 39, 0.95)`
    : `rgba(255, 255, 255, 0.98)`};
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: ${({ theme }) => theme.radii.xl};
  padding: ${({ theme }) => theme.spacing[8]};
  border: 1px solid ${({ theme }) => theme.mode === 'dark'
    ? 'rgba(255, 255, 255, 0.1)'
    : 'rgba(255, 255, 255, 0.1)'};
  box-shadow:
    0 0 0 1px ${({ theme }) => theme.mode === 'dark'
      ? 'rgba(255, 255, 255, 0.05)'
      : 'rgba(255, 255, 255, 0.1)'},
    0 25px 50px -12px rgba(0, 0, 0, 0.5);
`;

export const BrandDot = styled.span`
  display: inline-block;
  width: ${({ theme }) => theme.spacing[2]};
  height: ${({ theme }) => theme.spacing[2]};
  margin-left: ${({ theme }) => theme.spacing[1]};
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary[500]};
`;