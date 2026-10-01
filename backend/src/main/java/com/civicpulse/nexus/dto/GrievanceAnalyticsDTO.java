package com.civicpulse.nexus.dto;

import com.civicpulse.nexus.model.Grievance;
import java.util.List;
import java.util.Map;

public class GrievanceAnalyticsDTO {

    private Long totalGrievances;
    private Long resolvedGrievances;
    private Long openGrievances;
    private Long escalatedGrievances;
    private Double resolvedPercentage;
    private Double averageMttrHours;
    private Double satisfactionRating;
    private String totalFiledDisplay;
    private String resolvedDisplay;
    private String mttrDisplay;
    private List<Map<String, Object>> categoryHeatmap;
    private List<Map<String, Object>> priorityDistribution;
    private List<Map<String, Object>> wardHeatmap;
    private List<Grievance> recentGrievances;

    public GrievanceAnalyticsDTO() {}

    public Long getTotalGrievances() { return totalGrievances; }
    public void setTotalGrievances(Long totalGrievances) { this.totalGrievances = totalGrievances; }

    public Long getResolvedGrievances() { return resolvedGrievances; }
    public void setResolvedGrievances(Long resolvedGrievances) { this.resolvedGrievances = resolvedGrievances; }

    public Long getOpenGrievances() { return openGrievances; }
    public void setOpenGrievances(Long openGrievances) { this.openGrievances = openGrievances; }

    public Long getEscalatedGrievances() { return escalatedGrievances; }
    public void setEscalatedGrievances(Long escalatedGrievances) { this.escalatedGrievances = escalatedGrievances; }

    public Double getResolvedPercentage() { return resolvedPercentage; }
    public void setResolvedPercentage(Double resolvedPercentage) { this.resolvedPercentage = resolvedPercentage; }

    public Double getAverageMttrHours() { return averageMttrHours; }
    public void setAverageMttrHours(Double averageMttrHours) { this.averageMttrHours = averageMttrHours; }

    public Double getSatisfactionRating() { return satisfactionRating; }
    public void setSatisfactionRating(Double satisfactionRating) { this.satisfactionRating = satisfactionRating; }

    public String getTotalFiledDisplay() { return totalFiledDisplay; }
    public void setTotalFiledDisplay(String totalFiledDisplay) { this.totalFiledDisplay = totalFiledDisplay; }

    public String getResolvedDisplay() { return resolvedDisplay; }
    public void setResolvedDisplay(String resolvedDisplay) { this.resolvedDisplay = resolvedDisplay; }

    public String getMttrDisplay() { return mttrDisplay; }
    public void setMttrDisplay(String mttrDisplay) { this.mttrDisplay = mttrDisplay; }

    public List<Map<String, Object>> getCategoryHeatmap() { return categoryHeatmap; }
    public void setCategoryHeatmap(List<Map<String, Object>> categoryHeatmap) { this.categoryHeatmap = categoryHeatmap; }

    public List<Map<String, Object>> getPriorityDistribution() { return priorityDistribution; }
    public void setPriorityDistribution(List<Map<String, Object>> priorityDistribution) { this.priorityDistribution = priorityDistribution; }

    public List<Map<String, Object>> getWardHeatmap() { return wardHeatmap; }
    public void setWardHeatmap(List<Map<String, Object>> wardHeatmap) { this.wardHeatmap = wardHeatmap; }

    public List<Grievance> getRecentGrievances() { return recentGrievances; }
    public void setRecentGrievances(List<Grievance> recentGrievances) { this.recentGrievances = recentGrievances; }
}
