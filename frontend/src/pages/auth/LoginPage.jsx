import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { FiMail, FiLock, FiShield, FiArrowRight, FiUserCheck } from 'react-icons/fi';

export const LoginPage = () => {
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('eleanor.vance@peoplesync.io');
  const [password, setPassword] = useState('Password@123');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const user = await login(email, password, rememberMe);
      showSuccess(`Welcome back, ${user.name}! Authenticated as ${user.role}.`);
      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Invalid credentials. Please verify your email and password.';
      setErrorMsg(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('Password@123');
    showSuccess(`Selected Demo Account: ${demoRole} (${demoEmail})`);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Dynamic Background Blurs & Lighting Effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-600 text-white shadow-lg shadow-primary-600/30 mb-4">
            <FiShield className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">PeopleSync HRMS</h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">Enterprise Resource & Workforce Management</p>
        </div>

        {/* Demo Quick Selector */}
        <div className="mb-6 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center">
              <FiUserCheck className="mr-1 text-primary-600" /> Quick Demo Login
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => handleDemoSelect('eleanor.vance@peoplesync.io', 'ADMIN')}
              className="px-2.5 py-1.5 bg-white hover:bg-primary-50 text-slate-700 hover:text-primary-700 border border-slate-200 hover:border-primary-300 rounded-xl text-xs font-semibold transition-all text-left flex items-center justify-between"
            >
              <span>Admin</span>
              <span className="text-[9px] bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded">ADMIN</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoSelect('marcus.sterling@peoplesync.io', 'HR')}
              className="px-2.5 py-1.5 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-xl text-xs font-semibold transition-all text-left flex items-center justify-between"
            >
              <span>HR Manager</span>
              <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">HR</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoSelect('david.miller@peoplesync.io', 'MANAGER')}
              className="px-2.5 py-1.5 bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-300 rounded-xl text-xs font-semibold transition-all text-left flex items-center justify-between"
            >
              <span>Team Lead</span>
              <span className="text-[9px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded">MGR</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoSelect('sarah.jenkins@peoplesync.io', 'EMPLOYEE')}
              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl text-xs font-semibold transition-all text-left flex items-center justify-between"
            >
              <span>Employee</span>
              <span className="text-[9px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">EMP</span>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium">
            {errorMsg}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Corporate Email"
            type="email"
            placeholder="name@peoplesync.io"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={FiMail}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={FiLock}
            required
          />

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500 border-slate-300"
              />
              <span className="text-xs text-slate-600 font-medium">Remember me</span>
            </label>
            <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset link sent to registered email'); }} className="text-xs text-primary-600 font-semibold hover:underline">
              Forgot password?
            </a>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            className="w-full mt-2"
          >
            Sign In to HRMS 
          </Button>
        </form>

        <div className="mt-8 text-center border-t border-slate-100 pt-4">
          <p className="text-[11px] text-slate-400">
            Protected by JWT & Spring Boot Security • SSL Encrypted
          </p>
        </div>
      </motion.div>
    </div>
  );
};
