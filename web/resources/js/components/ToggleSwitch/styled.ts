import styled from 'styled-components';

export const Button = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => `${theme.spacing[1]} 0`};
  transition: opacity 0.15s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const Track = styled.span<{ $active: boolean }>`
  position: relative;
  width: 2.25rem;
  height: 1.25rem;
  border-radius: 9999px;
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.green[500] : theme.colors.text.tertiary};
  transition: background-color 0.2s ease;
  flex-shrink: 0;
`;

export const Thumb = styled.span<{ $active: boolean }>`
  position: absolute;
  top: 0.125rem;
  left: ${({ $active }) => ($active ? '1.125rem' : '0.125rem')};
  width: 1rem;
  height: 1rem;
  border-radius: 9999px;
  background-color: white;
  transition: left 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

export const Label = styled.span<{ $active: boolean }>`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.green[500] : theme.colors.text.tertiary};
  transition: color 0.2s ease;
`;
