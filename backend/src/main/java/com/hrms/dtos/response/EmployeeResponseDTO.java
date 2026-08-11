package com.hrms.dtos.response;

import java.time.LocalDate;

import com.hrms.enums.Gender;
import com.hrms.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeResponseDTO {

    private Long id;

    private String firstName;

    private String lastName;

    private String email;

    private Gender gender;
    
    private String designation;

    private String phoneNo;

    private Role role;

    private LocalDate joinDate;

    private Integer performanceRating;
    
    private Long departmentId;
    private String departmentName;

    private Long managerId;
    private String managerName;
    
    private boolean isActive;
}
