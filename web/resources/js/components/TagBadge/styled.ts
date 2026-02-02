import styled from 'styled-components';

export const TagBadge = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ $color }) => $color};
  background-color: ${({ $color }) => `${$color}15`};
  border: 1px solid ${({ $color }) => `${$color}30`};
  border-radius: ${({ theme }) => theme.radii.full};
  white-space: nowrap;
`;

export const ColorDot = styled.span<{ $color: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
`;

export const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[1]};
`;
