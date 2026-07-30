import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { attendanceService, reportService } from '../services/api';
import { INITIAL_EMPLOYEES, INITIAL_LEAVE_REQUESTS, ACTIVITIES } from '../services/mockData';
import StatCard from '../components/common/StatCard';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import {
  Users, CalendarCheck, CalendarDays, DollarSign, Clock,
  CheckCircle, LogOut, ArrowRight, UserPlus, FileSpreadsheet
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { motion } from 'framer-motion';

const DashboardPage = () => {
  const { currentUser, activeRole } = useAuth();
  const { showToast } = useToast();

  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [chartsData, setChartsData] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    reportService.getChartsData().then(data => setChartsData(data));
  }, []);

  const handleToggleCheckIn = async () => {
    if (!isCheckedIn) {
      const record = await attendanceService.checkIn(currentUser.employeeId, currentUser.name, currentUser.department);
      setIsCheckedIn(true);
      setCheckInTime(record.checkIn);
      showToast({ message: `Successfully Checked In at ${record.checkIn}`, type: 'success' });
    } else {
      await attendanceService.checkOut(currentUser.employeeId);
      setIsCheckedIn(false);
      showToast({ message: 'Checked Out. Work duration logged!', type: 'info' });
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary-dark to-secondary text-white p-6 md:p-8 shadow-2xl"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-md mb-2">
              Role: {activeRole} Dashboard
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Good day, {currentUser.name}! 👋
            </h1>
            <p className="text-xs md:text-sm text-white/80 mt-1 max-w-xl">
              {activeRole === 'EMPLOYEE'
                ? "Here is your personal attendance log, leave balances, and salary history."
                : "Welcome to PeopleSync HR Portal. Overview of workforce operations, attendance metrics, and pending approvals."}
            </p>
          </div>

          {/* Live Check-In Widget */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex items-center gap-4 shrink-0 shadow-lg">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-white/70 block">Live Clock</span>
              <p className="text-lg font-extrabold font-mono leading-tight">{currentTime}</p>
              {isCheckedIn && <span className="text-[10px] text-emerald-300 font-semibold">Checked in since {checkInTime}</span>}
            </div>

            <Button
              variant={isCheckedIn ? 'danger' : 'success'}
              size="md"
              onClick={handleToggleCheckIn}
              className="shadow-lg"
            >
              {isCheckedIn ? (
                <>
                  <LogOut className="w-4 h-4" /> Check Out
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" /> Check In
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Decorative Circles */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </motion.div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Workforce"
          value="113 Active"
          change="+8.4%"
          isPositive={true}
          icon={Users}
          color="primary"
        />
        <StatCard
          title="Today's Attendance"
          value="98.4%"
          change="+1.2%"
          isPositive={true}
          icon={CalendarCheck}
          color="accent"
        />
        <StatCard
          title="Pending Leaves"
          value="4 Requests"
          change="-2"
          isPositive={true}
          icon={CalendarDays}
          color="warning"
        />
        <StatCard
          title="Monthly Payroll"
          value="$342,500"
          change="+4.1%"
          isPositive={true}
          icon={DollarSign}
          color="secondary"
        />
      </div>

      {/* Recharts Section */}
      {chartsData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Area Chart */}
          <Card title="Attendance Performance Trend" subtitle="Monthly presence rate percentage across enterprise" className="lg:col-span-2">
            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartsData.attendanceTrend}>
                  <defs>
                    <linearGradient id="attendanceColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1F4D3B" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#1F4D3B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                  <YAxis domain={[80, 100]} stroke="#9CA3AF" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18221D', borderColor: '#2D3F36', borderRadius: '12px', color: '#FFF' }}
                  />
                  <Area type="monotone" dataKey="rate" stroke="#1F4D3B" strokeWidth={3} fillOpacity={1} fill="url(#attendanceColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Dept Distribution Donut Chart */}
          <Card title="Department Roster" subtitle="Employee headcount distribution">
            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartsData.deptDistribution}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {chartsData.deptDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18221D', borderColor: '#2D3F36', borderRadius: '12px', color: '#FFF' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      )}

      {/* Salary Distribution Bar Chart & Activity Feed */}
      {chartsData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Salary Distribution */}
          <Card title="Compensation Bands" subtitle="Salary breakdown range" className="lg:col-span-2">
            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartsData.salaryDistribution}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                  <XAxis dataKey="range" stroke="#9CA3AF" fontSize={12} />
                  <YAxis stroke="#9CA3AF" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18221D', borderColor: '#2D3F36', borderRadius: '12px', color: '#FFF' }}
                  />
                  <Bar dataKey="count" fill="#2E7D57" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Activity Feed */}
          <Card title="Recent HR Activities" subtitle="Real-time audit log">
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {ACTIVITIES.map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-text dark:text-gray-200">
                      {act.user} <span className="font-normal text-gray-500">{act.action}</span>
                    </p>
                    <p className="text-emerald-700 dark:text-emerald-400 font-semibold">{act.target}</p>
                    <span className="text-[10px] text-gray-400">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Recent Employees & Upcoming Leaves Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Hires */}
        <Card title="Recently Joined Employees" subtitle="Latest additions to PeopleSync">
          <div className="divide-y divide-gray-100 dark:divide-border-dark">
            {INITIAL_EMPLOYEES.slice(0, 4).map((emp) => (
              <div key={emp.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-2xl object-cover" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-text dark:text-gray-200">{emp.name}</h5>
                    <p className="text-[11px] text-gray-400">{emp.designation} • {emp.department}</p>
                  </div>
                </div>
                <Badge variant="active">{emp.status}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Pending / Upcoming Leaves */}
        <Card title="Upcoming Leave Approvals" subtitle="Leaves needing manager action">
          <div className="divide-y divide-gray-100 dark:divide-border-dark">
            {INITIAL_LEAVE_REQUESTS.slice(0, 3).map((leave) => (
              <div key={leave.id} className="py-3 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-text dark:text-gray-200">{leave.employeeName}</h5>
                  <p className="text-[11px] text-gray-400">{leave.leaveType} ({leave.days} days) • {leave.startDate}</p>
                </div>
                <Badge variant={leave.status.toLowerCase()}>{leave.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
