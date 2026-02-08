package com.neurofleetx.service;

import com.neurofleetx.model.Vehicle;
import com.neurofleetx.model.VehicleHealthLog;
import com.neurofleetx.repository.VehicleHealthLogRepository;
import com.neurofleetx.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MaintenanceService {

    private final VehicleRepository vehicleRepository;
    private final VehicleHealthLogRepository logRepository;
    private final Random random = new Random();

    public MaintenanceService(VehicleRepository vehicleRepository, VehicleHealthLogRepository logRepository) {
        this.vehicleRepository = vehicleRepository;
        this.logRepository = logRepository;
    }

    /**
     * Simulations run to update fleet health parameters randomly.
     * In real life, this would consume IoT data.
     */
    @Transactional
    public void simulateFleetHealth() {
        List<Vehicle> fleet = vehicleRepository.findAll();

        for (Vehicle v : fleet) {
            if (v == null)
                continue;

            // Degrade health based on mileage or random factors
            updateVehicleHealth(v);

            // Check thresholds
            checkThresholds(v);

            // Save current state
            vehicleRepository.save(v);

            // Log history
            logRepository.save(new VehicleHealthLog(v));
        }
    }

    private void updateVehicleHealth(Vehicle v) {
        // Initialize if null
        if (v.getEngineHealth() == null)
            v.setEngineHealth(100.0);
        if (v.getTirePressure() == null)
            v.setTirePressure(32.0); // Standard PSI
        if (v.getOilLevel() == null)
            v.setOilLevel(100.0);
        if (v.getMileage() == null)
            v.setMileage(0.0);

        // Simulate degradation
        double wear = random.nextDouble() * 0.5; // Up to 0.5% wear per cycle
        v.setEngineHealth(Math.max(0, v.getEngineHealth() - wear));

        // Tire pressure fluctuates/decreases
        if (random.nextDouble() > 0.8) {
            v.setTirePressure(Math.max(20, v.getTirePressure() - 0.2));
        }

        // Oil decreases
        v.setOilLevel(Math.max(0, v.getOilLevel() - (wear * 0.1)));

        // Increase mileage slightly for simulation
        v.setMileage(v.getMileage() + random.nextDouble() * 10);
    }

    private void checkThresholds(Vehicle v) {
        boolean critical = false;
        boolean maintenance = false;

        // Engine Health Thresholds
        if (v.getEngineHealth() < 50)
            critical = true;
        else if (v.getEngineHealth() < 80)
            maintenance = true;

        // Tire Pressure
        if (v.getTirePressure() < 28 || v.getTirePressure() > 36)
            maintenance = true;
        if (v.getTirePressure() < 25)
            critical = true;

        // Status Logic
        if (critical) {
            v.setStatus(Vehicle.VehicleStatus.CRITICAL);
            v.setNextServiceDate(LocalDate.now()); // Immediate
        } else if (maintenance) {
            if (v.getStatus() != Vehicle.VehicleStatus.CRITICAL) {
                v.setStatus(Vehicle.VehicleStatus.MAINTENANCE);
                // Predict date: if 80% now, maybe in 2 weeks it hits 75%
                if (v.getNextServiceDate() == null || v.getNextServiceDate().isBefore(LocalDate.now())) {
                    v.setNextServiceDate(LocalDate.now().plusDays(7));
                }
            }
        } else {
            v.setStatus(Vehicle.VehicleStatus.AVAILABLE);
            // Standard schedule
            if (v.getNextServiceDate() == null) {
                v.setNextServiceDate(LocalDate.now().plusMonths(3));
            }
        }
    }

    public Map<String, Object> getDashboardAnalytics() {
        List<Vehicle> vehicles = vehicleRepository.findAll();

        Map<String, Long> statusCounts = vehicles.stream()
                .collect(Collectors.groupingBy(v -> v.getStatus().name(), Collectors.counting()));

        // Alerts: Critical or Maintenance
        List<Map<String, Object>> alerts = vehicles.stream()
                .filter(v -> v.getStatus() == Vehicle.VehicleStatus.CRITICAL
                        || v.getStatus() == Vehicle.VehicleStatus.MAINTENANCE)
                .map(v -> {
                    Map<String, Object> alert = new HashMap<>();
                    alert.put("id", v.getId());
                    alert.put("name", v.getName() + " (" + v.getLicensePlate() + ")");
                    alert.put("status", v.getStatus());
                    alert.put("issue", determinePrimaryIssue(v));
                    alert.put("action", determineAction(v));
                    return alert;
                })
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("statusDistribution", statusCounts);
        response.put("alerts", alerts);
        response.put("totalFleet", vehicles.size());

        return response;
    }

    private String determinePrimaryIssue(Vehicle v) {
        if (v.getEngineHealth() < 50)
            return "Engine Critical";
        if (v.getEngineHealth() < 80)
            return "Engine Wear";
        if (v.getTirePressure() < 28)
            return "Low Tire Pressure";
        return "Routine Maintenance";
    }

    private String determineAction(Vehicle v) {
        if (v.getStatus() == Vehicle.VehicleStatus.CRITICAL)
            return "Immediate Grounding";
        return "Schedule Service";
    }

    public List<VehicleHealthLog> getVehicleHistory(Long vehicleId) {
        return logRepository.findTop20ByVehicleIdOrderByTimestampDesc(vehicleId);
    }
}
