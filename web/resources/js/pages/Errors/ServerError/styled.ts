import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.surface.secondary};
`;

export const Content = styled.div`
  text-align: center;
`;

export const Code = styled.h1`
  font-size: 6rem;
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.muted};
`;

export const Message = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

export const ButtonWrapper = styled.div`
  margin-top: ${({ theme }) => theme.spacing[6]};
`;
