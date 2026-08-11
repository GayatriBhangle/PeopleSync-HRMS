package com.hrms.dtos.response;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.hrms.enums.PaymentStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * Flat, display-ready record for the Payment History page.
 * Derived from a paid Payroll row rather than a separate table -
 * the Spring Boot side doesn't persist its own payment ledger,
 * it trusts the outcome the .NET payment service already returned.
 */
@Getter
@Setter
@AllArgsConstructor
public class PaymentHistoryDTO {

    private Long id;

    private Long payrollId;

    private Long employeeId;

    private String employeeName;

    private BigDecimal amount;

    private PaymentStatus status;

    private LocalDateTime paymentDate;

    private String transactionId;

    private String paymentMethod;
}