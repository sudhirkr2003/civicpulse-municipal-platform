package com.civicpulse.nexus.controller;

import com.civicpulse.nexus.dto.RevenueTrackingDTO;
import com.civicpulse.nexus.model.RevenueTransaction;
import com.civicpulse.nexus.service.RevenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/revenue")
public class RevenueController {

    @Autowired
    private RevenueService revenueService;

    @GetMapping("/tracking")
    public ResponseEntity<RevenueTrackingDTO> getRevenueTracking() {
        return ResponseEntity.ok(revenueService.getRevenueTracking());
    }

    @GetMapping("/transactions")
    public ResponseEntity<List<RevenueTransaction>> getAllTransactions() {
        return ResponseEntity.ok(revenueService.getAllTransactions());
    }
}
