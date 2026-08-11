package com.hrms.services;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.hrms.dtos.request.LoginRequestDTO;
import com.hrms.dtos.response.LoginResponseDTO;
import com.hrms.entities.Employee;
import com.hrms.exceptions.ResourceNotFoundException;
import com.hrms.repositories.EmployeeRepository;
import com.hrms.security.JwtService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final EmployeeRepository employeeRepository;
    private final JwtService jwtService;

    @Override
    public LoginResponseDTO login(LoginRequestDTO loginRequestDTO) {

        // Authenticate email and password
        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                loginRequestDTO.getEmail(),
                                loginRequestDTO.getPassword()));

        // Load employee details
        Employee employee = employeeRepository
                .findByEmail(loginRequestDTO.getEmail())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Employee not found"));

        // Generate JWT
        String token = jwtService.generateToken(
                (org.springframework.security.core.userdetails.UserDetails)
                        authentication.getPrincipal());

        return new LoginResponseDTO(
                token,
                employee.getId(),
                employee.getFirstName() + " " + employee.getLastName(),
                employee.getRole());
    }
    
    
}