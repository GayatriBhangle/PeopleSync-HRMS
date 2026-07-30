package com.peoplesync.hrms.config;

import com.peoplesync.hrms.model.*;
import com.peoplesync.hrms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private PayrollRepository payrollRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (departmentRepository.count() == 0) {
            // Seed Departments
            Department eng = departmentRepository.save(Department.builder()
                    .name("Engineering")
                    .code("ENG")
                    .headName("Sophia Chen")
                    .employeeCount(42)
                    .budget("$1,450,000")
                    .location("Austin HQ & Remote")
                    .description("Product engineering, architecture, and cloud infra.")
                    .build());

            Department hr = departmentRepository.save(Department.builder()
                    .name("Human Resources")
                    .code("HR")
                    .headName("Marcus Sterling")
                    .employeeCount(14)
                    .budget("$520,000")
                    .location("New York HQ")
                    .description("Talent, culture, and employee wellness.")
                    .build());

            // Seed Employees & Users
            Employee e1 = employeeRepository.save(Employee.builder()
                    .employeeId("EMP-001")
                    .name("Eleanor Vance")
                    .email("eleanor.vance@peoplesync.io")
                    .phone("+1 (555) 234-5678")
                    .department("Engineering")
                    .designation("Chief Technology Officer")
                    .role(RoleEnum.ADMIN)
                    .status("ACTIVE")
                    .joinDate(LocalDate.of(2020, 1, 15))
                    .salary(195000.0)
                    .location("San Francisco, CA")
                    .avatar("https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80")
                    .build());

            Employee e2 = employeeRepository.save(Employee.builder()
                    .employeeId("EMP-002")
                    .name("Marcus Sterling")
                    .email("marcus.sterling@peoplesync.io")
                    .phone("+1 (555) 345-6789")
                    .department("Human Resources")
                    .designation("Head of Human Resources")
                    .role(RoleEnum.HR)
                    .status("ACTIVE")
                    .joinDate(LocalDate.of(2021, 3, 1))
                    .salary(145000.0)
                    .location("New York, NY")
                    .avatar("https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80")
                    .build());

            // Seed Users for Auth
            userRepository.save(User.builder()
                    .email("eleanor.vance@peoplesync.io")
                    .password(passwordEncoder.encode("Password@123"))
                    .name("Eleanor Vance")
                    .role(RoleEnum.ADMIN)
                    .avatar(e1.getAvatar())
                    .build());

            userRepository.save(User.builder()
                    .email("marcus.sterling@peoplesync.io")
                    .password(passwordEncoder.encode("Password@123"))
                    .name("Marcus Sterling")
                    .role(RoleEnum.HR)
                    .avatar(e2.getAvatar())
                    .build());

            // Seed Attendance
            attendanceRepository.save(Attendance.builder()
                    .employeeId("EMP-001")
                    .employeeName("Eleanor Vance")
                    .department("Engineering")
                    .date(LocalDate.now())
                    .checkIn("08:52 AM")
                    .checkOut("05:45 PM")
                    .status("PRESENT")
                    .workHours("8h 53m")
                    .build());

            // Seed Leave Requests
            leaveRequestRepository.save(LeaveRequest.builder()
                    .employeeId("EMP-004")
                    .employeeName("David Miller")
                    .department("Engineering")
                    .leaveType("Annual Leave")
                    .startDate(LocalDate.of(2026, 8, 4))
                    .endDate(LocalDate.of(2026, 8, 8))
                    .days(5)
                    .reason("Family vacation and downtime.")
                    .status("PENDING")
                    .appliedOn(LocalDate.of(2026, 7, 28))
                    .build());

            // Seed Payroll
            payrollRepository.save(Payroll.builder()
                    .employeeId("EMP-001")
                    .employeeName("Eleanor Vance")
                    .department("Engineering")
                    .designation("Chief Technology Officer")
                    .month("July 2026")
                    .basicSalary(12000.0)
                    .allowances(4250.0)
                    .deductions(1200.0)
                    .tax(1800.0)
                    .netSalary(13250.0)
                    .status("PAID")
                    .paymentDate("2026-07-25")
                    .build());
        }
    }
}
