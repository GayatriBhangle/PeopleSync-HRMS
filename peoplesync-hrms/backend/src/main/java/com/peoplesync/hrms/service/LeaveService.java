package com.peoplesync.hrms.service;

import com.peoplesync.hrms.model.LeaveRequest;
import com.peoplesync.hrms.repository.LeaveRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class LeaveService {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    public List<LeaveRequest> getAllLeaves() {
        return leaveRequestRepository.findAll();
    }

    public LeaveRequest applyLeave(LeaveRequest leaveRequest) {
        leaveRequest.setStatus("PENDING");
        leaveRequest.setAppliedOn(LocalDate.now());
        return leaveRequestRepository.save(leaveRequest);
    }

    public LeaveRequest updateLeaveStatus(Long id, String status, String managerNotes) {
        LeaveRequest leave = leaveRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave request not found"));
        leave.setStatus(status);
        leave.setManagerNotes(managerNotes);
        return leaveRequestRepository.save(leave);
    }
}
