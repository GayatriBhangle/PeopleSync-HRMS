package com.peoplesync.hrms.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "departments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String code;
    private String headName;
    private Integer employeeCount;
    private String budget;
    private String location;

    @Column(length = 1000)
    private String description;
}
