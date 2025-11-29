import React from 'react';

const FormField = ({
  label,
  field,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  showError,
  children,
}) => (
  <label className="block">
    <div className="text-xs">{label}</div>

    {children ? (
      children
    ) : (
      <input
        type={type}
        className="w-full px-2 py-1 border rounded"
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        onBlur={() => onBlur(field)}
      />
    )}

    {showError && error && (
      <div className="text-xs text-red-600">{error}</div>
    )}
  </label>
);


export default FormField;
