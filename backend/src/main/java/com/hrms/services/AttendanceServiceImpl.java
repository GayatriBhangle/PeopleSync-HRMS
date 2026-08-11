package com.hrms.services;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.hrms.dtos.request.AttendanceRequestDTO;
import com.hrms.dtos.response.AttendanceResponseDTO;
import com.hrms.dtos.response.AttendanceSummaryResponseDTO;
import com.hrms.entities.Attendance;
import com.hrms.entities.Employee;
import com.hrms.enums.AttendanceStatus;
import com.hrms.exceptions.ResourceNotFoundException;
import com.hrms.repositories.AttendanceRepository;
import com.hrms.repositories.EmployeeRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;
    private final ModelMapper modelMapper;

    /*
     * Helper method to convert Attendance Entity to Response DTO
     */
    private AttendanceResponseDTO mapToResponseDto(Attendance attendance) {

        AttendanceResponseDTO dto = modelMapper.map(attendance, AttendanceResponseDTO.class);

        dto.setEmployeeId(attendance.getEmployee().getId());

        dto.setEmployeeName(
                attendance.getEmployee().getFirstName() + " "
                        + attendance.getEmployee().getLastName());

        return dto;
    }
    

    /*
     * Helper method to convert AttendanceRequestDTO to Attendance Entity
     */
    private Attendance mapToEntity(AttendanceRequestDTO attendanceRequestDTO) {

        return modelMapper.map(attendanceRequestDTO, Attendance.class);
    }

    /*
     *    ADD ATTENDANCE
     */
    @Override
    public AttendanceResponseDTO addAttendance(
            AttendanceRequestDTO attendanceRequestDTO) {

        // Fetch Employee
        Employee employee = employeeRepository.findById(
                attendanceRequestDTO.getEmployeeId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee with id "
                                        + attendanceRequestDTO.getEmployeeId()
                                        + " not found"));

        // Prevent duplicate attendance
        if (attendanceRepository.existsByEmployeeIdAndAttendanceDate(
                attendanceRequestDTO.getEmployeeId(),
                attendanceRequestDTO.getAttendanceDate())) {

            throw new IllegalStateException(
                    "Attendance already marked for this employee on "
                            + attendanceRequestDTO.getAttendanceDate());
        }

        // Convert DTO to Entity
        Attendance attendance = mapToEntity(attendanceRequestDTO);

        // Set Employee
        attendance.setEmployee(employee);

        // Save Attendance
        Attendance savedAttendance = attendanceRepository.save(attendance);

        return mapToResponseDto(savedAttendance);
    }

    /*
     *    GET ALL ATTENDANCE
     */
    @Override
    public List<AttendanceResponseDTO> getAllAttendance() {

        List<Attendance> attendanceList = attendanceRepository.findAll();

//        if (attendanceList.isEmpty()) {
//            throw new ResourceNotFoundException(
//                    "No attendance records found.");
//        }

        return attendanceList.stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    /*
     *    MONTHLY ATTENDANCE OF EMPLOYEE
     */
    @Override
    public List<AttendanceResponseDTO> getMonthlyAttendance(
            Long employeeId,
            int month,
            int year) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee with id "
                                        + employeeId
                                        + " not found"));

        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        List<Attendance> attendanceList =
                attendanceRepository.findByEmployeeIdAndAttendanceDateBetween(
                        employeeId,
                        startDate,
                        endDate);

