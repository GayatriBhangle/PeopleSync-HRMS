import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ArrowUpDown, ChevronLeft, ChevronRight,
  Download, Filter, MoreHorizontal
} from 'lucide-react';
import Button from './Button';
import Skeleton from './Skeleton';
import EmptyState from './EmptyState';

const DataTable = ({
  columns,
  data = [],
  isLoading = false,
  searchPlaceholder = 'Search records...',
  exportFilename = 'export_data.csv',
  onRowClick,
  actions,
  filterOptions,
  onFilterChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [selectedFilter, setSelectedFilter] = useState('ALL');

  // Filtering
  const filteredData = useMemo(() => {
    return data.filter(row => {
      // Filter dropdown check
      if (selectedFilter !== 'ALL' && filterOptions?.key) {
        if (row[filterOptions.key] !== selectedFilter) return false;
      }

      // Search term check
      if (!searchTerm) return true;
      const query = searchTerm.toLowerCase();
      return Object.values(row).some(val =>
        val !== null && val !== undefined && String(val).toLowerCase().includes(query)
      );
    });
  }, [data, searchTerm, selectedFilter, filterOptions]);

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / rowsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // CSV Export
  const handleExportCSV = () => {
    if (!data.length) return;
    const headers = columns.map(c => c.header).join(',');
    const rows = sortedData.map(row =>
      columns.map(c => {
        let val = row[c.accessor];
        if (typeof val === 'string' && val.includes(',')) val = `"${val}"`;
        return val ?? '';
      }).join(',')
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', exportFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-surface dark:bg-surface-cardDark rounded-2xl border border-border/70 dark:border-border-dark shadow-soft overflow-hidden">
      {/* Controls Bar */}
      <div className="p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-100 dark:border-border-dark bg-gray-50/40 dark:bg-black/10">
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 dark:text-gray-200"
            />
          </div>

          {/* Filter Dropdown */}
          {filterOptions && (
            <div className="relative shrink-0">
              <select
                value={selectedFilter}
                onChange={(e) => {
                  setSelectedFilter(e.target.value);
                  if (onFilterChange) onFilterChange(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8 pr-8 py-2 text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-slate-text dark:text-gray-200 appearance-none cursor-pointer"
              >
                <option value="ALL">All {filterOptions.label || 'Filter'}</option>
                {filterOptions.items.map((item, idx) => (
                  <option key={idx} value={item.value}>{item.label}</option>
                ))}
              </select>
              <Filter className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          )}
        </div>

        {/* Actions & Export */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <Button variant="outline" size="sm" icon={Download} onClick={handleExportCSV}>
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/80 dark:bg-gray-900/60 border-b border-gray-200/80 dark:border-border-dark text-xs uppercase font-bold text-gray-500 dark:text-gray-400 tracking-wider">
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  onClick={() => col.sortable !== false && col.accessor && handleSort(col.accessor)}
                  className={`p-4 ${col.sortable !== false && col.accessor ? 'cursor-pointer select-none hover:text-slate-text dark:hover:text-gray-200' : ''}`}
                >
                  <div className="flex items-center gap-1.5">
                    {col.header}
                    {col.sortable !== false && col.accessor && (
                      <ArrowUpDown className="w-3 h-3 text-gray-400" />
                    )}
                  </div>
                </th>
              ))}
              {actions && <th className="p-4 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-border-dark/60 text-sm">
            {isLoading ? (
              Array.from({ length: rowsPerPage }).map((_, rIdx) => (
                <tr key={rIdx}>
                  {columns.map((_, cIdx) => (
                    <td key={cIdx} className="p-4">
                      <Skeleton className="h-5 w-full rounded-lg" />
                    </td>
                  ))}
                  {actions && <td className="p-4"><Skeleton className="h-5 w-8 ml-auto rounded-lg" /></td>}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="p-8 text-center">
                  <EmptyState title="No records found" description="Try adjusting your search query or filter settings." />
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rIdx) => (
                <motion.tr
                  key={row.id || rIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.15, delay: rIdx * 0.03 }}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`group hover:bg-gray-50/70 dark:hover:bg-white/5 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} className="p-4 text-slate-text dark:text-gray-200 font-medium">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                  {actions && (
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-gray-100 dark:border-border-dark flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 bg-gray-50/30 dark:bg-black/10">
        <div>
          Showing {sortedData.length ? (currentPage - 1) * rowsPerPage + 1 : 0} to {Math.min(currentPage * rowsPerPage, sortedData.length)} of {sortedData.length} entries
        </div>

        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-semibold text-slate-text dark:text-gray-200 px-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
