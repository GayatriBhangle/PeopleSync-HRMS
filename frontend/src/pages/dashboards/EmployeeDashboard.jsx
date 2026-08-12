import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { attendanceService } from '../../services/attendanceService';
import { FiClock, FiCalendar, FiDollarSign, FiCheckCircle } from 'react-icons/fi';
import { Badge } from '../../components/common/Badge';

export const EmployeeDashboard = () => {
  const { user } = useAuth();

  // The backend has no self check-in/out flow — attendance is recorded by
  // HR/Managers. This is a read-only view of today's already-recorded status.
  const [todayRecord, setTodayRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  const [leaveBalance] = useState({
    annual: 14,
    sick: 8,
    casual: 5,
    taken: 3
  });

  const [recentPaystub] = useState({
    month: 'July 2026',
    netSalary: '$8,900.00',
    status: 'PAID',
    paymentDate: '2026-07-25'
  });

  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    attendanceService.getTodayAttendance(user.id, todayStr)
      .then(setTodayRecord)
      .catch(() => setTodayRecord(null))
      .finally(() => setLoading(false));
  }, [user.id]);

  return (
    <div className="space-y-8">
      {/* Employee Greeting Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-primary-950 p-6 md:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="flex items-center space-x-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-primary-500/40 shadow-lg"
          />
          <div>
            <h1 className="text-2xl font-black tracking-tight">Welcome back, {user?.name || 'Sarah'}!</h1>
            <p className="text-xs text-slate-400 mt-1">Senior Frontend Developer • Engineering Dept</p>
          </div>
        </div>

        {/* Today's Attendance Status (read-only — HR/Manager maintained) */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center space-x-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-300 tracking-wider block">Today's Status</span>
            {loading ? (
              <p className="text-sm font-bold text-white mt-0.5">Loading...</p>
            ) : todayRecord ? (
              <div className="flex items-center gap-2 mt-1">
                <Badge status={todayRecord.attendanceStatus}>{todayRecord.attendanceStatus}</Badge>
                {todayRecord.clockingIn && (
                  <span className="text-xs text-slate-300">{todayRecord.clockingIn} – {todayRecord.clockingOut || 'now'}</span>
                )}
              </div>
            ) : (
              <p className="text-sm font-bold text-white mt-0.5">Not yet recorded</p>
            )}
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Leave Balance</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-primary-600">
              <FiCalendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800 mt-3">{leaveBalance.annual + leaveBalance.sick + leaveBalance.casual} Days</p>
          <p className="text-xs text-slate-500 mt-1">14 Annual, 8 Sick, 5 Casual</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recent Paystub</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <FiDollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800 mt-3">{recentPaystub.netSalary}</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">{recentPaystub.month} ({recentPaystub.status})</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Payroll</span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <FiClock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800 mt-3">August 25</p>
          <p className="text-xs text-purple-600 font-semibold mt-1">Estimated Disbursement</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance Rate</span>
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600">
              <FiCheckCircle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800 mt-3">99.2%</p>
          <p className="text-xs text-teal-600 font-semibold mt-1">Punctuality Score</p>
        </div>
      </div>
    </div>
  );
};