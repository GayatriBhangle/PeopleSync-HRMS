package com.hrms.services;

import java.util.List;

import com.hrms.dtos.response.PaymentHistoryDTO;
import com.hrms.dtos.response.PaymentResultDTO;

public interface PaymentService {

    /**
     * Triggers disbursement for a payroll record by calling the
     * ASP.NET Core payment microservice, then persists the outcome
     * back onto the Payroll row.
     */
    PaymentResultDTO paySalary(Long payrollId);

    /**
     * All successfully completed payments, most recent first.
     */
    List<PaymentHistoryDTO> getPaymentHistory();

    /**
     * A single payment record, looked up by payroll id.
     */
    PaymentHistoryDTO getPaymentDetail(Long payrollId);
}