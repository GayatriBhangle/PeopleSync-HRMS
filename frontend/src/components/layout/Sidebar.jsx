import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import {
  FiGrid,
  FiUsers,
  FiBriefcase,
  FiClock,
  FiCalendar,
  FiDollarSign,
  FiCreditCard,
  FiBarChart2,
  FiUser,
  FiSettings,
  FiLogOut,
  FiShield
} from 'react-icons/fi';

export const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const role = user?.role || 'EMPLOYEE';

  // Define menu items per role strictly matching the requirements
  const menuConfig = {
    ADMIN: [
      { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
      { name: 'Employees', path: '/employees', icon: FiUsers },
      { name: 'Departments', path: '/departments', icon: FiBriefcase },
      { name: 'Attendance', path: '/attendance', icon: FiClock },
      { name: 'Leaves', path: '/leaves', icon: FiCalendar },
      { name: 'Payroll', path: '/payroll', icon: FiDollarSign },
      { name: 'Payments', path: '/payments', icon: FiCreditCard },
      { name: 'Reports', path: '/reports', icon: FiBarChart2 },
      { name: 'Profile', path: '/profile', icon: FiUser },
      { name: 'Settings', path: '/settings', icon: FiSettings },
    ],
    HR: [
      { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
      { name: 'Employees', path: '/employees', icon: FiUsers },
      { name: 'Attendance', path: '/attendance', icon: FiClock },
      { name: 'Leaves', path: '/leaves', icon: FiCalendar },
      { name: 'Payroll', path: '/payroll', icon: FiDollarSign },
      { name: 'Payments', path: '/payments', icon: FiCreditCard },
      { name: 'Profile', path: '/profile', icon: FiUser },
    ],
    MANAGER: [
      { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
      { name: 'My Team', path: '/employees', icon: FiUsers },
      { name: 'Attendance', path: '/attendance', icon: FiClock },
      { name: 'Leaves', path: '/leaves', icon: FiCalendar },
      { name: 'Profile', path: '/profile', icon: FiUser },
    ],
    EMPLOYEE: [
      { name: 'Dashboard', path: '/dashboard', icon: FiGrid },
      { name: 'My Profile', path: '/profile', icon: FiUser },
      { name: 'Attendance', path: '/attendance', icon: FiClock },
      { name: 'Leaves', path: '/leaves', icon: FiCalendar },
      { name: 'Payroll History', path: '/payroll', icon: FiDollarSign },
    ]
  };

  const navItems = menuConfig[role] || menuConfig.EMPLOYEE;

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen w-64 bg-slate-900 text-slate-300 transition-transform duration-300 ease-in-out border-r border-slate-800 flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      {/* Brand Logo */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center text-white shadow-md shadow-primary-500/20">
            <FiShield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-wide">PeopleSync</h1>
            <p className="text-[10px] text-primary-400 font-semibold tracking-wider uppercase">Enterprise HRMS</p>
          </div>
        </div>
      </div>

      {/* Role Badge Indicator */}
      <div className="px-6 py-3 border-b border-slate-800/50 bg-slate-950/20">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Access Role</span>
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-primary-500/10 text-primary-400 border border-primary-500/20 uppercase tracking-wider">
            {role}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path + item.name}
              to={item.path}
              className={({ isActive: linkActive }) =>
                `relative flex items-center px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  linkActive
                    ? 'text-white bg-primary-600 shadow-md shadow-primary-600/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className={`w-5 h-5 mr-3 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
              <span>{item.name}</span>
              {isActive && (
                <motion.div
                  layoutId="activeSidePill"
                  className="absolute right-2 w-1.5 h-5 bg-white rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User Profile Card & Logout */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center justify-between bg-slate-800/50 p-2.5 rounded-xl border border-slate-700/50">
          <div className="flex items-center space-x-3 overflow-hidden">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name || 'User'}
              className="w-8 h-8 rounded-lg object-cover ring-2 ring-primary-500/30 flex-shrink-0"
            />
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email || 'user@peoplesync.io'}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <FiLogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
