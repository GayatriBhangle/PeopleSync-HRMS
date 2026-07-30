import axios from 'axios';
import { INITIAL_EMPLOYEES, INITIAL_DEPARTMENTS, INITIAL_ATTENDANCE, INITIAL_LEAVE_REQUESTS, INITIAL_PAYROLL, RECHARTS_DATA } from './mockData';

const API_BASE_URL = '/api';

// Create Axios Instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

// Request Interceptor: Attach JWT Token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('peoplesync_jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Unified Mock Storage (Persisted in localStorage for demo interactivity)
const getStorage = (key, defaultVal) => {
  const stored = localStorage.getItem(`peoplesync_${key}`);
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { console.error(e); }
  }
  return defaultVal;
};

const setStorage = (key, val) => {
  localStorage.setItem(`peoplesync_${key}`, JSON.stringify(val));
};

// API Services Layer (Handles API calls with fallback to dynamic LocalStorage mock)
export const employeeService = {
  getAll: async () => {
    try {
      const res = await apiClient.get('/employees');
      return res.data;
    } catch {
      return getStorage('employees', INITIAL_EMPLOYEES);
    }
  },
  create: async (employeeData) => {
    try {
      const res = await apiClient.post('/employees', employeeData);
      return res.data;
    } catch {
      const list = getStorage('employees', INITIAL_EMPLOYEES);
      const newEmp = {
        id: Date.now(),
        employeeId: `EMP-00${list.length + 1}`,
        status: 'ACTIVE',
        leaveBalance: { casual: 10, sick: 10, annual: 15 },
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        ...employeeData,
      };
      const updated = [newEmp, ...list];
      setStorage('employees', updated);
      return newEmp;
    }
  },
  update: async (id, employeeData) => {
    try {
      const res = await apiClient.put(`/employees/${id}`, employeeData);
      return res.data;
    } catch {
      const list = getStorage('employees', INITIAL_EMPLOYEES);
      const updated = list.map(emp => emp.id === id ? { ...emp, ...employeeData } : emp);
      setStorage('employees', updated);
      return updated.find(emp => emp.id === id);
    }
  },
  delete: async (id) => {
    try {
      await apiClient.delete(`/employees/${id}`);
    } catch {
      const list = getStorage('employees', INITIAL_EMPLOYEES);
      const updated = list.filter(emp => emp.id !== id);
      setStorage('employees', updated);
    }
  }
};

export const departmentService = {
  getAll: async () => {
    try {
      const res = await apiClient.get('/departments');
      return res.data;
    } catch {
      return getStorage('departments', INITIAL_DEPARTMENTS);
    }
  },
  create: async (deptData) => {
    try {
      const res = await apiClient.post('/departments', deptData);
      return res.data;
    } catch {
      const list = getStorage('departments', INITIAL_DEPARTMENTS);
      const newDept = { id: Date.now(), employeeCount: 1, ...deptData };
      const updated = [...list, newDept];
      setStorage('departments', updated);
      return newDept;
    }
  }
};

export const attendanceService = {
  getToday: async () => {
    try {
      const res = await apiClient.get('/attendance/today');
      return res.data;
    } catch {
      return getStorage('attendance', INITIAL_ATTENDANCE);
    }
  },
  checkIn: async (employeeId, name, department) => {
    try {
      const res = await apiClient.post('/attendance/check-in', { employeeId });
      return res.data;
    } catch {
      const list = getStorage('attendance', INITIAL_ATTENDANCE);
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const todayRecord = {
        id: Date.now(),
        employeeId: employeeId || 'EMP-004',
        employeeName: name || 'David Miller',
        department: department || 'Engineering',
        date: now.toISOString().split('T')[0],
        checkIn: timeStr,
        checkOut: '--:--',
        status: 'PRESENT',
        workHours: 'Active',
      };
      const updated = [todayRecord, ...list.filter(item => item.employeeId !== employeeId)];
      setStorage('attendance', updated);
      return todayRecord;
    }
  },
  checkOut: async (employeeId) => {
    try {
      const res = await apiClient.post('/attendance/check-out', { employeeId });
      return res.data;
    } catch {
      const list = getStorage('attendance', INITIAL_ATTENDANCE);
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const updated = list.map(item => {
        if (item.employeeId === employeeId || item.id === 104) {
          return { ...item, checkOut: timeStr, workHours: '8h 15m' };
        }
        return item;
      });
      setStorage('attendance', updated);
      return updated;
    }
  }
};

export const leaveService = {
  getAll: async () => {
    try {
      const res = await apiClient.get('/leaves');
      return res.data;
    } catch {
      return getStorage('leaves', INITIAL_LEAVE_REQUESTS);
    }
  },
  apply: async (leaveData) => {
    try {
      const res = await apiClient.post('/leaves', leaveData);
      return res.data;
    } catch {
      const list = getStorage('leaves', INITIAL_LEAVE_REQUESTS);
      const newLeave = {
        id: Date.now(),
        status: 'PENDING',
        appliedOn: new Date().toISOString().split('T')[0],
        managerNotes: '',
        ...leaveData
      };
      const updated = [newLeave, ...list];
      setStorage('leaves', updated);
      return newLeave;
    }
  },
  updateStatus: async (id, status, notes) => {
    try {
      const res = await apiClient.put(`/leaves/${id}/status`, { status, notes });
      return res.data;
    } catch {
      const list = getStorage('leaves', INITIAL_LEAVE_REQUESTS);
      const updated = list.map(l => l.id === id ? { ...l, status, managerNotes: notes } : l);
      setStorage('leaves', updated);
      return updated.find(l => l.id === id);
    }
  }
};

export const payrollService = {
  getAll: async () => {
    try {
      const res = await apiClient.get('/payroll');
      return res.data;
    } catch {
      return getStorage('payroll', INITIAL_PAYROLL);
    }
  },
  generateMonthly: async () => {
    try {
      const res = await apiClient.post('/payroll/generate');
      return res.data;
    } catch {
      const list = getStorage('payroll', INITIAL_PAYROLL);
      const updated = list.map(p => ({ ...p, status: 'PAID', paymentDate: new Date().toISOString().split('T')[0] }));
      setStorage('payroll', updated);
      return updated;
    }
  }
};

export const reportService = {
  getChartsData: async () => {
    try {
      const res = await apiClient.get('/reports/dashboard');
      return res.data;
    } catch {
      return RECHARTS_DATA;
    }
  }
};

export default apiClient;
