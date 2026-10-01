package com.civicpulse.nexus.dto;

public class DepartmentPerformanceDTO {

    private Long departmentId;
    private String departmentName;
    private String departmentCode;
    private String directorName;
    private Double currentSlaPerformance;
    private Double targetSlaPercentage;
    private Double budgetAllocated;
    private Double budgetUtilized;
    private Long activeRequests;
    private Long openGrievances;

    public DepartmentPerformanceDTO() {}

    public DepartmentPerformanceDTO(Long departmentId, String departmentName, String departmentCode, String directorName, Double currentSlaPerformance, Double targetSlaPercentage, Double budgetAllocated, Double budgetUtilized, Long activeRequests, Long openGrievances) {
        this.departmentId = departmentId;
        this.departmentName = departmentName;
        this.departmentCode = departmentCode;
        this.directorName = directorName;
        this.currentSlaPerformance = currentSlaPerformance;
        this.targetSlaPercentage = targetSlaPercentage;
        this.budgetAllocated = budgetAllocated;
        this.budgetUtilized = budgetUtilized;
        this.activeRequests = activeRequests;
        this.openGrievances = openGrievances;
    }

    public Long getDepartmentId() { return departmentId; }
    public void setDepartmentId(Long departmentId) { this.departmentId = departmentId; }

    public String getDepartmentName() { return departmentName; }
    public void setDepartmentName(String departmentName) { this.departmentName = departmentName; }

    public String getDepartmentCode() { return departmentCode; }
    public void setDepartmentCode(String departmentCode) { this.departmentCode = departmentCode; }

    public String getDirectorName() { return directorName; }
    public void setDirectorName(String directorName) { this.directorName = directorName; }

    public Double getCurrentSlaPerformance() { return currentSlaPerformance; }
    public void setCurrentSlaPerformance(Double currentSlaPerformance) { this.currentSlaPerformance = currentSlaPerformance; }

    public Double getTargetSlaPercentage() { return targetSlaPercentage; }
    public void setTargetSlaPercentage(Double targetSlaPercentage) { this.targetSlaPercentage = targetSlaPercentage; }

    public Double getBudgetAllocated() { return budgetAllocated; }
    public void setBudgetAllocated(Double budgetAllocated) { this.budgetAllocated = budgetAllocated; }

    public Double getBudgetUtilized() { return budgetUtilized; }
    public void setBudgetUtilized(Double budgetUtilized) { this.budgetUtilized = budgetUtilized; }

    public Long getActiveRequests() { return activeRequests; }
    public void setActiveRequests(Long activeRequests) { this.activeRequests = activeRequests; }

    public Long getOpenGrievances() { return openGrievances; }
    public void setOpenGrievances(Long openGrievances) { this.openGrievances = openGrievances; }
}
