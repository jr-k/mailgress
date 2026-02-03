import { PropsWithChildren } from 'react';
import { usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import * as S from './styled';

export default function GuestLayout({ children }: PropsWithChildren) {
  const { appVersion } = usePage<PageProps>().props;

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
        <S.Version>{appVersion}</S.Version>
      </S.Content>
    </S.Container>
  );
}