//        if (attendanceList.isEmpty()) {
//            throw new ResourceNotFoundException(
//                    "No attendance found for "
//                            + employee.getFirstName()
//                            + " in "
//                            + month
//                            + "/"
//                            + year);
//        }

        return attendanceList.stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    /*
     *    UPDATE ATTENDANCE
     */
    @Override
    public AttendanceResponseDTO updateAttendance(
            Long attendanceId,
            AttendanceRequestDTO attendanceRequestDTO) {

        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Attendance with id " + attendanceId + " not found"));

        Employee employee = employeeRepository.findById(
                attendanceRequestDTO.getEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Employee with id "
                                + attendanceRequestDTO.getEmployeeId()
                                + " not found"));

        // Check duplicate attendance only if employee/date changed
        if ((!attendance.getEmployee().getId().equals(attendanceRequestDTO.getEmployeeId())
                || !attendance.getAttendanceDate().equals(attendanceRequestDTO.getAttendanceDate()))
                && attendanceRepository.existsByEmployeeIdAndAttendanceDate(
                        attendanceRequestDTO.getEmployeeId(),
                        attendanceRequestDTO.getAttendanceDate())) {

            throw new IllegalStateException(
                    "Attendance already marked for this employee on "
                            + attendanceRequestDTO.getAttendanceDate());
        }

        modelMapper.map(attendanceRequestDTO, attendance);

        attendance.setEmployee(employee);

        Attendance updatedAttendance = attendanceRepository.save(attendance);

        return mapToResponseDto(updatedAttendance);
    }

    /*
     *    GET ATTENDANCE BY DATE
     */
    @Override
    public List<AttendanceResponseDTO> getAttendanceByDate(
            LocalDate attendanceDate) {

        List<Attendance> attendanceList =
                attendanceRepository.findByAttendanceDate(attendanceDate);

//        if (attendanceList.isEmpty()) {
//            throw new ResourceNotFoundException(
//                    "No attendance found for date : " + attendanceDate);
//        }

        return attendanceList.stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    /*
     *    GET ATTENDANCE BY STATUS
     */
    @Override
    public List<AttendanceResponseDTO> getAttendanceByStatus(
            AttendanceStatus attendanceStatus) {

        List<Attendance> attendanceList =
                attendanceRepository.findByAttendanceStatus(attendanceStatus);

//        if (attendanceList.isEmpty()) {
//            throw new ResourceNotFoundException(
//                    "No employees found with attendance status : "
//                            + attendanceStatus);
//        }

        return attendanceList.stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    /*
     *    GET EMPLOYEE ATTENDANCE BY DATE
     */
    @Override
    public AttendanceResponseDTO getAttendanceByEmployeeAndDate(
            Long employeeId,
            LocalDate attendanceDate) {
    	
    	Optional<Attendance> attendance =
    	        attendanceRepository.findByEmployeeIdAndAttendanceDate(
    	                employeeId,
    	                attendanceDate);

    	return attendance
    	        .map(this::mapToResponseDto)
    	        .orElse(null);

//        Attendance attendance =
//                attendanceRepository.findByEmployeeIdAndAttendanceDate(
//                        employeeId,
//                        attendanceDate)
//                .orElseThrow(() -> new ResourceNotFoundException(
//                        "Attendance not found for employee id "
//                                + employeeId
//                                + " on "
//                                + attendanceDate));
//
//        return mapToResponseDto(attendance);
    }
    
    /*
     *    MONTHLY ATTENDANCE SUMMARY
     */
    @Override
    public AttendanceSummaryResponseDTO getAttendanceSummary(Long employeeId, int month, int year) {

        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Employee with id " + employeeId + " not found"));

        LocalDate startDate = LocalDate.of(year, month, 1);
        LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

        List<Attendance> attendanceList =
                attendanceRepository.findByEmployeeIdAndAttendanceDateBetween(
                        employeeId,
                        startDate,
                        endDate);

//        if (attendanceList.isEmpty()) {
//            throw new ResourceNotFoundException(
//                    "No attendance found.");
//        }

        long present =
                attendanceList.stream()
                        .filter(a -> a.getAttendanceStatus() == AttendanceStatus.PRESENT)
                        .count();

        long absent =
                attendanceList.stream()
                        .filter(a -> a.getAttendanceStatus() == AttendanceStatus.ABSENT)
                        .count();

        long halfDay =
                attendanceList.stream()
                        .filter(a -> a.getAttendanceStatus() == AttendanceStatus.HALF_DAY)
                        .count();

        AttendanceSummaryResponseDTO dto =
                new AttendanceSummaryResponseDTO();

        dto.setEmployeeId(employee.getId());
        dto.setEmployeeName(employee.getFirstName() + " " + employee.getLastName());
        dto.setMonth(month);
        dto.setYear(year);
        dto.setPresentDays((int) present);
        dto.setAbsentDays((int) absent);
        dto.setHalfDays((int) halfDay);
        dto.setTotalWorkingDays((int) (present + absent + halfDay));
        dto.setTotalWorkingDays(attendanceList.size());

        return dto;
    }
    
    @Override
    public AttendanceSummaryResponseDTO getMyAttendanceSummary(
            int month,
            int year) {

        Employee employee = getLoggedInEmployee();

        return getAttendanceSummary(
                employee.getId(),
                month,
                year);

    }

    @Override
    public AttendanceResponseDTO clockIn() {

        Employee employee = getLoggedInEmployee();

        LocalDate today = LocalDate.now();

        Optional<Attendance> existingAttendance =
                attendanceRepository
                        .findByEmployeeIdAndAttendanceDate(
                                employee.getId(),
                                today);

        if (existingAttendance.isPresent()) {

            throw new IllegalStateException(
                    "Already clocked in today.");

        }

        Attendance attendance = new Attendance();

        attendance.setEmployee(employee);
        attendance.setAttendanceDate(today);
        attendance.setAttendanceStatus(AttendanceStatus.PRESENT);
        attendance.setClockingIn(LocalTime.now());

        Attendance saved =
                attendanceRepository.save(attendance);

        return mapToResponseDto(saved);
    }

    @Override
    public AttendanceResponseDTO clockOut() {

        Employee employee = getLoggedInEmployee();

        Attendance attendance =
                attendanceRepository
                        .findByEmployeeIdAndAttendanceDate(
                                employee.getId(),
                                LocalDate.now())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "No attendance found for today."));

        if (attendance.getClockingOut() != null) {

            throw new IllegalStateException(
                    "Already clocked out.");

        }

        attendance.setClockingOut(LocalTime.now());

        Attendance updated =
                attendanceRepository.save(attendance);

        return mapToResponseDto(updated);
    }
    
    @Override
    public AttendanceResponseDTO getTodayAttendance() {

        Employee employee = getLoggedInEmployee();

        return attendanceRepository
                .findByEmployeeIdAndAttendanceDate(
                        employee.getId(),
                        LocalDate.now())
                .map(this::mapToResponseDto)
                .orElse(null);

    }
    
    /*
     * Helper method to get record of the already logged in user to clock-in or clock-out
     * */
    
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