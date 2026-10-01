package com.civicpulse.nexus.dto;

import com.civicpulse.nexus.model.BudgetAllocation;
import java.util.List;
import java.util.Map;

public class BudgetUtilizationDTO {

    private Double totalAllocatedMillions;
    private Double totalUtilizedMillions;
    private Double overallBurnRatePercentage;
    private Double totalCapexMillions;
    private Double totalOpexMillions;
    private String budgetSummaryDisplay;
    private List<Map<String, Object>> departmentBreakdown;
    private List<Map<String, Object>> capexVsOpex;
    private List<BudgetAllocation> allocations;

    public BudgetUtilizationDTO() {}

    public Double getTotalAllocatedMillions() { return totalAllocatedMillions; }
    public void setTotalAllocatedMillions(Double totalAllocatedMillions) { this.totalAllocatedMillions = totalAllocatedMillions; }

    public Double getTotalUtilizedMillions() { return totalUtilizedMillions; }
    public void setTotalUtilizedMillions(Double totalUtilizedMillions) { this.totalUtilizedMillions = totalUtilizedMillions; }

    public Double getOverallBurnRatePercentage() { return overallBurnRatePercentage; }
    public void setOverallBurnRatePercentage(Double overallBurnRatePercentage) { this.overallBurnRatePercentage = overallBurnRatePercentage; }

    public Double getTotalCapexMillions() { return totalCapexMillions; }
    public void setTotalCapexMillions(Double totalCapexMillions) { this.totalCapexMillions = totalCapexMillions; }

    public Double getTotalOpexMillions() { return totalOpexMillions; }
    public void setTotalOpexMillions(Double totalOpexMillions) { this.totalOpexMillions = totalOpexMillions; }

    public String getBudgetSummaryDisplay() { return budgetSummaryDisplay; }
    public void setBudgetSummaryDisplay(String budgetSummaryDisplay) { this.budgetSummaryDisplay = budgetSummaryDisplay; }

    public List<Map<String, Object>> getDepartmentBreakdown() { return departmentBreakdown; }
    public void setDepartmentBreakdown(List<Map<String, Object>> departmentBreakdown) { this.departmentBreakdown = departmentBreakdown; }

    public List<Map<String, Object>> getCapexVsOpex() { return capexVsOpex; }
    public void setCapexVsOpex(List<Map<String, Object>> capexVsOpex) { this.capexVsOpex = capexVsOpex; }

    public List<BudgetAllocation> getAllocations() { return allocations; }
    public void setAllocations(List<BudgetAllocation> allocations) { this.allocations = allocations; }
}
