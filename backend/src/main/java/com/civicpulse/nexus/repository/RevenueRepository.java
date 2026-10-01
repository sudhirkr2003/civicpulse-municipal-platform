package com.civicpulse.nexus.repository;

import com.civicpulse.nexus.model.RevenueTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface RevenueRepository extends JpaRepository<RevenueTransaction, Long> {
    List<RevenueTransaction> findByCategory(String category);
    List<RevenueTransaction> findByPaymentStatus(String paymentStatus);

    @Query("SELECT SUM(r.amount) FROM RevenueTransaction r WHERE r.paymentStatus = 'COMPLETED'")
    Double getTotalRevenue();

    @Query("SELECT r.category, SUM(r.amount) FROM RevenueTransaction r WHERE r.paymentStatus = 'COMPLETED' GROUP BY r.category")
    List<Object[]> getRevenueByCategory();
}
