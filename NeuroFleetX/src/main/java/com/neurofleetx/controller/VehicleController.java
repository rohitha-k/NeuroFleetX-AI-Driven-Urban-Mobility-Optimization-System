package com.neurofleetx.controller;

import com.neurofleetx.model.Vehicle;
import com.neurofleetx.service.VehicleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "http://localhost:3000")
public class VehicleController {
    
    private final VehicleService vehicleService;
    
    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }
    
    @GetMapping
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.getVehicleById(id));
    }
    
    @PostMapping
    public ResponseEntity<Vehicle> createVehicle(@RequestBody Vehicle vehicle) {
        return ResponseEntity.status(201).body(vehicleService.createVehicle(vehicle));
    }
}