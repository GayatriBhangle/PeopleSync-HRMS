import { useEffect, useState } from "react";
import { attendanceService } from "../../services/attendanceService";
import { Button } from "../../components/common/Button";

export const EmployeeAttendance = () => {
    const [attendance, setAttendance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const loadAttendance = async () => {
        try {
            const data = await attendanceService.getTodayAttendance();
            setAttendance(data);
        } catch (error) {
            console.error("Failed to load today's attendance:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAttendance();
    }, []);

    const handleClockIn = async () => {
        try {
            setActionLoading(true);

            await attendanceService.clockIn();

            await loadAttendance();
        } catch (error) {
            console.error("Clock in failed:", error);
        } finally {
            setActionLoading(false);
        }
    };

    const handleClockOut = async () => {
        try {
            setActionLoading(true);

            await attendanceService.clockOut();

            await loadAttendance();
        } catch (error) {
            console.error("Clock out failed:", error);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return <p>Loading attendance...</p>;
    }

    return (
        <div>
            <h2>Today's Attendance</h2>

            {!attendance ? (
                <div>
                    <p>No attendance marked today.</p>

                    <Button
                        onClick={handleClockIn}
                        disabled={actionLoading}
                    >
                        {actionLoading ? "Clocking In..." : "Clock In"}
                    </Button>
                </div>
            ) : (
                <div>
                    <p>
                        Status: {attendance.status}
                    </p>

                    <p>
                        Clock In: {attendance.clockingIn || "--"}
                    </p>

                    <p>
                        Clock Out: {attendance.clockingOut || "--"}
                    </p>

                    {!attendance.clockingOut && (
                        <Button
                            onClick={handleClockOut}
                            disabled={actionLoading}
                        >
                            {actionLoading
                                ? "Clocking Out..."
                                : "Clock Out"}
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};