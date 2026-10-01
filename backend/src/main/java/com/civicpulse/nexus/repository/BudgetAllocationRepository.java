package com.civicpulse.nexus.repository;

import com.civicpulse.nexus.model.BudgetAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BudgetAllocationRepository extends JpaRepository<BudgetAllocation, Long> {
    List<BudgetAllocation> findByFiscalYear(String fiscalYear);
    List<BudgetAllocation> findByDepartmentId(Long departmentId);

    @Query("SELECT SUM(b.allocatedAmount) FROM BudgetAllocation b")
    Double getTotalAllocatedBudget();

    @Query("SELECT SUM(b.utilizedAmount) FROM BudgetAllocation b")
    Double getTotalUtilizedBudget();

    @Query("SELECT SUM(b.capexAmount) FROM BudgetAllocation b")
    Double getTotalCapex();

    @Query("SELECT SUM(b.opexAmount) FROM BudgetAllocation b")
    Double getTotalOpex();
}
