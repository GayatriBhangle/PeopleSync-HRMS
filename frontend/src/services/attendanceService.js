import api from './api';

/** Real enum values from com.hrms.enums.AttendanceStatus. */
export const ATTENDANCE_STATUSES = [
  { label: 'Present', value: 'PRESENT' },
  { label: 'Absent', value: 'ABSENT' },
  { label: 'Half Day', value: 'HALF_DAY' },
  { label: 'On Leave', value: 'LEAVE' },
];

/**
 * Backend AttendanceResponseDTO: { id, attendanceStatus, attendanceDate,
 * clockingIn, clockingOut, employeeId, employeeName }. No `department`,
 * `workHours`, or check-in/check-out self-service flow exists — those were
 * mock-only. `status` is aliased from `attendanceStatus` for the existing UI.
 */
const normalizeAttendance = (dto) => ({
  ...dto,
  status: dto.attendanceStatus,
});

const toRequestPayload = (form) => ({
  employeeId: Number(form.employeeId),
  attendanceStatus: form.attendanceStatus,
  attendanceDate: form.attendanceDate,
  clockingIn: form.clockingIn,
  clockingOut: form.clockingOut || null,
});

// let localAttendance = [
//   { id: 1, employeeId: 1, employeeName: 'Eleanor Vance', attendanceStatus: 'PRESENT', attendanceDate: new Date().toISOString().split('T')[0], clockingIn: '09:00', clockingOut: '18:00' },
// ];

const isNetworkError = (error) => !error.response;

export const attendanceService = {
  // ADMIN/HR only — full ledger.
  getAllAttendance: async () => {
    try {
      const response = await api.get('/attendance');
      return response.data.map(normalizeAttendance);
    } catch (error) {
      if(error.response?.status===404){
        return [];
      }
      throw error;
      
      // if (!isNetworkError(error)) throw error;
      // console.warn('Backend unreachable, using attendance fallback state');
      // return localAttendance.map(normalizeAttendance);
    }
  },

  // ADMIN/HR/MANAGER — everyone's records for one specific day (defaults the page's table).
  getAttendanceByDate: async (date) => {
    try {
      const response = await api.get('/attendance/date', { params: { attendanceDate: date } });
      return response.data.map(normalizeAttendance);
    } catch (error) {
      if(error.response?.status===404){
        return [];
      }
      throw error;
      // if (!isNetworkError(error)) throw error;
      // return localAttendance.filter((a) => a.attendanceDate === date).map(normalizeAttendance);
    }
  },

  // ADMIN/HR/MANAGER — mark a record for an employee.
  markAttendance: async (formData) => {
    try {
      const response = await api.post('/attendance', toRequestPayload(formData));
      return normalizeAttendance(response.data);
    } catch (error) {
      if(error.response?.status===404){
        return null;
      }
      throw error;
      // if (!isNetworkError(error)) throw error;
      // const newRecord = { id: Math.max(0, ...localAttendance.map((a) => a.id)) + 1, ...toRequestPayload(formData) };
      // localAttendance.unshift(newRecord);
      // return normalizeAttendance(newRecord);
    }
  },

  // ADMIN/HR only — correct an existing record.
  updateAttendance: async (id, formData) => {
    try {
      const response = await api.put(`/attendance/${id}`, toRequestPayload(formData));
      return normalizeAttendance(response.data);
    } catch (error) {
      if(error.response?.status===404){
        return null;
      }
      throw error;
      // if (!isNetworkError(error)) throw error;
      // localAttendance = localAttendance.map((a) => (a.id === Number(id) ? { ...a, ...toRequestPayload(formData) } : a));
      // return normalizeAttendance(localAttendance.find((a) => a.id === Number(id)));
    }
  },

  // All roles — self-view. Returns { employeeId, employeeName, month, year, presentDays, absentDays, halfDays, totalWorkingDays }.
  getAttendanceSummary: async (employeeId, month, year) => {
    try {
      const response = await api.get(`/attendance/employee/${employeeId}/summary`, { params: { month, year } });
      return response.data;
    } catch (error) {
      if(error.response?.status===404){
        return null;
      }
      throw error;
      // if (!isNetworkError(error)) throw error;
      // return { employeeId: Number(employeeId), employeeName: '', month, year, presentDays: 0, absentDays: 0, halfDays: 0, totalWorkingDays: 0 };
    }
  },

  // ADMIN/HR/MANAGER only (not EMPLOYEE) — one employee across a month, for the calendar-style view.
  getMonthlyAttendance: async (employeeId, month, year) => {
    try {
      const response = await api.get(`/attendance/employee/${employeeId}/monthly`, { params: { month, year } });
      return response.data.map(normalizeAttendance);
    } catch (error) {
      if(error.response?.status===404){
        return [];
      }
      throw error;
      // if (!isNetworkError(error)) throw error;
      // return [];
    }
  },

  // All roles, including EMPLOYEE — self-view for one specific day.
  // getAttendanceByEmployeeAndDate: async (employeeId, date) => {
  //   try {
  //     const response = await api.get(`/attendance/employee/${employeeId}/date`, { params: { attendanceDate: date } });
  //     return normalizeAttendance(response.data);
  //   } catch (error) {
  //     if(error.response?.status===404){
  //       return null;
  //     }
  //     throw error;
  //     // if (!isNetworkError(error)) throw error;
  //     // const record = localAttendance.find((a) => a.employeeId === Number(employeeId) && a.attendanceDate === date);
  //     // return record ? normalizeAttendance(record) : null;
  //   }
  // },

  getTodayAttendance: async () => {
    const response =
        await api.get("/attendance/me");
    return response.data
        ? normalizeAttendance(response.data)
        : null;
  },

  clockIn: async () => {
    const response = await api.post("/attendance/clock-in");
    return normalizeAttendance(response.data);
  },

  clockOut: async () => {
    const response = await api.post("/attendance/clock-out");
    return normalizeAttendance(response.data);
  },
};