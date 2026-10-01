package com.civicpulse.nexus.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "service_requests")
public class ServiceRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "request_number", nullable = false, unique = true, length = 50)
    private String requestNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "citizen_id")
    private Long citizenId;

    @Column(name = "citizen_name", nullable = false, length = 100)
    private String citizenName;

    @Column(name = "service_type", nullable = false, length = 100)
    private String serviceType;

    @Column(nullable = false, length = 30)
    private String status;

    @Column(name = "submission_date", nullable = false)
    private LocalDateTime submissionDate;

    @Column(name = "resolved_date")
    private LocalDateTime resolvedDate;

    @Column(name = "sla_met")
    private Boolean slaMet = true;

    @Column(name = "turnaround_days")
    private Double turnaroundDays;

    @Column(length = 50)
    private String ward;

    public ServiceRequest() {}

    public ServiceRequest(String requestNumber, Department department, Long citizenId, String citizenName, String serviceType, String status, LocalDateTime submissionDate, LocalDateTime resolvedDate, Boolean slaMet, Double turnaroundDays, String ward) {
        this.requestNumber = requestNumber;
        this.department = department;
        this.citizenId = citizenId;
        this.citizenName = citizenName;
        this.serviceType = serviceType;
        this.status = status;
        this.submissionDate = submissionDate;
        this.resolvedDate = resolvedDate;
        this.slaMet = slaMet;
        this.turnaroundDays = turnaroundDays;
        this.ward = ward;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRequestNumber() { return requestNumber; }
    public void setRequestNumber(String requestNumber) { this.requestNumber = requestNumber; }

    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }

    public Long getCitizenId() { return citizenId; }
    public void setCitizenId(Long citizenId) { this.citizenId = citizenId; }

    public String getCitizenName() { return citizenName; }
    public void setCitizenName(String citizenName) { this.citizenName = citizenName; }

    public String getServiceType() { return serviceType; }
    public void setServiceType(String serviceType) { this.serviceType = serviceType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getSubmissionDate() { return submissionDate; }
    public void setSubmissionDate(LocalDateTime submissionDate) { this.submissionDate = submissionDate; }

    public LocalDateTime getResolvedDate() { return resolvedDate; }
    public void setResolvedDate(LocalDateTime resolvedDate) { this.resolvedDate = resolvedDate; }

    public Boolean getSlaMet() { return slaMet; }
    public void setSlaMet(Boolean slaMet) { this.slaMet = slaMet; }

    public Double getTurnaroundDays() { return turnaroundDays; }
    public void setTurnaroundDays(Double turnaroundDays) { this.turnaroundDays = turnaroundDays; }

    public String getWard() { return ward; }
    public void setWard(String ward) { this.ward = ward; }
}
