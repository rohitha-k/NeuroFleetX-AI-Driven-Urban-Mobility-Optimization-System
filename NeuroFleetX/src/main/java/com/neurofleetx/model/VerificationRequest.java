package com.neurofleetx.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "verification_request")
public class VerificationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // POD or DOC
    private String title;
    private String requesterName;
    private String vehicleId;

    @Column(name = "status")
    private String status; // PENDING, APPROVED, REJECTED

    private String imageUrl;

    private LocalDateTime createdAt;

    public VerificationRequest() {
        this.createdAt = LocalDateTime.now();
    }

    public VerificationRequest(String type, String title, String requesterName, String vehicleId, String status,
            String imageUrl) {
        this.type = type;
        this.title = title;
        this.requesterName = requesterName;
        this.vehicleId = vehicleId;
        this.status = status;
        this.imageUrl = imageUrl;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getRequesterName() {
        return requesterName;
    }

    public void setRequesterName(String requesterName) {
        this.requesterName = requesterName;
    }

    public String getVehicleId() {
        return vehicleId;
    }

    public void setVehicleId(String vehicleId) {
        this.vehicleId = vehicleId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
