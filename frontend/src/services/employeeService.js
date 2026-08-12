import api from './api';

const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80';

/**
 * Backend EmployeeResponseDTO shape:
 * { id, firstName, lastName, email, gender, designation, phoneNo, role,
 *   joinDate, performanceRating, departmentId, departmentName,
 *   managerId, managerName, isActive }
 *
 * The UI (table/detail page) was built against a flatter mock shape
 * (name, department, phone, employeeId, status). Rather than rewrite every
 * page, this normalizer returns BOTH: the real backend fields (needed by
 * the edit form) and the convenience aliases the UI already reads.
 */
const normalizeEmployee = (dto) => {
  if (!dto) return dto;
  return {
    ...dto,
    name: `${dto.firstName ?? ''} ${dto.lastName ?? ''}`.trim(),
    employeeId: `EMP-${String(dto.id).padStart(3, '0')}`,
    department: dto.departmentName,
    phone: dto.phoneNo,
    status: dto.isActive ? 'ACTIVE' : 'INACTIVE',
    avatar: FALLBACK_AVATAR,
  };
};

/** UI form shape -> backend EmployeeRequestDTO shape. */
const toRequestPayload = (form) => ({
  firstName: form.firstName,
  lastName: form.lastName,
  email: form.email,
  hashPwd: form.hashPwd || undefined, // omit entirely on edit if left blank
  phoneNo: form.phoneNo,
  gender: form.gender,
  role: form.role,
  joinDate: form.joinDate,
  performanceRating: form.performanceRating ? Number(form.performanceRating) : null,
  departmentId: form.departmentId ? Number(form.departmentId) : null,
  designation: form.designation,
  managerId: form.managerId ? Number(form.managerId) : null,
  isActive: form.isActive ?? true,
});

// Small offline fallback so the UI doesn't hard-crash if Spring Boot isn't
// running yet during frontend-only work. Shaped like the real DTO so the
// same normalizer applies to it.
let localEmployees = [
  {
    id: 1, firstName: 'Eleanor', lastName: 'Vance', email: 'eleanor.vance@peoplesync.io',
    gender: 'FEMALE', designation: 'Chief Technology Officer', phoneNo: '5552345678',
    role: 'ADMIN', joinDate: '2020-01-15', performanceRating: 5,
    departmentId: 1, departmentName: 'Engineering', managerId: null, managerName: null, isActive: true,
  },
  {
    id: 2, firstName: 'Marcus', lastName: 'Sterling', email: 'marcus.sterling@peoplesync.io',
    gender: 'MALE', designation: 'Head of HR', phoneNo: '5553456789',
    role: 'HR', joinDate: '2021-03-01', performanceRating: 4,
    departmentId: 2, departmentName: 'Human Resources', managerId: null, managerName: null, isActive: true,
  },
];

const isNetworkError = (error) => !error.response;

export const employeeService = {
  getAllEmployees: async () => {
    try {
      const response = await api.get('/employees');
      return response.data.map(normalizeEmployee);
    } catch (error) {
      if (!isNetworkError(error)) throw error;
      console.warn('Backend unreachable, using employee fallback state');
      return localEmployees.map(normalizeEmployee);
    }
  },

  getEmployeeById: async (id) => {
    try {
      const response = await api.get(`/employees/${id}`);
      return normalizeEmployee(response.data);
    } catch (error) {
      if (!isNetworkError(error)) throw error;
      const emp = localEmployees.find((e) => e.id === Number(id));
      return emp ? normalizeEmployee(emp) : null;
    }
  },

  createEmployee: async (formData) => {
    try {
      const response = await api.post('/employees', toRequestPayload(formData));
      return normalizeEmployee(response.data);
    } catch (error) {
      if (!isNetworkError(error)) throw error;
      const newEmp = { id: Math.max(0, ...localEmployees.map((e) => e.id)) + 1, ...toRequestPayload(formData), isActive: true };
      localEmployees.push(newEmp);
      return normalizeEmployee(newEmp);
    }
  },

  updateEmployee: async (id, formData) => {
    try {
      const response = await api.put(`/employees/${id}`, toRequestPayload(formData));
      return normalizeEmployee(response.data);
    } catch (error) {
      if (!isNetworkError(error)) throw error;
      localEmployees = localEmployees.map((e) => (e.id === Number(id) ? { ...e, ...toRequestPayload(formData) } : e));
      return normalizeEmployee(localEmployees.find((e) => e.id === Number(id)));
    }
  },

  // Backend does a soft delete (marks isActive = false) — DELETE /employees/{id}
  deleteEmployee: async (id) => {
    try {
      await api.delete(`/employees/${id}`);
    } catch (error) {
      if (!isNetworkError(error)) throw error;
      localEmployees = localEmployees.filter((e) => e.id !== Number(id));
    }
  },
};