package com.peoplesync.hrms.service;

import com.peoplesync.hrms.model.Attendance;
import com.peoplesync.hrms.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    public List<Attendance> getTodayAttendance() {
        return attendanceRepository.findByDate(LocalDate.now());
    }

    public Attendance checkIn(String employeeId, String name, String department) {
        LocalDate today = LocalDate.now();
        String timeStr = LocalTime.now().format(DateTimeFormatter.ofPattern("hh:mm a"));

        Attendance attendance = attendanceRepository.findByEmployeeIdAndDate(employeeId, today)
                .orElse(Attendance.builder()
                        .employeeId(employeeId)
                        .employeeName(name)
                        .department(department)
                        .date(today)
                        .status("PRESENT")
                        .workHours("Active")
                        .build());

        attendance.setCheckIn(timeStr);
        return attendanceRepository.save(attendance);
    }

    public Attendance checkOut(String employeeId) {
        LocalDate today = LocalDate.now();
        String timeStr = LocalTime.now().format(DateTimeFormatter.ofPattern("hh:mm a"));

        Attendance attendance = attendanceRepository.findByEmployeeIdAndDate(employeeId, today)
                .orElseThrow(() -> new RuntimeException("No check-in record found for today"));

        attendance.setCheckOut(timeStr);
        attendance.setWorkHours("8h 15m");
        return attendanceRepository.save(attendance);
    }
}
