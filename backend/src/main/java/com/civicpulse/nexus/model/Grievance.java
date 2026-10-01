package com.civicpulse.nexus.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "grievances")
public class Grievance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ticket_number", nullable = false, unique = true, length = 50)
    private String ticketNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "citizen_id")
    private Long citizenId;

    @Column(name = "assigned_officer_id")
    private Long assignedOfficerId;

    @Column(name = "citizen_name", nullable = false, length = 100)
    private String citizenName;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 30)
    private String status;

    @Column(nullable = false, length = 30)
    private String priority;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "mttr_hours")
    private Double mttrHours;

    @Column(name = "satisfaction_rating")
    private Integer satisfactionRating;

    @Column(length = 50)
    private String ward;

    @Column(name = "proof_photo", columnDefinition = "TEXT")
    private String proofPhoto;

    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;

    public Grievance() {}

    public Grievance(String ticketNumber, Department department, Long citizenId, Long assignedOfficerId, String citizenName, String category, String description, String status, String priority, LocalDateTime createdAt, LocalDateTime resolvedAt, Double mttrHours, Integer satisfactionRating, String ward) {
        this.ticketNumber = ticketNumber;
        this.department = department;
        this.citizenId = citizenId;
        this.assignedOfficerId = assignedOfficerId;
        this.citizenName = citizenName;
        this.category = category;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.createdAt = createdAt;
        this.resolvedAt = resolvedAt;
        this.mttrHours = mttrHours;
        this.satisfactionRating = satisfactionRating;
        this.ward = ward;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTicketNumber() { return ticketNumber; }
    public void setTicketNumber(String ticketNumber) { this.ticketNumber = ticketNumber; }

    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }

    public Long getCitizenId() { return citizenId; }
    public void setCitizenId(Long citizenId) { this.citizenId = citizenId; }

    public Long getAssignedOfficerId() { return assignedOfficerId; }
    public void setAssignedOfficerId(Long assignedOfficerId) { this.assignedOfficerId = assignedOfficerId; }

    public String getCitizenName() { return citizenName; }
    public void setCitizenName(String citizenName) { this.citizenName = citizenName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(LocalDateTime resolvedAt) { this.resolvedAt = resolvedAt; }

    public Double getMttrHours() { return mttrHours; }
    public void setMttrHours(Double mttrHours) { this.mttrHours = mttrHours; }

    public Integer getSatisfactionRating() { return satisfactionRating; }
    public void setSatisfactionRating(Integer satisfactionRating) { this.satisfactionRating = satisfactionRating; }

    public String getWard() { return ward; }
    public void setWard(String ward) { this.ward = ward; }

    public String getProofPhoto() { return proofPhoto; }
    public void setProofPhoto(String proofPhoto) { this.proofPhoto = proofPhoto; }

    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }
}
