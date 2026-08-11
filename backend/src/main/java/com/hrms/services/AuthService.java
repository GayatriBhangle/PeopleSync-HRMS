package com.hrms.services;

import com.hrms.dtos.request.LoginRequestDTO;
import com.hrms.dtos.response.LoginResponseDTO;

public interface AuthService {

    LoginResponseDTO login(LoginRequestDTO loginRequestDTO);

}