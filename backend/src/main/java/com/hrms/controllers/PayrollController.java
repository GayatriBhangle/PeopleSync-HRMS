package com.hrms.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.hrms.dtos.request.PayrollRequestDTO;
import com.hrms.dtos.response.PaymentResultDTO;
import com.hrms.dtos.response.PayrollResponseDTO;
import com.hrms.services.PayrollService;
import com.hrms.services.PaymentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/payroll")
@SecurityRequirement(name = "bearerAuth")
public class PayrollController {

    private final PayrollService payrollService;
    private final PaymentService paymentService;

    /*
     *    GENERATE PAYROLL
     */
    @Operation(
            summary = "Generate Payroll",
            description = "Generate payroll for an employee."
    )
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @PostMapping("/generate")
    public ResponseEntity<PayrollResponseDTO> generatePayroll(
            @Valid @RequestBody PayrollRequestDTO payrollRequestDTO) {

        PayrollResponseDTO response =
                payrollService.generatePayroll(payrollRequestDTO);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /*
     *    GET ALL PAYROLLS
     */
    @Operation(
            summary = "Get All Payrolls",
            description = "Retrieve payroll records of all employees."
    )
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @GetMapping
    public ResponseEntity<List<PayrollResponseDTO>> getAllPayrolls() {

        return ResponseEntity.ok(
                payrollService.getAllPayrolls());
    }

    /*
     *    GET PAYROLL HISTORY OF EMPLOYEE
     */
    @Operation(
            summary = "Get Employee Payroll History",
            description = "Retrieve payroll history of a specific employee."
    )
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<PayrollResponseDTO>> getPayrollByEmployee(
            @PathVariable Long employeeId) {

        return ResponseEntity.ok(
                payrollService.getPayrollByEmployee(employeeId));
    }
    
    /*
     * GET MY PAYROLL HISTORY
     */
    @Operation(
            summary = "Get My Payroll History",
            description = "Retrieve payroll history of the logged-in employee."
    )
    @PreAuthorize("hasRole('EMPLOYEE')")
    @GetMapping("/me")
    public ResponseEntity<List<PayrollResponseDTO>> getMyPayrolls() {

        return ResponseEntity.ok(
                payrollService.getMyPayrolls());
    }
    
    /*
     * GET MY MONTHLY PAYROLL
     */
    @Operation(
            summary = "Get My Monthly Payroll",
            description = "Retrieve payroll of the logged-in employee for a specific month."
    )
    @PreAuthorize("hasRole('EMPLOYEE')")
    @GetMapping("/me/month")
    public ResponseEntity<PayrollResponseDTO> getMyPayrollByMonth(
            @RequestParam Integer payrollMonth,
            @RequestParam Integer payrollYear) {

        return ResponseEntity.ok(
                payrollService.getMyPayrollByMonth(
                        payrollMonth,
                        payrollYear));
    }

    /*
     *    GET PAYROLL OF EMPLOYEE FOR A MONTH
     */
    @Operation(
            summary = "Get Monthly Payroll",
            description = "Retrieve payroll of an employee for a specific month and year."
    )
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @GetMapping("/employee/{employeeId}/month")
    public ResponseEntity<PayrollResponseDTO> getPayrollByEmployeeAndMonth(
            @PathVariable Long employeeId,
            @RequestParam Integer payrollMonth,
            @RequestParam Integer payrollYear) {

        return ResponseEntity.ok(
                payrollService.getPayrollByEmployeeAndMonth(
                        employeeId,
                        payrollMonth,
                        payrollYear));
    }

    /*
     *    PAY SALARY
     */
    @Operation(
            summary = "Pay Salary",
            description = "Disburse a payroll's net salary via the payment service."
    )
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @PostMapping("/{payrollId}/pay")
    public ResponseEntity<PaymentResultDTO> paySalary(
            @PathVariable Long payrollId) {

        return ResponseEntity.ok(
                paymentService.paySalary(payrollId));
    }

    /*
     *    DELETE PAYROLL
     */
    @Operation(
            summary = "Delete Payroll",
            description = "Delete a payroll record using payroll id."
    )
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{payrollId}")
    public ResponseEntity<String> deletePayroll(
            @PathVariable Long payrollId) {

        payrollService.deletePayroll(payrollId);

        return ResponseEntity.ok("Payroll deleted successfully.");
    }
}