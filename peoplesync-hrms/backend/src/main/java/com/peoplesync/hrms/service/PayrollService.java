package com.peoplesync.hrms.service;

import com.peoplesync.hrms.model.Payroll;
import com.peoplesync.hrms.repository.PayrollRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class PayrollService {

    @Autowired
    private PayrollRepository payrollRepository;

    public List<Payroll> getAllPayrolls() {
        return payrollRepository.findAll();
    }

    public List<Payroll> generateMonthlyPayroll() {
        List<Payroll> list = payrollRepository.findAll();
        for (Payroll p : list) {
            p.setStatus("PAID");
            p.setPaymentDate(LocalDate.now().toString());
            payrollRepository.save(p);
        }
        return list;
    }
}
