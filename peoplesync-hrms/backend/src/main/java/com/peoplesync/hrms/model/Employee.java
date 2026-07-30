package com.peoplesync.hrms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "employees")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String employeeId;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;
    private String department;
    private String designation;

    @Enumerated(EnumType.STRING)
    private RoleEnum role;

    private String status;
    private LocalDate joinDate;
    private Double salary;
    private String location;
    private String avatar;
}
