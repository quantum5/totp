import React from 'react';

export default function Select<T extends string>({label, options, value, onChange}: {
  label: React.ReactNode;
  options: Record<T, string>;
  value: T;
  onChange: (value: T) => void;
}) {
  const id = React.useId();
  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value as T),
    [onChange],
  );

  return <div className="totp-select">
    <label htmlFor={id} className="form-label">{label}</label>
    <select id={id} className="form-select" value={value} onChange={handleChange}>
      {Object.entries(options).map(([key, value]) =>
        <option key={key} value={key}>{value as string}</option>)}
    </select>
  </div>;
}
