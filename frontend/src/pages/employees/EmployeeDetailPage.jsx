import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { employeeService } from '../../services/employeeService';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { FiArrowLeft, FiMail, FiPhone, FiUserCheck } from 'react-icons/fi';

export const EmployeeDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const emp = await employeeService.getEmployeeById(id);
        setEmployee(emp);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center p-8 bg-white rounded-2xl border border-slate-200">
        <p className="text-sm font-bold text-slate-700">Employee not found.</p>
        <Button onClick={() => navigate('/employees')} className="mt-4" variant="outline">
          Back to Directory
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button onClick={() => navigate('/employees')} variant="ghost" size="sm" icon={FiArrowLeft}>
        Back to Employee List
      </Button>

      {/* Header Profile Card */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <img
            src={employee.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
            alt={employee.name}
            className="w-20 h-20 rounded-2xl object-cover ring-4 ring-primary-500/20 shadow-md"
          />
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-black text-slate-900">{employee.name}</h1>
              <Badge status={employee.role}>{employee.role}</Badge>
            </div>
            <p className="text-sm font-semibold text-slate-500 mt-0.5">{employee.designation}</p>
            <p className="text-xs text-primary-600 font-bold mt-1">{employee.department} Department</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Badge status={employee.status || 'ACTIVE'}>{employee.status || 'ACTIVE'}</Badge>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
            Employment Details
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Employee ID</span>
              <span className="font-bold text-slate-800">{employee.employeeId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Department</span>
              <span className="font-semibold text-slate-700">{employee.department}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Joining Date</span>
              <span className="font-semibold text-slate-700">{employee.joinDate || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Reporting Manager</span>
              <span className="font-semibold text-slate-700">{employee.managerName || 'None'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Performance Rating</span>
              <span className="font-bold text-emerald-600">
                {employee.performanceRating ? `${employee.performanceRating} / 5` : 'Not rated'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft space-y-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3">
            Contact
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center space-x-3 text-slate-600">
              <FiMail className="w-4 h-4 text-slate-400" />
              <span>{employee.email}</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-600">
              <FiPhone className="w-4 h-4 text-slate-400" />
              <span>{employee.phone || 'Not provided'}</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-600">
              <FiUserCheck className="w-4 h-4 text-slate-400" />
              <span>{employee.gender || 'Not specified'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payroll for this employee moves here once Step 5 (Payroll + Payment) is wired */}
    </div>
  );
};
