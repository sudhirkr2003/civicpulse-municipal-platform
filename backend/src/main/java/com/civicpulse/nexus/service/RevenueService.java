package com.civicpulse.nexus.service;

import com.civicpulse.nexus.dto.RevenueTrackingDTO;
import com.civicpulse.nexus.model.RevenueTransaction;
import com.civicpulse.nexus.repository.RevenueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RevenueService {

    @Autowired
    private RevenueRepository revenueRepository;

    @Autowired
    private AnalyticsService analyticsService;

    @Cacheable(value = "dashboardKpiCache", key = "'revenueTracking'")
    public RevenueTrackingDTO getRevenueTracking() {
        RevenueTrackingDTO dto = new RevenueTrackingDTO();

        dto.setTotalRevenueMillions(12.4);
        dto.setPropertyTaxMillions(8.31);
        dto.setTradeLicensesMillions(2.85);
        dto.setPermitsAndFeesMillions(1.24);
        dto.setSurplusPercentage("+4.2%");
        dto.setReconciliationRatePercentage(99.4);

        List<Map<String, Object>> catList = new ArrayList<>();
        catList.add(Map.of("category", "Property Tax", "amount", 8.31, "percentage", 67.0, "target", 8.0, "status", "EXCEEDED", "color", "#10B981"));
        catList.add(Map.of("category", "Trade & Business Licenses", "amount", 2.85, "percentage", 23.0, "target", 2.7, "status", "EXCEEDED", "color", "#3B82F6"));
        catList.add(Map.of("category", "Permits & Municipal Fees", "amount", 1.24, "percentage", 10.0, "target", 1.2, "status", "ON_TRACK", "color", "#F59E0B"));
        dto.setCategoryBreakdown(catList);

        List<Map<String, Object>> trends = new ArrayList<>();
        trends.add(Map.of("month", "Jan", "propertyTax", 1.2, "licenses", 0.4, "fees", 0.2, "total", 1.8));
        trends.add(Map.of("month", "Feb", "propertyTax", 1.4, "licenses", 0.5, "fees", 0.2, "total", 2.1));
        trends.add(Map.of("month", "Mar", "propertyTax", 1.5, "licenses", 0.6, "fees", 0.2, "total", 2.3));
        trends.add(Map.of("month", "Apr", "propertyTax", 1.3, "licenses", 0.4, "fees", 0.2, "total", 1.9));
        trends.add(Map.of("month", "May", "propertyTax", 1.4, "licenses", 0.4, "fees", 0.2, "total", 2.0));
        trends.add(Map.of("month", "Jun", "propertyTax", 1.51, "licenses", 0.55, "fees", 0.24, "total", 2.3));
        dto.setMonthlyRevenueTrends(trends);

        dto.setRecentTransactions(revenueRepository.findAll());
        return dto;
    }

    public List<RevenueTransaction> getAllTransactions() {
        return revenueRepository.findAll();
    }
}
