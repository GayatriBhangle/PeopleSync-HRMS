import api from './api';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const normalizePayroll = (dto) => {
  if (!dto) return dto;
  return {
    ...dto,
    employeeId: `EMP-${String(dto.employeeId).padStart(3, '0')}`,
    month: `${MONTH_NAMES[dto.payrollMonth - 1] || ''} ${dto.payrollYear}`.trim(),
    allowances: Number(dto.bonus) || 0,
    tax: 0,
    status: dto.paymentStatus === 'SUCCESS' ? 'PAID' : 'PROCESSED',
    paymentStatus:
      dto.paymentStatus === 'SUCCESS' ? 'COMPLETED' :
      dto.paymentStatus === 'FAILED' ? 'FAILED' : 'PENDING',
  };
};

export const payrollService = {
  getAllPayrolls: async () => {
    const response = await api.get('/payroll');
    return response.data.map(normalizePayroll);
  },

  getPayrollByEmployee: async (employeeId) => {
    const response = await api.get(`/payroll/employee/${employeeId}`);
    return response.data.map(normalizePayroll);
  },

  generatePayroll: async ({ employeeId, payrollMonth, payrollYear, basicSalary, bonus }) => {
    const response = await api.post('/payroll/generate', {
      employeeId: Number(employeeId),
      payrollMonth: Number(payrollMonth),
      payrollYear: Number(payrollYear),
      basicSalary: Number(basicSalary),
      bonus: Number(bonus) || 0,
    });
    return normalizePayroll(response.data);
  },

  paySalary: async (payrollId) => {
    const response = await api.post(`/payroll/${payrollId}/pay`);
    return response.data;
  },
};