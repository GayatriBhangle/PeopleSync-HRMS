package com.hrms.dtos.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DepartmentRequestDTO {

    @NotBlank(message = "Department name is required")
    @Size(max = 30, message = "Department name cannot exceed 30 characters")
    private String departmentName;

    @Size(max = 30, message = "Department location cannot exceed 30 characters")
    private String deptLocation;
}