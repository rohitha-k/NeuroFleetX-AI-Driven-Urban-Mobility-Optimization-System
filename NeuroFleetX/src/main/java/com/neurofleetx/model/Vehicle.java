package com.neurofleetx.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String licensePlate;
    private String type; // "SEDAN", "SUV", "TRUCK", "EV"

    @Enumerated(EnumType.STRING)
    private VehicleStatus status;

    private Double latitude;
    private Double longitude;
    private Integer speed;
    private Integer battery;
    private Integer fuel;
    private Double mileage;

    // Health Metrics
    private Double engineHealth; // 0-100%
    private Double tirePressure; // PSI
    private Double oilLevel; // 0-100%

    private LocalDate nextServiceDate;
    private LocalDate lastMaintenanceDate;
    private String location;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private User driver;

    private Instant lastUpdated;

    public enum VehicleStatus {
        AVAILABLE, IN_USE, MAINTENANCE, CRITICAL
    }
}