package com.civicpulse.nexus.repository;

import com.civicpulse.nexus.model.ServiceRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {
    List<ServiceRequest> findByDepartmentId(Long departmentId);
    List<ServiceRequest> findByStatus(String status);
    List<ServiceRequest> findByWard(String ward);
    List<ServiceRequest> findByCitizenId(Long citizenId);
    Optional<ServiceRequest> findByRequestNumberIgnoreCase(String requestNumber);
    
    @Query("SELECT COUNT(s) FROM ServiceRequest s")
    Long countTotalRequests();

    @Query("SELECT COUNT(s) FROM ServiceRequest s WHERE s.status = 'RESOLVED'")
    Long countResolvedRequests();

    @Query("SELECT AVG(s.turnaroundDays) FROM ServiceRequest s WHERE s.status = 'RESOLVED'")
    Double getAverageTurnaroundDays();
}
