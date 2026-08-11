package com.hrms.services;

import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.hrms.dtos.request.DepartmentRequestDTO;
import com.hrms.dtos.response.DepartmentEmployeeCountResponseDTO;
import com.hrms.dtos.response.DepartmentResponseDTO;
import com.hrms.dtos.response.EmployeeResponseDTO;
import com.hrms.entities.Department;
import com.hrms.entities.Employee;
import com.hrms.exceptions.ResourceNotFoundException;
import com.hrms.repositories.DepartmentRepository;
import com.hrms.repositories.EmployeeRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;
    private final ModelMapper modelMapper;

    /**
     * Helper method to convert Department Entity to Response DTO
     */
    private DepartmentResponseDTO mapToResponseDto(Department department) {
        return modelMapper.map(department, DepartmentResponseDTO.class);
    }

    /**
     * Helper method to convert DepartmentRequestDTO to Department Entity
     */
    private Department mapToEntity(DepartmentRequestDTO dto) {
        return modelMapper.map(dto, Department.class);
    }
    
	/*
	 * 
	 * Helper Method of Employee
	*/
    
    private EmployeeResponseDTO mapEmployeeToResponseDto(Employee employee) {

        EmployeeResponseDTO dto =
                modelMapper.map(employee, EmployeeResponseDTO.class);

        dto.setDepartmentName(employee.getDepartment().getDepartmentName());

        if (employee.getManager() != null) {
            dto.setManagerName(
                    employee.getManager().getFirstName()
                            + " "
                            + employee.getManager().getLastName());
        }

        return dto;
    }
    
    // GET ALL
    @Override
    public List<DepartmentResponseDTO> getAllDepartments() {

        List<Department> departments = departmentRepository.findAll();

        if (departments.isEmpty()) {
            throw new ResourceNotFoundException("No departments found.");
        }

        return departments.stream()
                .map(this::mapToResponseDto)
                .toList();
    }
    
    // GET BY ID
    @Override
    public DepartmentResponseDTO getDepartmentById(Long departmentId) {

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department with id " + departmentId + " not found"));

        return mapToResponseDto(department);
    }

    // ADD 
    @Override
    public DepartmentResponseDTO addDepartment(
            DepartmentRequestDTO departmentRequestDTO) {

        Department department = mapToEntity(departmentRequestDTO);

        Department savedDepartment = departmentRepository.save(department);

        return mapToResponseDto(savedDepartment);
    }
    
    @Override
    public DepartmentResponseDTO updateDepartment(
            Long departmentId,
            DepartmentRequestDTO departmentRequestDTO) {

        // Fetch existing department
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Department with id " + departmentId + " not found"));

        // Update fields
        modelMapper.map(departmentRequestDTO, department);

        // Save updated department
        Department updatedDepartment = departmentRepository.save(department);

        return mapToResponseDto(updatedDepartment);
    }
    
    /*
     *    DELETE DEPARTMENT
     *    Deletes a department only if no employees are assigned to it.
     */
    
    @Override
    public void deleteDepartment(Long departmentId) {

        // Check if department exists
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department with id " + departmentId + " not found"));

        // Check whether employees belong to this department
        if (employeeRepository.existsById(departmentId)) {
            throw new IllegalStateException(
                    "Cannot delete department because employees are assigned to it.");
        }

        // Delete department
        departmentRepository.delete(department);
    }
    
    /*
     *    SEARCH DEPARTMENT BY NAME
     */
    @Override
    public List<DepartmentResponseDTO> searchDepartment(String departmentName) {

        List<Department> departments =
                departmentRepository.findByDepartmentNameContainingIgnoreCase(departmentName);

        if (departments.isEmpty()) {
            throw new ResourceNotFoundException(
                    "No department found with name : " + departmentName);
        }

        return departments.stream()
                .map(this::mapToResponseDto)
                .toList();
    }
    
    /*
     *    GET ALL EMPLOYEES OF A DEPARTMENT
     */
    @Override
    public List<EmployeeResponseDTO> getEmployeesByDepartment(Long departmentId) {

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Department with id " + departmentId + " not found"));

        List<Employee> employees = department.getEmployees();

        if (employees.isEmpty()) {
            throw new ResourceNotFoundException(
                    "No employees found in department : "
                            + department.getDepartmentName());
        }

        return employees.stream()
                .map(this::mapEmployeeToResponseDto)
                .toList();
    }
    
	/*
	 * 
	 * Get Employee Count per department
	*/
    
    @Override
    public DepartmentEmployeeCountResponseDTO getEmployeeCountByDepartment(Long departmentId) {

        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Department with id " + departmentId + " not found"));

        long employeeCount = employeeRepository.countByDepartmentId(departmentId);

        return new DepartmentEmployeeCountResponseDTO(
                department.getDepartmentName(),
                employeeCount);
    }
}