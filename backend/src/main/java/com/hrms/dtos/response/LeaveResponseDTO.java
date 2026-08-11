package com.hrms.dtos.response;

import java.time.LocalDate;

import com.hrms.enums.LeaveStatus;
import com.hrms.enums.LeaveType;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LeaveResponseDTO {

    private Long id;

    private Long employeeId;

    private String employeeName;

    private LeaveType leaveType;

    private LocalDate startDate;

    private LocalDate endDate;

    private String reason;

    private LeaveStatus status;
}