import React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from './Skeleton';
import { EmptyState } from './EmptyState';

export const Table = ({
  columns = [],
  data = [],
  isLoading = false,
  emptyMessage = 'No records found.',
  keyField = 'id',
  onRowClick
}) => {
  if (isLoading) {
    return (
      <div className="w-full bg-white rounded-2xl border border-slate-200 p-4 space-y-4 shadow-sm">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <EmptyState title="No Data Available" description={emptyMessage} />
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {columns.map((col, index) => (
                <th key={col.key || index} className={`px-6 py-4 ${col.className || ''}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {data.map((row, rowIndex) => (
              <motion.tr
                key={row[keyField] || rowIndex}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: rowIndex * 0.03 }}
                onClick={() => onRowClick && onRowClick(row)}
                className={`hover:bg-slate-50/70 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
              >
                {columns.map((col, colIndex) => (
                  <td key={col.key || colIndex} className={`px-6 py-4 whitespace-nowrap ${col.className || ''}`}>
                    {col.render ? col.render(row, rowIndex) : row[col.accessor]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
