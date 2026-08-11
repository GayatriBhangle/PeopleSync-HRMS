import api from './api';

/**
 * Backend DepartmentResponseDTO is just { id, departmentName, deptLocation }.
 * No code/headName/budget/description/employeeCount fields exist on the
 * backend at all — those were mock-only and never actually persisted.
 * Normalized to `name`/`location` so it drops into the UI.
 */
const normalizeDepartment = (dto) => ({
  ...dto,
  name: dto.departmentName,
  location: dto.deptLocation,
});

/** UI form shape -> backend DepartmentRequestDTO shape. */
const toRequestPayload = (form) => ({
  departmentName: form.name,
  deptLocation: form.location || null,
});

// Offline fallback so the page doesn't hard-crash if Spring Boot isn't running.
let localDepartments = [
  { id: 1, departmentName: 'Engineering', deptLocation: 'Austin, TX' },
  { id: 2, departmentName: 'Human Resources', deptLocation: 'New York, NY' },
];

const isNetworkError = (error) => !error.response;

export const departmentService = {
  getAllDepartments: async () => {
    try {
      const response = await api.get('/departments');
      return response.data.map(normalizeDepartment);
    } catch (error) {
      if (!isNetworkError(error)) throw error;
      console.warn('Backend unreachable, using department fallback state');
      return localDepartments.map(normalizeDepartment);
    }
  },

  createDepartment: async (formData) => {
    try {
      const response = await api.post('/departments', toRequestPayload(formData));
      return normalizeDepartment(response.data);
    } catch (error) {
      if (!isNetworkError(error)) throw error;
      const newDept = { id: Math.max(0, ...localDepartments.map((d) => d.id)) + 1, ...toRequestPayload(formData) };
      localDepartments.push(newDept);
      return normalizeDepartment(newDept);
    }
  },

  updateDepartment: async (id, formData) => {
    try {
      const response = await api.put(`/departments/${id}`, toRequestPayload(formData));
      return normalizeDepartment(response.data);
    } catch (error) {
      if (!isNetworkError(error)) throw error;
      localDepartments = localDepartments.map((d) => (d.id === Number(id) ? { ...d, ...toRequestPayload(formData) } : d));
      return normalizeDepartment(localDepartments.find((d) => d.id === Number(id)));
    }
  },

  // Backend rejects this (400, with a message) if employees are still assigned to the department.
  deleteDepartment: async (id) => {
    try {
      await api.delete(`/departments/${id}`);
    } catch (error) {
      if (!isNetworkError(error)) throw error;
      localDepartments = localDepartments.filter((d) => d.id !== Number(id));
    }
  },
};