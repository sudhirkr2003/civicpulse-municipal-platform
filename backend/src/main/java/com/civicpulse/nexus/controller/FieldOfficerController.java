package com.civicpulse.nexus.controller;

import com.civicpulse.nexus.dto.StatusUpdateDTO;
import com.civicpulse.nexus.model.Grievance;
import com.civicpulse.nexus.model.User;
import com.civicpulse.nexus.repository.GrievanceRepository;
import com.civicpulse.nexus.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/v1/field")
public class FieldOfficerController {

    @Autowired
    private GrievanceRepository grievanceRepository;

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/tasks")
    @PreAuthorize("hasAnyRole('FIELD_OFFICER', 'MUNICIPAL_ADMIN')")
    public ResponseEntity<Map<String, Object>> getFieldTasks(@AuthenticationPrincipal User user) {
        String targetWard = (user != null && user.getWard() != null) ? user.getWard() : "Ward 4 - Tech Corridor";
        List<Grievance> tasks = grievanceRepository.findByWard(targetWard);
        if (tasks.isEmpty()) {
            tasks = grievanceRepository.findAll();
        }

        long pendingCount = tasks.stream().filter(t -> !"RESOLVED".equalsIgnoreCase(t.getStatus())).count();
        long resolvedCount = tasks.stream().filter(t -> "RESOLVED".equalsIgnoreCase(t.getStatus())).count();

        Map<String, Object> response = new HashMap<>();
        response.put("ward", targetWard);
        response.put("totalAssigned", tasks.size());
        response.put("pendingTasks", pendingCount);
        response.put("resolvedTasks", resolvedCount);
        response.put("tasks", tasks);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/tasks/{id}/status")
    @PreAuthorize("hasAnyRole('FIELD_OFFICER', 'MUNICIPAL_ADMIN')")
    public ResponseEntity<Grievance> updateTaskStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload,
            @AuthenticationPrincipal User user) {

        Grievance grievance = grievanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        String newStatus = payload.getOrDefault("status", "IN_PROGRESS");
        String notes = payload.get("notes");
        String photoUrl = payload.get("proofPhoto");

        grievance.setStatus(newStatus);
        if (notes != null) {
            grievance.setResolutionNotes(notes);
        }
        if (photoUrl != null) {
            grievance.setProofPhoto(photoUrl);
        }
        if (user != null) {
            grievance.setAssignedOfficerId(user.getId());
        }

        if ("RESOLVED".equalsIgnoreCase(newStatus)) {
            grievance.setResolvedAt(LocalDateTime.now());
            if (grievance.getCreatedAt() != null) {
                long hours = Duration.between(grievance.getCreatedAt(), grievance.getResolvedAt()).toHours();
                grievance.setMttrHours(hours > 0 ? (double) hours : 47.0);
            } else {
                grievance.setMttrHours(47.0);
            }
            if (grievance.getSatisfactionRating() == null) {
                grievance.setSatisfactionRating(5);
            }
        }

        Grievance saved = grievanceRepository.save(grievance);
        analyticsService.evictAllCaches();
        return ResponseEntity.ok(saved);
    }
}
