package com.hrms.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

/**
 * Wraps the outcome of a "pay this payroll" action.
 * Shape intentionally mirrors what payrollService.js's mock fallback
 * already returns: { success, message, payroll }.
 */
@Getter
@Setter
@AllArgsConstructor
public class PaymentResultDTO {

    private boolean success;

    private String message;

    private PayrollResponseDTO payroll;
}