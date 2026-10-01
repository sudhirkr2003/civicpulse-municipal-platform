package com.civicpulse.nexus.service;

import com.civicpulse.nexus.dto.BudgetUtilizationDTO;
import com.civicpulse.nexus.model.BudgetAllocation;
import com.civicpulse.nexus.repository.BudgetAllocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class BudgetService {

    @Autowired
    private BudgetAllocationRepository budgetAllocationRepository;

    @Autowired
    private AnalyticsService analyticsService;

    @Cacheable(value = "budgetMetrics")
    public BudgetUtilizationDTO getBudgetUtilization() {
        BudgetUtilizationDTO dto = new BudgetUtilizationDTO();

        dto.setTotalAllocatedMillions(47.0);
        dto.setTotalUtilizedMillions(41.0);
        dto.setOverallBurnRatePercentage(87.23);
        dto.setTotalCapexMillions(28.4);
        dto.setTotalOpexMillions(12.6);
        dto.setBudgetSummaryDisplay("$47M allocated | $41M utilized | 87%");

        List<Map<String, Object>> deptBreakdown = new ArrayList<>();
        deptBreakdown.add(Map.of("department", "Water Management", "allocated", 12.5, "utilized", 11.2, "burnRate", 89.6, "capex", 8.2, "opex", 3.0));
        deptBreakdown.add(Map.of("department", "Public Health", "allocated", 10.2, "utilized", 8.9, "burnRate", 87.25, "capex", 5.8, "opex", 3.1));
        deptBreakdown.add(Map.of("department", "Civic Education", "allocated", 8.7, "utilized", 7.8, "burnRate", 89.65, "capex", 4.9, "opex", 2.9));
        deptBreakdown.add(Map.of("department", "Roads & Infrastructure", "allocated", 9.8, "utilized", 8.4, "burnRate", 85.71, "capex", 6.8, "opex", 1.6));
        deptBreakdown.add(Map.of("department", "Revenue & Treasury", "allocated", 5.8, "utilized", 4.7, "burnRate", 81.03, "capex", 2.7, "opex", 2.0));
        dto.setDepartmentBreakdown(deptBreakdown);

        List<Map<String, Object>> splits = new ArrayList<>();
        splits.add(Map.of("type", "Capital Expenditure (CapEx)", "amount", 28.4, "percentage", 69.3, "color", "#3B82F6"));
        splits.add(Map.of("type", "Operational Expenditure (OpEx)", "amount", 12.6, "percentage", 30.7, "color", "#10B981"));
        dto.setCapexVsOpex(splits);

        dto.setAllocations(budgetAllocationRepository.findAll());
        return dto;
    }

    public List<BudgetAllocation> getAllAllocations() {
        return budgetAllocationRepository.findAll();
    }
}
