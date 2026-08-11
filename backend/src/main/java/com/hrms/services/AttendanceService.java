package com.hrms.services;

import java.time.LocalDate;
import java.util.List;

import com.hrms.dtos.request.AttendanceRequestDTO;
import com.hrms.dtos.response.AttendanceResponseDTO;
import com.hrms.dtos.response.AttendanceSummaryResponseDTO;
import com.hrms.enums.AttendanceStatus;

public interface AttendanceService {

    /*
     *    ADD ATTENDANCE
     */
    AttendanceResponseDTO addAttendance(
            AttendanceRequestDTO attendanceRequestDTO);

    /*
     *    GET ALL ATTENDANCE
     */
    List<AttendanceResponseDTO> getAllAttendance();

    /*
     *    UPDATE ATTENDANCE
     */
    AttendanceResponseDTO updateAttendance(
            Long attendanceId,
            AttendanceRequestDTO attendanceRequestDTO);

    /*
     *    MONTHLY ATTENDANCE REPORT
     */
    List<AttendanceResponseDTO> getMonthlyAttendance(
            Long employeeId,
            int month,
            int year);

    /*
     *    GET ATTENDANCE BY DATE
     */
    List<AttendanceResponseDTO> getAttendanceByDate(
            LocalDate attendanceDate);

    /*
     *    GET ATTENDANCE BY STATUS
     */
    List<AttendanceResponseDTO> getAttendanceByStatus(
            AttendanceStatus attendanceStatus);

    /*
     *    GET EMPLOYEE ATTENDANCE BY DATE
     */
    AttendanceResponseDTO getAttendanceByEmployeeAndDate(
            Long employeeId,
            LocalDate attendanceDate);
    
    AttendanceSummaryResponseDTO getAttendanceSummary(
            Long employeeId,
            int month,
            int year);
    
    AttendanceSummaryResponseDTO getMyAttendanceSummary(
            int month,
            int year);
    
    AttendanceResponseDTO clockIn();

    AttendanceResponseDTO clockOut();
    
    AttendanceResponseDTO getTodayAttendance();

}