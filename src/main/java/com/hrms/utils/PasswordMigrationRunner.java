package com.hrms.utils;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.hrms.entities.Employee;
import com.hrms.repositories.EmployeeRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class PasswordMigrationRunner implements CommandLineRunner {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        employeeRepository.findAll().forEach(employee -> {

            // Skip if already BCrypt encoded
            if (!employee.getHashedPwd().startsWith("$2")) {

                employee.setHashedPwd(
                        passwordEncoder.encode(employee.getHashedPwd()));

                employeeRepository.save(employee);

                System.out.println("Updated password for: "
                        + employee.getEmail());
            }
        });

        System.out.println("Password migration completed.");
    }
}