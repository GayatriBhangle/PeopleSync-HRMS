import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX, FiAlertTriangle } from 'react-icons/fi';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showSuccess = useCallback((msg, dur) => addToast(msg, 'success', dur), [addToast]);
  const showError = useCallback((msg, dur) => addToast(msg, 'error', dur), [addToast]);
  const showInfo = useCallback((msg, dur) => addToast(msg, 'info', dur), [addToast]);
  const showWarning = useCallback((msg, dur) => addToast(msg, 'warning', dur), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, showSuccess, showError, showInfo, showWarning }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            const icons = {
              success: <FiCheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
              error: <FiAlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />,
              warning: <FiAlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />,
              info: <FiInfo className="w-5 h-5 text-primary-500 flex-shrink-0" />,
            };

            const borderColors = {
              success: 'border-l-4 border-l-emerald-500',
              error: 'border-l-4 border-l-rose-500',
              warning: 'border-l-4 border-l-amber-500',
              info: 'border-l-4 border-l-primary-500',
            };

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                className={`pointer-events-auto flex items-center justify-between p-4 bg-white/95 backdrop-blur-md rounded-xl shadow-soft-lg border border-slate-200 ${borderColors[toast.type]}`}
              >
                <div className="flex items-center space-x-3 pr-2">
                  {icons[toast.type]}
                  <p className="text-sm font-medium text-slate-700 leading-snug">{toast.message}</p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
