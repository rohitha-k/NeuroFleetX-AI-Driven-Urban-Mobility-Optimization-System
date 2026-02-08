package com.neurofleetx.controller;

import com.neurofleetx.model.Booking;
import com.neurofleetx.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend access
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        // In a real app, extract customerId from SecurityContext/Token
        // For now, frontend sends the ID
        return ResponseEntity.ok(bookingService.createBooking(booking));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<Booking>> getPendingBookings() {
        return ResponseEntity.ok(bookingService.getPendingBookings());
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<?> acceptBooking(@PathVariable @NonNull Long id, @RequestBody Map<String, Long> payload) {
        Long driverId = payload.get("driverId");
        return ResponseEntity.ok(bookingService.acceptBooking(id, driverId));
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable @NonNull Long id, @RequestBody Map<String, String> payload) {
        String status = payload.get("status");
        return ResponseEntity.ok(bookingService.updateStatus(id, status));
    }

    @PostMapping("/{id}/location")
    public ResponseEntity<?> updateLocation(@PathVariable @NonNull Long id, @RequestBody Map<String, Double> payload) {
        Double lat = payload.get("lat");
        Double lng = payload.get("lng");
        bookingService.updateDriverLocation(id, lat, lng);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBooking(@PathVariable @NonNull Long id) {
        return ResponseEntity.ok(bookingService.getBooking(id));
    }

    @GetMapping("/history")
    public ResponseEntity<List<Booking>> getHistory(@RequestParam Long userId, @RequestParam String role) {
        return ResponseEntity.ok(bookingService.getUserBookings(userId, role));
    }
}
