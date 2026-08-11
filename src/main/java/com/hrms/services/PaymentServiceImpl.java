package com.hrms.services;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;

import com.hrms.dtos.request.PaymentRequestDTO;
import com.hrms.dtos.response.PaymentHistoryDTO;
import com.hrms.dtos.response.PaymentResponseDTO;
import com.hrms.dtos.response.PaymentResultDTO;
import com.hrms.dtos.response.PayrollResponseDTO;
import com.hrms.entities.Payroll;
import com.hrms.enums.PaymentStatus;
import com.hrms.exceptions.ResourceNotFoundException;
import com.hrms.integration.PaymentClient;
import com.hrms.repositories.PayrollRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private static final String PAYMENT_METHOD_LABEL =
            "Bank Transfer (ASP.NET Core Payment Module)";

    private final PayrollRepository payrollRepository;
    private final PaymentClient paymentClient;
    private final ModelMapper modelMapper;

    /*
     * PAY SALARY - calls the .NET payment microservice for this payroll
     * and persists whatever it reports back onto the Payroll row.
     */
    @Override
    public PaymentResultDTO paySalary(Long payrollId) {

        Payroll payroll = payrollRepository.findById(payrollId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Payroll not found."));

        if (payroll.getPaymentStatus() == PaymentStatus.SUCCESS) {
            throw new IllegalStateException(
                    "This payroll has already been paid.");
        }

        PaymentRequestDTO request = new PaymentRequestDTO();
        request.setPayrollId(payroll.getId());
        request.setEmployeeId(payroll.getEmployee().getId());
        request.setAmount(payroll.getNetSalary());

        try {
            PaymentResponseDTO response = paymentClient.makePayment(request);

            boolean success = response != null
                    && response.getStatus() == PaymentStatus.SUCCESS;

            payroll.setPaymentStatus(
                    success ? PaymentStatus.SUCCESS : PaymentStatus.FAILED);
            payroll.setTransactionId(
                    response != null ? response.getTransactionId() : null);
            payroll.setPaymentDate(LocalDateTime.now());

            Payroll saved = payrollRepository.save(payroll);

            String message = (response != null && response.getMessage() != null)
                    ? response.getMessage()
                    : (success ? "Payment successful." : "Payment failed.");

            return new PaymentResultDTO(success, message, mapToResponseDto(saved));

        } catch (RestClientException ex) {
            // .NET payment service is down/unreachable/errored - this is a
            // legitimate business outcome (payment failed), not a 500.
            payroll.setPaymentStatus(PaymentStatus.FAILED);
            Payroll saved = payrollRepository.save(payroll);

            return new PaymentResultDTO(
                    false,
                    "Payment gateway unreachable. Please try again shortly.",
                    mapToResponseDto(saved));
        }
    }

    /*
     * PAYMENT HISTORY - every payroll that has been successfully paid,
     * most recently paid first.
     */
    @Override
    public List<PaymentHistoryDTO> getPaymentHistory() {
        return payrollRepository.findAll().stream()
                .filter(p -> p.getPaymentStatus() == PaymentStatus.SUCCESS)
                .sorted(Comparator.comparing(
                        Payroll::getPaymentDate,
                        Comparator.nullsLast(Comparator.reverseOrder())))
                .map(this::mapToHistoryDto)
                .toList();
    }

    /*
     * PAYMENT DETAIL - a single payment, looked up by payroll id.
     */
    @Override
    public PaymentHistoryDTO getPaymentDetail(Long payrollId) {
        Payroll payroll = payrollRepository.findById(payrollId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Payment not found."));

        return mapToHistoryDto(payroll);
    }

    private PaymentHistoryDTO mapToHistoryDto(Payroll payroll) {
        return new PaymentHistoryDTO(
                payroll.getId(),
                payroll.getId(),
                payroll.getEmployee().getId(),
                payroll.getEmployee().getFirstName() + " " + payroll.getEmployee().getLastName(),
                payroll.getNetSalary(),
                payroll.getPaymentStatus(),
                payroll.getPaymentDate(),
                payroll.getTransactionId(),
                PAYMENT_METHOD_LABEL);
    }

    private PayrollResponseDTO mapToResponseDto(Payroll payroll) {
        PayrollResponseDTO dto = modelMapper.map(payroll, PayrollResponseDTO.class);

        dto.setEmployeeId(payroll.getEmployee().getId());
        dto.setEmployeeName(
                payroll.getEmployee().getFirstName() + " " + payroll.getEmployee().getLastName());
        dto.setDepartment(payroll.getEmployee().getDepartment().getDepartmentName());
        dto.setDesignation(payroll.getEmployee().getDesignation());
        dto.setPaymentStatus(payroll.getPaymentStatus());
        dto.setTransactionId(payroll.getTransactionId());
        dto.setPaymentDate(payroll.getPaymentDate());

        return dto;
    }
}