package com.civicpulse.nexus.model;

import jakarta.persistence.*;

@Entity
@Table(name = "departments")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Column(name = "target_sla_percentage", nullable = false)
    private Double targetSlaPercentage;

    @Column(name = "director_name", length = 100)
    private String directorName;

    @Column(name = "budget_allocated")
    private Double budgetAllocated;

    @Column(name = "budget_utilized")
    private Double budgetUtilized;

    @Column(name = "current_sla_performance")
    private Double currentSlaPerformance;

    public Department() {}

    public Department(String name, String code, Double targetSlaPercentage, String directorName, Double budgetAllocated, Double budgetUtilized, Double currentSlaPerformance) {
        this.name = name;
        this.code = code;
        this.targetSlaPercentage = targetSlaPercentage;
        this.directorName = directorName;
        this.budgetAllocated = budgetAllocated;
        this.budgetUtilized = budgetUtilized;
        this.currentSlaPerformance = currentSlaPerformance;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public Double getTargetSlaPercentage() { return targetSlaPercentage; }
    public void setTargetSlaPercentage(Double targetSlaPercentage) { this.targetSlaPercentage = targetSlaPercentage; }

    public String getDirectorName() { return directorName; }
    public void setDirectorName(String directorName) { this.directorName = directorName; }

    public Double getBudgetAllocated() { return budgetAllocated; }
    public void setBudgetAllocated(Double budgetAllocated) { this.budgetAllocated = budgetAllocated; }

    public Double getBudgetUtilized() { return budgetUtilized; }
    public void setBudgetUtilized(Double budgetUtilized) { this.budgetUtilized = budgetUtilized; }

    public Double getCurrentSlaPerformance() { return currentSlaPerformance; }
    public void setCurrentSlaPerformance(Double currentSlaPerformance) { this.currentSlaPerformance = currentSlaPerformance; }
}
