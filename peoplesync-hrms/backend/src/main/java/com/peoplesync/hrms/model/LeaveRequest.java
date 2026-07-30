package com.peoplesync.hrms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "leave_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaveRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String employeeId;
    private String employeeName;
    private String department;
    private String leaveType;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer days;

    @Column(length = 1000)
    private String reason;

    private String status; // PENDING, APPROVED, REJECTED
    private LocalDate appliedOn;

    @Column(length = 1000)
    private String managerNotes;
}
