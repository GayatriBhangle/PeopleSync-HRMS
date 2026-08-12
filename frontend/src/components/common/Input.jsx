import React, { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export const Input = React.forwardRef(({
  label,
  type = 'text',
  error,
  icon: Icon,
  placeholder,
  className = '',
  id,
  required = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === 'password';
  const inputType = isPasswordType ? (showPassword ? 'text' : 'password') : type;
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          placeholder={placeholder}
          className={`w-full bg-white border ${
            error ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200' : 'border-slate-200 focus:border-primary-500 focus:ring-primary-100'
          } rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-4 ${
            Icon ? 'pl-11' : ''
          } ${isPasswordType ? 'pr-11' : ''}`}
          {...props}
        />
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-rose-500 mt-1 font-medium">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
