import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { employeeService } from '../../services/employeeService';
import { departmentService } from '../../services/departmentService';
import { Table } from '../../components/common/Table';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { Pagination } from '../../components/common/Pagination';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye, FiUserCheck, FiMail, FiPhone } from 'react-icons/fi';

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  hashPwd: '',
  phoneNo: '',
  gender: 'FEMALE',
  role: 'EMPLOYEE',
  departmentId: '',
  designation: '',
  joinDate: '',
  performanceRating: '',
  managerId: '',
  isActive: true,
};

export const EmployeeListPage = () => {
  const { role } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);

  // Form State
  const [formData, setFormData] = useState(emptyForm);

  const canManage = ['ADMIN', 'HR'].includes(role);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await employeeService.getAllEmployees();
      setEmployees(data);
    } catch (e) {
      showError('Failed to load employees.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // GET /departments is ADMIN/HR-only on the backend, but any role that can
  // see this page can already see each row's department name. So the filter
  // dropdown is built from the loaded employees (works for everyone), and
  // the real department list (needed for the create/edit form's dropdown)
  // is only fetched for ADMIN/HR, who are the only ones who can open those forms.
  useEffect(() => {
    if (canManage) {
      departmentService.getAllDepartments().then(setDepartments).catch(() => setDepartments([]));
    }
  }, [canManage]);

  const departmentFilterOptions = useMemo(() => {
    const unique = [...new Set(employees.map((e) => e.department).filter(Boolean))];
    return unique.map((name) => ({ label: name, value: name }));
  }, [employees]);

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name?.toLowerCase().includes(search.toLowerCase()) ||
      emp.email?.toLowerCase().includes(search.toLowerCase()) ||
      emp.employeeId?.toLowerCase().includes(search.toLowerCase());
    const matchesDept = !deptFilter || emp.department === deptFilter;
    const matchesRole = !roleFilter || emp.role === roleFilter;

    return matchesSearch && matchesDept && matchesRole;
  });

  const totalPages = Math.ceil(filteredEmployees.length / pageSize) || 1;
  const paginatedData = filteredEmployees.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleOpenAdd = () => {
    setFormData(emptyForm);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (emp, e) => {
    e.stopPropagation();
    setSelectedEmp(emp);
    setFormData({
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      hashPwd: '', // left blank = keep current password (see Step 2 notes)
      phoneNo: emp.phoneNo,
      gender: emp.gender,
      role: emp.role,
      departmentId: emp.departmentId,
      designation: emp.designation,
      joinDate: emp.joinDate,
      performanceRating: emp.performanceRating,
      managerId: emp.managerId || '',
      isActive: emp.isActive,
    });
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (emp, e) => {
    e.stopPropagation();
    setSelectedEmp(emp);
    setIsDeleteModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await employeeService.createEmployee(formData);
      showSuccess(`Employee ${formData.firstName} ${formData.lastName} created successfully.`);
      setIsAddModalOpen(false);
      fetchEmployees();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to create employee.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await employeeService.updateEmployee(selectedEmp.id, formData);
      showSuccess(`Employee ${formData.firstName} ${formData.lastName} updated.`);
      setIsEditModalOpen(false);
      fetchEmployees();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update employee.');
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await employeeService.deleteEmployee(selectedEmp.id);
      showSuccess(`Employee ${selectedEmp.name} removed.`);
      setIsDeleteModalOpen(false);
      fetchEmployees();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to delete employee.');
    }
  };

  const columns = [
    {
      header: 'Employee',
      key: 'name',
      render: (row) => (
        <div className="flex items-center space-x-3">
          <img src={row.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'} alt={row.name} className="w-10 h-10 rounded-xl object-cover ring-2 ring-primary-500/20" />
          <div>
            <p className="text-xs font-bold text-slate-800">{row.name}</p>
            <p className="text-[11px] text-slate-400">{row.employeeId}</p>
          </div>
        </div>
      )
    },
    {
      header: 'Department & Designation',
      key: 'department',
      render: (row) => (
        <div>
          <p className="text-xs font-semibold text-slate-700">{row.department}</p>
          <p className="text-[11px] text-slate-400">{row.designation}</p>
        </div>
      )
    },
    {
      header: 'Role',
      key: 'role',
      render: (row) => <Badge status={row.role}>{row.role}</Badge>
    },
    {
      header: 'Contact',
      key: 'email',
      render: (row) => (
        <div className="text-xs text-slate-600 space-y-0.5">
          <p className="flex items-center"><FiMail className="mr-1 text-slate-400" /> {row.email}</p>
          <p className="flex items-center text-slate-400"><FiPhone className="mr-1 text-slate-400" /> {row.phone}</p>
        </div>
      )
    },
    {
      header: 'Status',
      key: 'active',
      render: (row) => {
        const isActive = row.active === true;

        return (
          <Badge status={isActive ? 'ACTIVE' : 'INACTIVE'}>
            {isActive ? 'ACTIVE' : 'INACTIVE'}
          </Badge>
        );
      }
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate(`/employees/${row.id}`)}
            className="p-1.5 text-slate-500 hover:text-primary-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="View Details"
          >
            <FiEye className="w-4 h-4" />
          </button>
          {canManage && (
            <>
              <button
                onClick={(e) => handleOpenEdit(row, e)}
                className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                title="Edit Employee"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => handleOpenDelete(row, e)}
                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Delete Employee"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Employee Directory</h1>
          <p className="text-xs font-medium text-slate-500 mt-1">Manage organization headcount, profiles, and roles</p>
        </div>
        {canManage && (
          <Button onClick={handleOpenAdd} variant="primary" icon={FiPlus}>
            Add New Employee
          </Button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Search by name, ID or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={FiSearch}
        />
        <Select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          options={[{ label: 'All Departments', value: '' }, ...departmentFilterOptions]}
        />
        <Select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          options={[
            { label: 'All Roles', value: '' },
            { label: 'ADMIN', value: 'ADMIN' },
            { label: 'HR', value: 'HR' },
            { label: 'MANAGER', value: 'MANAGER' },
            { label: 'EMPLOYEE', value: 'EMPLOYEE' },
          ]}
        />
      </div>

      {/* Datatable */}
      <Table
        columns={columns}
        data={paginatedData}
        isLoading={loading}
        emptyMessage="No employees found matching the specified search criteria."
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredEmployees.length}
        pageSize={pageSize}
        onPageChange={(p) => setCurrentPage(p)}
      />

      {/* Add Employee Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Employee" subtitle="Create employee profile and generate system credentials">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
            <Input label="Last Name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            <Input label="Temporary Password" type="password" value={formData.hashPwd} onChange={(e) => setFormData({ ...formData, hashPwd: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Phone (10 digits)" value={formData.phoneNo} onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })} />
            <Select
              label="Gender"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              options={[
                { label: 'Female', value: 'FEMALE' },
                { label: 'Male', value: 'MALE' },
                { label: 'Other', value: 'OTHER' },
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Department"
              value={formData.departmentId}
              onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
              options={departments.map((d) => ({ label: d.name, value: d.id }))}
              required
            />
            <Select
              label="Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              options={[
                { label: 'EMPLOYEE', value: 'EMPLOYEE' },
                { label: 'MANAGER', value: 'MANAGER' },
                { label: 'HR', value: 'HR' },
                { label: 'ADMIN', value: 'ADMIN' },
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Designation" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} required />
            <Select
              label="Reporting Manager"
              value={formData.managerId}
              onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
              placeholder="None"
              options={employees.map((emp) => ({ label: emp.name, value: emp.id }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Join Date" type="date" value={formData.joinDate} onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })} required />
            <Input label="Performance Rating (1-5)" type="number" min="1" max="5" value={formData.performanceRating} onChange={(e) => setFormData({ ...formData, performanceRating: e.target.value })} />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Employee</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Employee Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Employee Profile" subtitle="Update details for selected employee">
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="First Name" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} required />
            <Input label="Last Name" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
            <Input label="Phone (10 digits)" value={formData.phoneNo} onChange={(e) => setFormData({ ...formData, phoneNo: e.target.value })} />
          </div>
          <Input
            label="New Password"
            type="password"
            value={formData.hashPwd}
            onChange={(e) => setFormData({ ...formData, hashPwd: e.target.value })}
            placeholder="Leave blank to keep current password"
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Department"
              value={formData.departmentId}
              onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
              options={departments.map((d) => ({ label: d.name, value: d.id }))}
              required
            />
            <Select
              label="Role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              options={[
                { label: 'EMPLOYEE', value: 'EMPLOYEE' },
                { label: 'MANAGER', value: 'MANAGER' },
                { label: 'HR', value: 'HR' },
                { label: 'ADMIN', value: 'ADMIN' },
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Designation" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} required />
            <Select
              label="Reporting Manager"
              value={formData.managerId}
              onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
              placeholder="None"
              options={employees.filter((emp) => emp.id !== selectedEmp?.id).map((emp) => ({ label: emp.name, value: emp.id }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Join Date" type="date" value={formData.joinDate} onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })} required />
            <Input label="Performance Rating (1-5)" type="number" min="1" max="5" value={formData.performanceRating} onChange={(e) => setFormData({ ...formData, performanceRating: e.target.value })} />
          </div>
          <Select
            label="Status"
            value={formData.isActive ? 'true' : 'false'}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
            options={[
              { label: 'Active', value: 'true' },
              { label: 'Inactive', value: 'false' },
            ]}
          />

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Update Employee</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Remove Employee"
        message={`Are you sure you want to permanently delete ${selectedEmp?.name}? This action will revoke their access to PeopleSync.`}
      />
    </div>
  );
};
