package com.hrms.dtos.response;

import com.hrms.enums.Role;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponseDTO {

    private String token;

    private Long employeeId;

    private String employeeName;

    private Role role;

}