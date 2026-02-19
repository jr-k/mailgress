import * as S from './styled';

interface ToggleSwitchProps {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  activeLabel?: string;
  inactiveLabel?: string;
  title?: string;
}

export function ToggleSwitch({
  active,
  disabled,
  onClick,
  activeLabel = 'Active',
  inactiveLabel = 'Inactive',
  title,
}: ToggleSwitchProps) {
  return (
    <S.Button
      onClick={onClick}
      disabled={disabled}
      $active={active}
      title={title || (active ? `Disable` : `Enable`)}
    >
      <S.Track $active={active}>
        <S.Thumb $active={active} />
      </S.Track>
      <S.Label $active={active}>
        {active ? activeLabel : inactiveLabel}
      </S.Label>
    </S.Button>
  );
}
