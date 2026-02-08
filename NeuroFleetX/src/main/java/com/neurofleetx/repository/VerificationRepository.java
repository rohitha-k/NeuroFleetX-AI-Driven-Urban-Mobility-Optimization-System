package com.neurofleetx.repository;

import com.neurofleetx.model.VerificationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VerificationRepository extends JpaRepository<VerificationRequest, Long> {
    List<VerificationRequest> findByStatus(String status);
}
