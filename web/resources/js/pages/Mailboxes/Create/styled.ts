import styled from 'styled-components';

export const Container = styled.div`
  max-width: 42rem;
  margin: 0 auto;
`;

export const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const BackLink = styled.a`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
  display: inline-block;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  transition: color 0.15s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[6]};
`;

export const FormCard = styled.div`
  padding: ${({ theme }) => theme.spacing[6]};
`;

export const InputGroup = styled.div`
  display: flex;
`;

export const InputAddon = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
  background-color: ${({ theme }) => theme.colors.surface.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border.secondary};
  border-left: none;
  border-radius: 0 ${({ theme }) => theme.radii.md} ${({ theme }) => theme.radii.md} 0;
`;

export const InputNoRightRadius = styled.div`
  flex: 1;

  input {
    border-radius: 0;
  }
`;

export const GenerateButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  background-color: ${({ theme }) => theme.colors.surface.secondary};
  border: 1px solid ${({ theme }) => theme.colors.border.secondary};
  border-right: none;
  border-radius: ${({ theme }) => theme.radii.md} 0 0 ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text.tertiary};
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.interactive.hover};
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const HelperText = styled.p`
  margin-top: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[3]};
`;
