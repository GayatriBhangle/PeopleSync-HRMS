package com.hrms.dtos.response;

import com.hrms.enums.PaymentStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentResponseDTO {

    private Long paymentId;

    private String message;

    private PaymentStatus status;
    
    private String transactionId;
}