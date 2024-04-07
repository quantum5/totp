import React from 'react';

export default function Input({type, label, value, onChange}: {
  type?: string;
  label: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = React.useId();
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange],
  );

  return <div className="totp-input">
    <label htmlFor={id} className="form-label">{label}</label>
    <input id={id} className="form-control" type={type || 'text'} value={value} onChange={handleChange}/>
  </div>;
}
