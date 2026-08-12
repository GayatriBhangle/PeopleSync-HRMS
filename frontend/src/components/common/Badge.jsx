import React from 'react';

export const Badge = ({ children, status, variant = 'default', className = '' }) => {
  const getBadgeStyle = () => {
    const val = (status || children || '').toString().toUpperCase();

    if (['ACTIVE', 'PAID', 'APPROVED', 'PRESENT', 'SUCCESS', 'COMPLETED'].includes(val)) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20';
    }
    if (['PENDING', 'PROCESSED', 'IN_PROGRESS'].includes(val)) {
      return 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20';
    }
    if (['INACTIVE', 'REJECTED', 'FAILED', 'ABSENT', 'CANCELLED'].includes(val)) {
      return 'bg-rose-50 text-rose-700 border-rose-200 ring-rose-500/20';
    }
    if (['ADMIN', 'HR'].includes(val)) {
      return 'bg-primary-50 text-primary-700 border-primary-200 ring-primary-500/20';
    }
    if (['MANAGER', 'EMPLOYEE'].includes(val)) {
      return 'bg-indigo-50 text-indigo-700 border-indigo-200 ring-indigo-500/20';
    }

    return 'bg-slate-100 text-slate-700 border-slate-200 ring-slate-400/20';
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors ${getBadgeStyle()} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {children || status}
    </span>
  );
};
