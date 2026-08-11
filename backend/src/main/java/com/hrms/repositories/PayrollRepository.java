package com.hrms.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hrms.entities.Payroll;

public interface PayrollRepository extends JpaRepository<Payroll, Long> {

    boolean existsByEmployeeIdAndPayrollMonthAndPayrollYear(
            Long employeeId,
            Integer payrollMonth,
            Integer payrollYear);

    Optional<Payroll> findByEmployeeIdAndPayrollMonthAndPayrollYear(
            Long employeeId,
            Integer payrollMonth,
            Integer payrollYear);

    List<Payroll> findByEmployeeId(Long employeeId);
}