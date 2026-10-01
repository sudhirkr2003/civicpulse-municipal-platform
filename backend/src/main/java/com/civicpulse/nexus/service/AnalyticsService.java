package com.civicpulse.nexus.service;

import com.civicpulse.nexus.dto.DashboardSummaryDTO;
import com.civicpulse.nexus.dto.DepartmentPerformanceDTO;
import com.civicpulse.nexus.dto.GovernanceKpiDTO;
import com.civicpulse.nexus.dto.ShareLinkDTO;
import com.civicpulse.nexus.dto.WardPerformanceDTO;
import com.civicpulse.nexus.model.Department;
import com.civicpulse.nexus.repository.DepartmentRepository;
import com.civicpulse.nexus.repository.GrievanceRepository;
import com.civicpulse.nexus.repository.RevenueRepository;
import com.civicpulse.nexus.repository.ServiceRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class AnalyticsService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private GrievanceRepository grievanceRepository;

    @Autowired
    private RevenueRepository revenueRepository;

    @Cacheable(value = "dashboardKpis")
    public DashboardSummaryDTO getDashboardSummary() {
        DashboardSummaryDTO dto = new DashboardSummaryDTO();

        dto.setCitizenSatisfaction(4.7);
        dto.setSatisfactionTrend("Complaints \u2193 23%");
        dto.setServiceSlaPercentage(94.0);
        dto.setTargetSlaPercentage(90.0);
        dto.setRevenueCollectedMillions(12.4);
        dto.setRevenueSurplus("+4.2%");

        GovernanceKpiDTO kpi = new GovernanceKpiDTO();
        kpi.setServicesSummary("24.7K requests | 94% resolved | Avg 2.4 days");
        kpi.setGrievancesSummary("12.4K filed | 94% resolved | MTTR 47 hrs");
        kpi.setRevenueSummary("$12.4M | Property Tax 67% | Licenses 23% | Others 10%");
        kpi.setBudgetSummary("$47M allocated | $41M utilized | 87%");
        kpi.setDepartmentsSummary("Water 94% | Health 91% | Education 89%");
        kpi.setCitizenSatSummary("4.7/5 | Complaints \u2193 23% | Services \u2191 47%");

        kpi.setTotalServiceRequests(24700L);
        kpi.setServicesResolvedPercentage(94.0);
        kpi.setAvgTurnaroundDays(2.4);

        kpi.setTotalGrievances(12400L);
        kpi.setGrievancesResolvedPercentage(94.0);
        kpi.setMttrHours(47.0);

        kpi.setTotalRevenueMillions(12.4);
        Map<String, Double> revPercentages = new LinkedHashMap<>();
        revPercentages.put("Property Tax", 67.0);
        revPercentages.put("Business Licenses", 23.0);
        revPercentages.put("Permits & Others", 10.0);
        kpi.setRevenuePercentages(revPercentages);

        kpi.setTotalAllocatedBudgetMillions(47.0);
        kpi.setTotalUtilizedBudgetMillions(41.0);
        kpi.setBudgetBurnRatePercentage(87.23);

        Map<String, Double> deptScores = new LinkedHashMap<>();
        deptScores.put("Water Management", 94.0);
        deptScores.put("Public Health", 91.0);
        deptScores.put("Civic Education", 89.0);
        deptScores.put("Roads & Infrastructure", 86.0);
        deptScores.put("Revenue & Treasury", 95.0);
        kpi.setDepartmentSlaScores(deptScores);

        kpi.setCitizenSatScore(4.7);
        kpi.setComplaintsTrend("\u2193 23%");
        kpi.setServicesTrend("\u2191 47%");

        dto.setGovernanceKpis(kpi);

        List<DepartmentPerformanceDTO> deptList = new ArrayList<>();
        List<Department> departments = departmentRepository.findAll();
        if (departments.isEmpty()) {
            deptList.add(new DepartmentPerformanceDTO(1L, "Water Management", "WTR", "Dr. Robert Sterling", 94.0, 90.0, 12.5, 11.2, 5420L, 210L));
            deptList.add(new DepartmentPerformanceDTO(2L, "Public Health", "HLT", "Dr. Evelyn Vance", 91.0, 90.0, 10.2, 8.9, 4890L, 185L));
            deptList.add(new DepartmentPerformanceDTO(3L, "Civic Education", "EDU", "Marcus Thorne", 89.0, 90.0, 8.7, 7.8, 3120L, 95L));
            deptList.add(new DepartmentPerformanceDTO(4L, "Roads & Infrastructure", "RDS", "Elena Rostova", 86.0, 85.0, 9.8, 8.4, 6110L, 420L));
            deptList.add(new DepartmentPerformanceDTO(5L, "Revenue & Treasury", "REV", "Claire Beauchamp", 95.0, 92.0, 5.8, 4.7, 5160L, 75L));
        } else {
            for (Department d : departments) {
                deptList.add(new DepartmentPerformanceDTO(
                        d.getId(),
                        d.getName(),
                        d.getCode(),
                        d.getDirectorName(),
                        d.getCurrentSlaPerformance(),
                        d.getTargetSlaPercentage(),
                        d.getBudgetAllocated(),
                        d.getBudgetUtilized(),
                        4500L,
                        180L
                ));
            }
        }
        dto.setDepartmentPerformance(deptList);

        List<WardPerformanceDTO> wards = new ArrayList<>();
        wards.add(new WardPerformanceDTO("Ward 1 - Downtown Metro", 145000L, 6200L, 2100L, 96.2, 4.8, 3850000.0));
        wards.add(new WardPerformanceDTO("Ward 2 - Riverside North", 112000L, 4800L, 1950L, 94.5, 4.7, 2740000.0));
        wards.add(new WardPerformanceDTO("Ward 3 - Highland Park", 98000L, 3900L, 1620L, 93.8, 4.6, 2190000.0));
        wards.add(new WardPerformanceDTO("Ward 4 - Tech Corridor", 134000L, 5300L, 2480L, 95.1, 4.8, 3120000.0));
        wards.add(new WardPerformanceDTO("Ward 5 - Industrial Valley", 82000L, 2600L, 2350L, 91.4, 4.4, 1850000.0));
        wards.add(new WardPerformanceDTO("Ward 6 - Harborview Heights", 76000L, 1900L, 1900L, 93.1, 4.6, 1650000.0));
        dto.setWardPerformance(wards);

        List<Map<String, Object>> trends = new ArrayList<>();
        trends.add(Map.of("month", "Jan", "requests", 3800, "resolved", 3500, "sla", 92.1, "complaints", 2400, "revenue", 1.8));
        trends.add(Map.of("month", "Feb", "requests", 4100, "resolved", 3850, "sla", 93.9, "complaints", 2250, "revenue", 2.1));
        trends.add(Map.of("month", "Mar", "requests", 3950, "resolved", 3720, "sla", 94.2, "complaints", 2100, "revenue", 2.3));
        trends.add(Map.of("month", "Apr", "requests", 4300, "resolved", 4050, "sla", 94.1, "complaints", 1980, "revenue", 1.9));
        trends.add(Map.of("month", "May", "requests", 4250, "resolved", 4010, "sla", 94.4, "complaints", 1870, "revenue", 2.0));
        trends.add(Map.of("month", "Jun", "requests", 4300, "resolved", 4070, "sla", 94.7, "complaints", 1800, "revenue", 2.3));
        dto.setMonthlyTrends(trends);

        List<Map<String, Object>> revList = new ArrayList<>();
        revList.add(Map.of("category", "Property Tax", "amount", 8.31, "percentage", 67.0, "color", "#10B981"));
        revList.add(Map.of("category", "Business Licenses", "amount", 2.85, "percentage", 23.0, "color", "#3B82F6"));
        revList.add(Map.of("category", "Permits & Others", "amount", 1.24, "percentage", 10.0, "color", "#F59E0B"));
        dto.setRevenueBreakdown(revList);

        return dto;
    }

    public Map<String, Object> getDrillDownData() {
        Map<String, Object> drillDown = new HashMap<>();
        drillDown.put("timestamp", LocalDateTime.now());
        drillDown.put("dashboardData", getDashboardSummary());
        drillDown.put("departmentDeepDive", List.of(
                Map.of("department", "Water Management", "totalStaff", 340, "activeSensors", 1420, "leakDetectionsResolved", 98.4, "budgetEfficiency", 89.6),
                Map.of("department", "Public Health", "totalStaff", 420, "activeClinics", 38, "vaccinationCompliance", 96.1, "budgetEfficiency", 87.2),
                Map.of("department", "Civic Education", "totalStaff", 510, "activeSchools", 45, "studentEnrollmentRate", 98.8, "budgetEfficiency", 89.7),
                Map.of("department", "Roads & Infrastructure", "totalStaff", 290, "potholeRepairsAvgHours", 18.2, "roadMaintenanceMiles", 450, "budgetEfficiency", 85.7),
                Map.of("department", "Revenue & Treasury", "totalStaff", 180, "ePaymentAdoptionRate", 91.5, "auditComplianceRate", 99.8, "budgetEfficiency", 81.0)
        ));
        return drillDown;
    }

    public ShareLinkDTO generateShareLink() {
        String token = UUID.randomUUID().toString();
        String url = "http://localhost:5173/dashboard?viewToken=" + token;
        String expiresAt = LocalDateTime.now().plusDays(7).toString();
        return new ShareLinkDTO(url, token, expiresAt, "READ_ONLY_EXECUTIVE");
    }

    @CacheEvict(value = {"dashboardKpis", "departmentPerformance", "grievanceMetrics", "serviceMetrics", "permitMetrics", "budgetMetrics", "citizenMetrics"}, allEntries = true)
    public void evictAllCaches() {
    }
}
