package com.hrms.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.hrms.dtos.request.LeaveRequestDTO;
import com.hrms.dtos.response.LeaveResponseDTO;
import com.hrms.enums.LeaveStatus;
import com.hrms.services.LeaveService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/leaves")
@SecurityRequirement(name = "bearerAuth")
public class LeaveController {

    private final LeaveService leaveService;

    /*
     *    APPLY LEAVE
     */
    @Operation(
            summary = "Apply Leave",
            description = "Submit a leave request for the logged-in employee."
    )
    @PreAuthorize("hasRole('EMPLOYEE')")
    @PostMapping
    public ResponseEntity<LeaveResponseDTO> applyLeave(
            @Valid @RequestBody LeaveRequestDTO leaveRequestDTO) {

        LeaveResponseDTO response =
                leaveService.applyLeave(leaveRequestDTO);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /*
     *    GET ALL LEAVES
     */
    @Operation(
            summary = "Get All Leave Requests",
            description = "Retrieve all leave requests."
    )
    @PreAuthorize("hasAnyRole('ADMIN','HR', 'MANAGER')")
    @GetMapping
    public ResponseEntity<List<LeaveResponseDTO>> getAllLeaves() {

        return ResponseEntity.ok(
                leaveService.getAllLeaves());
    }

    /*
     *    GET EMPLOYEE LEAVE HISTORY
     */
    @Operation(
            summary = "Get Employee Leave History",
            description = "Retrieve leave history of a specific employee."
    )
    @PreAuthorize("hasAnyRole('ADMIN','HR','MANAGER')")
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<LeaveResponseDTO>> getLeavesByEmployee(
            @PathVariable Long employeeId) {

        return ResponseEntity.ok(
                leaveService.getLeavesByEmployee(employeeId));
    }

    /*
     *    GET LEAVES BY STATUS
     */
    @Operation(
            summary = "Get Leave Requests By Status",
            description = "Retrieve leave requests based on leave status."
    )
    @PreAuthorize("hasAnyRole('ADMIN','HR','MANAGER')")
    @GetMapping("/status")
    public ResponseEntity<List<LeaveResponseDTO>> getLeavesByStatus(
            @RequestParam LeaveStatus status) {

        return ResponseEntity.ok(
                leaveService.getLeavesByStatus(status));
    }

    /*
     *    APPROVE LEAVE
     */
    @Operation(
            summary = "Approve Leave",
            description = "Approve a pending leave request."
    )
    @PreAuthorize("hasAnyRole('ADMIN','HR','MANAGER')")
    @PutMapping("/{leaveId}/approve")
    public ResponseEntity<LeaveResponseDTO> approveLeave(
            @PathVariable Long leaveId) {

        return ResponseEntity.ok(
                leaveService.approveLeave(leaveId));
    }

    /*
     *    REJECT LEAVE
     */
    @Operation(
            summary = "Reject Leave",
            description = "Reject a pending leave request."
    )
    @PreAuthorize("hasAnyRole('ADMIN','HR','MANAGER')")
    @PutMapping("/{leaveId}/reject")
    public ResponseEntity<LeaveResponseDTO> rejectLeave(
            @PathVariable Long leaveId) {

        return ResponseEntity.ok(
                leaveService.rejectLeave(leaveId));
    }
    
    /*
     * GET MY LEAVE HISTORY
     */
    @Operation(
            summary = "Get My Leave History",
            description = "Retrieve leave history of the logged-in employee."
    )
    @PreAuthorize("hasRole('EMPLOYEE')")
    @GetMapping("/me")
    public ResponseEntity<List<LeaveResponseDTO>> getMyLeaves() {

        return ResponseEntity.ok(
                leaveService.getMyLeaves());
    }

}