import React from 'react';
import { FolderOpen } from 'lucide-react';
import Button from './Button';

const EmptyState = ({ title = 'No Data Available', description = 'There are no items to display at this time.', actionText, onAction, icon: Icon = FolderOpen }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center my-6">
      <div className="p-4 rounded-3xl bg-gray-100 dark:bg-gray-800/60 text-gray-400 dark:text-gray-500 mb-3">
        <Icon className="w-8 h-8" />
      </div>
      <h4 className="text-base font-bold text-slate-text dark:text-gray-200">{title}</h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mt-1 mb-4">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
