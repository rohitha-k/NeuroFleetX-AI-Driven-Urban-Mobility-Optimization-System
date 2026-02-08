package com.neurofleetx.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class DashboardController {

    @GetMapping("/admin/dashboard")
    public ResponseEntity<Map<String, Object>> adminDashboard() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalBookings", 200);
        stats.put("totalFleet", 60);
        stats.put("totalUsers", 120);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/manager/dashboard")
    public ResponseEntity<Map<String, Object>> managerDashboard() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("bookingsManaged", 90);
        stats.put("fleetManaged", 55);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/driver/dashboard")
    public ResponseEntity<Map<String, Object>> driverDashboard() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("tripsAssigned", 22);
        stats.put("vehicleAssigned", 1);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/customer/dashboard")
    public ResponseEntity<Map<String, Object>> customerDashboard() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("bookingsMade", 14);
        return ResponseEntity.ok(stats);
    }
}
