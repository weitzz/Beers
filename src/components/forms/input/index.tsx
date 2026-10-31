import React from "react";

interface InputProps {
  label?: string;
  type: string;
  name: string;
  value?: string;
  placeholder?: string;
  className?: string;
  id?: string;
  error?: string | null;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
}

const Input = ({
  label,
  type,
  name,
  value,
  onChange,
  error,
  onBlur,
  className,
  placeholder,
  id,
}: InputProps) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id ?? name} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        type={type}
        id={id ?? name}
        name={name}
        placeholder={placeholder}
        className={`ui-input ${className ?? ""}`}
        onChange={onChange}
        value={value}
        onBlur={onBlur}
      />
      {error && (
        <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
