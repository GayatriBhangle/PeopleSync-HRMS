package com.hrms.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceSummaryResponseDTO {

    private Long employeeId;

    private String employeeName;

    private int month;

    private int year;

    private long presentDays;

    private long absentDays;

    private long halfDays;

    private long totalWorkingDays;

}