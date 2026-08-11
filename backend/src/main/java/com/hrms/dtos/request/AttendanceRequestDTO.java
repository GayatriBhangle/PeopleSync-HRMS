package com.hrms.dtos.request;

import java.time.LocalDate;
import java.time.LocalTime;

import com.hrms.enums.AttendanceStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttendanceRequestDTO {

    @NotNull(message = "Attendance status is required")
    private AttendanceStatus attendanceStatus;

    @NotNull(message = "Attendance date is required")
    private LocalDate attendanceDate;

    @NotNull(message = "Clock in time is required")
    private LocalTime clockingIn;

    private LocalTime clockingOut;

    @NotNull(message = "Employee Id is required")
    private Long employeeId;

}