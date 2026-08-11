package com.hrms.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.hrms.dtos.request.LoginRequestDTO;
import com.hrms.dtos.response.LoginResponseDTO;
import com.hrms.services.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    @Operation(
            summary = "Employee Login",
            description = "Authenticate employee using email and password and return a JWT access token."
    )
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(
            @Valid @RequestBody LoginRequestDTO loginRequestDTO) {

        return ResponseEntity.ok(
                authService.login(loginRequestDTO));
    }

}