package com.civicpulse.nexus.dto;

import com.civicpulse.nexus.model.Department;
import java.util.List;
import java.util.Map;

public class DepartmentPerformanceResponseDTO {

    private Double overallCitySla;
    private Double benchmarkTarget;
    private String varianceDisplay;
    private String topPerformer;
    private String mostImproved;
    private List<DepartmentPerformanceDTO> leaderboard;
    private List<Map<String, Object>> comparativeMetrics;
    private List<Department> departments;

    public DepartmentPerformanceResponseDTO() {}

    public Double getOverallCitySla() { return overallCitySla; }
    public void setOverallCitySla(Double overallCitySla) { this.overallCitySla = overallCitySla; }

    public Double getBenchmarkTarget() { return benchmarkTarget; }
    public void setBenchmarkTarget(Double benchmarkTarget) { this.benchmarkTarget = benchmarkTarget; }

    public String getVarianceDisplay() { return varianceDisplay; }
    public void setVarianceDisplay(String varianceDisplay) { this.varianceDisplay = varianceDisplay; }

    public String getTopPerformer() { return topPerformer; }
    public void setTopPerformer(String topPerformer) { this.topPerformer = topPerformer; }

    public String getMostImproved() { return mostImproved; }
    public void setMostImproved(String mostImproved) { this.mostImproved = mostImproved; }

    public List<DepartmentPerformanceDTO> getLeaderboard() { return leaderboard; }
    public void setLeaderboard(List<DepartmentPerformanceDTO> leaderboard) { this.leaderboard = leaderboard; }

    public List<Map<String, Object>> getComparativeMetrics() { return comparativeMetrics; }
    public void setComparativeMetrics(List<Map<String, Object>> comparativeMetrics) { this.comparativeMetrics = comparativeMetrics; }

    public List<Department> getDepartments() { return departments; }
    public void setDepartments(List<Department> departments) { this.departments = departments; }
}
