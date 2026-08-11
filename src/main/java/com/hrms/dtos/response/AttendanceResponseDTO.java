package com.hrms.dtos.response;

import java.time.LocalDate;
import java.time.LocalTime;

import com.hrms.enums.AttendanceStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceResponseDTO {

    private Long id;

    private AttendanceStatus attendanceStatus;

    private LocalDate attendanceDate;

    private LocalTime clockingIn;

    private LocalTime clockingOut;

    private Long employeeId;

    private String employeeName;
}