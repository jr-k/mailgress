import { Link } from '@inertiajs/react';
import { ComponentProps, forwardRef } from 'react';
import * as S from './styled';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  size?: 'sm' | 'md';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', fullWidth, size = 'md', children, ...props }, ref) => {
    return (
      <S.Button ref={ref} $variant={variant} $fullWidth={fullWidth} $size={size} {...props}>
        {children}
      </S.Button>
    );
  }
);

Button.displayName = 'Button';

interface LinkButtonProps extends ComponentProps<typeof Link> {
  variant?: 'primary' | 'secondary';
}

export const LinkButton = ({ variant = 'primary', children, href, ...props }: LinkButtonProps) => {
  return (
    <Link href={href} {...props}>
      <S.LinkButton as="span" $variant={variant}>
        {children}
      </S.LinkButton>
    </Link>
  );
};

interface TextLinkProps extends ComponentProps<typeof Link> {
  variant?: 'default' | 'danger';
}

export const TextLink = ({ variant = 'default', children, href, ...props }: TextLinkProps) => {
  return (
    <Link href={href} {...props}>
      <S.TextLink as="span" $variant={variant}>
        {children}
      </S.TextLink>
    </Link>
  );
};
