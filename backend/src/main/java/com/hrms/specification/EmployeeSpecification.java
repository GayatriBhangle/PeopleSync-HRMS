package com.hrms.specification;

import java.time.LocalDate;

import org.springframework.data.jpa.domain.Specification;

import com.hrms.entities.Employee;
import com.hrms.enums.Role;

public class EmployeeSpecification {

    public static Specification<Employee> filterEmployees(String name, String department, Role role, Long managerId, LocalDate joinDate) {
        return (root, query, cb) -> {
            var predicate = cb.conjunction();
            if (name != null && !name.isBlank()) {
                predicate = cb.and(
                        predicate,
                        cb.like(cb.lower(cb.concat(cb.concat(root.get("firstName"), " "),root.get("lastName"))
                        		),"%" + name.toLowerCase() + "%"
                        )
                );

            }

            if (department != null && !department.isBlank()) {
                predicate = cb.and(
                        predicate,
                        cb.equal(root.get("department").get("departmentName"), department));
            }

            if (role != null) {
                predicate = cb.and( predicate, cb.equal(root.get("role"), role));
            }

            if (managerId != null) {
                predicate = cb.and(predicate,cb.equal(root.get("manager").get("id"),managerId));
            }

            if (joinDate != null) {
            	predicate = cb.and(predicate, cb.equal(root.get("joinDate"), joinDate));
            }

            // Only active employees
            predicate = cb.and(
                    predicate,
                    cb.isTrue(root.get("isActive"))
            );

            return predicate;

        };

    }

}