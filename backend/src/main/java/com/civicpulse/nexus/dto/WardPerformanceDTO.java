package com.civicpulse.nexus.dto;

public class WardPerformanceDTO {

    private String wardName;
    private Long population;
    private Long serviceRequests;
    private Long grievancesCount;
    private Double slaPercentage;
    private Double satisfactionRating;
    private Double revenueCollected;

    public WardPerformanceDTO() {}

    public WardPerformanceDTO(String wardName, Long population, Long serviceRequests, Long grievancesCount, Double slaPercentage, Double satisfactionRating, Double revenueCollected) {
        this.wardName = wardName;
        this.population = population;
        this.serviceRequests = serviceRequests;
        this.grievancesCount = grievancesCount;
        this.slaPercentage = slaPercentage;
        this.satisfactionRating = satisfactionRating;
        this.revenueCollected = revenueCollected;
    }

    public String getWardName() { return wardName; }
    public void setWardName(String wardName) { this.wardName = wardName; }

    public Long getPopulation() { return population; }
    public void setPopulation(Long population) { this.population = population; }

    public Long getServiceRequests() { return serviceRequests; }
    public void setServiceRequests(Long serviceRequests) { this.serviceRequests = serviceRequests; }

    public Long getGrievancesCount() { return grievancesCount; }
    public void setGrievancesCount(Long grievancesCount) { this.grievancesCount = grievancesCount; }

    public Double getSlaPercentage() { return slaPercentage; }
    public void setSlaPercentage(Double slaPercentage) { this.slaPercentage = slaPercentage; }

    public Double getSatisfactionRating() { return satisfactionRating; }
    public void setSatisfactionRating(Double satisfactionRating) { this.satisfactionRating = satisfactionRating; }

    public Double getRevenueCollected() { return revenueCollected; }
    public void setRevenueCollected(Double revenueCollected) { this.revenueCollected = revenueCollected; }
}
