package com.hrms.dtos.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AttendanceClockRequestDTO {

    @NotNull
    private Long employeeId;

}