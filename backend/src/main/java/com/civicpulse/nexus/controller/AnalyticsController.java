package com.civicpulse.nexus.controller;

import com.civicpulse.nexus.dto.DashboardSummaryDTO;
import com.civicpulse.nexus.dto.ShareLinkDTO;
import com.civicpulse.nexus.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardSummaryDTO> getDashboardAnalytics() {
        return ResponseEntity.ok(analyticsService.getDashboardSummary());
    }

    @GetMapping("/drill-down")
    public ResponseEntity<Map<String, Object>> getDrillDownAnalytics() {
        return ResponseEntity.ok(analyticsService.getDrillDownData());
    }

    @GetMapping("/share-link")
    public ResponseEntity<ShareLinkDTO> getShareLink() {
        return ResponseEntity.ok(analyticsService.generateShareLink());
    }

    @PostMapping("/cache/evict")
    public ResponseEntity<Map<String, String>> evictCache() {
        analyticsService.evictAllCaches();
        return ResponseEntity.ok(Map.of("message", "Analytical cache successfully invalidated"));
    }
}
