import { PropsWithChildren } from 'react';
import * as S from './styled';

export default function GuestLayout({ children }: PropsWithChildren) {
  return (
    <S.Container>
      <S.Content>
        <S.Branding>
          <S.Logo>
            <S.LogoIcon>
              <img src="/img/mailgress-icon.png" alt="" width="64" height="64" />
            </S.LogoIcon>
          </S.Logo>
        </S.Branding>
        <S.Card>
          <S.BrandName>Mailgress<S.BrandDot /></S.BrandName>
          {children}
        </S.Card>
      </S.Content>
    </S.Container>
  );
}
