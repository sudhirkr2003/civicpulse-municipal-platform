package com.civicpulse.nexus.dto;

import com.civicpulse.nexus.model.Citizen;
import java.util.List;
import java.util.Map;

public class CitizenAnalyticsDTO {

    private Long totalCitizens;
    private Double averageSatisfactionScore;
    private Long activeVoters;
    private String csatRatingDisplay;
    private String complaintTrendDisplay;
    private String serviceGrowthDisplay;
    private List<Map<String, Object>> ageDemographics;
    private List<Map<String, Object>> satisfactionDistribution;
    private List<Map<String, Object>> wardBreakdown;
    private List<Citizen> recentCitizens;

    public CitizenAnalyticsDTO() {}

    public Long getTotalCitizens() { return totalCitizens; }
    public void setTotalCitizens(Long totalCitizens) { this.totalCitizens = totalCitizens; }

    public Double getAverageSatisfactionScore() { return averageSatisfactionScore; }
    public void setAverageSatisfactionScore(Double averageSatisfactionScore) { this.averageSatisfactionScore = averageSatisfactionScore; }

    public Long getActiveVoters() { return activeVoters; }
    public void setActiveVoters(Long activeVoters) { this.activeVoters = activeVoters; }

    public String getCsatRatingDisplay() { return csatRatingDisplay; }
    public void setCsatRatingDisplay(String csatRatingDisplay) { this.csatRatingDisplay = csatRatingDisplay; }

    public String getComplaintTrendDisplay() { return complaintTrendDisplay; }
    public void setComplaintTrendDisplay(String complaintTrendDisplay) { this.complaintTrendDisplay = complaintTrendDisplay; }

    public String getServiceGrowthDisplay() { return serviceGrowthDisplay; }
    public void setServiceGrowthDisplay(String serviceGrowthDisplay) { this.serviceGrowthDisplay = serviceGrowthDisplay; }

    public List<Map<String, Object>> getAgeDemographics() { return ageDemographics; }
    public void setAgeDemographics(List<Map<String, Object>> ageDemographics) { this.ageDemographics = ageDemographics; }

    public List<Map<String, Object>> getSatisfactionDistribution() { return satisfactionDistribution; }
    public void setSatisfactionDistribution(List<Map<String, Object>> satisfactionDistribution) { this.satisfactionDistribution = satisfactionDistribution; }

    public List<Map<String, Object>> getWardBreakdown() { return wardBreakdown; }
    public void setWardBreakdown(List<Map<String, Object>> wardBreakdown) { this.wardBreakdown = wardBreakdown; }

    public List<Citizen> getRecentCitizens() { return recentCitizens; }
    public void setRecentCitizens(List<Citizen> recentCitizens) { this.recentCitizens = recentCitizens; }
}
