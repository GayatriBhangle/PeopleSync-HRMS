package com.hrms.repositories;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hrms.entities.Employee;
import com.hrms.enums.Role;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long>, JpaSpecificationExecutor<Employee>{

	Optional<Employee> findByEmail(String email);
	
	Optional<Employee> findById(Long employeeId);

    boolean existsByEmail(String email);

    boolean existsByPhoneNo(String phoneNo);
    
    //for soft delete
    List<Employee> findByIsActiveTrue();
    
    long countByDepartmentId(Long departmentId);
    
	/*
	 * Search functions
	*/
    
    
    //search by firstname and lastname
    @Query("""
    	       SELECT e FROM Employee e
    	       WHERE LOWER(CONCAT(e.firstName,' ',e.lastName))
    	       LIKE LOWER(CONCAT('%', :name, '%'))
    	       """)
    	List<Employee> searchByName(@Param("name") String name);
    
    // search by departmentName
    List<Employee> findByDepartmentDepartmentNameContainingIgnoreCase(String departmentName);
    
    // search by role enum
    List<Employee> findByRole(Role role);
    
    // search by join date
    List<Employee> findByJoinDate(LocalDate joinDate);
    
    // find by manager id
    List<Employee> findByManagerId(Long managerId);
    
    
    
    
}
