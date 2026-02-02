import { useState } from 'react';
import * as S from './styled';

interface AvatarProps {
  src?: string;
  email: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ src, email, size = 'md' }: AvatarProps) {
  const [imgError, setImgError] = useState(false);

  const getInitials = (email: string) => {
    const name = email.split('@')[0];
    if (name.length >= 2) {
      return name.substring(0, 2);
    }
    return name.charAt(0);
  };

  const showFallback = !src || imgError;

  return (
    <S.AvatarWrapper $size={size}>
      {!showFallback ? (
        <S.AvatarImage
          src={src}
          alt={email}
          onError={() => setImgError(true)}
        />
      ) : (
        <S.AvatarFallback>{getInitials(email)}</S.AvatarFallback>
      )}
    </S.AvatarWrapper>
  );
}
