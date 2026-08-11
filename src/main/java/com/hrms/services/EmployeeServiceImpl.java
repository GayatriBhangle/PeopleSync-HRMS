package com.hrms.services;

import java.time.LocalDate;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.hrms.dtos.request.EmployeeRequestDTO;
import com.hrms.dtos.response.EmployeeResponseDTO;
import com.hrms.entities.Department;
import com.hrms.entities.Employee;
import com.hrms.enums.Role;
import com.hrms.exceptions.ResourceNotFoundException;
import com.hrms.repositories.DepartmentRepository;
import com.hrms.repositories.EmployeeRepository;
import com.hrms.specification.EmployeeSpecification;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService{
	
	private final EmployeeRepository employeeRepository;
	private final DepartmentRepository departmentRepository;
	private final ModelMapper modelMapper;
	private final PasswordEncoder passwordEncoder;
	
	 /**
     * Helper method to convert Employee Entity to Response DTO
     */
	private EmployeeResponseDTO mapToResponseDto(Employee employee) {

	    EmployeeResponseDTO dto = modelMapper.map(employee, EmployeeResponseDTO.class);

	    if (employee.getDepartment() != null) {
	        dto.setDepartmentId(employee.getDepartment().getId());
	        dto.setDepartmentName(employee.getDepartment().getDepartmentName());
	    }

	    if (employee.getManager() != null) {
	        dto.setManagerId(employee.getManager().getId());
	        dto.setManagerName(
	                employee.getManager().getFirstName() + " "
	                + employee.getManager().getLastName());
	    }

	    return dto;
	}
    
    /**
     * Helper method to convert EmployeeRequestDTO to Employee Entity
     */
    private Employee mapToEntity(EmployeeRequestDTO dto) {
        return modelMapper.map(dto, Employee.class);
    }
    
    /*
	 * 
	 * REGISTER
	*/
	
	@Override
	public EmployeeResponseDTO registerEmployee(EmployeeRequestDTO dto) {
	    return addEmployee(dto);
	}

//	@Override
//	public List<EmployeeResponseDTO> getAllEmployees() {
//		return employeeRepository.findAll()
//                .stream()
//                .map(this::mapToResponseDto)
//                .toList();
//	}
	
    /*
	 *    GET BY ID
	*/
    
	@Override
	public EmployeeResponseDTO getEmployeeById(Long employeeId) {

	    Employee employee = employeeRepository.findById(employeeId)
	            .orElseThrow(() ->
	                    new ResourceNotFoundException(
	                            "Employee with id " + employeeId + " not found"));

	    return mapToResponseDto(employee);
	}

	/*
	 *    ADD EMPLOYEE
	*/
	
	@Override
	public EmployeeResponseDTO addEmployee(EmployeeRequestDTO employeeRequestDto) {

	    // Fetch Department
	    Department department = departmentRepository.findById(employeeRequestDto.getDepartmentId())
	            .orElseThrow(() -> new ResourceNotFoundException(
	                    "Department with id " + employeeRequestDto.getDepartmentId() + " not found"));

	    // Convert Request DTO to Entity
	    Employee employee = mapToEntity(employeeRequestDto);

	    // Set Department
	    employee.setDepartment(department);
	    
	    // Set password
	   // employee.setHashedPwd(employeeRequestDto.getHashPwd()); ------ without spring security
	    employee.setHashedPwd(
	            passwordEncoder.encode(employeeRequestDto.getHashPwd()));  // ----- with spring security

	    // Set Manager (if provided)
	    if (employeeRequestDto.getManagerId() != null) {

	        Employee manager = employeeRepository.findById(employeeRequestDto.getManagerId())
	                .orElseThrow(() -> new ResourceNotFoundException(
	                        "Manager with id " + employeeRequestDto.getManagerId() + " not found"));

	        employee.setManager(manager);
	    }

	    // Save Employee
	    Employee savedEmployee = employeeRepository.save(employee);

	    // Convert Entity to Response DTO
	    return mapToResponseDto(savedEmployee);
	}

	/*
	 *    hard delete
	*/
	
	@Override
	public void hardDeleteEmployee(Long employeeId) {

	    if (!employeeRepository.existsById(employeeId)) {
	        throw new ResourceNotFoundException(
	                "Employee with id " + employeeId + " not found.");
	    }

	    employeeRepository.deleteById(employeeId);
	}

	/*
	 *    soft delete
	*/
	
	@Override
	public void softDeleteEmployee(Long employeeId) {

	    Employee employee = employeeRepository.findById(employeeId)
	            .orElseThrow(() ->
	                    new ResourceNotFoundException(
	                            "Employee with id " + employeeId + " not found."));

//	    employee.setActive(false);
	    employee.setActive(false);

	    
	    employeeRepository.save(employee);
	}
	
	/*
	 *    GET ALL
	*/
	
	
	@Override
	public List<EmployeeResponseDTO> getAllEmployees() {

	    return employeeRepository.findByIsActiveTrue()
	            .stream()
	            .map(this::mapToResponseDto)
	            .toList();
	}

	/*
	 *    UPDATE
	*/
	
	@Override
	public EmployeeResponseDTO updateEmployee(Long employeeId,
	        EmployeeRequestDTO employeeRequestDTO) {

		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		System.out.println("User : " + authentication.getName());
		System.out.println("Authorities : " + authentication.getAuthorities());
		
	    // Fetch existing employee
	    Employee employee = employeeRepository.findById(employeeId)
	            .orElseThrow(() -> new ResourceNotFoundException(
	                    "Employee with id " + employeeId + " not found"));

	    // Fetch department
	    Department department = departmentRepository.findById(employeeRequestDTO.getDepartmentId())
	            .orElseThrow(() -> new ResourceNotFoundException(
	                    "Department with id " + employeeRequestDTO.getDepartmentId() + " not found"));

	    // Copy matching fields from DTO to existing entity
	    modelMapper.map(employeeRequestDTO, employee);

	    // Password field names are different
	   // employee.setHashedPwd(employeeRequestDTO.getHashPwd());  without spring security
	    if (employeeRequestDTO.getHashPwd() != null &&
	    	    !employeeRequestDTO.getHashPwd().isBlank()) {

	    	    employee.setHashedPwd(
	    	        passwordEncoder.encode(employeeRequestDTO.getHashPwd())
	    	    );
	    	}
	    
	    // Set Department
	    employee.setDepartment(department);

	    // Set Manager
	    if (employeeRequestDTO.getManagerId() != null) {

	        Employee manager = employeeRepository.findById(employeeRequestDTO.getManagerId())
	                .orElseThrow(() -> new ResourceNotFoundException(
	                        "Manager with id " + employeeRequestDTO.getManagerId() + " not found"));

	        employee.setManager(manager);

	    } else {
	        employee.setManager(null);
	    }

	    Employee updatedEmployee = employeeRepository.save(employee);

	    return mapToResponseDto(updatedEmployee);
	}

	/*
	 * 
	 * Search function Implementation
	*/
	
	// Search by all the attributes in one query
	@Override
	public List<EmployeeResponseDTO> searchEmployees(String name, String department, Role role, Long managerId,
			LocalDate joinDate) {
		return employeeRepository.findAll(EmployeeSpecification.filterEmployees(name, department, role, managerId, joinDate)
								 ).stream().map(this::mapToResponseDto).toList();
	}
	
//	// by firstname and lastname
//	@Override
//	public List<EmployeeResponseDTO> searchByName(String name) {
//
//	    List<Employee> employees = employeeRepository.searchByName(name);
//
//	    if (employees.isEmpty()) {
//	        throw new ResourceNotFoundException("No employee found with name : " + name);
//	    }
//
//	    return employees.stream()
//	            .map(this::mapToResponseDto)
//	            .toList();
//	}
//	
//	// by department
//	@Override
//	public List<EmployeeResponseDTO> searchByDepartment(String department) {
//
//	    List<Employee> employees =
//	            employeeRepository.findByDepartmentDepartmentNameContainingIgnoreCase(department);
//
//	    if (employees.isEmpty()) {
//	        throw new ResourceNotFoundException(
//	                "No employees found in department : " + department);
//	    }
//
//	    return employees.stream()
//	            .map(this::mapToResponseDto)
//	            .toList();
//	}
//	
//	// search by role
//	@Override
//	public List<EmployeeResponseDTO> searchByRole(Role role) {
//
//	    List<Employee> employees = employeeRepository.findByRole(role);
//
//	    if (employees.isEmpty()) {
//	        throw new ResourceNotFoundException(
//	                "No employees found with role : " + role);
//	    }
//
//	    return employees.stream()
//	            .map(this::mapToResponseDto)
//	            .toList();
//	}
//	
//	@Override
//	public List<EmployeeResponseDTO> searchByJoinDate(LocalDate joinDate) {
//
//	    List<Employee> employees = employeeRepository.findByJoinDate(joinDate);
//
//	    if (employees.isEmpty()) {
//	        throw new ResourceNotFoundException(
//	                "No employees found with join date : " + joinDate);
//	    }
//
//	    return employees.stream()
//	            .map(this::mapToResponseDto)
//	            .toList();
//	}
//	
//	@Override
//	public List<EmployeeResponseDTO> searchByManager(Long managerId) {
//
//	    List<Employee> employees = employeeRepository.findByManagerId(managerId);
//
//	    if (employees.isEmpty()) {
//	        throw new ResourceNotFoundException(
//	                "No employees found under manager id : " + managerId);
//	    }
//
//	    return employees.stream()
//	            .map(this::mapToResponseDto)
//	            .toList();
//	}

	
}
