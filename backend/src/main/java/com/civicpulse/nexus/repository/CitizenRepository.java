package com.civicpulse.nexus.repository;

import com.civicpulse.nexus.model.Citizen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CitizenRepository extends JpaRepository<Citizen, Long> {
    Optional<Citizen> findByNationalId(String nationalId);
    List<Citizen> findByWard(String ward);

    @Query("SELECT COUNT(c) FROM Citizen c")
    Long countTotalCitizens();

    @Query("SELECT AVG(c.satisfactionScore) FROM Citizen c")
    Double getAverageSatisfactionScore();

    @Query("SELECT c.ward, COUNT(c), AVG(c.satisfactionScore) FROM Citizen c GROUP BY c.ward")
    List<Object[]> getCitizenMetricsByWard();
}
