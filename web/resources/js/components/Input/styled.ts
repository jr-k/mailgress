import styled, { css } from 'styled-components';

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`;

export const Label = styled.label`
  display: block;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

const inputStyles = css`
  display: block;
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.gray[900]};
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.input};
  outline: none;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover:not(:focus):not(:disabled) {
    border-color: ${({ theme }) => theme.colors.gray[400]};
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: ${({ theme }) => theme.shadows.focus} ${({ theme }) => theme.colors.primary[100]};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray[50]};
    color: ${({ theme }) => theme.colors.gray[500]};
    cursor: not-allowed;
  }
`;

export const Input = styled.input`
  ${inputStyles}
`;

export const Textarea = styled.textarea`
  ${inputStyles}
  resize: vertical;
  min-height: 80px;
`;

export const Select = styled.select`
  ${inputStyles}
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right ${({ theme }) => theme.spacing[2]} center;
  background-repeat: no-repeat;
  background-size: 1.25rem 1.25rem;
  padding-right: ${({ theme }) => theme.spacing[10]};

  &:disabled {
    cursor: not-allowed;
  }
`;

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 1rem;
  height: 1rem;
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }

  &:checked {
    background-color: ${({ theme }) => theme.colors.primary[600]};
    border-color: ${({ theme }) => theme.colors.primary[600]};
  }

  &:focus {
    box-shadow: ${({ theme }) => theme.shadows.focus} ${({ theme }) => theme.colors.primary[100]};
  }
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
  cursor: pointer;
  user-select: none;
`;

export const HelperText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  line-height: 1.4;
`;

export const ErrorText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.red[600]};
  line-height: 1.4;
`;
