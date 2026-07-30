import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import FormInput from '../../components/common/FormInput';
import Button from '../../components/common/Button';
import { Mail, Lock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const { login, ROLES } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('eleanor.vance@peoplesync.io');
  const [password, setPassword] = useState('Password@123');
  const [selectedRole, setSelectedRole] = useState(ROLES.ADMIN);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      login(email, password, selectedRole);
      setIsLoading(false);
      showToast({ message: `Welcome back! Signed in as ${selectedRole}`, type: 'success' });
      navigate('/');
    }, 600);
  };

  const handleQuickDemo = (roleKey) => {
    setSelectedRole(roleKey);
    const emails = {
      ADMIN: 'eleanor.vance@peoplesync.io',
      HR: 'marcus.sterling@peoplesync.io',
      MANAGER: 'sophia.chen@peoplesync.io',
      EMPLOYEE: 'david.miller@peoplesync.io',
    };
    setEmail(emails[roleKey]);
    setPassword('DemoPass2026!');
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-surface/90 dark:bg-surface-cardDark/90 border border-border/80 dark:border-border-dark rounded-3xl shadow-2xl p-8 backdrop-blur-xl relative z-10"
      >
        {/* Brand Badge */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-primary dark:bg-accent text-white flex items-center justify-center text-3xl shadow-soft mb-3">
            🌿
          </div>
          <h2 className="text-2xl font-extrabold text-slate-text dark:text-gray-100 tracking-tight">
            PeopleSync HRMS
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Enterprise Human Resource Operations Portal
          </p>
        </div>

        {/* Quick Demo Role Selector Pills */}
        <div className="mb-6">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2 text-center">
            ⚡ Quick Demo Sign-In Role
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[ROLES.ADMIN, ROLES.HR, ROLES.MANAGER, ROLES.EMPLOYEE].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleQuickDemo(r)}
                className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                  selectedRole === r
                    ? 'bg-primary text-white shadow-soft dark:bg-accent'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Corporate Email Address"
            type="email"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <FormInput
            label="Account Password"
            type="password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showPasswordStrength={true}
            required
          />

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-400">
              <input type="checkbox" defaultChecked className="rounded border-gray-300 text-primary focus:ring-primary/30" />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-primary dark:text-emerald-400 font-semibold hover:underline">
              Forgot Password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-2"
          >
            Sign In to Dashboard <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        {/* Footer Note */}
        <div className="mt-8 text-center text-xs text-gray-400 border-t border-gray-100 dark:border-border-dark pt-4">
          Protected by JWT Enterprise Authentication & RBAC.
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
