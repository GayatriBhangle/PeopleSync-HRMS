import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiClock,
  FiCreditCard,
  FiUserPlus,
  FiCheckCircle,
  FiXCircle,
  FiArrowRight
} from 'react-icons/fi';
import { employeeService } from '../../services/employeeService';
import { leaveService } from '../../services/leaveService';
import { payrollService } from '../../services/payrollService';
import { attendanceService } from '../../services/attendanceService';
import { useToast } from '../../context/ToastContext';

export const HRDashboard = () => {
  const navigate = useNavigate();
  const { showSuccess } = useToast();

  const [stats, setStats] = useState({
    totalEmployees: 48,
    pendingLeaves: 3,
    payrollStatus: 'Generated',
    todayAttendanceCount: 42
  });

  const [pendingLeavesList, setPendingLeavesList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHRData = async () => {
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        const [emps, leaves, att] = await Promise.all([
          employeeService.getAllEmployees(),
          leaveService.getAllLeaves(),
          attendanceService.getAttendanceByDate(todayStr)
        ]);

        const pending = leaves.filter((l) => l.status === 'PENDING');
        setPendingLeavesList(pending);
        setStats({
          totalEmployees: emps.length,
          pendingLeaves: pending.length,
          payrollStatus: 'July 2026 Ready',
          todayAttendanceCount: att.length
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchHRData();
  }, []);

  const handleQuickApprove = async (id) => {
    await leaveService.approveLeave(id);
    setPendingLeavesList((prev) => prev.filter((l) => l.id !== id));
    showSuccess('Leave request approved.');
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider">
            HR Operations Hub
          </span>
          <h1 className="text-2xl font-black mt-2 tracking-tight">Human Resources Portal</h1>
          <p className="text-xs text-primary-100 mt-1 max-w-lg">
            Manage employee lifecycle, approve pending leave requests, process monthly payroll, and review payments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate('/employees')}
            className="px-4 py-2.5 bg-white text-primary-700 hover:bg-slate-100 rounded-xl text-xs font-bold shadow-md transition-all flex items-center"
          >
            <FiUserPlus className="w-4 h-4 mr-2" /> Add Employee
          </button>
          <button
            onClick={() => navigate('/payroll')}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center"
          >
            <FiDollarSign className="w-4 h-4 mr-2" /> Initiate Payroll
          </button>
        </div>
      </div>

      {/* HR Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Employees</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-primary-600">
              <FiUsers className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800 mt-3">{stats.totalEmployees}</p>
          <p className="text-xs text-slate-500 mt-1">Full-time & Remote Staff</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Leave Apps</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <FiCalendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800 mt-3">{stats.pendingLeaves}</p>
          <p className="text-xs text-amber-600 font-semibold mt-1">Action Required</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payroll Cycle</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <FiDollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800 mt-3">{stats.payrollStatus}</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Ready for Payment</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Check-Ins</span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <FiClock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800 mt-3">{stats.todayAttendanceCount}</p>
          <p className="text-xs text-indigo-600 font-semibold mt-1">Attendance Recorded</p>
        </div>
      </div>

      {/* Pending Leave Approval Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-soft p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-800">Pending Leave Requests</h3>
            <p className="text-xs text-slate-400 mt-0.5">Review and approve employee absence applications</p>
          </div>
          <button onClick={() => navigate('/leaves')} className="text-xs text-primary-600 font-semibold hover:underline flex items-center">
            View All Leaves <FiArrowRight className="ml-1" />
          </button>
        </div>

        {pendingLeavesList.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-100">
            <FiCheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">All caught up!</p>
            <p className="text-[11px] text-slate-400 mt-0.5">No pending leave applications require your attention.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingLeavesList.map((leave) => (
              <div key={leave.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/70 border border-slate-200 rounded-xl gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-800">{leave.employeeName}</span>
                    <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {leave.department}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    <span className="font-medium text-slate-800">{leave.leaveType}</span> • {leave.startDate} to {leave.endDate} ({leave.days} Days)
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5 italic">"{leave.reason}"</p>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() => handleQuickApprove(leave.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all flex items-center"
                  >
                    <FiCheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                  </button>
                  <button
                    onClick={async () => {
                      await leaveService.rejectLeave(leave.id);
                      setPendingLeavesList(prev => prev.filter(l => l.id !== leave.id));
                    }}
                    className="px-3 py-1.5 bg-white border border-slate-200 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold transition-all flex items-center"
                  >
                    <FiXCircle className="w-3.5 h-3.5 mr-1" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};