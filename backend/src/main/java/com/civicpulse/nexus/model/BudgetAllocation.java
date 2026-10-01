package com.civicpulse.nexus.model;

import jakarta.persistence.*;

@Entity
@Table(name = "budget_allocations")
public class BudgetAllocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "fiscal_year", nullable = false, length = 20)
    private String fiscalYear;

    @Column(name = "allocated_amount", nullable = false)
    private Double allocatedAmount;

    @Column(name = "utilized_amount", nullable = false)
    private Double utilizedAmount;

    @Column(name = "capex_amount", nullable = false)
    private Double capexAmount;

    @Column(name = "opex_amount", nullable = false)
    private Double opexAmount;

    public BudgetAllocation() {}

    public BudgetAllocation(Department department, String fiscalYear, Double allocatedAmount, Double utilizedAmount, Double capexAmount, Double opexAmount) {
        this.department = department;
        this.fiscalYear = fiscalYear;
        this.allocatedAmount = allocatedAmount;
        this.utilizedAmount = utilizedAmount;
        this.capexAmount = capexAmount;
        this.opexAmount = opexAmount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Department getDepartment() { return department; }
    public void setDepartment(Department department) { this.department = department; }

    public String getFiscalYear() { return fiscalYear; }
    public void setFiscalYear(String fiscalYear) { this.fiscalYear = fiscalYear; }

    public Double getAllocatedAmount() { return allocatedAmount; }
    public void setAllocatedAmount(Double allocatedAmount) { this.allocatedAmount = allocatedAmount; }

    public Double getUtilizedAmount() { return utilizedAmount; }
    public void setUtilizedAmount(Double utilizedAmount) { this.utilizedAmount = utilizedAmount; }

    public Double getCapexAmount() { return capexAmount; }
    public void setCapexAmount(Double capexAmount) { this.capexAmount = capexAmount; }

    public Double getOpexAmount() { return opexAmount; }
    public void setOpexAmount(Double opexAmount) { this.opexAmount = opexAmount; }
}
