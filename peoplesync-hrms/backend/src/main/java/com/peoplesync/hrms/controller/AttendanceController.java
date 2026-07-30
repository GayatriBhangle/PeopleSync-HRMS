package com.peoplesync.hrms.controller;

import com.peoplesync.hrms.model.Attendance;
import com.peoplesync.hrms.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @GetMapping("/today")
    public ResponseEntity<List<Attendance>> getTodayAttendance() {
        return ResponseEntity.ok(attendanceService.getTodayAttendance());
    }

    @PostMapping("/check-in")
    public ResponseEntity<Attendance> checkIn(@RequestBody Map<String, String> payload) {
        String empId = payload.getOrDefault("employeeId", "EMP-004");
        String name = payload.getOrDefault("name", "David Miller");
        String dept = payload.getOrDefault("department", "Engineering");
        return ResponseEntity.ok(attendanceService.checkIn(empId, name, dept));
    }

    @PostMapping("/check-out")
    public ResponseEntity<Attendance> checkOut(@RequestBody Map<String, String> payload) {
        String empId = payload.getOrDefault("employeeId", "EMP-004");
        return ResponseEntity.ok(attendanceService.checkOut(empId));
    }
}
