package com.hrms.entities;

import java.time.LocalDate;

import com.hrms.enums.Gender;
import com.hrms.enums.Role;

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
@Table(name = "employee")
@Getter
@Setter
@ToString(exclude = {"department", "manager"})
@NoArgsConstructor
@AllArgsConstructor
@AttributeOverride(name = "id", column = @Column(name= "employee_id", nullable = false))
public class Employee extends BaseEntity {
	
	
	@Column(name = "first_name", length = 30, nullable = false)
	private String firstName;

	@Column(name = "last_name", length = 30, nullable = false)
	private String lastName;

	@Column(length = 50, unique = true, nullable = false)
	private String email;

	@Column(name = "password", length = 100, nullable = false)
	private String hashedPwd;

	@Enumerated(EnumType.STRING)
	private Gender gender;
	
	@Column(length = 15, unique = true)
	private String phoneNo;
	
	@Enumerated(EnumType.STRING)
	private Role role;
	
	private LocalDate joinDate;
	
	@Column(length = 70, nullable = false)
	private String designation;
	
	@ManyToOne
	@JoinColumn(name = "dept_id", nullable = false)
	private Department department;   //FK

	@Column(name = "performance_rating")
	private int performanceRating;
	
	@ManyToOne
	@JoinColumn(name = "manager_id")
	private Employee manager;      // FK
	
	@Column(nullable = false)
	private boolean isActive = true;
}
