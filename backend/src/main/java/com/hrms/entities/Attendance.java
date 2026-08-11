package com.hrms.entities;

import java.time.LocalDate;
import java.time.LocalTime;

import com.hrms.enums.AttendanceStatus;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString(exclude = "employee")
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "attendance")
@AttributeOverride(name = "id", column = @Column(name = "attendance_id", nullable = false))
public class Attendance extends BaseEntity {

	@Enumerated(EnumType.STRING)
	@Column(name = "attendance_status", nullable = false)
	private AttendanceStatus attendanceStatus;

	@Column(name = "attendance_date", nullable = false)
	private LocalDate attendanceDate;

	@Column(name = "clocking_in")
	private LocalTime clockingIn;

	@Column(name = "clocking_out")
	private LocalTime clockingOut;

	@ManyToOne
	@JoinColumn(name = "employee_id", nullable = false)
	private Employee employee;

}
