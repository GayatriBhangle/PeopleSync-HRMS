import api from './api';

export const authService = {
  login: async (email, password) => {
    const response = await api.post("/auth/login", {
        email,
        password,
    });

    return {
        token: response.data.token,
        id: response.data.employeeId,
        name: response.data.employeeName,
        role: response.data.role,
        email,
    };
  }
};