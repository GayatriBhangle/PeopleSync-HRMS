package com.hrms.services;

import java.util.List;

import com.hrms.dtos.request.LeaveRequestDTO;
import com.hrms.dtos.response.LeaveResponseDTO;
import com.hrms.enums.LeaveStatus;

public interface LeaveService {

    // Apply leave
    LeaveResponseDTO applyLeave(
            LeaveRequestDTO leaveRequestDTO);

    // Get all leave requests
    List<LeaveResponseDTO> getAllLeaves();

    // Employee leave history
    List<LeaveResponseDTO> getLeavesByEmployee(
            Long employeeId);

    // Filter by status
    List<LeaveResponseDTO> getLeavesByStatus(
            LeaveStatus status);

    // Approve leave
    LeaveResponseDTO approveLeave(
            Long leaveId);

    // Reject leave
    LeaveResponseDTO rejectLeave(
            Long leaveId);
    
    List<LeaveResponseDTO> getMyLeaves();
}