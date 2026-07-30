import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  onClick,
  className = '',
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-primary hover:bg-primary-dark text-white shadow-soft hover:shadow-soft-hover focus:ring-primary/40 dark:bg-accent dark:hover:bg-accent-hover',
    secondary: 'bg-secondary hover:bg-secondary-dark text-white shadow-soft hover:shadow-soft-hover focus:ring-secondary/40',
    outline: 'border border-border dark:border-border-dark text-slate-text dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5 focus:ring-primary/30',
    ghost: 'text-slate-text dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 focus:ring-primary/20',
    danger: 'bg-red-600 hover:bg-red-700 text-white shadow-soft focus:ring-red-500/40',
    success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-soft focus:ring-emerald-500/40',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5',
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.01 }}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </motion.button>
  );
};

export default Button;
