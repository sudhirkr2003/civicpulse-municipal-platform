package com.civicpulse.nexus.service;

import com.civicpulse.nexus.dto.DepartmentPerformanceDTO;
import com.civicpulse.nexus.dto.DepartmentPerformanceResponseDTO;
import com.civicpulse.nexus.model.Department;
import com.civicpulse.nexus.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private AnalyticsService analyticsService;

    @Cacheable(value = "dashboardKpiCache", key = "'departmentPerformance'")
    public DepartmentPerformanceResponseDTO getDepartmentPerformance() {
        DepartmentPerformanceResponseDTO dto = new DepartmentPerformanceResponseDTO();

        dto.setOverallCitySla(94.0);
        dto.setBenchmarkTarget(90.0);
        dto.setVarianceDisplay("+4.0% Over Statutory Target");
        dto.setTopPerformer("Revenue & Treasury (95%)");
        dto.setMostImproved("Water Management (+4.0%)");

        List<DepartmentPerformanceDTO> leaderboard = new ArrayList<>();
        leaderboard.add(new DepartmentPerformanceDTO(5L, "Revenue & Treasury", "REV", "Claire Beauchamp", 95.0, 92.0, 5.8, 4.7, 5160L, 75L));
        leaderboard.add(new DepartmentPerformanceDTO(1L, "Water Management", "WTR", "Dr. Robert Sterling", 94.0, 90.0, 12.5, 11.2, 5420L, 210L));
        leaderboard.add(new DepartmentPerformanceDTO(2L, "Public Health", "HLT", "Dr. Evelyn Vance", 91.0, 90.0, 10.2, 8.9, 4890L, 185L));
        leaderboard.add(new DepartmentPerformanceDTO(3L, "Civic Education", "EDU", "Marcus Thorne", 89.0, 90.0, 8.7, 7.8, 3120L, 95L));
        leaderboard.add(new DepartmentPerformanceDTO(4L, "Roads & Infrastructure", "RDS", "Elena Rostova", 86.0, 85.0, 9.8, 8.4, 6110L, 420L));
        dto.setLeaderboard(leaderboard);

        List<Map<String, Object>> comp = new ArrayList<>();
        comp.add(Map.of("name", "Revenue", "sla", 95.0, "target", 92.0, "budgetRate", 81.0, "color", "#10B981"));
        comp.add(Map.of("name", "Water", "sla", 94.0, "target", 90.0, "budgetRate", 89.6, "color", "#06B6D4"));
        comp.add(Map.of("name", "Health", "sla", 91.0, "target", 90.0, "budgetRate", 87.3, "color", "#3B82F6"));
        comp.add(Map.of("name", "Education", "sla", 89.0, "target", 90.0, "budgetRate", 89.7, "color", "#F59E0B"));
        comp.add(Map.of("name", "Roads", "sla", 86.0, "target", 85.0, "budgetRate", 85.7, "color", "#8B5CF6"));
        dto.setComparativeMetrics(comp);

        dto.setDepartments(departmentRepository.findAll());
        return dto;
    }

    public DepartmentPerformanceDTO getDepartmentDashboardById(Long id) {
        Department dept = departmentRepository.findById(id).orElse(null);
        String name = dept != null ? dept.getName() : "Water Management";
        String code = dept != null ? dept.getCode() : "WTR";
        String head = dept != null && dept.getDirectorName() != null ? dept.getDirectorName() : "Dr. Robert Sterling";
        Double sla = dept != null && dept.getCurrentSlaPerformance() != null ? dept.getCurrentSlaPerformance() : 94.0;
        Double target = dept != null && dept.getTargetSlaPercentage() != null ? dept.getTargetSlaPercentage() : 90.0;
        Double allocated = dept != null && dept.getBudgetAllocated() != null ? dept.getBudgetAllocated() : 12.5;
        Double utilized = dept != null && dept.getBudgetUtilized() != null ? dept.getBudgetUtilized() : 11.2;
        return new DepartmentPerformanceDTO(id, name, code, head, sla, target, allocated, utilized, 5420L, 210L);
    }
}
