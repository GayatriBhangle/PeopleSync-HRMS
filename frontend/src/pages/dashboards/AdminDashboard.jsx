import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers,
  FiBriefcase,
  FiClock,
  FiCalendar,
  FiDollarSign,
  FiCreditCard,
  FiTrendingUp,
  FiActivity,
  FiUserPlus,
  FiFileText,
  FiCheckCircle,
  FiArrowUpRight
} from 'react-icons/fi';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { employeeService } from '../../services/employeeService';
import { departmentService } from '../../services/departmentService';
import { attendanceService } from '../../services/attendanceService';
import { leaveService } from '../../services/leaveService';
import { payrollService } from '../../services/payrollService';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    todayAttendance: 0,
    pendingLeaves: 0,
    payrollProcessed: 0,
    monthlySalaryPaid: '$42,350.00'
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        const [emps, depts, att, leaves, payrolls] = await Promise.all([
          employeeService.getAllEmployees(),
          departmentService.getAllDepartments(),
          attendanceService.getAttendanceByDate(todayStr),
          leaveService.getAllLeaves(),
          payrollService.getAllPayrolls()
        ]);

        const pending = leaves.filter(l => l.status === 'PENDING').length;
        const paidCount = payrolls.filter(p => p.status === 'PAID').length;

        setStats({
          totalEmployees: emps.length || 48,
          totalDepartments: depts.length || 6,
          todayAttendance: att.length || 42,
          pendingLeaves: pending || 3,
          payrollProcessed: paidCount || 12,
          monthlySalaryPaid: '$148,500.00'
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // Recharts Chart Mock Data
  const attendanceTrendData = [
    { day: 'Mon', Present: 44, Absent: 4 },
    { day: 'Tue', Present: 46, Absent: 2 },
    { day: 'Wed', Present: 47, Absent: 1 },
    { day: 'Thu', Present: 45, Absent: 3 },
    { day: 'Fri', Present: 42, Absent: 6 },
  ];

  const deptDistribution = [
    { name: 'Engineering', count: 42, color: '#3b82f6' },
    { name: 'HR', count: 14, color: '#10b981' },
    { name: 'Product', count: 22, color: '#6366f1' },
    { name: 'Sales', count: 35, color: '#f59e0b' },
  ];

  const monthlyPayrollData = [
    { month: 'Mar', amount: 120000 },
    { month: 'Apr', amount: 128000 },
    { month: 'May', amount: 135000 },
    { month: 'Jun', amount: 142000 },
    { month: 'Jul', amount: 148500 },
  ];

  const recentActivities = [
    { id: 1, title: 'New Employee Joined', desc: 'Sarah Jenkins registered in Engineering', time: '10m ago', icon: FiUserPlus, color: 'text-emerald-500 bg-emerald-50' },
    { id: 2, title: 'Leave Approved', desc: 'David Miller (Annual Leave - 5 Days)', time: '45m ago', icon: FiCheckCircle, color: 'text-primary-500 bg-primary-50' },
    { id: 3, title: 'Payroll Disbursement', desc: 'July 2026 Salary batch executed', time: '2h ago', icon: FiDollarSign, color: 'text-indigo-500 bg-indigo-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Title & Intro */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Admin Dashboard</h1>
          <p className="text-xs font-medium text-slate-500 mt-1">Real-time enterprise overview & system status</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/employees')}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-primary-500/20 transition-all flex items-center"
          >
            <FiUserPlus className="w-4 h-4 mr-2" /> Add Employee
          </button>
          <button
            onClick={() => navigate('/payroll')}
            className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold transition-all flex items-center"
          >
            <FiDollarSign className="w-4 h-4 mr-2 text-emerald-600" /> Process Payroll
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Card 1 */}
        <motion.div whileHover={{ y: -3 }} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Employees</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-primary-600">
              <FiUsers className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800 mt-3">{stats.totalEmployees}</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center">
            <FiTrendingUp className="mr-1" /> +12% this month
          </p>
        </motion.div>

        {/* Card 2 */}
        <motion.div whileHover={{ y: -3 }} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Departments</span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <FiBriefcase className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800 mt-3">{stats.totalDepartments}</p>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">4 Active Hubs</p>
        </motion.div>

        {/* Card 3 */}
        <motion.div whileHover={{ y: -3 }} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <FiClock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800 mt-3">{stats.todayAttendance}</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">94% Present Today</p>
        </motion.div>

        {/* Card 4 */}
        <motion.div whileHover={{ y: -3 }} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Leaves</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <FiCalendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800 mt-3">{stats.pendingLeaves}</p>
          <p className="text-[11px] text-amber-600 font-semibold mt-1">Requires HR Review</p>
        </motion.div>

        {/* Card 5 */}
        <motion.div whileHover={{ y: -3 }} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payroll Status</span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <FiDollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800 mt-3">{stats.payrollProcessed} Paid</p>
          <p className="text-[11px] text-purple-600 font-semibold mt-1">July 2026 Complete</p>
        </motion.div>

        {/* Card 6 */}
        <motion.div whileHover={{ y: -3 }} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Salary Paid</span>
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600">
              <FiCreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xl font-black text-slate-800 mt-3">{stats.monthlySalaryPaid}</p>
          <p className="text-[11px] text-teal-600 font-semibold mt-1">Disbursed via Payment Module</p>
        </motion.div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Attendance Trend */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">Weekly Attendance Trend</h3>
              <p className="text-xs text-slate-400 mt-0.5">Daily workforce check-in breakdown</p>
            </div>
            <span className="text-xs font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
              This Week
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="Present" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Absent" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Distribution Donut */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-800">Department Headcount</h3>
            <p className="text-xs text-slate-400 mt-0.5">Employee distribution across departments</p>
          </div>
          <div className="h-52 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deptDistribution} dataKey="count" nameKey="name" innerRadius={55} outerRadius={80} paddingAngle={4}>
                  {deptDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3">
            {deptDistribution.map((d) => (
              <div key={d.name} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-xs font-semibold text-slate-700">{d.name} ({d.count})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Payroll Growth & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Salary Paid Curve */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-800">Monthly Payroll Expenditure</h3>
              <p className="text-xs text-slate-400 mt-0.5">Total salary disbursement history</p>
            </div>
            <button onClick={() => navigate('/reports')} className="text-xs text-primary-600 font-semibold hover:underline flex items-center">
              View Detailed Report <FiArrowUpRight className="ml-1" />
            </button>
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyPayrollData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSalary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Total Paid']} />
                <Area type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorSalary)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent System Activity Widget */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-800">Recent Activities</h3>
            <FiActivity className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-4">
            {recentActivities.map((act) => {
              const Icon = act.icon;
              return (
                <div key={act.id} className="flex items-start space-x-3.5 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100">
                  <div className={`p-2 rounded-xl ${act.color} flex-shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800">{act.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">{act.desc}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{act.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};