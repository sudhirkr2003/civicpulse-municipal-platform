package com.civicpulse.nexus.repository;

import com.civicpulse.nexus.model.Permit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PermitRepository extends JpaRepository<Permit, Long> {
    List<Permit> findByStatus(String status);
    List<Permit> findByPermitType(String permitType);
    List<Permit> findByWard(String ward);

    @Query("SELECT COUNT(p) FROM Permit p")
    Long countTotalPermits();

    @Query("SELECT COUNT(p) FROM Permit p WHERE p.status = 'APPROVED'")
    Long countApprovedPermits();

    @Query("SELECT COUNT(p) FROM Permit p WHERE p.status = 'UNDER_REVIEW' OR p.status = 'SUBMITTED' OR p.status = 'INSPECTION_SCHEDULED'")
    Long countPendingPermits();

    @Query("SELECT SUM(p.feeCollected) FROM Permit p")
    Double getTotalFeesCollected();
}
