import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, change, isPositive = true, icon: Icon, color = 'primary' }) => {
  const iconBgClasses = {
    primary: 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-emerald-400',
    secondary: 'bg-secondary/10 text-secondary dark:bg-secondary/20 dark:text-amber-300',
    accent: 'bg-accent/10 text-accent dark:bg-accent/20 dark:text-emerald-300',
    warning: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
    info: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -3 }}
      className="bg-surface dark:bg-surface-cardDark p-5 rounded-2xl border border-border/70 dark:border-border-dark shadow-soft flex flex-col justify-between"
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            {title}
          </span>
          <h4 className="text-2xl font-extrabold text-slate-text dark:text-gray-100 mt-1 tracking-tight">
            {value}
          </h4>
        </div>
        {Icon && (
          <div className={`p-3 rounded-2xl shrink-0 ${iconBgClasses[color] || iconBgClasses.primary}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {change && (
        <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-gray-100 dark:border-border-dark text-xs">
          {isPositive ? (
            <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
              <TrendingUp className="w-3 h-3" />
              {change}
            </span>
          ) : (
            <span className="inline-flex items-center gap-0.5 text-red-600 dark:text-red-400 font-bold bg-red-50 dark:bg-red-950/40 px-2 py-0.5 rounded-full">
              <TrendingDown className="w-3 h-3" />
              {change}
            </span>
          )}
          <span className="text-gray-400 dark:text-gray-500">vs last month</span>
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;
