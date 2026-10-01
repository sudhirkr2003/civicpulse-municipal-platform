package com.civicpulse.nexus.service;

import com.civicpulse.nexus.dto.PermitSummaryDTO;
import com.civicpulse.nexus.dto.StatusUpdateDTO;
import com.civicpulse.nexus.model.Permit;
import com.civicpulse.nexus.repository.PermitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class PermitService {

    @Autowired
    private PermitRepository permitRepository;

    @Autowired
    private AnalyticsService analyticsService;

    @Cacheable(value = "permitMetrics")
    public PermitSummaryDTO getPermitsSummary() {
        PermitSummaryDTO dto = new PermitSummaryDTO();

        dto.setTotalPermits(3840L);
        dto.setApprovedPermits(3340L);
        dto.setPendingPermits(390L);
        dto.setUnderReviewPermits(240L);
        dto.setInspectionScheduledPermits(150L);
        dto.setRejectedPermits(110L);
        dto.setTotalFeesCollected(1240000.0);
        dto.setTotalEstimatedProjectValue(184500000.0);
        dto.setApprovalRatePercentage(87.0);

        List<Map<String, Object>> byType = new ArrayList<>();
        byType.add(Map.of("type", "Commercial Building", "count", 890, "fees", 540000.0, "avgDays", 12.4));
        byType.add(Map.of("type", "Residential Construction", "count", 1450, "fees", 410000.0, "avgDays", 8.2));
        byType.add(Map.of("type", "Signage & Billboard", "count", 620, "fees", 110000.0, "avgDays", 3.1));
        byType.add(Map.of("type", "Street Vendor License", "count", 540, "fees", 95000.0, "avgDays", 2.0));
        byType.add(Map.of("type", "Environmental Clearance", "count", 340, "fees", 85000.0, "avgDays", 14.5));
        dto.setPermitsByType(byType);

        List<Map<String, Object>> pipeline = new ArrayList<>();
        pipeline.add(Map.of("stage", "1. Submitted", "count", 120, "percentage", 3.1));
        pipeline.add(Map.of("stage", "2. Document Verification", "count", 120, "percentage", 3.1));
        pipeline.add(Map.of("stage", "3. Inspection Scheduled", "count", 150, "percentage", 3.9));
        pipeline.add(Map.of("stage", "4. Approved & Issued", "count", 3340, "percentage", 87.0));
        pipeline.add(Map.of("stage", "5. Rejected / Resubmission", "count", 110, "percentage", 2.9));
        dto.setPipelineStatus(pipeline);

        dto.setRecentPermits(permitRepository.findAll());
        return dto;
    }

    public List<Permit> getAllPermits() {
        return permitRepository.findAll();
    }

    @Transactional
    public Permit createPermit(Permit permit) {
        if (permit.getPermitNumber() == null || permit.getPermitNumber().isBlank()) {
            permit.setPermitNumber("PMT-2026-" + (10000 + (int)(Math.random() * 90000)));
        }
        if (permit.getSubmissionDate() == null) {
            permit.setSubmissionDate(LocalDateTime.now());
        }
        if (permit.getStatus() == null) {
            permit.setStatus("UNDER_REVIEW");
        }
        Permit saved = permitRepository.save(permit);
        analyticsService.evictAllCaches();
        return saved;
    }

    @Transactional
    public Permit updateStatus(Long id, StatusUpdateDTO updateDTO) {
        Permit p = permitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Permit not found"));
        p.setStatus(updateDTO.getStatus());
        if ("APPROVED".equalsIgnoreCase(updateDTO.getStatus())) {
            p.setApprovalDate(LocalDateTime.now());
        }
        Permit saved = permitRepository.save(p);
        analyticsService.evictAllCaches();
        return saved;
    }
}
