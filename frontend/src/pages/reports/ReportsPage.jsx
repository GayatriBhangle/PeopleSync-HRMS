import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { FiBarChart2, FiPieChart, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';

export const ReportsPage = () => {
  const attendanceMonthlyTrend = [
    { month: 'Jan', rate: 96 },
    { month: 'Feb', rate: 94 },
    { month: 'Mar', rate: 98 },
    { month: 'Apr', rate: 95 },
    { month: 'May', rate: 97 },
    { month: 'Jun', rate: 99 },
    { month: 'Jul', rate: 98.5 },
  ];

  const leaveStatsData = [
    { type: 'Annual Leave', days: 45, color: '#3b82f6' },
    { type: 'Sick Leave', days: 18, color: '#10b981' },
    { type: 'Casual Leave', days: 22, color: '#f59e0b' },
    { type: 'Maternity/Paternity', days: 30, color: '#ec4899' },
  ];

  const deptHeadcountData = [
    { department: 'Engineering', count: 42 },
    { department: 'Human Resources', count: 14 },
    { department: 'Product & Design', count: 22 },
    { department: 'Sales & Marketing', count: 35 },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Reports & Analytics Center</h1>
        <p className="text-xs font-medium text-slate-500 mt-1">
          Visual metrics on attendance rates, leave statistics, headcount, and financial expenditure
        </p>
      </div>

      {/* Grid of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Rate Trend */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2.5 bg-blue-50 text-primary-600 rounded-xl">
              <FiTrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Monthly Attendance Rate (%)</h3>
              <p className="text-xs text-slate-400">Punctuality trends year-to-date</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={attendanceMonthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis domain={[90, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => [`${v}%`, 'Attendance Rate']} />
                <Line type="monotone" dataKey="rate" stroke="#2563eb" strokeWidth={3} dot={{ r: 5, fill: '#2563eb' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leave Statistics Donut */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
              <FiPieChart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Leave Type Distribution</h3>
              <p className="text-xs text-slate-400">Total days taken by category</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={leaveStatsData} dataKey="days" nameKey="type" innerRadius={60} outerRadius={90} paddingAngle={4}>
                  {leaveStatsData.map((e, index) => (
                    <Cell key={index} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => [`${v} Days`, 'Leave Taken']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Headcount Bar */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-soft">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
              <FiBarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Department Headcount Comparison</h3>
              <p className="text-xs text-slate-400">Active employee counts across units</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptHeadcountData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="department" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
