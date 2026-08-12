import api from "./api";

export const leaveService = {

    // ADMIN / HR
    getAllLeaves: async () => {
        const response = await api.get("/leaves");
        return response.data;
    },

    // EMPLOYEE - logged-in employee only
    getMyLeaves: async () => {
        const response = await api.get("/leaves/me");
        return response.data;
    },

    // EMPLOYEE - apply leave
    applyLeave: async (leaveData) => {

        const payload = {
            leaveType: leaveData.leaveType,
            startDate: leaveData.startDate,
            endDate: leaveData.endDate,
            reason: leaveData.reason
        };

        const response = await api.post("/leaves", payload);

        return response.data;
    },

    // ADMIN / HR / MANAGER
    getLeavesByEmployee: async (employeeId) => {
        const response =
            await api.get(`/leaves/employee/${employeeId}`);

        return response.data;
    },

    // ADMIN / HR / MANAGER
    getLeavesByStatus: async (status) => {
        const response =
            await api.get("/leaves/status", {
                params: { status }
            });

        return response.data;
    },

    // ADMIN / HR / MANAGER
    approveLeave: async (leaveId) => {
        const response =
            await api.put(`/leaves/${leaveId}/approve`);

        return response.data;
    },

    // ADMIN / HR / MANAGER
    rejectLeave: async (leaveId) => {
        const response =
            await api.put(`/leaves/${leaveId}/reject`);

        return response.data;
    }
};