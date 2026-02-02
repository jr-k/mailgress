import * as S from './styled';

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  variant?: AlertVariant;
  children: React.ReactNode;
}

export const Alert = ({ variant = 'info', children }: AlertProps) => {
  return <S.Alert $variant={variant}>{children}</S.Alert>;
};
