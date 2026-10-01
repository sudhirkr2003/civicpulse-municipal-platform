package com.civicpulse.nexus.dto;

import java.util.List;
import java.util.Map;

public class DashboardSummaryDTO {

    private Double citizenSatisfaction;
    private String satisfactionTrend;
    private Double serviceSlaPercentage;
    private Double targetSlaPercentage;
    private Double revenueCollectedMillions;
    private String revenueSurplus;
    
    private GovernanceKpiDTO governanceKpis;
    private List<DepartmentPerformanceDTO> departmentPerformance;
    private List<WardPerformanceDTO> wardPerformance;
    private List<Map<String, Object>> monthlyTrends;
    private List<Map<String, Object>> revenueBreakdown;

    public DashboardSummaryDTO() {}

    public Double getCitizenSatisfaction() { return citizenSatisfaction; }
    public void setCitizenSatisfaction(Double citizenSatisfaction) { this.citizenSatisfaction = citizenSatisfaction; }

    public String getSatisfactionTrend() { return satisfactionTrend; }
    public void setSatisfactionTrend(String satisfactionTrend) { this.satisfactionTrend = satisfactionTrend; }

    public Double getServiceSlaPercentage() { return serviceSlaPercentage; }
    public void setServiceSlaPercentage(Double serviceSlaPercentage) { this.serviceSlaPercentage = serviceSlaPercentage; }

    public Double getTargetSlaPercentage() { return targetSlaPercentage; }
    public void setTargetSlaPercentage(Double targetSlaPercentage) { this.targetSlaPercentage = targetSlaPercentage; }

    public Double getRevenueCollectedMillions() { return revenueCollectedMillions; }
    public void setRevenueCollectedMillions(Double revenueCollectedMillions) { this.revenueCollectedMillions = revenueCollectedMillions; }

    public String getRevenueSurplus() { return revenueSurplus; }
    public void setRevenueSurplus(String revenueSurplus) { this.revenueSurplus = revenueSurplus; }

    public GovernanceKpiDTO getGovernanceKpis() { return governanceKpis; }
    public void setGovernanceKpis(GovernanceKpiDTO governanceKpis) { this.governanceKpis = governanceKpis; }

    public List<DepartmentPerformanceDTO> getDepartmentPerformance() { return departmentPerformance; }
    public void setDepartmentPerformance(List<DepartmentPerformanceDTO> departmentPerformance) { this.departmentPerformance = departmentPerformance; }

    public List<WardPerformanceDTO> getWardPerformance() { return wardPerformance; }
    public void setWardPerformance(List<WardPerformanceDTO> wardPerformance) { this.wardPerformance = wardPerformance; }

    public List<Map<String, Object>> getMonthlyTrends() { return monthlyTrends; }
    public void setMonthlyTrends(List<Map<String, Object>> monthlyTrends) { this.monthlyTrends = monthlyTrends; }

    public List<Map<String, Object>> getRevenueBreakdown() { return revenueBreakdown; }
    public void setRevenueBreakdown(List<Map<String, Object>> revenueBreakdown) { this.revenueBreakdown = revenueBreakdown; }
}
