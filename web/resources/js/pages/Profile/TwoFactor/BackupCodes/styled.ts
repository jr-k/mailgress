import styled from 'styled-components';

export const Container = styled.div`
  max-width: 500px;
  margin: 0 auto;
`;

export const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.primary};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.spacing[6]};
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

export const CodesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing[3]};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const Code = styled.div`
  padding: ${({ theme }) => theme.spacing[3]};
  background: ${({ theme }) => theme.colors.interactive.hover};
  border-radius: ${({ theme }) => theme.radii.md};
  font-family: monospace;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  text-align: center;
  letter-spacing: 0.1em;
`;

export const Actions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  justify-content: flex-end;
  flex-wrap: wrap;
`;
