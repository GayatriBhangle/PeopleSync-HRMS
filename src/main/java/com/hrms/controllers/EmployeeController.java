package com.hrms.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hrms.dtos.request.EmployeeRequestDTO;
import com.hrms.dtos.response.EmployeeResponseDTO;
import com.hrms.enums.Role;
import com.hrms.services.EmployeeService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/employees")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class EmployeeController {

    private final EmployeeService employeeService;
    /*
   	 * 
   	 * REGISTER NEW EMPLOYEE
   	*/
       @PostMapping("/register")
       @PreAuthorize("hasAnyRole('ADMIN','HR')")
       @Operation(summary = "Register Employee")
       public ResponseEntity<EmployeeResponseDTO> registerEmployee(
               @Valid @RequestBody EmployeeRequestDTO dto) {

           return ResponseEntity.status(HttpStatus.CREATED)
                   .body(employeeService.addEmployee(dto));
       }
       
    /**
     * Get All Employees
     */
    @Operation(
            summary = "Get All Employees",
            description = "Retrieve a list of all active employees."
    )
    @PreAuthorize("hasAnyRole('ADMIN','HR', 'MANAGER')")
    @GetMapping
    public ResponseEntity<List<EmployeeResponseDTO>> getAllEmployees() {

        List<EmployeeResponseDTO> employees =
                employeeService.getAllEmployees();
        return ResponseEntity.ok(employees);
    }

    @Operation(
            summary = "Get Employee By ID",
            description = "Retrieve employee details using employee id."
    )
    @PreAuthorize("hasAnyRole('ADMIN','HR','MANAGER')")
    @GetMapping("/{employeeId}")
    public ResponseEntity<EmployeeResponseDTO> getEmployeeById(
            @PathVariable Long employeeId) {

        EmployeeResponseDTO employee = employeeService.getEmployeeById(employeeId);

        return ResponseEntity.ok(employee);
    }

    @Operation(
            summary = "Add Employee",
            description = "Create a new employee."
    )
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @PostMapping
    public ResponseEntity<EmployeeResponseDTO> addEmployee(
            @Valid @RequestBody EmployeeRequestDTO employeeRequestDTO) {

        EmployeeResponseDTO employee =
                employeeService.addEmployee(employeeRequestDTO);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(employee);
    }

    //hard delete
    @Operation(
            summary = "Delete Employee",
            description = "Soft delete an employee by marking the employee as inactive."
    )
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{employeeId}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long employeeId) {

        //employeeService.hardDeleteEmployee(employeeId);
        employeeService.softDeleteEmployee(employeeId);

        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "Update Employee",
            description = "Update employee details using employee id."
    )
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @PutMapping("/{employeeId}")
    public ResponseEntity<EmployeeResponseDTO> updateEmployee(
            @PathVariable Long employeeId,
            @Valid @RequestBody EmployeeRequestDTO employeeRequestDTO) {

        EmployeeResponseDTO updatedEmployee =
                employeeService.updateEmployee(employeeId, employeeRequestDTO);

        return ResponseEntity.ok(updatedEmployee);
    }

    /*
     * Search
    */
    @GetMapping("/search")
    @PreAuthorize("hasAnyRole('ADMIN', 'HR', 'MANAGER')")
    public ResponseEntity<List<EmployeeResponseDTO>> searchEmployees(
    		@RequestParam(required = false) String name,
    		@RequestParam(required = false) String department,
    		@RequestParam(required = false) Role role, 
    		@RequestParam(required = false) Long managerId,
    		@RequestParam(required = false) LocalDate joinDate){
    	return ResponseEntity.ok(employeeService.searchEmployees(name, department, role, managerId, joinDate));
    }

//    @Operation(
//            summary = "Search Employee By Name",
//            description = "Search employees using first name or last name."
//    )
//    @PreAuthorize("hasAnyRole('ADMIN','HR','MANAGER')")
//    @GetMapping("/search")
//    public ResponseEntity<List<EmployeeResponseDTO>> searchByName(
//            @RequestParam String name) {
//        return ResponseEntity.ok(employeeService.searchByName(name));
//    }
//    
//    @Operation(
//            summary = "Search Employee By Department",
//            description = "Search employees by department."
//    )
//    @PreAuthorize("hasAnyRole('ADMIN','HR','MANAGER')")
//    @GetMapping("/search/department")
//    public ResponseEntity<List<EmployeeResponseDTO>> searchByDepartment(
//            @RequestParam String department) {
//
//        return ResponseEntity.ok(employeeService.searchByDepartment(department));
//    }
//
//    @Operation(
//            summary = "Search Employee By Role",
//            description = "Search employees by role."
//    )
//    @PreAuthorize("hasAnyRole('ADMIN','HR','MANAGER')")
//    @GetMapping("/search/role")
//    public ResponseEntity<List<EmployeeResponseDTO>> searchByRole(
//            @RequestParam Role role) {
//
//        return ResponseEntity.ok(employeeService.searchByRole(role));
//    }
//
//    @Operation(
//            summary = "Search Employee By Join Date",
//            description = "Search employees by joining date."
//    )
//    @PreAuthorize("hasAnyRole('ADMIN','HR','MANAGER')")
//    @GetMapping("/search/join-date")
//    public ResponseEntity<List<EmployeeResponseDTO>> searchByJoinDate(
//            @RequestParam LocalDate date) {
//
//        return ResponseEntity.ok(employeeService.searchByJoinDate(date));
//    }
//
//    @Operation(
//            summary = "Search Employees By Manager",
//            description = "Search employees reporting to a specific manager."
//    )
//    @PreAuthorize("hasAnyRole('ADMIN','HR','MANAGER')")
//    @GetMapping("/search/manager")
//    public ResponseEntity<List<EmployeeResponseDTO>> searchByManager(
//            @RequestParam Long managerId) {
//
//        return ResponseEntity.ok(employeeService.searchByManager(managerId));
//    }
}