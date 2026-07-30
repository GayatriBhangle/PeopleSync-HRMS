package com.peoplesync.hrms.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "attendance")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String employeeId;
    private String employeeName;
    private String department;
    private LocalDate date;
    private String checkIn;
    private String checkOut;
    private String status; // PRESENT, LATE, ABSENT, ON_LEAVE
    private String workHours;
}
