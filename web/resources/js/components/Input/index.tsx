import * as S from './styled';

export const Label = S.Label;
export const Input = S.Input;
export const Textarea = S.Textarea;
export const Select = S.Select;
export const Checkbox = S.Checkbox;
export const CheckboxLabel = S.CheckboxLabel;
export const HelperText = S.HelperText;
export const ErrorText = S.ErrorText;

interface FormGroupProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  helper?: string;
  children: React.ReactNode;
}

export const FormGroup = ({ label, htmlFor, error, helper, children }: FormGroupProps) => {
  return (
    <S.InputWrapper>
      {label && <S.Label htmlFor={htmlFor}>{label}</S.Label>}
      {children}
      {error && <S.ErrorText>{error}</S.ErrorText>}
      {helper && !error && <S.HelperText>{helper}</S.HelperText>}
    </S.InputWrapper>
  );
};
