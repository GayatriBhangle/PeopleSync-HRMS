package com.peoplesync.hrms.service;

import com.peoplesync.hrms.model.Employee;
import com.peoplesync.hrms.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Employee getEmployeeById(Long id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
    }

    public Employee createEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    public Employee updateEmployee(Long id, Employee empDetails) {
        Employee emp = getEmployeeById(id);
        emp.setName(empDetails.getName());
        emp.setEmail(empDetails.getEmail());
        emp.setPhone(empDetails.getPhone());
        emp.setDepartment(empDetails.getDepartment());
        emp.setDesignation(empDetails.getDesignation());
        emp.setRole(empDetails.getRole());
        emp.setSalary(empDetails.getSalary());
        emp.setLocation(empDetails.getLocation());
        return employeeRepository.save(emp);
    }

    public void deleteEmployee(Long id) {
        employeeRepository.deleteById(id);
    }
}
