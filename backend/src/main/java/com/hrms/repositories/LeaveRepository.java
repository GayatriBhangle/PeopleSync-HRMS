package com.hrms.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hrms.entities.Leave;
import com.hrms.enums.LeaveStatus;

public interface LeaveRepository extends JpaRepository<Leave, Long> {

    // Employee leave history
    List<Leave> findByEmployeeId(Long employeeId);

    // Filter by status
    List<Leave> findByStatus(LeaveStatus status);

    // Check overlapping leave requests
    List<Leave> findByEmployeeIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            Long employeeId,
            java.time.LocalDate endDate,
            java.time.LocalDate startDate);
}