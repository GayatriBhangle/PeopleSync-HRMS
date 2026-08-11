package com.hrms.services;

import java.util.List;

import com.hrms.dtos.request.PayrollRequestDTO;
import com.hrms.dtos.response.PayrollResponseDTO;

public interface PayrollService {

    PayrollResponseDTO generatePayroll(
            PayrollRequestDTO payrollRequestDTO);

    List<PayrollResponseDTO> getAllPayrolls();

    List<PayrollResponseDTO> getPayrollByEmployee(
            Long employeeId);

    PayrollResponseDTO getPayrollByEmployeeAndMonth(
            Long employeeId,
            Integer payrollMonth,
            Integer payrollYear);

    void deletePayroll(Long payrollId);
    
    List<PayrollResponseDTO> getMyPayrolls();

    PayrollResponseDTO getMyPayrollByMonth(
            Integer payrollMonth,
            Integer payrollYear);
   
}