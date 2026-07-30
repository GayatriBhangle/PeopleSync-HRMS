import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { Home, Compass } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-20 h-20 rounded-3xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-emerald-400 flex items-center justify-center mb-6 shadow-soft">
        <Compass className="w-10 h-10 animate-spin-slow" />
      </div>
      <h1 className="text-6xl font-extrabold text-slate-text dark:text-gray-100 tracking-tight">404</h1>
      <h2 className="text-xl font-bold text-slate-text dark:text-gray-200 mt-2">Page Not Found</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mt-2 mb-8 leading-relaxed">
        The HR portal page you are looking for might have been moved, renamed, or is temporarily unavailable.
      </p>
      <Link to="/">
        <Button variant="primary" icon={Home}>
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
