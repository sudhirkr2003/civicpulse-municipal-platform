package com.civicpulse.nexus.dto;

import com.civicpulse.nexus.model.RevenueTransaction;
import java.util.List;
import java.util.Map;

public class RevenueTrackingDTO {

    private Double totalRevenueMillions;
    private Double propertyTaxMillions;
    private Double tradeLicensesMillions;
    private Double permitsAndFeesMillions;
    private String surplusPercentage;
    private Double reconciliationRatePercentage;
    private List<Map<String, Object>> categoryBreakdown;
    private List<Map<String, Object>> monthlyRevenueTrends;
    private List<RevenueTransaction> recentTransactions;

    public RevenueTrackingDTO() {}

    public Double getTotalRevenueMillions() { return totalRevenueMillions; }
    public void setTotalRevenueMillions(Double totalRevenueMillions) { this.totalRevenueMillions = totalRevenueMillions; }

    public Double getPropertyTaxMillions() { return propertyTaxMillions; }
    public void setPropertyTaxMillions(Double propertyTaxMillions) { this.propertyTaxMillions = propertyTaxMillions; }

    public Double getTradeLicensesMillions() { return tradeLicensesMillions; }
    public void setTradeLicensesMillions(Double tradeLicensesMillions) { this.tradeLicensesMillions = tradeLicensesMillions; }

    public Double getPermitsAndFeesMillions() { return permitsAndFeesMillions; }
    public void setPermitsAndFeesMillions(Double permitsAndFeesMillions) { this.permitsAndFeesMillions = permitsAndFeesMillions; }

    public String getSurplusPercentage() { return surplusPercentage; }
    public void setSurplusPercentage(String surplusPercentage) { this.surplusPercentage = surplusPercentage; }

    public Double getReconciliationRatePercentage() { return reconciliationRatePercentage; }
    public void setReconciliationRatePercentage(Double reconciliationRatePercentage) { this.reconciliationRatePercentage = reconciliationRatePercentage; }

    public List<Map<String, Object>> getCategoryBreakdown() { return categoryBreakdown; }
    public void setCategoryBreakdown(List<Map<String, Object>> categoryBreakdown) { this.categoryBreakdown = categoryBreakdown; }

    public List<Map<String, Object>> getMonthlyRevenueTrends() { return monthlyRevenueTrends; }
    public void setMonthlyRevenueTrends(List<Map<String, Object>> monthlyRevenueTrends) { this.monthlyRevenueTrends = monthlyRevenueTrends; }

    public List<RevenueTransaction> getRecentTransactions() { return recentTransactions; }
    public void setRecentTransactions(List<RevenueTransaction> recentTransactions) { this.recentTransactions = recentTransactions; }
}
