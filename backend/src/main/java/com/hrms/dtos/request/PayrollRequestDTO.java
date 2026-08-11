package com.hrms.dtos.request;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PayrollRequestDTO {

    @NotNull(message = "Employee Id is required")
    private Long employeeId;

    @NotNull(message = "Payroll month is required")
    @Min(value = 1)
    @Max(value = 12)
    private Integer payrollMonth;

    @NotNull(message = "Payroll year is required")
    private Integer payrollYear;

    @NotNull(message = "Basic salary is required")
    @DecimalMin(value = "0.0")
    private BigDecimal basicSalary;

    @DecimalMin(value = "0.0")
    private BigDecimal bonus = BigDecimal.ZERO;
}