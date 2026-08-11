import { useEffect, useState } from "react";
import { attendanceService } from "../../services/attendanceService";

export const AdminAttendance = () => {
    const [attendance, setAttendance] = useState([]);
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [loading, setLoading] = useState(true);

    const loadAttendance = async () => {
        try {
            setLoading(true);

            const data =
                await attendanceService.getAttendanceByDate(
                    selectedDate
                );

            setAttendance(data || []);
        } catch (error) {
            console.error(
                "Failed to load attendance:",
                error
            );

            setAttendance([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAttendance();
    }, [selectedDate]);

    const getStatusStyle = (status) => {
        switch (status) {
            case "PRESENT":
                return "bg-emerald-50 text-emerald-700 border border-emerald-200";

            case "ABSENT":
                return "bg-red-50 text-red-700 border border-red-200";

            case "HALF_DAY":
                return "bg-amber-50 text-amber-700 border border-amber-200";

            case "LEAVE":
                return "bg-blue-50 text-blue-700 border border-blue-200";

            default:
                return "bg-gray-50 text-gray-600 border border-gray-200";
        }
    };

    const formatStatus = (status) => {
        if (!status) return "--";

        return status
            .replace("_", " ")
            .toLowerCase()
            .replace(/\b\w/g, (char) =>
                char.toUpperCase()
            );
    };

    const formatTime = (time) => {
        if (!time) return "--";

        return time.substring(0, 5);
    };

    return (
        <div className="p-6 space-y-6">

            {/* PAGE HEADER */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                <div>
                    <h1 className="text-2xl font-semibold text-slate-800">
                        Attendance Management
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        View and manage employee attendance records.
                    </p>
                </div>

                {/* DATE FILTER */}
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

                    <label
                        htmlFor="attendance-date"
                        className="text-sm font-medium text-slate-600"
                    >
                        Select Date
                    </label>

                    <input
                        id="attendance-date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) =>
                            setSelectedDate(e.target.value)
                        }
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>
            </div>

            {/* SUMMARY */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Total Records
                    </p>

                    <p className="mt-2 text-2xl font-bold text-slate-800">
                        {attendance.length}
                    </p>
                </div>

                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5">
                    <p className="text-sm text-emerald-700">
                        Present
                    </p>

                    <p className="mt-2 text-2xl font-bold text-emerald-700">
                        {
                            attendance.filter(
                                (record) =>
                                    record.attendanceStatus ===
                                        "PRESENT" ||
                                    record.status === "PRESENT"
                            ).length
                        }
                    </p>
                </div>

                <div className="rounded-xl border border-red-100 bg-red-50 p-5">
                    <p className="text-sm text-red-700">
                        Absent
                    </p>

                    <p className="mt-2 text-2xl font-bold text-red-700">
                        {
                            attendance.filter(
                                (record) =>
                                    record.attendanceStatus ===
                                        "ABSENT" ||
                                    record.status === "ABSENT"
                            ).length
                        }
                    </p>
                </div>

                <div className="rounded-xl border border-amber-100 bg-amber-50 p-5">
                    <p className="text-sm text-amber-700">
                        Half Day
                    </p>

                    <p className="mt-2 text-2xl font-bold text-amber-700">
                        {
                            attendance.filter(
                                (record) =>
                                    record.attendanceStatus ===
                                        "HALF_DAY" ||
                                    record.status === "HALF_DAY"
                            ).length
                        }
                    </p>
                </div>
            </div>

            {/* ATTENDANCE TABLE */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                {/* TABLE HEADER */}
                <div className="border-b border-slate-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-slate-800">
                        Employee Attendance
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Attendance records for{" "}
                        {selectedDate}
                    </p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="text-sm text-slate-500">
                            Loading attendance...
                        </div>
                    </div>
                ) : attendance.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16">

                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                            <span className="text-xl">
                                📋
                            </span>
                        </div>

                        <p className="font-medium text-slate-700">
                            No attendance records
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            No attendance has been marked for this date.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">

                        <table className="min-w-full">

                            <thead className="bg-slate-50">
                                <tr>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Employee
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Employee ID
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Status
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Clock In
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                                        Clock Out
                                    </th>

                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">

                                {attendance.map((record) => (

                                    <tr
                                        key={record.id}
                                        className="transition hover:bg-slate-50"
                                    >

                                        {/* EMPLOYEE */}
                                        <td className="whitespace-nowrap px-6 py-4">

                                            <div className="flex items-center gap-3">

                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-600">
                                                    {record.employeeName
                                                        ?.charAt(0)
                                                        ?.toUpperCase() ||
                                                        "E"}
                                                </div>

                                                <div>
                                                    <p className="font-medium text-slate-800">
                                                        {record.employeeName ||
                                                            "--"}
                                                    </p>

                                                    <p className="text-xs text-slate-400">
                                                        Employee
                                                    </p>
                                                </div>

                                            </div>

                                        </td>

                                        {/* EMPLOYEE ID */}
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-600">
                                            #{record.employeeId}
                                        </td>

                                        {/* STATUS */}
                                        <td className="whitespace-nowrap px-6 py-4">

                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                                    record.attendanceStatus ||
                                                        record.status
                                                )}`}
                                            >
                                                {formatStatus(
                                                    record.attendanceStatus ||
                                                        record.status
                                                )}
                                            </span>

                                        </td>

                                        {/* CLOCK IN */}
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                            {formatTime(
                                                record.clockingIn
                                            )}
                                        </td>

                                        {/* CLOCK OUT */}
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                                            {formatTime(
                                                record.clockingOut
                                            )}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

        </div>
    );
};