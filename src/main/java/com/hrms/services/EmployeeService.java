package com.hrms.services;

import java.time.LocalDate;
import java.util.List;

import com.hrms.dtos.request.EmployeeRequestDTO;
import com.hrms.dtos.response.EmployeeResponseDTO;
import com.hrms.enums.Role;

public interface EmployeeService {

    EmployeeResponseDTO addEmployee(EmployeeRequestDTO employeeRequestDto);

    EmployeeResponseDTO updateEmployee(Long employeeId,
    		EmployeeRequestDTO employeeRequestDto);

    EmployeeResponseDTO getEmployeeById(Long employeeId);

    List<EmployeeResponseDTO> getAllEmployees();
    
    /*
	 * 
	 * REGISTER
	*/
    EmployeeResponseDTO registerEmployee(EmployeeRequestDTO dto);

    void hardDeleteEmployee(Long employeeId);
    
    void softDeleteEmployee(Long employeeId);
    
	/*
	 * SEARCH
	*/
    
    List<EmployeeResponseDTO> searchEmployees(String name, String department, Role role, Long managerId, LocalDate joinDate);
    
//    List<EmployeeResponseDTO> searchByName(String name);
//    
//    List<EmployeeResponseDTO> searchByDepartment(String department);
//    
//    List<EmployeeResponseDTO> searchByRole(Role role);
//    
//    List<EmployeeResponseDTO> searchByJoinDate(LocalDate joinDate);
//    
//    List<EmployeeResponseDTO> searchByManager(Long managerId);
}
