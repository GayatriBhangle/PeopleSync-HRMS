package com.hrms.controllers;

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

import com.hrms.dtos.request.DepartmentRequestDTO;
import com.hrms.dtos.response.DepartmentEmployeeCountResponseDTO;
import com.hrms.dtos.response.DepartmentResponseDTO;
import com.hrms.dtos.response.EmployeeResponseDTO;
import com.hrms.services.DepartmentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/departments")
@SecurityRequirement(name = "bearerAuth")
public class DepartmentController {

    private final DepartmentService departmentService;

    @Operation(
            summary = "Get All Departments",
            description = "Retrieve a list of all departments."
    )
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @GetMapping
    public ResponseEntity<List<DepartmentResponseDTO>> getAllDepartments() {

        return ResponseEntity.ok(
                departmentService.getAllDepartments());
    }

    @Operation(
            summary = "Get Department By ID",
            description = "Retrieve department details using department id."
    )
    @PreAuthorize("hasAnyRole('ADMIN','HR','MANAGER')")
    @GetMapping("/{departmentId}")
    public ResponseEntity<DepartmentResponseDTO> getDepartmentById(
            @PathVariable Long departmentId) {

        return ResponseEntity.ok(
                departmentService.getDepartmentById(departmentId));
    }

    @Operation(
            summary = "Add Department",
            description = "Create a new department."
    )
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @PostMapping
    public ResponseEntity<DepartmentResponseDTO> addDepartment(
            @Valid @RequestBody DepartmentRequestDTO departmentRequestDTO) {

        DepartmentResponseDTO response =
                departmentService.addDepartment(departmentRequestDTO);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Operation(
            summary = "Update Department",
            description = "Update department details using department id."
    )
    @PreAuthorize("hasAnyRole('ADMIN','HR')")
    @PutMapping("/{departmentId}")
    public ResponseEntity<DepartmentResponseDTO> updateDepartment(
            @PathVariable Long departmentId,
            @Valid @RequestBody DepartmentRequestDTO departmentRequestDTO) {

        return ResponseEntity.ok(
                departmentService.updateDepartment(
                        departmentId,
                        departmentRequestDTO));
    }

    @Operation(
            summary = "Delete Department",
            description = "Delete a department if no employees are assigned to it."
    )
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{departmentId}")
    public ResponseEntity<String> deleteDepartment(
            @PathVariable Long departmentId) {

        departmentService.deleteDepartment(departmentId);

        return ResponseEntity.ok("Department deleted successfully.");
    }

    @Operation(
            summary = "Search Department",
            description = "Search department by department name."
    )
    @PreAuthorize("hasAnyRole('ADMIN','HR','MANAGER')")
    @GetMapping("/searchDeptName")
    public ResponseEntity<List<DepartmentResponseDTO>> searchDepartment(
            @RequestParam String name) {

        return ResponseEntity.ok(
                departmentService.searchDepartment(name));
    }

    @Operation(
            summary = "Get Employees By Department",
            description = "Retrieve all employees belonging to a department."
    )
    @PreAuthorize("hasAnyRole('ADMIN','HR','MANAGER')")
    @GetMapping("/{departmentId}/employees")
    public ResponseEntity<List<EmployeeResponseDTO>>
            getEmployeesByDepartment(
                    @PathVariable Long departmentId) {

        return ResponseEntity.ok(
                departmentService.getEmployeesByDepartment(departmentId));
    }

    @Operation(
            summary = "Get Employee Count By Department",
            description = "Retrieve the total number of employees in a department."
    )
    @PreAuthorize("hasAnyRole('ADMIN','HR','MANAGER')")
    @GetMapping("/{departmentId}/employee-count")
    public ResponseEntity<DepartmentEmployeeCountResponseDTO> getEmployeeCountByDepartment(
            @PathVariable Long departmentId) {

        return ResponseEntity.ok(
                departmentService.getEmployeeCountByDepartment(departmentId));
    }
}