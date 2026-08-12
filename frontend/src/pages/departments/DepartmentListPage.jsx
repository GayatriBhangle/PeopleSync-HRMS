import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { departmentService } from '../../services/departmentService';
import { employeeService } from '../../services/employeeService';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Skeleton } from '../../components/common/Skeleton';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { FiPlus, FiUsers, FiMapPin, FiEdit2, FiTrash2 } from 'react-icons/fi';

const emptyForm = { name: '', location: '' };

export const DepartmentListPage = () => {
  const { role } = useAuth();
  const { showSuccess, showError } = useToast();

  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deletingDept, setDeletingDept] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  // POST/PUT /departments allow ADMIN or HR; DELETE is ADMIN-only.
  const canManage = ['ADMIN', 'HR'].includes(role);
  const canDelete = role === 'ADMIN';

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [deptData, empData] = await Promise.all([
        departmentService.getAllDepartments(),
        employeeService.getAllEmployees(),
      ]);
      setDepartments(deptData);
      setEmployees(empData);
    } catch (e) {
      showError('Failed to load departments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // Real headcount per department, computed from the employees already loaded
  // (avoids an extra ADMIN/HR/MANAGER-gated /departments/{id}/employee-count call per card).
  const employeeCounts = useMemo(() => {
    const counts = {};
    employees.forEach((e) => {
      if (e.departmentId) counts[e.departmentId] = (counts[e.departmentId] || 0) + 1;
    });
    return counts;
  }, [employees]);

  const handleOpenCreate = () => {
    setEditingDept(null);
    setFormData(emptyForm);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (dept) => {
    setEditingDept(dept);
    setFormData({ name: dept.name, location: dept.location || '' });
    setIsFormModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDept) {
        await departmentService.updateDepartment(editingDept.id, formData);
        showSuccess(`Department ${formData.name} updated.`);
      } else {
        await departmentService.createDepartment(formData);
        showSuccess(`Department ${formData.name} created successfully.`);
      }
      setIsFormModalOpen(false);
      fetchAll();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to save department.');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await departmentService.deleteDepartment(deletingDept.id);
      showSuccess(`Department ${deletingDept.name} removed.`);
      setIsDeleteModalOpen(false);
      fetchAll();
    } catch (err) {
      // The backend blocks deletion (400) if employees are still assigned — surface that message.
      showError(err.response?.data?.message || 'Failed to delete department.');
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Department Hub</h1>
          <p className="text-xs font-medium text-slate-500 mt-1">Manage organizational units and headcounts</p>
        </div>
        {canManage && (
          <Button onClick={handleOpenCreate} variant="primary" icon={FiPlus}>
            Create Department
          </Button>
        )}
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-40 w-full" count={4} />
        </div>
      ) : departments.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-2xl border border-slate-200">
          <p className="text-sm font-bold text-slate-700">No departments yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {departments.map((dept) => (
            <div key={dept.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft hover:shadow-soft-lg transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center font-bold text-base">
                    {dept.name?.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">{dept.name}</h3>
                    <p className="text-xs text-slate-400 font-medium flex items-center mt-0.5">
                      <FiMapPin className="w-3 h-3 mr-1" /> {dept.location || 'Location not set'}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold flex items-center gap-1">
                  <FiUsers className="w-3 h-3" /> {employeeCounts[dept.id] || 0}
                </span>
              </div>

              {canManage && (
                <div className="flex items-center space-x-2 mt-6 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleOpenEdit(dept)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
                  >
                    <FiEdit2 className="w-3.5 h-3.5" /> Edit
                  </button>
                  {canDelete && (
                    <button
                      onClick={() => { setDeletingDept(dept); setIsDeleteModalOpen(true); }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingDept ? 'Edit Department' : 'Create New Department'}
        subtitle={editingDept ? 'Update this department\u2019s details' : 'Add a business division or functional team'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Department Name"
            placeholder="e.g. Finance & Operations"
            maxLength={30}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Location"
            placeholder="e.g. New York, NY"
            maxLength={30}
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setIsFormModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">{editingDept ? 'Save Changes' : 'Create Department'}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Department"
        message={`Delete ${deletingDept?.name}? This will fail if employees are still assigned to it.`}
      />
    </div>
  );
};
