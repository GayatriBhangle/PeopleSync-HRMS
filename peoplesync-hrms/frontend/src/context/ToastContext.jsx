import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X, RotateCcw } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = ({ message, type = 'success', duration = 4000, onUndo }) => {
    const id = Date.now();
    const newToast = { id, message, type, onUndo };
    
    setToasts(prev => [...prev, newToast]);

    if (duration) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl shadow-soft border ${
                toast.type === 'success' ? 'bg-emerald-900/90 text-white border-emerald-700' :
                toast.type === 'danger' ? 'bg-red-900/90 text-white border-red-700' :
                toast.type === 'warning' ? 'bg-amber-900/90 text-white border-amber-700' :
                'bg-slate-900/90 text-white border-slate-700'
              } glass-panel backdrop-blur-md`}
            >
              <div className="flex items-center gap-3">
                {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                {toast.type === 'danger' && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
                {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />}
                {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
                <p className="text-sm font-medium leading-tight">{toast.message}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-3">
                {toast.onUndo && (
                  <button
                    onClick={() => {
                      toast.onUndo();
                      removeToast(toast.id);
                    }}
                    className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Undo
                  </button>
                )}
                <button
                  onClick={() => removeToast(toast.id)}
                  className="p-1 rounded-lg hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4 text-white/80" />
                </button>
              </div>
            </motion.div>
          ))}
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
