import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { NOTIFICATIONS } from '../../services/mockData';
import {
  Bell, Sun, Moon, Search, Shield, ChevronDown, User, LogOut,
  Sliders, CheckCircle2, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { currentUser, activeRole, switchRole, logout, ROLES } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="sticky top-0 z-30 w-full h-16 bg-surface/80 dark:bg-surface-dark/80 backdrop-blur-md border-b border-border/60 dark:border-border-dark px-4 lg:px-8 flex items-center justify-between transition-colors">
      {/* Search Input */}
      <div className="flex items-center gap-4 w-full max-w-xs md:max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search employees, departments, reports (Ctrl + K)..."
            className="w-full pl-10 pr-4 py-2 text-xs md:text-sm bg-gray-100/80 dark:bg-gray-900/80 border border-transparent focus:border-primary/30 rounded-2xl focus:outline-none focus:bg-white dark:focus:bg-gray-900 transition-all text-slate-text dark:text-gray-200"
          />
        </div>
      </div>

      {/* Right Navbar Controls */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Dynamic Role Switcher (For User Previewing All 4 Roles) */}
        <div className="relative group">
          <div className="flex items-center gap-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-emerald-300 px-3 py-1.5 rounded-2xl border border-primary/20 dark:border-primary/40 text-xs font-bold cursor-pointer">
            <Shield className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">Role:</span>
            <select
              value={activeRole}
              onChange={(e) => switchRole(e.target.value)}
              className="bg-transparent border-none focus:outline-none font-bold cursor-pointer pr-1 text-xs"
            >
              <option value={ROLES.ADMIN} className="text-gray-900">ADMIN</option>
              <option value={ROLES.HR} className="text-gray-900">HR</option>
              <option value={ROLES.MANAGER} className="text-gray-900">MANAGER</option>
              <option value={ROLES.EMPLOYEE} className="text-gray-900">EMPLOYEE</option>
            </select>
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-2xl text-gray-500 hover:text-slate-text dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          title="Toggle Dark/Light Mode"
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            className="relative p-2 rounded-2xl text-gray-500 hover:text-slate-text dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-accent rounded-full ring-2 ring-white dark:ring-gray-900 animate-pulse" />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 md:w-96 bg-surface dark:bg-surface-cardDark border border-border/80 dark:border-border-dark rounded-3xl shadow-2xl overflow-hidden z-50"
              >
                <div className="p-4 border-b border-gray-100 dark:border-border-dark flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-text dark:text-gray-100">Notifications</h4>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="text-xs text-primary dark:text-emerald-400 font-semibold hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-border-dark">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-4 transition-colors flex items-start gap-3 ${
                        n.read ? 'opacity-70 bg-transparent' : 'bg-primary/5 dark:bg-primary/10'
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-white dark:bg-gray-800 text-primary dark:text-emerald-400 shadow-xs shrink-0">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-text dark:text-gray-200">{n.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">{n.message}</p>
                        <span className="text-[10px] text-gray-400 mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 p-1 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-9 h-9 rounded-2xl object-cover ring-2 ring-primary/20 dark:ring-primary/40"
            />
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-text dark:text-gray-100 leading-tight">{currentUser.name}</p>
              <p className="text-[10px] text-gray-400 capitalize">{currentUser.designation}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400 hidden md:block" />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-56 bg-surface dark:bg-surface-cardDark border border-border/80 dark:border-border-dark rounded-3xl shadow-2xl overflow-hidden z-50 p-2"
              >
                <div className="p-3 border-b border-gray-100 dark:border-border-dark">
                  <p className="text-xs font-bold text-slate-text dark:text-gray-100">{currentUser.name}</p>
                  <p className="text-[11px] text-gray-400 truncate">{currentUser.email}</p>
                </div>

                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <User className="w-4 h-4 text-gray-400" />
                    My Profile
                  </Link>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                      navigate('/login');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
