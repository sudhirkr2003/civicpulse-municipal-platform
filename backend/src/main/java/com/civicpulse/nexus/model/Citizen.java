package com.civicpulse.nexus.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "citizens")
public class Citizen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "national_id", nullable = false, unique = true, length = 50)
    private String nationalId;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(length = 30)
    private String phone;

    @Column(length = 50)
    private String ward;

    @Column(name = "satisfaction_score")
    private Double satisfactionScore;

    @Column(name = "total_requests")
    private Integer totalRequests = 0;

    @Column(name = "registered_date")
    private LocalDateTime registeredDate = LocalDateTime.now();

    public Citizen() {}

    public Citizen(String nationalId, String fullName, String email, String phone, String ward, Double satisfactionScore, Integer totalRequests) {
        this.nationalId = nationalId;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.ward = ward;
        this.satisfactionScore = satisfactionScore;
        this.totalRequests = totalRequests;
        this.registeredDate = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNationalId() { return nationalId; }
    public void setNationalId(String nationalId) { this.nationalId = nationalId; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getWard() { return ward; }
    public void setWard(String ward) { this.ward = ward; }

    public Double getSatisfactionScore() { return satisfactionScore; }
    public void setSatisfactionScore(Double satisfactionScore) { this.satisfactionScore = satisfactionScore; }

    public Integer getTotalRequests() { return totalRequests; }
    public void setTotalRequests(Integer totalRequests) { this.totalRequests = totalRequests; }

    public LocalDateTime getRegisteredDate() { return registeredDate; }
    public void setRegisteredDate(LocalDateTime registeredDate) { this.registeredDate = registeredDate; }
}
