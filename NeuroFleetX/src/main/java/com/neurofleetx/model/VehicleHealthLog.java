package com.neurofleetx.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;

@Entity
@Table(name = "vehicle_health_logs")
@Data
@NoArgsConstructor
public class VehicleHealthLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    private Instant timestamp;

    private Double engineHealth;
    private Integer batteryHealth;
    private Double tirePressure;
    private Double oilLevel;

    public VehicleHealthLog(Vehicle vehicle) {
        this.vehicle = vehicle;
        this.timestamp = Instant.now();
        this.engineHealth = vehicle.getEngineHealth();
        this.batteryHealth = vehicle.getBattery();
        this.tirePressure = vehicle.getTirePressure();
        this.oilLevel = vehicle.getOilLevel();
    }
}
