package com.peoplesync.hrms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "payrolls")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payroll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String employeeId;
    private String employeeName;
    private String department;
    private String designation;
    private String month;

    private Double basicSalary;
    private Double allowances;
    private Double deductions;
    private Double tax;
    private Double netSalary;

    private String status; // PAID, PROCESSED, DRAFT
    private String paymentDate;
}
