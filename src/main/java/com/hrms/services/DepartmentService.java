package com.hrms.services;

import java.util.List;

import com.hrms.dtos.request.DepartmentRequestDTO;
import com.hrms.dtos.response.DepartmentEmployeeCountResponseDTO;
import com.hrms.dtos.response.DepartmentResponseDTO;
import com.hrms.dtos.response.EmployeeResponseDTO;

public interface DepartmentService {
	
	DepartmentResponseDTO addDepartment(DepartmentRequestDTO departmentRequestDTO);
	
	DepartmentResponseDTO getDepartmentById(Long departmentId);
	
	List<DepartmentResponseDTO> getAllDepartments();
	
	DepartmentResponseDTO updateDepartment(
	        Long departmentId,
	        DepartmentRequestDTO departmentRequestDTO);
	
	void deleteDepartment(Long departmentId);
	
	List<DepartmentResponseDTO> searchDepartment(String departmentName);
	
	List<EmployeeResponseDTO> getEmployeesByDepartment(Long departmentId);
	
	DepartmentEmployeeCountResponseDTO getEmployeeCountByDepartment(Long departmentId);
}
