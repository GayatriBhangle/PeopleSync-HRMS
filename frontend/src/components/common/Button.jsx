import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  className = '',
  onClick,
  ...props
  }) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none active:scale-[0.98]';

  const variants = {
  primary:
    'bg-primary-600 hover:bg-primary-700 text-white shadow-md shadow-primary-500/20 focus:ring-primary-500',
  secondary:
    'bg-slate-200 hover:bg-slate-300 text-slate-800 border border-slate-300 focus:ring-slate-400',
  outline:
    'border-2 border-primary-600 text-primary-700 bg-white hover:bg-primary-50 focus:ring-primary-500',
  danger:
    'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20 focus:ring-rose-500',
  success:
    'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-500/20 focus:ring-emerald-500',
  ghost:
    'text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-300',
};

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-5 py-2.5 text-base gap-2.5',
  };

  return (
    <motion.button
      whileHover={{ y: disabled || isLoading ? 0 : -1 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      <span>{children}</span>
    </motion.button>
  );
};
