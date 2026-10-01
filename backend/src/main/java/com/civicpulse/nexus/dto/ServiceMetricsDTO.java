package com.civicpulse.nexus.dto;

import com.civicpulse.nexus.model.ServiceRequest;
import java.util.List;
import java.util.Map;

public class ServiceMetricsDTO {

    private Long totalRequests;
    private Long resolvedRequests;
    private Long inProgressRequests;
    private Long pendingRequests;
    private Double slaCompliancePercentage;
    private Double averageTurnaroundDays;
    private String totalRequestsDisplay;
    private String slaMetDisplay;
    private String turnaroundDisplay;
    private List<Map<String, Object>> volumeByDepartment;
    private List<Map<String, Object>> turnaroundByType;
    private List<ServiceRequest> serviceRequests;

    public ServiceMetricsDTO() {}

    public Long getTotalRequests() { return totalRequests; }
    public void setTotalRequests(Long totalRequests) { this.totalRequests = totalRequests; }

    public Long getResolvedRequests() { return resolvedRequests; }
    public void setResolvedRequests(Long resolvedRequests) { this.resolvedRequests = resolvedRequests; }

    public Long getInProgressRequests() { return inProgressRequests; }
    public void setInProgressRequests(Long inProgressRequests) { this.inProgressRequests = inProgressRequests; }

    public Long getPendingRequests() { return pendingRequests; }
    public void setPendingRequests(Long pendingRequests) { this.pendingRequests = pendingRequests; }

    public Double getSlaCompliancePercentage() { return slaCompliancePercentage; }
    public void setSlaCompliancePercentage(Double slaCompliancePercentage) { this.slaCompliancePercentage = slaCompliancePercentage; }

    public Double getAverageTurnaroundDays() { return averageTurnaroundDays; }
    public void setAverageTurnaroundDays(Double averageTurnaroundDays) { this.averageTurnaroundDays = averageTurnaroundDays; }

    public String getTotalRequestsDisplay() { return totalRequestsDisplay; }
    public void setTotalRequestsDisplay(String totalRequestsDisplay) { this.totalRequestsDisplay = totalRequestsDisplay; }

    public String getSlaMetDisplay() { return slaMetDisplay; }
    public void setSlaMetDisplay(String slaMetDisplay) { this.slaMetDisplay = slaMetDisplay; }

    public String getTurnaroundDisplay() { return turnaroundDisplay; }
    public void setTurnaroundDisplay(String turnaroundDisplay) { this.turnaroundDisplay = turnaroundDisplay; }

    public List<Map<String, Object>> getVolumeByDepartment() { return volumeByDepartment; }
    public void setVolumeByDepartment(List<Map<String, Object>> volumeByDepartment) { this.volumeByDepartment = volumeByDepartment; }

    public List<Map<String, Object>> getTurnaroundByType() { return turnaroundByType; }
    public void setTurnaroundByType(List<Map<String, Object>> turnaroundByType) { this.turnaroundByType = turnaroundByType; }

    public List<ServiceRequest> getServiceRequests() { return serviceRequests; }
    public void setServiceRequests(List<ServiceRequest> serviceRequests) { this.serviceRequests = serviceRequests; }
}
