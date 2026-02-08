package com.neurofleetx.service;

import com.neurofleetx.model.VerificationRequest;
import com.neurofleetx.repository.VerificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VerificationService {

    private final VerificationRepository repository;

    public VerificationService(VerificationRepository repository) {
        this.repository = repository;
    }

    public List<VerificationRequest> getAllRequests() {
        return repository.findAll();
    }

    public List<VerificationRequest> getPendingRequests() {
        return repository.findByStatus("PENDING");
    }

    public VerificationRequest createRequest(VerificationRequest request) {
        request.setStatus("PENDING");
        return repository.save(request);
    }

    public VerificationRequest updateStatus(Long id, String status) {
        if (id == null) {
            throw new IllegalArgumentException("ID cannot be null");
        }
        VerificationRequest request = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        request.setStatus(status);
        return repository.save(request);
    }
}
