package com.civicpulse.nexus.dto;

import com.civicpulse.nexus.model.ComplianceAuditLog;
import java.util.List;
import java.util.Map;

public class AuditLogDTO {

    private Long totalLogsCount;
    private Long statutoryComplianceScore;
    private String lastAuditTimestamp;
    private List<Map<String, Object>> activityByType;
    private List<ComplianceAuditLog> logs;

    public AuditLogDTO() {}

    public Long getTotalLogsCount() { return totalLogsCount; }
    public void setTotalLogsCount(Long totalLogsCount) { this.totalLogsCount = totalLogsCount; }

    public Long getStatutoryComplianceScore() { return statutoryComplianceScore; }
    public void setStatutoryComplianceScore(Long statutoryComplianceScore) { this.statutoryComplianceScore = statutoryComplianceScore; }

    public String getLastAuditTimestamp() { return lastAuditTimestamp; }
    public void setLastAuditTimestamp(String lastAuditTimestamp) { this.lastAuditTimestamp = lastAuditTimestamp; }

    public List<Map<String, Object>> getActivityByType() { return activityByType; }
    public void setActivityByType(List<Map<String, Object>> activityByType) { this.activityByType = activityByType; }

    public List<ComplianceAuditLog> getLogs() { return logs; }
    public void setLogs(List<ComplianceAuditLog> logs) { this.logs = logs; }
}
