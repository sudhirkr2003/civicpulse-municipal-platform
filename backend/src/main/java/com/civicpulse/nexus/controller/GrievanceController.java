package com.civicpulse.nexus.controller;

import com.civicpulse.nexus.dto.GrievanceAnalyticsDTO;
import com.civicpulse.nexus.dto.StatusUpdateDTO;
import com.civicpulse.nexus.model.Grievance;
import com.civicpulse.nexus.model.User;
import com.civicpulse.nexus.repository.GrievanceRepository;
import com.civicpulse.nexus.service.GrievanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/grievances")
public class GrievanceController {

    @Autowired
    private GrievanceService grievanceService;

    @Autowired
    private GrievanceRepository grievanceRepository;

    @GetMapping("/analytics")
    public ResponseEntity<GrievanceAnalyticsDTO> getGrievanceAnalytics() {
        return ResponseEntity.ok(grievanceService.getGrievanceAnalytics());
    }

    @GetMapping
    public ResponseEntity<List<Grievance>> getAllGrievances(@AuthenticationPrincipal User user) {
        if (user != null) {
            String role = user.getRole();
            if ("DEPT_HEAD".equalsIgnoreCase(role) && user.getDepartmentId() != null) {
                return ResponseEntity.ok(grievanceRepository.findByDepartmentId(user.getDepartmentId()));
            }
            if ("FIELD_OFFICER".equalsIgnoreCase(role)) {
                if (user.getDepartmentId() != null) {
                    return ResponseEntity.ok(grievanceRepository.findByDepartmentId(user.getDepartmentId()));
                }
                if (user.getWard() != null) {
                    return ResponseEntity.ok(grievanceRepository.findByWard(user.getWard()));
                }
            }
            if ("CITIZEN".equalsIgnoreCase(role)) {
                String name = user.getFullName() != null ? user.getFullName() : user.getUsername();
                List<Grievance> citizenList = grievanceRepository.findAll().stream()
                        .filter(g -> (user.getId() != null && user.getId().equals(g.getCitizenId()))
                                || (g.getCitizenName() != null && name != null && g.getCitizenName().trim().equalsIgnoreCase(name.trim())))
                        .toList();
                return ResponseEntity.ok(citizenList);
            }
        }
        return ResponseEntity.ok(grievanceService.getAllGrievances());
    }

    @PostMapping
    public ResponseEntity<Grievance> createGrievance(
            @RequestBody Grievance grievance,
            @AuthenticationPrincipal User user) {
        if (user != null && "CITIZEN".equalsIgnoreCase(user.getRole())) {
            grievance.setCitizenId(user.getId());
            grievance.setCitizenName(user.getFullName() != null ? user.getFullName() : user.getUsername());
            if (grievance.getWard() == null) {
                grievance.setWard(user.getWard() != null ? user.getWard() : "Ward 1 - Downtown Metro");
            }
        }
        return ResponseEntity.ok(grievanceService.createGrievance(grievance));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Grievance> updateGrievanceStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateDTO statusUpdateDTO) {
        return ResponseEntity.ok(grievanceService.updateStatus(id, statusUpdateDTO));
    }
}
