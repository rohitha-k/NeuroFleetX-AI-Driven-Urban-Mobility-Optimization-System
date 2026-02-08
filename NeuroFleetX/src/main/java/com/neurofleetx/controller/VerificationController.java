package com.neurofleetx.controller;

import com.neurofleetx.model.VerificationRequest;
import com.neurofleetx.service.VerificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/verification")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:5173" })
public class VerificationController {

    private final VerificationService service;

    public VerificationController(VerificationService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<VerificationRequest>> getAllRequests(@RequestParam(required = false) String status) {
        if ("PENDING".equals(status)) {
            return ResponseEntity.ok(service.getPendingRequests());
        }
        return ResponseEntity.ok(service.getAllRequests());
    }

    @PostMapping
    public ResponseEntity<VerificationRequest> createRequest(@RequestBody VerificationRequest request) {
        return ResponseEntity.ok(service.createRequest(request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<VerificationRequest> updateStatus(@PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        return ResponseEntity.ok(service.updateStatus(id, status));
    }
}
