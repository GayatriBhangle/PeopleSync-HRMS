import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { FiAlertOctagon, FiHome } from 'react-icons/fi';

export const ForbiddenPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-3xl border border-slate-200 shadow-soft">
        <div className="w-20 h-20 bg-rose-50 border border-rose-100 rounded-3xl flex items-center justify-center mx-auto text-rose-500 mb-6">
          <FiAlertOctagon className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">403</h1>
        <h2 className="text-lg font-bold text-slate-800 mt-2">Access Denied</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6 leading-relaxed">
          You do not have the required permissions to access this page or module under your current role.
        </p>
        <Button onClick={() => navigate('/dashboard')} variant="primary" size="md">
          <FiHome className="w-4 h-4 mr-2" /> Back to Dashboard
        </Button>
      </div>
    </div>
  );
};
