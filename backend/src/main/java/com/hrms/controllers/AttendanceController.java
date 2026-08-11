package com.hrms.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.hrms.dtos.request.AttendanceRequestDTO;
import com.hrms.dtos.response.AttendanceResponseDTO;
import com.hrms.dtos.response.AttendanceSummaryResponseDTO;
import com.hrms.enums.AttendanceStatus;
import com.hrms.services.AttendanceService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/attendance")
@SecurityRequirement(name = "bearerAuth")
public class AttendanceController {

    private final AttendanceService attendanceService;

    /*
     *    ADD ATTENDANCE
     */
    @Operation(
            summary = "Add Attendance",
            description = "Mark attendance for an employee."
    )
    @PreAuthorize("hasAnyRole('ADMIN','HR','MANAGER')")
    @PostMapping
    public ResponseEntity<AttendanceResponseDTO> addAttendance(
            @Valid @RequestBody AttendanceRequestDTO attendanceRequestDTO) {

        AttendanceResponseDTO response =
                attendanceService.addAttendance(attendanceRequestDTO);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /*
     *    GET ALL ATTENDANCE
     */
    @Operation(
            summary = "Get All Attendance",
            description = "Retrieve attendance records of all employees."
    )
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @GetMapping
    public ResponseEntity<List<AttendanceResponseDTO>> getAllAttendance() {

        return ResponseEntity.ok(
                attendanceService.getAllAttendance());
    }

    /*
     *    UPDATE ATTENDANCE
     */
    @Operation(
            summary = "Update Attendance",
            description = "Update an existing attendance record."
    )
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @PutMapping("/{attendanceId}")
    public ResponseEntity<AttendanceResponseDTO> updateAttendance(
            @PathVariable Long attendanceId,
            @Valid @RequestBody AttendanceRequestDTO attendanceRequestDTO) {

        return ResponseEntity.ok(
                attendanceService.updateAttendance(
                        attendanceId,
                        attendanceRequestDTO));
    }

    /*
     *    MONTHLY ATTENDANCE REPORT OF EMPLOYEE
     */
    @Operation(
            summary = "Monthly Attendance Report",
            description = "Retrieve monthly attendance records of an employee."
    )
    @PreAuthorize("hasAnyRole('ADMIN','HR','MANAGER')")
//    @GetMapping("/employee/{employeeId}/monthly")
    @GetMapping("/employee/{employeeId}/monthly")
    public ResponseEntity<List<AttendanceResponseDTO>> getMonthlyAttendance(
            @PathVariable Long employeeId,
            @RequestParam int month,
            @RequestParam int year) {

        return ResponseEntity.ok(
                attendanceService.getMonthlyAttendance(
                        employeeId,
                        month,
                        year));
    }

    /*
     *    GET ATTENDANCE BY DATE
     */
    @Operation(
            summary = "Get Attendance By Date",
            description = "Retrieve attendance records for a specific date."
    )
    @PreAuthorize("hasAnyRole('ADMIN','HR','MANAGER')")
    @GetMapping("/date")
    public ResponseEntity<List<AttendanceResponseDTO>> getAttendanceByDate(
            @RequestParam LocalDate attendanceDate) {

        return ResponseEntity.ok(
                attendanceService.getAttendanceByDate(attendanceDate));
    }

    /*
     *    GET ATTENDANCE BY STATUS
     */
    @Operation(
            summary = "Get Attendance By Status",
            description = "Retrieve attendance records by attendance status."
    )
    @PreAuthorize("hasAnyRole('ADMIN','HR','MANAGER')")
    @GetMapping("/status")
    public ResponseEntity<List<AttendanceResponseDTO>> getAttendanceByStatus(
            @RequestParam AttendanceStatus attendanceStatus) {

        return ResponseEntity.ok(
                attendanceService.getAttendanceByStatus(attendanceStatus));
    }

    /*
     *    GET EMPLOYEE ATTENDANCE BY DATE
     */
    @Operation(
            summary = "Get Employee Attendance By Date",
            description = "Retrieve attendance of a specific employee for a given date."
    )
    @PreAuthorize("hasAnyRole('ADMIN','HR','MANAGER')")
    @GetMapping("/employee/{employeeId}/date")
    public ResponseEntity<AttendanceResponseDTO> getAttendanceByEmployeeAndDate(
            @PathVariable Long employeeId,
            @RequestParam LocalDate attendanceDate) {

        return ResponseEntity.ok(
                attendanceService.getAttendanceByEmployeeAndDate(
                        employeeId,
                        attendanceDate));
    }

    /*
     *    MONTHLY ATTENDANCE SUMMARY
     */
    @Operation(
            summary = "Monthly Attendance Summary",
            description = "Retrieve attendance summary of an employee for a given month."
    )
    @PreAuthorize("hasAnyRole('ADMIN','HR','MANAGER')")
    @GetMapping("/employee/{employeeId}/summary")
    public ResponseEntity<AttendanceSummaryResponseDTO> getAttendanceSummary(
            @PathVariable Long employeeId,
            @RequestParam int month,
            @RequestParam int year) {

        return ResponseEntity.ok(
                attendanceService.getAttendanceSummary(
                        employeeId,
                        month,
                        year));
    }
    
    @GetMapping("/me/summary")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<AttendanceSummaryResponseDTO> getMySummary(
            @RequestParam int month,
            @RequestParam int year) {

        return ResponseEntity.ok(
                attendanceService.getMyAttendanceSummary(month, year));

    }
    
    /*
     * CLOCK IN
     */
    @Operation(
            summary = "Clock In",
            description = "Clock in the logged in employee."
    )
    @PreAuthorize("hasRole('EMPLOYEE')")
    @PostMapping("/clock-in")
    public ResponseEntity<AttendanceResponseDTO> clockIn() {

        return ResponseEntity.ok(
                attendanceService.clockIn());
    }

    /*
     * CLOCK OUT
     */
    @Operation(
            summary = "Clock Out",
            description = "Clock out the logged in employee."
    )
    @PreAuthorize("hasRole('EMPLOYEE')")
    @PostMapping("/clock-out")
    public ResponseEntity<AttendanceResponseDTO> clockOut() {

        return ResponseEntity.ok(
                attendanceService.clockOut());
    }
    
    /*
     * TODAY'S ATTENDANCE OF LOGGED-IN EMPLOYEE
     */
    @Operation(
            summary = "Today's Attendance",
            description = "Returns today's attendance of logged in employee."
    )
    @PreAuthorize("hasRole('EMPLOYEE')")
    @GetMapping("/me")
    public ResponseEntity<AttendanceResponseDTO> getTodayAttendance() {

        return ResponseEntity.ok(
                attendanceService.getTodayAttendance());

    }
}