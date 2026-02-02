import { LinkButton } from '@/components/Button';
import * as S from './styled';

export default function ServerError() {
  return (
    <S.Container>
      <S.Content>
        <S.Code>500</S.Code>
        <S.Message>Server error</S.Message>
        <S.ButtonWrapper>
          <LinkButton href="/dashboard">Go to Dashboard</LinkButton>
        </S.ButtonWrapper>
      </S.Content>
    </S.Container>
  );
}
