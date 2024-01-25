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
    <div className="">
      <label htmlFor={name}>{label}</label>
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        className={`${className}
       border border-slate-200  w-full text-base text-slate-500 p-2 rounded-md  transition duration-700 outline-none hover:border-yellow-400 `}
        onChange={onChange}
        value={value}
        onBlur={onBlur}
      />
      {error && (
        <p className="text-red-700 text-sm mt-2 bg-red-300 rounded-md px-2">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
