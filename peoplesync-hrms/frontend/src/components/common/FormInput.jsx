import React, { useState } from 'react';
import { Eye, EyeOff, Check, AlertCircle } from 'lucide-react';

const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error,
  required = false,
  options = [], // for dropdown select
  showPasswordStrength = false,
  helpText,
  icon: Icon,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // Password strength score (0-4)
  const calculateStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strengthScore = type === 'password' && showPasswordStrength ? calculateStrength(value) : 0;
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];

  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-4 h-4" />
          </div>
        )}

        {type === 'select' ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className={`w-full ${Icon ? 'pl-9' : 'pl-3.5'} pr-8 py-2.5 text-sm bg-white dark:bg-gray-900 border ${
              error ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-300 dark:border-gray-700 focus:ring-primary/30'
            } rounded-2xl focus:outline-none focus:ring-2 text-slate-text dark:text-gray-100 transition-all appearance-none`}
            {...props}
          >
            <option value="">Select option...</option>
            {options.map((opt, idx) => (
              <option key={idx} value={opt.value || opt}>
                {opt.label || opt}
              </option>
            ))}
          </select>
        ) : type === 'textarea' ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            rows={3}
            className={`w-full p-3 text-sm bg-white dark:bg-gray-900 border ${
              error ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-300 dark:border-gray-700 focus:ring-primary/30'
            } rounded-2xl focus:outline-none focus:ring-2 text-slate-text dark:text-gray-100 transition-all resize-none`}
            {...props}
          />
        ) : (
          <input
            type={inputType}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={`w-full ${Icon ? 'pl-9' : 'pl-3.5'} ${type === 'password' ? 'pr-10' : 'pr-3.5'} py-2.5 text-sm bg-white dark:bg-gray-900 border ${
              error ? 'border-red-500 focus:ring-red-500/30' : 'border-gray-300 dark:border-gray-700 focus:ring-primary/30'
            } rounded-2xl focus:outline-none focus:ring-2 text-slate-text dark:text-gray-100 transition-all`}
            {...props}
          />
        )}

        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Password Strength Indicator */}
      {type === 'password' && showPasswordStrength && value && (
        <div className="pt-1 space-y-1">
          <div className="flex items-center gap-1.5 h-1.5 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`h-full flex-1 transition-all duration-300 ${
                  i < strengthScore ? strengthColors[strengthScore - 1] : 'bg-transparent'
                }`}
              />
            ))}
          </div>
          <p className="text-[11px] font-medium text-gray-500 dark:text-gray-400 flex justify-between">
            <span>Password Strength:</span>
            <span className="font-semibold text-slate-text dark:text-gray-200">
              {strengthScore > 0 ? strengthLabels[strengthScore - 1] : 'Very Weak'}
            </span>
          </p>
        </div>
      )}

      {error ? (
        <p className="text-xs text-red-500 font-medium flex items-center gap-1">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {error}
        </p>
      ) : helpText ? (
        <p className="text-xs text-gray-400 dark:text-gray-500">{helpText}</p>
      ) : null}
    </div>
  );
};

export default FormInput;
