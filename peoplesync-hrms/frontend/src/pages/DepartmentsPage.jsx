import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { departmentService } from '../services/api';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import FormInput from '../components/common/FormInput';
import { Building2, Users, DollarSign, MapPin, Plus, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const DepartmentsPage = () => {
  const { activeRole, ROLES } = useAuth();
  const { showToast } = useToast();

  const [departments, setDepartments] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    headName: '',
    budget: '$500,000',
    location: 'Austin HQ',
    description: '',
  });

  useEffect(() => {
    departmentService.getAll().then(data => setDepartments(data));
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const created = await departmentService.create(formData);
    setDepartments(prev => [...prev, created]);
    showToast({ message: `Department ${created.name} created!`, type: 'success' });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-text dark:text-gray-100 tracking-tight">Departments</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Organizational structure, leadership, budget allocations, and team headcounts.
          </p>
        </div>

        {(activeRole === ROLES.ADMIN || activeRole === ROLES.HR) && (
          <Button variant="primary" icon={Plus} onClick={() => setIsAddModalOpen(true)}>
            New Department
          </Button>
        )}
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <Card
            key={dept.id}
            title={dept.name}
            subtitle={`Code: ${dept.code}`}
            action={
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full">
                <Users className="w-3.5 h-3.5" /> {dept.employeeCount} Members
              </span>
            }
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 mb-4 line-clamp-2 leading-relaxed">
              {dept.description}
            </p>

            <div className="pt-4 border-t border-gray-100 dark:border-border-dark space-y-2.5 text-xs">
              <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                <span className="flex items-center gap-1.5 text-gray-400">
                  <UserCheck className="w-4 h-4 text-primary dark:text-emerald-400" /> Dept Head:
                </span>
                <span className="font-bold text-slate-text dark:text-gray-100">{dept.headName}</span>
              </div>

              <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                <span className="flex items-center gap-1.5 text-gray-400">
                  <DollarSign className="w-4 h-4 text-secondary" /> Budget:
                </span>
                <span className="font-bold text-slate-text dark:text-gray-100">{dept.budget}</span>
              </div>

              <div className="flex items-center justify-between text-gray-600 dark:text-gray-300">
                <span className="flex items-center gap-1.5 text-gray-400">
                  <MapPin className="w-4 h-4 text-amber-500" /> Location:
                </span>
                <span className="font-medium text-slate-text dark:text-gray-200">{dept.location}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Department Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Department"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <FormInput label="Department Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <FormInput label="Department Code (e.g. ENG, FIN)" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} required />
          <FormInput label="Head of Department Name" value={formData.headName} onChange={(e) => setFormData({ ...formData, headName: e.target.value })} required />
          <FormInput label="Annual Budget Allocation ($)" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} required />
          <FormInput label="Office Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
          <FormInput label="Description & Scope" type="textarea" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-border-dark">
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create Department</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DepartmentsPage;
