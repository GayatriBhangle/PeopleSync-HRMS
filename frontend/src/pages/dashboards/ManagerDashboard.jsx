import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiClock, FiCalendar, FiTrendingUp, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { Badge } from '../../components/common/Badge';

export const ManagerDashboard = () => {
  const navigate = useNavigate();

  const [teamMembers] = useState([
    { id: 1, name: 'David Miller', role: 'Engineering Lead', status: 'ACTIVE', checkIn: '08:45 AM', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80' },
    { id: 2, name: 'Sarah Jenkins', role: 'Senior Developer', status: 'ACTIVE', checkIn: '09:15 AM', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80' },
    { id: 3, name: 'Michael Chang', role: 'Backend Engineer', status: 'ACTIVE', checkIn: '09:00 AM', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  ]);

  const [pendingTeamLeaves, setPendingTeamLeaves] = useState([
    { id: 101, name: 'Sarah Jenkins', type: 'Annual Leave', dates: 'Aug 4 - Aug 8 (5 Days)', reason: 'Family vacation' },
  ]);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Engineering Team Portal</h1>
        <p className="text-xs font-medium text-slate-500 mt-1">Manage team members, attendance, and leave requests</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Team</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-primary-600">
              <FiUsers className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800 mt-3">{teamMembers.length} Members</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">Engineering Squad</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today's Attendance</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <FiClock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800 mt-3">100% Present</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">All checked in</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Team Leaves</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <FiCalendar className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800 mt-3">{pendingTeamLeaves.length} Pending</p>
          <p className="text-xs text-amber-600 font-semibold mt-1">Review Request</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Team Performance</span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
              <FiTrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-800 mt-3">98.5% Sprint</p>
          <p className="text-xs text-indigo-600 font-semibold mt-1">High Velocity</p>
        </div>
      </div>

      {/* Team Roster Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Members List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <h3 className="text-base font-bold text-slate-800 mb-4">Direct Reports</h3>
          <div className="divide-y divide-slate-100">
            {teamMembers.map((member) => (
              <div key={member.id} className="py-3.5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">{member.name}</p>
                    <p className="text-[11px] text-slate-400">{member.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge status={member.status}>{member.status}</Badge>
                  <p className="text-[10px] text-slate-400 mt-1">Checked in: {member.checkIn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
          <h3 className="text-base font-bold text-slate-800 mb-4">Team Leave Approvals</h3>
          {pendingTeamLeaves.length === 0 ? (
            <p className="text-xs text-slate-400">No pending team leave requests.</p>
          ) : (
            <div className="space-y-4">
              {pendingTeamLeaves.map((req) => (
                <div key={req.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <p className="text-xs font-bold text-slate-800">{req.name}</p>
                  <p className="text-xs text-slate-600 mt-1">{req.type} • {req.dates}</p>
                  <p className="text-[11px] text-slate-400 mt-1 italic">"{req.reason}"</p>
                  <div className="flex items-center space-x-2 mt-3">
                    <button
                      onClick={() => setPendingTeamLeaves([])}
                      className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors flex items-center"
                    >
                      <FiCheckCircle className="mr-1" /> Approve
                    </button>
                    <button
                      onClick={() => setPendingTeamLeaves([])}
                      className="px-3 py-1.5 bg-white border border-slate-200 text-rose-600 text-xs font-bold rounded-lg hover:bg-rose-50 transition-colors flex items-center"
                    >
                      <FiXCircle className="mr-1" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
