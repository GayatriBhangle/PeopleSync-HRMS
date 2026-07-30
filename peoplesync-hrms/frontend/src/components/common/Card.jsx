import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hoverEffect = true, onClick, title, subtitle, action }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hoverEffect ? { y: -2, transition: { duration: 0.15 } } : {}}
      onClick={onClick}
      className={`bg-surface dark:bg-surface-cardDark rounded-2xl p-6 border border-border/70 dark:border-border-dark shadow-soft ${
        hoverEffect ? 'hover:shadow-soft-hover transition-all duration-200' : ''
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && <h3 className="text-lg font-bold text-slate-text dark:text-gray-100 tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </motion.div>
  );
};

export default Card;
