package com.neurofleetx.service;

import com.neurofleetx.model.Vehicle;
import com.neurofleetx.repository.VehicleRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final Random random = new Random();

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Vehicle getVehicleById(Long id) {
        java.util.Objects.requireNonNull(id, "ID cannot be null");
        return vehicleRepository.findById(id).orElseThrow();
    }

    public Vehicle createVehicle(Vehicle vehicle) {
        java.util.Objects.requireNonNull(vehicle, "Vehicle cannot be null");
        return vehicleRepository.save(vehicle);
    }

    // Simulate real-time telemetry updates every 30 seconds
    @Scheduled(fixedRate = 30000)
    public void simulateVehicleMovements() {
        List<Vehicle> vehicles = vehicleRepository.findAll();

        for (Vehicle vehicle : vehicles) {
            if (vehicle.getStatus() == Vehicle.VehicleStatus.IN_USE) {
                // Simulate movement in NYC area
                double latDelta = (random.nextDouble() - 0.5) * 0.01;
                double lngDelta = (random.nextDouble() - 0.5) * 0.01;

                vehicle.setLatitude(vehicle.getLatitude() + latDelta);
                vehicle.setLongitude(vehicle.getLongitude() + lngDelta);
                vehicle.setSpeed(20 + random.nextInt(60)); // 20-80 km/h

                // Update battery/fuel
                if ("EV".equals(vehicle.getType())) {
                    vehicle.setBattery(Math.max(5, vehicle.getBattery() - 1));
                } else {
                    vehicle.setFuel(Math.max(5, vehicle.getFuel() - 1));
                }

                // Update status if critical
                if (("EV".equals(vehicle.getType()) && vehicle.getBattery() < 15) ||
                        (!"EV".equals(vehicle.getType()) && vehicle.getFuel() < 15)) {
                    vehicle.setStatus(Vehicle.VehicleStatus.CRITICAL);
                }

                vehicleRepository.save(vehicle);
            }
        }
    }

    // Initialize sample vehicles on startup
    @Scheduled(fixedRate = 86400000) // Run once per day
    public void initializeSampleData() {
        if (vehicleRepository.count() == 0) {
            // Create sample vehicles
            Vehicle v1 = new Vehicle();
            v1.setName("Tesla Model 3");
            v1.setLicensePlate("EV-001");
            v1.setType("EV");
            v1.setStatus(Vehicle.VehicleStatus.AVAILABLE);
            v1.setLatitude(40.7128);
            v1.setLongitude(-74.0060);
            v1.setBattery(95);
            v1.setFuel(0);
            v1.setMileage(12500.0);
            v1.setLocation("Manhattan Depot");
            v1.setNextServiceDate(LocalDate.now().plusMonths(3));
            v1.setSpeed(0);
            vehicleRepository.save(v1);

            Vehicle v2 = new Vehicle();
            v2.setName("Ford Transit");
            v2.setLicensePlate("TRK-202");
            v2.setType("TRUCK");
            v2.setStatus(Vehicle.VehicleStatus.IN_USE);
            v2.setLatitude(40.7580);
            v2.setLongitude(-73.9855);
            v2.setBattery(0);
            v2.setFuel(75);
            v2.setMileage(45000.0);
            v2.setLocation("Midtown NYC");
            v2.setNextServiceDate(LocalDate.now().plusMonths(1));
            v2.setSpeed(45);
            vehicleRepository.save(v2);

            Vehicle v3 = new Vehicle();
            v3.setName("Toyota Camry");
            v3.setLicensePlate("SED-303");
            v3.setType("SEDAN");
            v3.setStatus(Vehicle.VehicleStatus.MAINTENANCE);
            v3.setLatitude(40.7484);
            v3.setLongitude(-73.9857);
            v3.setBattery(0);
            v3.setFuel(45);
            v3.setMileage(78000.0);
            v3.setLocation("Service Center");
            v3.setNextServiceDate(LocalDate.now().plusWeeks(1));
            v3.setSpeed(0);
            vehicleRepository.save(v3);

            Vehicle v4 = new Vehicle();
            v4.setName("Nissan Leaf");
            v4.setLicensePlate("EV-004");
            v4.setType("EV");
            v4.setStatus(Vehicle.VehicleStatus.IN_USE);
            v4.setLatitude(40.7306);
            v4.setLongitude(-73.9352);
            v4.setBattery(65);
            v4.setFuel(0);
            v4.setMileage(28000.0);
            v4.setLocation("Queens");
            v4.setNextServiceDate(LocalDate.now().plusMonths(2));
            v4.setSpeed(35);
            vehicleRepository.save(v4);
        }
    }
}