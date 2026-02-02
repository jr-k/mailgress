import { LinkButton } from '@/components/Button';
import * as S from './styled';

export default function Forbidden() {
  return (
    <S.Container>
      <S.Content>
        <S.Code>403</S.Code>
        <S.Message>Access forbidden</S.Message>
        <S.ButtonWrapper>
          <LinkButton href="/dashboard">Go to Dashboard</LinkButton>
        </S.ButtonWrapper>
      </S.Content>
    </S.Container>
  );
}
