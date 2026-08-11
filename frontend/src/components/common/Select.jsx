import React from 'react';

export const Select = React.forwardRef(({
  label,
  options = [],
  error,
  icon: Icon,
  className = '',
  id,
  required = false,
  placeholder = 'Select option...',
  ...props
}, ref) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={selectId} className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none z-10">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`w-full bg-white border ${
            error ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200' : 'border-slate-200 focus:border-primary-500 focus:ring-primary-100'
          } rounded-xl px-4 py-2.5 text-sm text-slate-800 transition-all duration-200 focus:outline-none focus:ring-4 appearance-none ${
            Icon ? 'pl-11' : ''
          }`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && <p className="text-xs text-rose-500 mt-1 font-medium">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
