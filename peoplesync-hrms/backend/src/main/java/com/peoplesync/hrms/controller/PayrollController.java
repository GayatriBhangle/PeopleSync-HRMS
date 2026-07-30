package com.peoplesync.hrms.controller;

import com.peoplesync.hrms.model.Payroll;
import com.peoplesync.hrms.service.PayrollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@CrossOrigin(origins = "*")
public class PayrollController {

    @Autowired
    private PayrollService payrollService;

    @GetMapping
    public ResponseEntity<List<Payroll>> getAllPayrolls() {
        return ResponseEntity.ok(payrollService.getAllPayrolls());
    }

    @PostMapping("/generate")
    public ResponseEntity<List<Payroll>> generateMonthlyPayroll() {
        return ResponseEntity.ok(payrollService.generateMonthlyPayroll());
    }
}
