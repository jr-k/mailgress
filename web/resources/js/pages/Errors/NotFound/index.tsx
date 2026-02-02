import { LinkButton } from '@/components/Button';
import * as S from './styled';

export default function NotFound() {
  return (
    <S.Container>
      <S.Content>
        <S.Code>404</S.Code>
        <S.Message>Page not found</S.Message>
        <S.ButtonWrapper>
          <LinkButton href="/dashboard">Go to Dashboard</LinkButton>
        </S.ButtonWrapper>
      </S.Content>
    </S.Container>
  );
}
