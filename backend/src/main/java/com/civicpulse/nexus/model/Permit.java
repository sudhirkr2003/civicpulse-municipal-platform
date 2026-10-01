package com.civicpulse.nexus.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "permits")
public class Permit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "permit_number", nullable = false, unique = true, length = 50)
    private String permitNumber;

    @Column(name = "applicant_name", nullable = false, length = 100)
    private String applicantName;

    @Column(name = "permit_type", nullable = false, length = 100)
    private String permitType;

    @Column(nullable = false, length = 50)
    private String status;

    @Column(name = "estimated_cost")
    private Double estimatedCost;

    @Column(name = "fee_collected")
    private Double feeCollected;

    @Column(name = "submission_date", nullable = false)
    private LocalDateTime submissionDate;

    @Column(name = "approval_date")
    private LocalDateTime approvalDate;

    @Column(length = 50)
    private String ward;

    public Permit() {}

    public Permit(String permitNumber, String applicantName, String permitType, String status, Double estimatedCost, Double feeCollected, LocalDateTime submissionDate, LocalDateTime approvalDate, String ward) {
        this.permitNumber = permitNumber;
        this.applicantName = applicantName;
        this.permitType = permitType;
        this.status = status;
        this.estimatedCost = estimatedCost;
        this.feeCollected = feeCollected;
        this.submissionDate = submissionDate;
        this.approvalDate = approvalDate;
        this.ward = ward;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPermitNumber() { return permitNumber; }
    public void setPermitNumber(String permitNumber) { this.permitNumber = permitNumber; }

    public String getApplicantName() { return applicantName; }
    public void setApplicantName(String applicantName) { this.applicantName = applicantName; }

    public String getPermitType() { return permitType; }
    public void setPermitType(String permitType) { this.permitType = permitType; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Double getEstimatedCost() { return estimatedCost; }
    public void setEstimatedCost(Double estimatedCost) { this.estimatedCost = estimatedCost; }

    public Double getFeeCollected() { return feeCollected; }
    public void setFeeCollected(Double feeCollected) { this.feeCollected = feeCollected; }

    public LocalDateTime getSubmissionDate() { return submissionDate; }
    public void setSubmissionDate(LocalDateTime submissionDate) { this.submissionDate = submissionDate; }

    public LocalDateTime getApprovalDate() { return approvalDate; }
    public void setApprovalDate(LocalDateTime approvalDate) { this.approvalDate = approvalDate; }

    public String getWard() { return ward; }
    public void setWard(String ward) { this.ward = ward; }
}
