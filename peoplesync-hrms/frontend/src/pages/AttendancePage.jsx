import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { attendanceService } from '../services/api';
import DataTable from '../components/common/DataTable';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import { CalendarCheck, Clock, CheckCircle2, LogOut, Calendar, Download } from 'lucide-react';

const AttendancePage = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('logs'); // 'logs' or 'calendar'
  const [isCheckedIn, setIsCheckedIn] = useState(false);

  useEffect(() => {
    attendanceService.getToday().then(data => {
      setAttendanceRecords(data);
      setIsLoading(false);
    });
  }, []);

  const handleClockToggle = async () => {
    if (!isCheckedIn) {
      const record = await attendanceService.checkIn(currentUser.employeeId, currentUser.name, currentUser.department);
      setAttendanceRecords(prev => [record, ...prev]);
      setIsCheckedIn(true);
      showToast({ message: `Check-in recorded at ${record.checkIn}`, type: 'success' });
    } else {
      await attendanceService.checkOut(currentUser.employeeId);
      setIsCheckedIn(false);
      showToast({ message: 'Checked out successfully.', type: 'info' });
    }
  };

  const columns = [
    { header: 'Employee', accessor: 'employeeName' },
    { header: 'Department', accessor: 'department' },
    { header: 'Date', accessor: 'date' },
    { header: 'Check In', accessor: 'checkIn' },
    { header: 'Check Out', accessor: 'checkOut' },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => (
        <Badge variant={row.status === 'PRESENT' ? 'active' : row.status === 'LATE' ? 'warning' : 'danger'}>
          {row.status}
        </Badge>
      )
    },
    { header: 'Duration', accessor: 'workHours' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-text dark:text-gray-100 tracking-tight">Attendance Logs</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Real-time employee check-in/out tracking and monthly attendance calendar.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl">
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'logs' ? 'bg-white dark:bg-gray-900 text-primary dark:text-emerald-400 shadow-xs' : 'text-gray-400'}`}
            >
              Daily Logs
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${activeTab === 'calendar' ? 'bg-white dark:bg-gray-900 text-primary dark:text-emerald-400 shadow-xs' : 'text-gray-400'}`}
            >
              Calendar View
            </button>
          </div>

          <Button
            variant={isCheckedIn ? 'danger' : 'success'}
            onClick={handleClockToggle}
          >
            {isCheckedIn ? <LogOut className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            {isCheckedIn ? 'Clock Out' : 'Clock In'}
          </Button>
        </div>
      </div>

      {activeTab === 'logs' ? (
        <DataTable
          columns={columns}
          data={attendanceRecords}
          isLoading={isLoading}
          searchPlaceholder="Search attendance logs..."
          exportFilename="attendance_report_2026.csv"
          filterOptions={{
            key: 'status',
            label: 'Status',
            items: [
              { label: 'PRESENT', value: 'PRESENT' },
              { label: 'LATE', value: 'LATE' },
              { label: 'ON_LEAVE', value: 'ON_LEAVE' },
            ]
          }}
        />
      ) : (
        <Card title="July 2026 Attendance Calendar" subtitle="Color-coded daily status for organizational overview">
          <div className="grid grid-cols-7 gap-2 mt-4 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-xs font-bold text-gray-400 uppercase py-2">{d}</div>
            ))}
            {Array.from({ length: 31 }).map((_, i) => {
              const day = i + 1;
              const isWeekend = i % 7 === 0 || i % 7 === 6;
              const isPresent = !isWeekend && day < 30;
              return (
                <div
                  key={day}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col justify-between h-20 transition-all ${
                    isWeekend
                      ? 'bg-gray-50 dark:bg-gray-900/40 border-gray-100 dark:border-gray-800 text-gray-400'
                      : isPresent
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                      : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 text-amber-800'
                  }`}
                >
                  <span className="text-left font-mono">{day}</span>
                  <span className="text-[10px] uppercase tracking-wider block text-right font-extrabold">
                    {isWeekend ? 'Weekend' : isPresent ? 'Present' : 'Leave'}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};

export default AttendancePage;
