import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { employeeService, departmentService } from '../services/api';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import FormInput from '../components/common/FormInput';
import ConfirmDialog from '../components/common/ConfirmDialog';
import {
  Plus, Edit, Trash2, Eye, Mail, Phone, MapPin, Building2,
  Briefcase, DollarSign, LayoutGrid, List, Search, Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EmployeesPage = () => {
  const { activeRole, ROLES } = useAuth();
  const { showToast } = useToast();

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Engineering',
    designation: '',
    role: 'EMPLOYEE',
    salary: 95000,
    location: 'Remote',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  });

  const loadData = async () => {
    setIsLoading(true);
    const [empData, deptData] = await Promise.all([
      employeeService.getAll(),
      departmentService.getAll(),
    ]);
    setEmployees(empData);
    setDepartments(deptData);
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const created = await employeeService.create(formData);
    setEmployees(prev => [created, ...prev]);
    showToast({ message: `Employee ${created.name} added successfully!`, type: 'success' });
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const updated = await employeeService.update(selectedEmployee.id, formData);
    setEmployees(prev => prev.map(emp => emp.id === selectedEmployee.id ? updated : emp));
    showToast({ message: `Employee ${updated.name} updated!`, type: 'success' });
    setIsEditModalOpen(false);
  };

  const handleDelete = async (id) => {
    const empToDelete = employees.find(e => e.id === id);
    await employeeService.delete(id);
    setEmployees(prev => prev.filter(e => e.id !== id));
    setDeleteConfirmId(null);

    // Toast with Undo Action!
    showToast({
      message: `Employee ${empToDelete?.name || ''} deleted`,
      type: 'danger',
      onUndo: async () => {
        const restored = await employeeService.create(empToDelete);
        setEmployees(prev => [restored, ...prev]);
        showToast({ message: `Restored ${empToDelete?.name}!`, type: 'success' });
      }
    });
  };

  const openEditModal = (emp) => {
    setSelectedEmployee(emp);
    setFormData({
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      department: emp.department,
      designation: emp.designation,
      role: emp.role,
      salary: emp.salary,
      location: emp.location,
      avatar: emp.avatar,
    });
    setIsEditModalOpen(true);
  };

  // Table Columns Setup
  const columns = [
    {
      header: 'Employee',
      accessor: 'name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img src={row.avatar} alt={row.name} className="w-10 h-10 rounded-2xl object-cover ring-2 ring-primary/20 shrink-0" />
          <div>
            <h5 className="text-xs font-bold text-slate-text dark:text-gray-100">{row.name}</h5>
            <p className="text-[11px] text-gray-400">{row.employeeId} • {row.email}</p>
          </div>
        </div>
      )
    },
    { header: 'Department', accessor: 'department' },
    { header: 'Designation', accessor: 'designation' },
    {
      header: 'Role',
      accessor: 'role',
      render: (row) => (
        <Badge variant={row.role === 'ADMIN' ? 'primary' : row.role === 'HR' ? 'secondary' : 'default'}>
          {row.role}
        </Badge>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Badge variant={row.status === 'ACTIVE' ? 'active' : 'warning'}>
          {row.status}
        </Badge>
      )
    },
    {
      header: 'Salary',
      accessor: 'salary',
      render: (row) => `$${Number(row.salary).toLocaleString()}`
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-text dark:text-gray-100 tracking-tight">Employee Directory</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Manage organization staff, roles, designations, and profiles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Grid / Table Toggle */}
          <div className="flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'table' ? 'bg-white dark:bg-gray-900 shadow-xs text-primary dark:text-emerald-400' : 'text-gray-400'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-900 shadow-xs text-primary dark:text-emerald-400' : 'text-gray-400'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>

          {(activeRole === ROLES.ADMIN || activeRole === ROLES.HR) && (
            <Button variant="primary" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
              Add Employee
            </Button>
          )}
        </div>
      </div>

      {/* Main View: Table vs Grid */}
      {viewMode === 'table' ? (
        <DataTable
          columns={columns}
          data={employees}
          isLoading={isLoading}
          searchPlaceholder="Search by name, email, department, role..."
          filterOptions={{
            key: 'department',
            label: 'Departments',
            items: departments.map(d => ({ label: d.name, value: d.name }))
          }}
          onRowClick={(emp) => {
            setSelectedEmployee(emp);
            setIsDetailDrawerOpen(true);
          }}
          actions={(row) => (
            <>
              <button
                onClick={() => {
                  setSelectedEmployee(row);
                  setIsDetailDrawerOpen(true);
                }}
                className="p-1.5 text-gray-400 hover:text-primary dark:hover:text-emerald-400 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
              >
                <Eye className="w-4 h-4" />
              </button>
              {(activeRole === ROLES.ADMIN || activeRole === ROLES.HR) && (
                <>
                  <button
                    onClick={() => openEditModal(row)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(row.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </>
          )}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {employees.map((emp) => (
            <motion.div
              key={emp.id}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -3 }}
              className="bg-surface dark:bg-surface-cardDark p-5 rounded-2xl border border-border/70 dark:border-border-dark shadow-soft flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <img src={emp.avatar} alt={emp.name} className="w-14 h-14 rounded-2xl object-cover ring-2 ring-primary/20" />
                  <Badge variant={emp.status === 'ACTIVE' ? 'active' : 'warning'}>{emp.status}</Badge>
                </div>
                <h4 className="text-base font-bold text-slate-text dark:text-gray-100">{emp.name}</h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold">{emp.designation}</p>
                <p className="text-xs text-gray-400 mt-1">{emp.department} • {emp.location}</p>

                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-border-dark space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate">{emp.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <span>{emp.phone}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 dark:border-border-dark flex items-center justify-between">
                <span className="text-xs font-bold text-slate-text dark:text-gray-200">
                  ${Number(emp.salary).toLocaleString()}/yr
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedEmployee(emp);
                    setIsDetailDrawerOpen(true);
                  }}
                >
                  View Profile
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Employee Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Employee"
        subtitle="Fill out official employee credentials and organizational position."
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-black/20 rounded-2xl border border-gray-200 dark:border-gray-800">
            <img src={formData.avatar} alt="Avatar" className="w-14 h-14 rounded-2xl object-cover" />
            <div>
              <p className="text-xs font-bold text-slate-text dark:text-gray-200">Avatar Photo Preview</p>
              <p className="text-[10px] text-gray-400">Unsplash Avatar URL automatically assigned.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Full Name" name="name" value={formData.name} onChange={handleInputChange} required />
            <FormInput label="Email Address" type="email" name="email" value={formData.email} onChange={handleInputChange} required />
            <FormInput label="Phone Number" name="phone" value={formData.phone} onChange={handleInputChange} required />
            <FormInput label="Designation" name="designation" value={formData.designation} onChange={handleInputChange} required />
            <FormInput
              label="Department"
              type="select"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              options={departments.map(d => ({ label: d.name, value: d.name }))}
              required
            />
            <FormInput
              label="System Role"
              type="select"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              options={['EMPLOYEE', 'MANAGER', 'HR', 'ADMIN']}
              required
            />
            <FormInput label="Annual Base Salary ($)" type="number" name="salary" value={formData.salary} onChange={handleInputChange} required />
            <FormInput label="Office Location" name="location" value={formData.location} onChange={handleInputChange} required />
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-border-dark">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Employee</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Employee Credentials"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Full Name" name="name" value={formData.name} onChange={handleInputChange} required />
            <FormInput label="Email Address" type="email" name="email" value={formData.email} onChange={handleInputChange} required />
            <FormInput label="Designation" name="designation" value={formData.designation} onChange={handleInputChange} required />
            <FormInput
              label="Department"
              type="select"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              options={departments.map(d => ({ label: d.name, value: d.name }))}
            />
            <FormInput label="Annual Salary ($)" type="number" name="salary" value={formData.salary} onChange={handleInputChange} required />
            <FormInput label="Location" name="location" value={formData.location} onChange={handleInputChange} />
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-border-dark">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Update Profile</Button>
          </div>
        </form>
      </Modal>

      {/* View Detail Drawer Modal */}
      {selectedEmployee && (
        <Modal
          isOpen={isDetailDrawerOpen}
          onClose={() => setIsDetailDrawerOpen(false)}
          title="Employee Profile Card"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-border-dark">
              <img src={selectedEmployee.avatar} alt={selectedEmployee.name} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-primary/20" />
              <div>
                <h4 className="text-lg font-extrabold text-slate-text dark:text-gray-100">{selectedEmployee.name}</h4>
                <p className="text-xs text-primary dark:text-emerald-400 font-bold">{selectedEmployee.designation}</p>
                <span className="text-[10px] text-gray-400">{selectedEmployee.employeeId} • Joined {selectedEmployee.joinDate}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-gray-50 dark:bg-black/20 rounded-2xl">
                <span className="text-gray-400 block">Department</span>
                <span className="font-bold text-slate-text dark:text-gray-200">{selectedEmployee.department}</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-black/20 rounded-2xl">
                <span className="text-gray-400 block">Role</span>
                <span className="font-bold text-slate-text dark:text-gray-200">{selectedEmployee.role}</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-black/20 rounded-2xl">
                <span className="text-gray-400 block">Base Salary</span>
                <span className="font-bold text-slate-text dark:text-gray-200">${Number(selectedEmployee.salary).toLocaleString()}</span>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-black/20 rounded-2xl">
                <span className="text-gray-400 block">Location</span>
                <span className="font-bold text-slate-text dark:text-gray-200">{selectedEmployee.location}</span>
              </div>
            </div>

            {selectedEmployee.skills && (
              <div>
                <h5 className="text-xs font-bold text-gray-500 mb-2">Core Competencies</h5>
                <div className="flex flex-wrap gap-1.5">
                  {selectedEmployee.skills.map((skill, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-xl bg-primary/10 text-primary dark:bg-primary/20 dark:text-emerald-300 text-xs font-semibold">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => handleDelete(deleteConfirmId)}
        title="Remove Employee"
        message="Are you sure you want to delete this employee record? You will be provided with an immediate Undo option in the toast notification."
      />
    </div>
  );
};

export default EmployeesPage;
