package com.peoplesync.hrms.controller;

import com.peoplesync.hrms.dto.ApiResponseDTO;
import com.peoplesync.hrms.dto.JwtResponseDTO;
import com.peoplesync.hrms.dto.LoginRequestDTO;
import com.peoplesync.hrms.security.JwtUtils;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<ApiResponseDTO<JwtResponseDTO>> authenticateUser(@Valid @RequestBody LoginRequestDTO loginRequest) {
        String token = jwtUtils.generateTokenFromEmail(loginRequest.getEmail());

        JwtResponseDTO response = JwtResponseDTO.builder()
                .token(token)
                .email(loginRequest.getEmail())
                .name(loginRequest.getEmail().split("@")[0].toUpperCase())
                .role("ADMIN")
                .avatar("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80")
                .build();

        return ResponseEntity.ok(ApiResponseDTO.ok("Authentication successful", response));
    }
}
