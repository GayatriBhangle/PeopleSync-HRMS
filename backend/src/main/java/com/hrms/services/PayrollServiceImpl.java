package com.hrms.services;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.hrms.dtos.request.PayrollRequestDTO;
import com.hrms.dtos.response.PayrollResponseDTO;
import com.hrms.entities.Attendance;
import com.hrms.entities.Employee;
import com.hrms.entities.Payroll;
import com.hrms.enums.AttendanceStatus;
import com.hrms.exceptions.ResourceNotFoundException;
import com.hrms.repositories.AttendanceRepository;
import com.hrms.repositories.EmployeeRepository;
import com.hrms.repositories.PayrollRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class PayrollServiceImpl implements PayrollService {

    private final PayrollRepository payrollRepository;
    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final ModelMapper modelMapper;

    /*
     * Helper Method : Entity -> ResponseDTO
     */
    private PayrollResponseDTO mapToResponseDto(Payroll payroll) {

        PayrollResponseDTO dto =
                modelMapper.map(payroll, PayrollResponseDTO.class);

        dto.setEmployeeId(payroll.getEmployee().getId());

        dto.setEmployeeName(
                payroll.getEmployee().getFirstName()
                        + " "
                        + payroll.getEmployee().getLastName());

        dto.setDepartment(
                payroll.getEmployee().getDepartment().getDepartmentName());

        dto.setDesignation(
                payroll.getEmployee().getDesignation());

        dto.setPaymentStatus(payroll.getPaymentStatus());
        dto.setTransactionId(payroll.getTransactionId());
        dto.setPaymentDate(payroll.getPaymentDate());

        return dto;
    }

    /*
     * Helper Method : RequestDTO -> Entity
     */
    private Payroll mapToEntity(PayrollRequestDTO dto) {
        return modelMapper.map(dto, Payroll.class);
    }

    /*
     * GENERATE PAYROLL
     */
    @Override
    public PayrollResponseDTO generatePayroll(
            PayrollRequestDTO payrollRequestDTO) {

        Employee employee = employeeRepository.findById(
                payrollRequestDTO.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Employee not found"));

        if (payrollRepository.existsByEmployeeIdAndPayrollMonthAndPayrollYear(
                payrollRequestDTO.getEmployeeId(),
                payrollRequestDTO.getPayrollMonth(),
                payrollRequestDTO.getPayrollYear())) {

            throw new IllegalStateException(
                    "Payroll already generated.");
        }

        LocalDate startDate = LocalDate.of(
                payrollRequestDTO.getPayrollYear(),
                payrollRequestDTO.getPayrollMonth(),
                1);

        LocalDate endDate =
                startDate.withDayOfMonth(startDate.lengthOfMonth());

        List<Attendance> attendanceList =
                attendanceRepository.findByEmployeeIdAndAttendanceDateBetween(
                        employee.getId(),
                        startDate,
                        endDate);

        if (attendanceList.isEmpty()) {
            throw new ResourceNotFoundException(
                    "Attendance not found.");
        }

        long absentDays = attendanceList.stream()
                .filter(a -> a.getAttendanceStatus() == AttendanceStatus.ABSENT)
                .count();

        long halfDays = attendanceList.stream()
                .filter(a -> a.getAttendanceStatus() == AttendanceStatus.HALF_DAY)
                .count();

        int workingDays = attendanceList.size();

        BigDecimal basicSalary =
                payrollRequestDTO.getBasicSalary();

        BigDecimal perDaySalary =
                basicSalary.divide(
                        BigDecimal.valueOf(workingDays),
                        2,
                        RoundingMode.HALF_UP);

        BigDecimal deductions =
                perDaySalary.multiply(
                        BigDecimal.valueOf(absentDays))
                        .add(
                                perDaySalary.divide(
                                        BigDecimal.valueOf(2),
                                        2,
                                        RoundingMode.HALF_UP)
                                        .multiply(
                                                BigDecimal.valueOf(halfDays)));

        BigDecimal bonus =
                payrollRequestDTO.getBonus();

        BigDecimal netSalary =
                basicSalary
                        .subtract(deductions)
                        .add(bonus);

        Payroll payroll = mapToEntity(payrollRequestDTO);

        payroll.setEmployee(employee);
        payroll.setPayrollDate(LocalDate.now());
        payroll.setDeductions(deductions);
        payroll.setNetSalary(netSalary);

        Payroll savedPayroll =
                payrollRepository.save(payroll);

        return mapToResponseDto(savedPayroll);
    }

    /*
     * GET ALL PAYROLLS
     */
    @Override
    public List<PayrollResponseDTO> getAllPayrolls() {

        return payrollRepository.findAll()
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    /*
     * GET PAYROLL BY EMPLOYEE
     */
    @Override
    public List<PayrollResponseDTO> getPayrollByEmployee(
            Long employeeId) {

        List<Payroll> payrolls =
                payrollRepository.findByEmployeeId(employeeId);

        if (payrolls.isEmpty()) {
            throw new ResourceNotFoundException(
                    "No payroll found.");
        }

        return payrolls.stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    /*
     * GET PAYROLL OF EMPLOYEE FOR MONTH
     */
    @Override
    public PayrollResponseDTO getPayrollByEmployeeAndMonth(
            Long employeeId,
            Integer payrollMonth,
            Integer payrollYear) {

        Payroll payroll =
                payrollRepository
                        .findByEmployeeIdAndPayrollMonthAndPayrollYear(
                                employeeId,
                                payrollMonth,
                                payrollYear)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Payroll not found."));

        return mapToResponseDto(payroll);
    }

    /*
     * DELETE PAYROLL
     */
    @Override
    public void deletePayroll(Long payrollId) {

        Payroll payroll =
                payrollRepository.findById(payrollId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Payroll not found."));

        payrollRepository.delete(payroll);
    }

	@Override
	public List<PayrollResponseDTO> getMyPayrolls() {
		Employee employee = getLoggedInEmployee();

	    List<Payroll> payrolls =
	            payrollRepository.findByEmployeeId(employee.getId());

	    return payrolls.stream()
	            .map(this::mapToResponseDto)
	            .toList();
	}

	@Override
	public PayrollResponseDTO getMyPayrollByMonth(Integer payrollMonth, Integer payrollYear) {
		Employee employee = getLoggedInEmployee();

	    Payroll payroll =
	            payrollRepository
	                    .findByEmployeeIdAndPayrollMonthAndPayrollYear(
	                            employee.getId(),
	                            payrollMonth,
	                            payrollYear)
	                    .orElseThrow(() ->
	                            new ResourceNotFoundException(
	                                    "Payroll not found."));

	    return mapToResponseDto(payroll);
		
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