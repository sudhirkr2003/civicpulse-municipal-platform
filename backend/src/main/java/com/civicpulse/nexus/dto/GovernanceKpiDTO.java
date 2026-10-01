package com.civicpulse.nexus.dto;

import java.util.Map;

public class GovernanceKpiDTO {

    private String servicesSummary;
    private String grievancesSummary;
    private String revenueSummary;
    private String budgetSummary;
    private String departmentsSummary;
    private String citizenSatSummary;

    private Long totalServiceRequests;
    private Double servicesResolvedPercentage;
    private Double avgTurnaroundDays;

    private Long totalGrievances;
    private Double grievancesResolvedPercentage;
    private Double mttrHours;

    private Double totalRevenueMillions;
    private Map<String, Double> revenuePercentages;

    private Double totalAllocatedBudgetMillions;
    private Double totalUtilizedBudgetMillions;
    private Double budgetBurnRatePercentage;

    private Map<String, Double> departmentSlaScores;

    private Double citizenSatScore;
    private String complaintsTrend;
    private String servicesTrend;

    public GovernanceKpiDTO() {}

    public String getServicesSummary() { return servicesSummary; }
    public void setServicesSummary(String servicesSummary) { this.servicesSummary = servicesSummary; }

    public String getGrievancesSummary() { return grievancesSummary; }
    public void setGrievancesSummary(String grievancesSummary) { this.grievancesSummary = grievancesSummary; }

    public String getRevenueSummary() { return revenueSummary; }
    public void setRevenueSummary(String revenueSummary) { this.revenueSummary = revenueSummary; }

    public String getBudgetSummary() { return budgetSummary; }
    public void setBudgetSummary(String budgetSummary) { this.budgetSummary = budgetSummary; }

    public String getDepartmentsSummary() { return departmentsSummary; }
    public void setDepartmentsSummary(String departmentsSummary) { this.departmentsSummary = departmentsSummary; }

    public String getCitizenSatSummary() { return citizenSatSummary; }
    public void setCitizenSatSummary(String citizenSatSummary) { this.citizenSatSummary = citizenSatSummary; }

    public Long getTotalServiceRequests() { return totalServiceRequests; }
    public void setTotalServiceRequests(Long totalServiceRequests) { this.totalServiceRequests = totalServiceRequests; }

    public Double getServicesResolvedPercentage() { return servicesResolvedPercentage; }
    public void setServicesResolvedPercentage(Double servicesResolvedPercentage) { this.servicesResolvedPercentage = servicesResolvedPercentage; }

    public Double getAvgTurnaroundDays() { return avgTurnaroundDays; }
    public void setAvgTurnaroundDays(Double avgTurnaroundDays) { this.avgTurnaroundDays = avgTurnaroundDays; }

    public Long getTotalGrievances() { return totalGrievances; }
    public void setTotalGrievances(Long totalGrievances) { this.totalGrievances = totalGrievances; }

    public Double getGrievancesResolvedPercentage() { return grievancesResolvedPercentage; }
    public void setGrievancesResolvedPercentage(Double grievancesResolvedPercentage) { this.grievancesResolvedPercentage = grievancesResolvedPercentage; }

    public Double getMttrHours() { return mttrHours; }
    public void setMttrHours(Double mttrHours) { this.mttrHours = mttrHours; }

    public Double getTotalRevenueMillions() { return totalRevenueMillions; }
    public void setTotalRevenueMillions(Double totalRevenueMillions) { this.totalRevenueMillions = totalRevenueMillions; }

    public Map<String, Double> getRevenuePercentages() { return revenuePercentages; }
    public void setRevenuePercentages(Map<String, Double> revenuePercentages) { this.revenuePercentages = revenuePercentages; }

    public Double getTotalAllocatedBudgetMillions() { return totalAllocatedBudgetMillions; }
    public void setTotalAllocatedBudgetMillions(Double totalAllocatedBudgetMillions) { this.totalAllocatedBudgetMillions = totalAllocatedBudgetMillions; }

    public Double getTotalUtilizedBudgetMillions() { return totalUtilizedBudgetMillions; }
    public void setTotalUtilizedBudgetMillions(Double totalUtilizedBudgetMillions) { this.totalUtilizedBudgetMillions = totalUtilizedBudgetMillions; }

    public Double getBudgetBurnRatePercentage() { return budgetBurnRatePercentage; }
    public void setBudgetBurnRatePercentage(Double budgetBurnRatePercentage) { this.budgetBurnRatePercentage = budgetBurnRatePercentage; }

    public Map<String, Double> getDepartmentSlaScores() { return departmentSlaScores; }
    public void setDepartmentSlaScores(Map<String, Double> departmentSlaScores) { this.departmentSlaScores = departmentSlaScores; }

    public Double getCitizenSatScore() { return citizenSatScore; }
    public void setCitizenSatScore(Double citizenSatScore) { this.citizenSatScore = citizenSatScore; }

    public String getComplaintsTrend() { return complaintsTrend; }
    public void setComplaintsTrend(String complaintsTrend) { this.complaintsTrend = complaintsTrend; }

    public String getServicesTrend() { return servicesTrend; }
    public void setServicesTrend(String servicesTrend) { this.servicesTrend = servicesTrend; }
}
