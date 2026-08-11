package com.hrms.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hrms.dtos.response.PaymentHistoryDTO;
import com.hrms.services.PaymentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/payments")
@SecurityRequirement(name = "bearerAuth")
public class PaymentController {

    private final PaymentService paymentService;

    /*
     *    GET PAYMENT HISTORY
     */
    @Operation(
            summary = "Get Payment History",
            description = "Retrieve all completed salary payments, most recent first."
    )
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @GetMapping
    public ResponseEntity<List<PaymentHistoryDTO>> getPaymentHistory() {

        return ResponseEntity.ok(
                paymentService.getPaymentHistory());
    }

    /*
     *    GET PAYMENT DETAIL
     */
    @Operation(
            summary = "Get Payment Detail",
            description = "Retrieve a single payment record by payroll id."
    )
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @GetMapping("/{id}")
    public ResponseEntity<PaymentHistoryDTO> getPaymentDetail(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                paymentService.getPaymentDetail(id));
    }
}