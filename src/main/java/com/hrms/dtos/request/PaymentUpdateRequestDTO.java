package com.hrms.dtos.request;

import com.hrms.enums.PaymentStatus;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentUpdateRequestDTO {

    @NotNull
    private Long payrollId;

    @NotNull
    private PaymentStatus paymentStatus;

    private String transactionId;
}