package com.civicpulse.nexus.repository;

import com.civicpulse.nexus.model.Grievance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface GrievanceRepository extends JpaRepository<Grievance, Long> {
    List<Grievance> findByDepartmentId(Long departmentId);
    List<Grievance> findByStatus(String status);
    List<Grievance> findByCategory(String category);
    List<Grievance> findByWard(String ward);
    List<Grievance> findByCitizenId(Long citizenId);
    Optional<Grievance> findByTicketNumberIgnoreCase(String ticketNumber);

    @Query("SELECT COUNT(g) FROM Grievance g")
    Long countTotalGrievances();

    @Query("SELECT COUNT(g) FROM Grievance g WHERE g.status = 'RESOLVED'")
    Long countResolvedGrievances();

    @Query("SELECT AVG(g.mttrHours) FROM Grievance g WHERE g.status = 'RESOLVED'")
    Double getAverageMttrHours();

    @Query("SELECT AVG(g.satisfactionRating) FROM Grievance g WHERE g.satisfactionRating IS NOT NULL")
    Double getAverageSatisfactionRating();
}
