package com.hrms.dtos.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.hrms.enums.PaymentStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PayrollResponseDTO {

    private Long id;

    private Long employeeId;

    private String employeeName;

    private String department;

    private String designation;

    private Integer payrollMonth;

    private Integer payrollYear;

    private BigDecimal basicSalary;

    private BigDecimal bonus;

    private BigDecimal deductions;

    private BigDecimal netSalary;

    private LocalDate payrollDate;

    private PaymentStatus paymentStatus;

    private String transactionId;

    private LocalDateTime paymentDate;
}