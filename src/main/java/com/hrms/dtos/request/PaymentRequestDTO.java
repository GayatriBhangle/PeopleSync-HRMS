package com.hrms.dtos.request;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentRequestDTO {

    private Long payrollId;

    private Long employeeId;

    private BigDecimal amount;
}