package com.civicpulse.nexus.controller;

import com.civicpulse.nexus.dto.BudgetUtilizationDTO;
import com.civicpulse.nexus.model.BudgetAllocation;
import com.civicpulse.nexus.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/budget")
public class BudgetController {

    @Autowired
    private BudgetService budgetService;

    @GetMapping("/utilization")
    public ResponseEntity<BudgetUtilizationDTO> getBudgetUtilization() {
        return ResponseEntity.ok(budgetService.getBudgetUtilization());
    }

    @GetMapping("/allocations")
    public ResponseEntity<List<BudgetAllocation>> getAllocations() {
        return ResponseEntity.ok(budgetService.getAllAllocations());
    }
}
