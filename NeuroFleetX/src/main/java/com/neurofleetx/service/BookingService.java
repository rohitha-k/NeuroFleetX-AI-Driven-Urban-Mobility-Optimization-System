package com.neurofleetx.service;

import com.neurofleetx.model.Booking;
import com.neurofleetx.repository.BookingRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.lang.NonNull;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public BookingService(BookingRepository bookingRepository, SimpMessagingTemplate messagingTemplate) {
        this.bookingRepository = bookingRepository;
        this.messagingTemplate = messagingTemplate;
    }

    public Booking createBooking(Booking booking) {
        booking.setStatus(Booking.BookingStatus.PENDING);
        // Initially no driver assigned
        Booking savedBooking = bookingRepository.save(booking);

        // Broadcast to all drivers listening on /topic/bookings/available
        messagingTemplate.convertAndSend("/topic/bookings/available", savedBooking);

        return savedBooking;
    }

    public List<Booking> getPendingBookings() {
        return bookingRepository.findByStatus(Booking.BookingStatus.PENDING);
    }

    public Booking acceptBooking(@NonNull Long bookingId, Long driverId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getStatus() != Booking.BookingStatus.PENDING) {
            throw new RuntimeException("Booking already accepted or cancelled");
        }

        booking.setDriverId(driverId);
        booking.setStatus(Booking.BookingStatus.ACCEPTED);
        // Set initial driver location (Mock: Depot) if needed, or wait for update
        Booking savedBooking = bookingRepository.save(booking);
        System.out.println("Sending WebSocket update for booking: " + savedBooking.getId());
        messagingTemplate.convertAndSend("/topic/bookings/" + savedBooking.getId(), savedBooking);
        return savedBooking;
    }

    public Booking updateStatus(@NonNull Long bookingId, String status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(Booking.BookingStatus.valueOf(status));
        Booking savedBooking = bookingRepository.save(booking);
        messagingTemplate.convertAndSend("/topic/bookings/" + savedBooking.getId(), savedBooking);
        return savedBooking;
    }

    public void updateDriverLocation(@NonNull Long bookingId, Double lat, Double lng) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setDriverLat(lat);
        booking.setDriverLng(lng);
        bookingRepository.save(booking);
        messagingTemplate.convertAndSend("/topic/bookings/" + booking.getId(), booking);
    }

    public Booking getBooking(@NonNull Long id) {
        return bookingRepository.findById(id).orElse(null);
    }

    public List<Booking> getUserBookings(Long userId, String role) {
        if ("DRIVER".equalsIgnoreCase(role)) {
            return bookingRepository.findByDriverId(userId);
        } else {
            return bookingRepository.findByCustomerId(userId);
        }
    }
}
