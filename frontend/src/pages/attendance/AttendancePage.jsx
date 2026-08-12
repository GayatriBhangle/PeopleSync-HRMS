import { useAuth } from "../../context/AuthContext";
import { EmployeeAttendance } from "./EmployeeAttendance";
import { AdminAttendance } from "./AdminAttendance";

export const AttendancePage = () => {
    const { user } = useAuth();

    if (!user) return null;

    if (user.role === "EMPLOYEE") {
        return <EmployeeAttendance />;
    }

    return <AdminAttendance />;
};