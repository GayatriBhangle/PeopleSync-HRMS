import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const ForbiddenPage = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-20 h-20 rounded-3xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mb-6 shadow-soft">
        <ShieldAlert className="w-10 h-10" />
      </div>
      <h1 className="text-6xl font-extrabold text-slate-text dark:text-gray-100 tracking-tight">403</h1>
      <h2 className="text-xl font-bold text-slate-text dark:text-gray-200 mt-2">Access Restricted</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mt-2 mb-8 leading-relaxed">
        Your current role does not have administrative permissions to view or edit this resource. Switch to **ADMIN** or **HR** role in the top header to preview.
      </p>
      <Link to="/">
        <Button variant="outline" icon={ArrowLeft}>
          Back to Overview
        </Button>
      </Link>
    </div>
  );
};

export default ForbiddenPage;
