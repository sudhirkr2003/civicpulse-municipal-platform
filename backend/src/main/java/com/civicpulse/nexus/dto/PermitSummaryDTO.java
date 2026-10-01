package com.civicpulse.nexus.dto;

import com.civicpulse.nexus.model.Permit;
import java.util.List;
import java.util.Map;

public class PermitSummaryDTO {

    private Long totalPermits;
    private Long approvedPermits;
    private Long pendingPermits;
    private Long underReviewPermits;
    private Long inspectionScheduledPermits;
    private Long rejectedPermits;
    private Double totalFeesCollected;
    private Double totalEstimatedProjectValue;
    private Double approvalRatePercentage;
    private List<Map<String, Object>> permitsByType;
    private List<Map<String, Object>> pipelineStatus;
    private List<Permit> recentPermits;

    public PermitSummaryDTO() {}

    public Long getTotalPermits() { return totalPermits; }
    public void setTotalPermits(Long totalPermits) { this.totalPermits = totalPermits; }

    public Long getApprovedPermits() { return approvedPermits; }
    public void setApprovedPermits(Long approvedPermits) { this.approvedPermits = approvedPermits; }

    public Long getPendingPermits() { return pendingPermits; }
    public void setPendingPermits(Long pendingPermits) { this.pendingPermits = pendingPermits; }

    public Long getUnderReviewPermits() { return underReviewPermits; }
    public void setUnderReviewPermits(Long underReviewPermits) { this.underReviewPermits = underReviewPermits; }

    public Long getInspectionScheduledPermits() { return inspectionScheduledPermits; }
    public void setInspectionScheduledPermits(Long inspectionScheduledPermits) { this.inspectionScheduledPermits = inspectionScheduledPermits; }

    public Long getRejectedPermits() { return rejectedPermits; }
    public void setRejectedPermits(Long rejectedPermits) { this.rejectedPermits = rejectedPermits; }

    public Double getTotalFeesCollected() { return totalFeesCollected; }
    public void setTotalFeesCollected(Double totalFeesCollected) { this.totalFeesCollected = totalFeesCollected; }

    public Double getTotalEstimatedProjectValue() { return totalEstimatedProjectValue; }
    public void setTotalEstimatedProjectValue(Double totalEstimatedProjectValue) { this.totalEstimatedProjectValue = totalEstimatedProjectValue; }

    public Double getApprovalRatePercentage() { return approvalRatePercentage; }
    public void setApprovalRatePercentage(Double approvalRatePercentage) { this.approvalRatePercentage = approvalRatePercentage; }

    public List<Map<String, Object>> getPermitsByType() { return permitsByType; }
    public void setPermitsByType(List<Map<String, Object>> permitsByType) { this.permitsByType = permitsByType; }

    public List<Map<String, Object>> getPipelineStatus() { return pipelineStatus; }
    public void setPipelineStatus(List<Map<String, Object>> pipelineStatus) { this.pipelineStatus = pipelineStatus; }

    public List<Permit> getRecentPermits() { return recentPermits; }
    public void setRecentPermits(List<Permit> recentPermits) { this.recentPermits = recentPermits; }
}
