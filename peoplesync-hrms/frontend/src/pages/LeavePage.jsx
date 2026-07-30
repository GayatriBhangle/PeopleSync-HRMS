import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { leaveService } from '../services/api';
import DataTable from '../components/common/DataTable';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import FormInput from '../components/common/FormInput';
import { CalendarDays, Plus, CheckCircle2, XCircle, Clock } from 'lucide-react';

const LeavePage = () => {
  const { currentUser, activeRole, ROLES } = useAuth();
  const { showToast } = useToast();

  const [leaves, setLeaves] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [managerNotes, setManagerNotes] = useState('');

  const [formData, setFormData] = useState({
    leaveType: 'Annual Leave',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const loadLeaves = async () => {
    setIsLoading(true);
    const data = await leaveService.getAll();
    setLeaves(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    const newLeave = await leaveService.apply({
      employeeId: currentUser.employeeId,
      employeeName: currentUser.name,
      department: currentUser.department,
      days: 3,
      ...formData
    });
    setLeaves(prev => [newLeave, ...prev]);
    showToast({ message: 'Leave application submitted for approval!', type: 'success' });
    setIsApplyModalOpen(false);
  };

  const handleReviewAction = async (status) => {
    if (!selectedLeave) return;
    const updated = await leaveService.updateStatus(selectedLeave.id, status, managerNotes);
    setLeaves(prev => prev.map(l => l.id === selectedLeave.id ? updated : l));
    showToast({ message: `Leave request ${status.toLowerCase()}!`, type: status === 'APPROVED' ? 'success' : 'danger' });
    setIsReviewModalOpen(false);
    setSelectedLeave(null);
    setManagerNotes('');
  };

  const columns = [
    { header: 'Employee', accessor: 'employeeName' },
    { header: 'Department', accessor: 'department' },
    { header: 'Leave Type', accessor: 'leaveType' },
    { header: 'Duration', accessor: 'days', render: (row) => `${row.days} days` },
    { header: 'Dates', accessor: 'startDate', render: (row) => `${row.startDate} to ${row.endDate}` },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Badge variant={row.status === 'APPROVED' ? 'active' : row.status === 'PENDING' ? 'pending' : 'rejected'}>
          {row.status}
        </Badge>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-text dark:text-gray-100 tracking-tight">Leave Management</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Apply for leave, track quotas, and process team time-off requests.
          </p>
        </div>

        <Button variant="primary" icon={Plus} onClick={() => setIsApplyModalOpen(true)}>
          Apply for Leave
        </Button>
      </div>

      {/* Leave Balances Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card title="Casual Leave" subtitle="Used: 4 / 12 Days">
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-extrabold text-slate-text dark:text-gray-100">8 Days</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-full">Available</span>
          </div>
        </Card>
        <Card title="Sick Leave" subtitle="Used: 2 / 10 Days">
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-extrabold text-slate-text dark:text-gray-100">8 Days</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-full">Available</span>
          </div>
        </Card>
        <Card title="Annual Leave" subtitle="Used: 5 / 20 Days">
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-extrabold text-slate-text dark:text-gray-100">15 Days</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-full">Available</span>
          </div>
        </Card>
        <Card title="Paid Vacation" subtitle="Used: 0 / 5 Days">
          <div className="flex items-center justify-between mt-2">
            <span className="text-2xl font-extrabold text-slate-text dark:text-gray-100">5 Days</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-full">Available</span>
          </div>
        </Card>
      </div>

      {/* Leave Requests Table */}
      <DataTable
        columns={columns}
        data={leaves}
        isLoading={isLoading}
        searchPlaceholder="Search leave applications..."
        exportFilename="leave_history.csv"
        filterOptions={{
          key: 'status',
          label: 'Status',
          items: [
            { label: 'PENDING', value: 'PENDING' },
            { label: 'APPROVED', value: 'APPROVED' },
            { label: 'REJECTED', value: 'REJECTED' },
          ]
        }}
        actions={(row) => (
          (activeRole === ROLES.ADMIN || activeRole === ROLES.HR || activeRole === ROLES.MANAGER) && row.status === 'PENDING' ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedLeave(row);
                setIsReviewModalOpen(true);
              }}
            >
              Review Application
            </Button>
          ) : null
        )}
      />

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Apply for Leave"
        subtitle="Submit a formal leave request for management review."
      >
        <form onSubmit={handleApplySubmit} className="space-y-4">
          <FormInput
            label="Leave Type"
            type="select"
            value={formData.leaveType}
            onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
            options={['Annual Leave', 'Casual Leave', 'Sick Leave', 'Unpaid Leave']}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Start Date" type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} required />
            <FormInput label="End Date" type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} required />
          </div>

          <FormInput label="Reason for Leave" type="textarea" value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })} required />

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-border-dark">
            <Button variant="outline" onClick={() => setIsApplyModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Submit Application</Button>
          </div>
        </form>
      </Modal>

      {/* Review Leave Modal */}
      {selectedLeave && (
        <Modal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          title="Review Leave Application"
        >
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-2xl space-y-2 text-xs">
              <p><strong className="text-slate-text dark:text-gray-200">Applicant:</strong> {selectedLeave.employeeName} ({selectedLeave.department})</p>
              <p><strong className="text-slate-text dark:text-gray-200">Type & Duration:</strong> {selectedLeave.leaveType} ({selectedLeave.days} Days)</p>
              <p><strong className="text-slate-text dark:text-gray-200">Dates:</strong> {selectedLeave.startDate} to {selectedLeave.endDate}</p>
              <p><strong className="text-slate-text dark:text-gray-200">Reason:</strong> {selectedLeave.reason}</p>
            </div>

            <FormInput
              label="Manager / HR Decision Notes"
              type="textarea"
              placeholder="Add approval comments or rejection feedback..."
              value={managerNotes}
              onChange={(e) => setManagerNotes(e.target.value)}
            />

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-border-dark">
              <Button variant="danger" icon={XCircle} onClick={() => handleReviewAction('REJECTED')}>
                Reject Request
              </Button>
              <Button variant="success" icon={CheckCircle2} onClick={() => handleReviewAction('APPROVED')}>
                Approve Request
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default LeavePage;
