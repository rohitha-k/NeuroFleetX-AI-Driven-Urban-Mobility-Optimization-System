package com.neurofleetx.repository;

import com.neurofleetx.model.VehicleHealthLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleHealthLogRepository extends JpaRepository<VehicleHealthLog, Long> {
    List<VehicleHealthLog> findByVehicleIdOrderByTimestampDesc(Long vehicleId);

    // Limit results for efficiency usually, but for now standard fetch
    List<VehicleHealthLog> findTop20ByVehicleIdOrderByTimestampDesc(Long vehicleId);
}
