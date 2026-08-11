package com.hrms.entities;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "department")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = "employees")
@AttributeOverride(name = "id", column = @Column(name="dept_id", nullable = false))
public class Department extends BaseEntity {
	
	@Column(name = "dept_name", length = 30, nullable = false)
	private String departmentName;
	
	@Column(name = "dept_loc", length = 30)
	private String deptLocation;
	
	// to get all employees of a department
	@OneToMany(mappedBy = "department")
	@JsonIgnore
	private List<Employee> employees;
}
