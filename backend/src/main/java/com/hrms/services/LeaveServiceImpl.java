package com.hrms.services;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.hrms.dtos.request.LeaveRequestDTO;
import com.hrms.dtos.response.LeaveResponseDTO;
import com.hrms.entities.Employee;
import com.hrms.entities.Leave;
import com.hrms.enums.LeaveStatus;
import com.hrms.exceptions.ResourceNotFoundException;
import com.hrms.repositories.EmployeeRepository;
import com.hrms.repositories.LeaveRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class LeaveServiceImpl implements LeaveService {

    private final LeaveRepository leaveRepository;
    private final EmployeeRepository employeeRepository;
    private final ModelMapper modelMapper;

    /*
     * Helper method to convert Entity -> Response DTO
     */
    private LeaveResponseDTO mapToResponseDto(Leave leave) {

        LeaveResponseDTO dto = modelMapper.map(leave, LeaveResponseDTO.class);

        dto.setEmployeeId(leave.getEmployee().getId());

        dto.setEmployeeName(
                leave.getEmployee().getFirstName()
                        + " "
                        + leave.getEmployee().getLastName());

        return dto;
    }

    /*
     * Helper method to convert Request DTO -> Entity
     */
    private Leave mapToEntity(LeaveRequestDTO dto) {
        return modelMapper.map(dto, Leave.class);
    }

    /*
     * APPLY LEAVE
     */
    @Override
    public LeaveResponseDTO applyLeave(
            LeaveRequestDTO leaveRequestDTO) {

        Employee employee = getLoggedInEmployee();

        if (leaveRequestDTO.getEndDate()
                .isBefore(leaveRequestDTO.getStartDate())) {

            throw new IllegalArgumentException(
                    "End date cannot be before start date.");
        }

        List<Leave> overlappingLeaves =
                leaveRepository
                        .findByEmployeeIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                                employee.getId(),
                                leaveRequestDTO.getEndDate(),
                                leaveRequestDTO.getStartDate());

        if (!overlappingLeaves.isEmpty()) {
            throw new IllegalStateException(
                    "Employee already has a leave request for the selected dates.");
        }

        Leave leave = mapToEntity(leaveRequestDTO);

        leave.setEmployee(employee);
        leave.setStatus(LeaveStatus.PENDING);

        Leave savedLeave = leaveRepository.save(leave);

        return mapToResponseDto(savedLeave);
    }

    /*
     * GET ALL LEAVES
     */
    @Override
    public List<LeaveResponseDTO> getAllLeaves() {

        List<Leave> leaves = leaveRepository.findAll();

        if (leaves.isEmpty()) {
            throw new ResourceNotFoundException(
                    "No leave requests found.");
        }

        return leaves.stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    /*
     * GET LEAVES OF EMPLOYEE
     */
    @Override
    public List<LeaveResponseDTO> getLeavesByEmployee(Long employeeId) {

        employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Employee with id " + employeeId + " not found"));

        List<Leave> leaves =
                leaveRepository.findByEmployeeId(employeeId);

        return leaves.stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    /*
     * GET LEAVES BY STATUS
     */
    @Override
    public List<LeaveResponseDTO> getLeavesByStatus(
            LeaveStatus status) {

        List<Leave> leaves =
                leaveRepository.findByStatus(status);

        if (leaves.isEmpty()) {
            throw new ResourceNotFoundException(
                    "No leave requests found with status : "
                            + status);
        }

        return leaves.stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    /*
     * APPROVE LEAVE
     */
    @Override
    public LeaveResponseDTO approveLeave(Long leaveId) {

        Leave leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Leave request not found."));

        leave.setStatus(LeaveStatus.APPROVED);

        Leave updatedLeave =
                leaveRepository.save(leave);

        return mapToResponseDto(updatedLeave);
    }

    /*
     * REJECT LEAVE
     */
    @Override
    public LeaveResponseDTO rejectLeave(Long leaveId) {

        Leave leave = leaveRepository.findById(leaveId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Leave request not found."));

        leave.setStatus(LeaveStatus.REJECTED);

        Leave updatedLeave =
                leaveRepository.save(leave);

        return mapToResponseDto(updatedLeave);
    }
    
    @Override
    public List<LeaveResponseDTO> getMyLeaves() {

        Employee employee = getLoggedInEmployee();

        List<Leave> leaves =
                leaveRepository.findByEmployeeId(employee.getId());

        return leaves.stream()
                .map(this::mapToResponseDto)
                .toList();
    }
    
    private Employee getLoggedInEmployee() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        String email = authentication.getName();

        return employeeRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found."));
    }
}