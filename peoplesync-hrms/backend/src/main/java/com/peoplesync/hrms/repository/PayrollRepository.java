package com.peoplesync.hrms.repository;

import com.peoplesync.hrms.model.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    List<Payroll> findByMonth(String month);
    List<Payroll> findByEmployeeId(String employeeId);
}
