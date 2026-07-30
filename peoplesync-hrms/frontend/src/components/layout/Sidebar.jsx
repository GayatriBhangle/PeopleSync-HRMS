import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building2, CalendarCheck, CalendarDays,
  CreditCard, BarChart3, User, ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Employees', path: '/employees', icon: Users, badge: '42' },
    { label: 'Departments', path: '/departments', icon: Building2 },
    { label: 'Attendance', path: '/attendance', icon: CalendarCheck, badge: 'Live' },
    { label: 'Leave', path: '/leave', icon: CalendarDays, badge: '2 New' },
    { label: 'Payroll', path: '/payroll', icon: CreditCard },
    { label: 'Reports', path: '/reports', icon: BarChart3 },
    { label: 'Settings', path: '/profile', icon: User },
  ];

  return (
    <aside
      className={`sticky top-0 h-screen bg-surface dark:bg-surface-dark border-r border-border/60 dark:border-border-dark flex flex-col justify-between transition-all duration-300 z-40 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100 dark:border-border-dark">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-primary dark:bg-accent text-white flex items-center justify-center font-black text-xl shadow-soft shrink-0">
              🌿
            </div>
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h1 className="text-base font-extrabold text-slate-text dark:text-gray-100 tracking-tight leading-none">
                  PeopleSync
                </h1>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-emerald-700 dark:text-emerald-400">
                  Enterprise HRMS
                </span>
              </motion.div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-xl text-gray-400 hover:text-slate-text dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-3 rounded-2xl font-semibold text-xs md:text-sm transition-all duration-200 group ${
                    isActive
                      ? 'bg-primary text-white shadow-soft dark:bg-accent'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-slate-text dark:hover:text-gray-200'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-slate-text dark:group-hover:text-gray-200'}`} />
                      {!collapsed && <span>{item.label}</span>}
                    </div>

                    {!collapsed && item.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Banner */}
      {!collapsed && (
        <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 border border-primary/20 dark:border-primary/40">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-text dark:text-gray-200">
            <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Enterprise v2.4</span>
          </div>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
            Connected to Java 21 REST API.
          </p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
