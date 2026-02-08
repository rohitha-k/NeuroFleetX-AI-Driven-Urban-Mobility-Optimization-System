package com.neurofleetx.repository;

import com.neurofleetx.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByStatus(Booking.BookingStatus status);

    List<Booking> findByDriverIdAndStatus(Long driverId, Booking.BookingStatus status);

    List<Booking> findByCustomerId(Long customerId);

    List<Booking> findByDriverId(Long driverId);
}
