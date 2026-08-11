package com.hrms.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hrms.entities.Attendance;
import com.hrms.enums.AttendanceStatus;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    // Get all attendance records of an employee
    List<Attendance> findByEmployeeId(Long employeeId);

    // Get attendance of all employees for a particular date
    List<Attendance> findByAttendanceDate(LocalDate attendanceDate);

    // Check duplicate attendance
    boolean existsByEmployeeIdAndAttendanceDate(
            Long employeeId,
            LocalDate attendanceDate);

    // Get attendance of an employee on a specific date
    Optional<Attendance> findByEmployeeIdAndAttendanceDate(
            Long employeeId,
            LocalDate attendanceDate);

    // Monthly attendance report
    List<Attendance> findByEmployeeIdAndAttendanceDateBetween(
            Long employeeId,
            LocalDate startDate,
            LocalDate endDate);

    // Filter by status
    List<Attendance> findByAttendanceStatus(
            AttendanceStatus attendanceStatus);
}