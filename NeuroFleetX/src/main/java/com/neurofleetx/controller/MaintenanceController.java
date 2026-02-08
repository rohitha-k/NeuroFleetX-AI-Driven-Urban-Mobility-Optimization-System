package com.neurofleetx.controller;

import com.neurofleetx.model.VehicleHealthLog;
import com.neurofleetx.service.MaintenanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/maintenance")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" }) // Allow frontend access
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        return ResponseEntity.ok(maintenanceService.getDashboardAnalytics());
    }

    @GetMapping("/history/{vehicleId}")
    public ResponseEntity<List<VehicleHealthLog>> getHistory(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(maintenanceService.getVehicleHistory(vehicleId));
    }

    @PostMapping("/simulate")
    public ResponseEntity<String> runSimulation() {
        maintenanceService.simulateFleetHealth();
        return ResponseEntity.ok("Fleet Health Simulated");
    }
}
