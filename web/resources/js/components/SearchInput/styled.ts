import styled from 'styled-components';

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 20rem;
`;

export const Icon = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.gray[400]};
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]} ${theme.spacing[2]} ${theme.spacing[10]}`};
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
`;

export const ClearButton = styled.button`
  position: absolute;
  right: ${({ theme }) => theme.spacing[2]};
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  padding: 0;
  color: ${({ theme }) => theme.colors.gray[400]};
  background: none;
  border: none;
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.gray[600]};
    background-color: ${({ theme }) => theme.colors.gray[100]};
  }
`;
