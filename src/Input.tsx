import React from 'react';
import classNames from 'classnames';

type CommonProps = {
  label: React.ReactNode;
  error?: React.ReactNode;
};

type TextInputProps = {
  value: string;
  onChange: (value: string) => void;
}

type HTMLInputProps = Omit<React.HTMLProps<HTMLInputElement>, 'onChange' | 'label'>;

function BaseInput({label, value, onChange, error, ...props}: CommonProps & HTMLInputProps & TextInputProps) {
  const id = React.useId();
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange],
  );

  return <div className={classNames('totp-input', {'has-validation': !!error})}>
    <label htmlFor={id} className="form-label">{label}</label>
    <input id={id} className={classNames('form-control', {'is-invalid': !!error})}
           value={value} onChange={handleChange} {...props}/>
    {error && <div className="invalid-feedback">{error}</div>}
  </div>;
}

export function TextInput(props: CommonProps & TextInputProps) {
  return <BaseInput {...props} />;
}

export function NumberInput({value, onChange, ...props}: CommonProps & {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}) {
  const handleChange = React.useCallback((value: string) => onChange(+value), [onChange]);
  return <BaseInput type="number" value={`${value}`} onChange={handleChange} {...props}/>;
}
