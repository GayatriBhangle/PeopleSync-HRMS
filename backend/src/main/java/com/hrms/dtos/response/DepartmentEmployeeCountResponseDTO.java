package com.hrms.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class DepartmentEmployeeCountResponseDTO {

    private String departmentName;
    private long employeeCount;
}