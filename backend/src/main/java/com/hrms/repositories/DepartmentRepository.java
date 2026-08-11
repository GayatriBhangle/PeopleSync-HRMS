package com.hrms.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hrms.entities.Department;

public interface DepartmentRepository extends JpaRepository<Department, Long> {


    boolean existsByDepartmentName(String departmentName);
    
    List<Department> findByDepartmentNameContainingIgnoreCase(String departmentName);
    
}