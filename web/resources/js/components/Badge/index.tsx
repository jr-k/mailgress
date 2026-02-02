import * as S from './styled';

type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'gray';

interface BadgeProps {
  variant?: BadgeVariant;
  dot?: boolean;
  children: React.ReactNode;
}

export const Badge = ({ variant = 'gray', dot = false, children }: BadgeProps) => {
  return <S.Badge $variant={variant} $dot={dot}>{children}</S.Badge>;
};
