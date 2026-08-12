import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { leaveService } from '../../services/leaveService';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { FiPlus, FiCheckCircle, FiXCircle, FiCalendar, FiFilter } from 'react-icons/fi';

export const LeavePage = () => {
  const { user, role } = useAuth();
  const { showSuccess, showError } = useToast();

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const [formData, setFormData] = useState({
  leaveType: 'EARNED',
  startDate: '',
  endDate: '',
  reason: ''
});

  const canApprove = ['ADMIN', 'HR', 'MANAGER'].includes(role);

  const fetchLeaves = async () => {
    setLoading(true);

    try {
        let data = [];

        if (role === "EMPLOYEE") {
            data = await leaveService.getMyLeaves();
        } else {
            data = await leaveService.getAllLeaves();
        }

        setLeaves(data);

    } catch (error) {
        console.error("Failed to load leaves:", error);
        showError("Failed to load leave records.");
        setLeaves([]);
    } finally {
        setLoading(false);
    }
};

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    try {
      await leaveService.applyLeave({
        leaveType: formData.leaveType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason
      });
      showSuccess('Leave application submitted successfully.');
      setIsApplyModalOpen(false);

      setFormData({
        leaveType: 'CAUSUAL',
        startDate: '',
        endDate: '',
        reason:''
      });
      fetchLeaves();
    } catch (err) {
      showError(err.response?.data?.meesgage || 'Failed to apply for leave.');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {

        if (newStatus === "APPROVED") {
            await leaveService.approveLeave(id);
        } else if (newStatus === "REJECTED") {
            await leaveService.rejectLeave(id);
        }

        showSuccess(
            `Leave request marked as ${newStatus}.`
        );

        fetchLeaves();

    } catch (error) {
        console.error("Failed to update leave:", error);
        showError("Failed to update leave status.");
    }
  };

  const filteredLeaves = leaves.filter((item) => {
    if (!statusFilter) return true;
    return item.status === statusFilter;
  });

  const columns = [
    {
      header: 'Employee',
      key: 'employeeName',
      render: (row) => (
        <div>
          <p className="text-xs font-bold text-slate-800">{row.employeeName}</p>
          <p className="text-[11px] text-slate-400">{row.department}</p>
        </div>
      )
    },
    {
      header: 'Leave Type',
      key: 'leaveType',
      render: (row) => <span className="text-xs font-semibold text-slate-700">{row.leaveType}</span>
    },
    {
      header: 'Duration',
      key: 'startDate',
      render: (row) => (
        <div className="text-xs text-slate-600">
          <p className="font-semibold">{row.startDate} to {row.endDate}</p>
          <p className="text-[10px] text-slate-400">{row.days} Days</p>
        </div>
      )
    },
    {
      header: 'Reason',
      key: 'reason',
      render: (row) => <span className="text-xs text-slate-500 italic max-w-xs block truncate">{row.reason}</span>
    },
    {
      header: 'Status',
      key: 'status',
      render: (row) => <Badge status={row.status}>{row.status}</Badge>
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => {
        if (!canApprove || row.status !== 'PENDING') return <span className="text-xs text-slate-400">-</span>;
        return (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleStatusUpdate(row.id, 'APPROVED')}
              className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold border border-emerald-200 transition-colors flex items-center"
            >
              <FiCheckCircle className="mr-1" /> Approve
            </button>
            <button
              onClick={() => handleStatusUpdate(row.id, 'REJECTED')}
              className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-bold border border-rose-200 transition-colors flex items-center"
            >
              <FiXCircle className="mr-1" /> Reject
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Leave Management</h1>
          <p className="text-xs font-medium text-slate-500 mt-1">Absence requests, leave quotas, and approvals</p>
        </div>
        <Button onClick={() => setIsApplyModalOpen(true)} variant="primary" icon={FiPlus}>
          Apply for Leave
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft flex items-center space-x-4 max-w-xs">
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          placeholder="All Statuses"
          options={[
            { label: 'Pending Approvals', value: 'PENDING' },
            { label: 'Approved', value: 'APPROVED' },
            { label: 'Rejected', value: 'REJECTED' },
          ]}
          icon={FiFilter}
          className="w-full"
        />
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={filteredLeaves}
        isLoading={loading}
        emptyMessage="No leave records found."
      />

      {/* Apply Leave Modal */}
      <Modal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} title="Apply for Time Off" subtitle="Submit your leave application for manager approval">
        <form onSubmit={handleApplySubmit} className="space-y-4">
          <Select
              label="Leave Type"
              value={formData.leaveType}
              onChange={(e) =>
                  setFormData({
                      ...formData,
                      leaveType: e.target.value
                  })
              }
              options={[
                { label: 'Casual Leave', value: 'CASUAL' },
                { label: 'Sick Leave', value: 'SICK' },
                { label: 'Earned Leave', value: 'EARNED' },
                { label: 'Maternity Leave', value: 'MATERNITY' },
                { label: 'Paternity Leave', value: 'PATERNITY' },
                { label: 'Unpaid Leave', value: 'UNPAID' },
              ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Date" type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required />
            <Input label="End Date" type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} required />
          </div>
          <Input label="Reason for Absence" placeholder="Brief explanation..." value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} required />

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setIsApplyModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Submit Request</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
