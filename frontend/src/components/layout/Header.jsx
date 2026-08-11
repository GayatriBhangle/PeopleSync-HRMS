import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiMenu,
  FiSearch,
  FiBell,
  FiChevronDown,
  FiUser,
  FiLogOut,
  FiCheckCircle,
  FiChevronRight
} from 'react-icons/fi';

export const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Generate breadcrumb path
  const pathnames = location.pathname.split('/').filter((x) => x);

  const notifications = [
    { id: 1, title: 'Leave Request Approved', time: '10 mins ago', type: 'success' },
    { id: 2, title: 'July Payroll Generated', time: '1 hour ago', type: 'info' },
    { id: 3, title: 'New Employee Onboarded', time: '3 hours ago', type: 'info' },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 flex items-center justify-between shadow-xs">
      {/* Left side: Sidebar toggle + Breadcrumbs */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors md:hidden"
        >
          <FiMenu className="w-5 h-5" />
        </button>

        {/* Breadcrumb Navigation */}
        <nav className="hidden sm:flex items-center space-x-2 text-xs font-medium text-slate-500">
          <Link to="/dashboard" className="hover:text-primary-600 transition-colors">
            Home
          </Link>
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;

            return (
              <React.Fragment key={to}>
                <FiChevronRight className="w-3.5 h-3.5 text-slate-400" />
                {isLast ? (
                  <span className="text-slate-800 font-semibold uppercase tracking-wider">
                    {value.replace('-', ' ')}
                  </span>
                ) : (
                  <Link to={to} className="hover:text-primary-600 capitalize">
                    {value.replace('-', ' ')}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Right side: Global Search + Notifications + Profile Dropdown */}
      <div className="flex items-center space-x-3">
        {/* Search Bar */}
        <div className="relative hidden md:block w-64">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search employees, leaves..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-100 border border-slate-200/80 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-primary-500 focus:bg-white focus:ring-2 focus:ring-primary-100 transition-all"
          />
        </div>

        {/* Notification Icon & Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <FiBell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary-600 ring-2 ring-white animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-soft-lg border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between px-4 pb-3 border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Notifications</h4>
                <span className="text-[10px] font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                  3 New
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-3.5 hover:bg-slate-50 transition-colors flex items-start space-x-3">
                    <FiCheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-slate-700">{n.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2 px-4 border-t border-slate-100 text-center">
                <button className="text-xs text-primary-600 font-semibold hover:underline">
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2.5 p-1 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
          >
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name}
              className="w-8 h-8 rounded-lg object-cover ring-2 ring-primary-500/30"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name || 'User'}</p>
              <p className="text-[10px] text-primary-600 font-semibold uppercase tracking-wider">{user?.role}</p>
            </div>
            <FiChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-soft-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/profile');
                  }}
                  className="w-full flex items-center px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <FiUser className="w-4 h-4 mr-2.5 text-slate-400" />
                  My Profile & Settings
                </button>
              </div>
              <div className="pt-1 border-t border-slate-100">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <FiLogOut className="w-4 h-4 mr-2.5 text-rose-500" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
