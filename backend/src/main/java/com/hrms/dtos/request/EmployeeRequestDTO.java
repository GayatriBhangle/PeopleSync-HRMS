package com.hrms.dtos.request;

import java.time.LocalDate;

import com.hrms.enums.Gender;
import com.hrms.enums.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EmployeeRequestDTO {

    @NotBlank(message = "First name is required")
    @Size(max = 30)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 30)
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email")
    private String email;

    // Not @NotBlank on purpose: this DTO backs both create and update.
    // EmployeeServiceImpl.addEmployee() requires it (frontend enforces "required" on the create form).
    // EmployeeServiceImpl.updateEmployee() already skips re-hashing when this is blank,
    // so edits don't force re-entering a password.
    private String hashPwd;

    @Pattern(regexp = "^[0-9]{10}$",
            message = "Phone number must contain exactly 10 digits")
    private String phoneNo;

    @NotNull(message = "Gender is required")
    private Gender gender;

    @NotNull(message = "Role is required")
    private Role role;

    @NotNull(message = "Join date is required")
    private LocalDate joinDate;

    @Min(value = 1, message = "Minimum rating is 1")
    @Max(value = 5, message = "Maximum rating is 5")
    private Integer performanceRating;

    @NotNull(message = "Department is required")
    private Long departmentId;
    
    @NotBlank(message = "Designation is required")
    private String designation;

    private Long managerId;
    
    
    
    private boolean isActive = true;
}