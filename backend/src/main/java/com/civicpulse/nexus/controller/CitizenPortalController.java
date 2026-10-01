package com.civicpulse.nexus.controller;

import com.civicpulse.nexus.model.Department;
import com.civicpulse.nexus.model.Grievance;
import com.civicpulse.nexus.model.ServiceRequest;
import com.civicpulse.nexus.model.User;
import com.civicpulse.nexus.repository.DepartmentRepository;
import com.civicpulse.nexus.repository.GrievanceRepository;
import com.civicpulse.nexus.repository.ServiceRequestRepository;
import com.civicpulse.nexus.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/v1/citizen")
public class CitizenPortalController {

    @Autowired
    private GrievanceRepository grievanceRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/portal")
    @PreAuthorize("hasAnyRole('CITIZEN', 'MUNICIPAL_ADMIN')")
    public ResponseEntity<Map<String, Object>> getCitizenPortalData(@AuthenticationPrincipal User user) {
        String citizenName = (user != null && user.getFullName() != null) ? user.getFullName() : (user != null ? user.getUsername() : "Citizen");
        Long userId = user != null ? user.getId() : null;
        String role = user != null ? user.getRole() : "CITIZEN";

        List<Grievance> myGrievances;
        List<ServiceRequest> myServices;

        if ("MUNICIPAL_ADMIN".equalsIgnoreCase(role)) {
            myGrievances = grievanceRepository.findAll();
            myServices = serviceRequestRepository.findAll();
        } else {
            myGrievances = grievanceRepository.findAll().stream()
                    .filter(g -> (userId != null && userId.equals(g.getCitizenId()))
                            || (g.getCitizenName() != null && citizenName != null && g.getCitizenName().trim().equalsIgnoreCase(citizenName.trim())))
                    .toList();

            myServices = serviceRequestRepository.findAll().stream()
                    .filter(s -> (userId != null && userId.equals(s.getCitizenId()))
                            || (s.getCitizenName() != null && citizenName != null && s.getCitizenName().trim().equalsIgnoreCase(citizenName.trim())))
                    .toList();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("citizenName", citizenName);
        response.put("ward", user != null && user.getWard() != null ? user.getWard() : "Ward 1 - Downtown Metro");
        response.put("totalGrievancesFiled", myGrievances.size());
        response.put("totalServicesApplied", myServices.size());
        response.put("grievances", myGrievances);
        response.put("serviceRequests", myServices);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/grievances")
    @PreAuthorize("hasAnyRole('CITIZEN', 'MUNICIPAL_ADMIN')")
    public ResponseEntity<Grievance> fileCitizenGrievance(
            @RequestBody Grievance grievance,
            @AuthenticationPrincipal User user) {

        if (user != null) {
            grievance.setCitizenId(user.getId());
            grievance.setCitizenName(user.getFullName() != null ? user.getFullName() : user.getUsername());
            if (grievance.getWard() == null) {
                grievance.setWard(user.getWard() != null ? user.getWard() : "Ward 1 - Downtown Metro");
            }
        }

        if (grievance.getTicketNumber() == null || grievance.getTicketNumber().isBlank()) {
            grievance.setTicketNumber("GRV-2026-" + (10000 + (int)(Math.random() * 90000)));
        }
        if (grievance.getCreatedAt() == null) {
            grievance.setCreatedAt(LocalDateTime.now());
        }
        if (grievance.getStatus() == null) {
            grievance.setStatus("SUBMITTED");
        }
        if (grievance.getPriority() == null) {
            grievance.setPriority("MEDIUM");
        }
        if (grievance.getDepartment() == null && grievance.getCategory() != null) {
            Department dept = departmentRepository.findByCode("WTR").orElse(null);
            grievance.setDepartment(dept);
        }

        Grievance saved = grievanceRepository.save(grievance);
        analyticsService.evictAllCaches();
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/services")
    @PreAuthorize("hasAnyRole('CITIZEN', 'MUNICIPAL_ADMIN')")
    public ResponseEntity<ServiceRequest> applyCitizenService(
            @RequestBody ServiceRequest request,
            @AuthenticationPrincipal User user) {

        if (user != null) {
            request.setCitizenId(user.getId());
            request.setCitizenName(user.getFullName() != null ? user.getFullName() : user.getUsername());
            if (request.getWard() == null) {
                request.setWard(user.getWard() != null ? user.getWard() : "Ward 1 - Downtown Metro");
            }
        }

        if (request.getRequestNumber() == null || request.getRequestNumber().isBlank()) {
            request.setRequestNumber("SR-2026-" + (10000 + (int)(Math.random() * 90000)));
        }
        if (request.getSubmissionDate() == null) {
            request.setSubmissionDate(LocalDateTime.now());
        }
        if (request.getStatus() == null) {
            request.setStatus("SUBMITTED");
        }
        if (request.getDepartment() == null) {
            Department dept = departmentRepository.findByCode("WTR").orElse(null);
            request.setDepartment(dept);
        }

        ServiceRequest saved = serviceRequestRepository.save(request);
        analyticsService.evictAllCaches();
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/rate/{ticketId}")
    @PreAuthorize("hasAnyRole('CITIZEN', 'MUNICIPAL_ADMIN')")
    public ResponseEntity<?> rateResolution(
            @PathVariable Long ticketId,
            @RequestBody Map<String, Integer> payload,
            @AuthenticationPrincipal User user) {

        Grievance g = grievanceRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Grievance ticket not found"));

        if (user != null && "CITIZEN".equalsIgnoreCase(user.getRole())) {
            if (g.getCitizenId() != null && !g.getCitizenId().equals(user.getId()) && !user.getFullName().equalsIgnoreCase(g.getCitizenName())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: You can only rate your own grievances.");
            }
        }

        Integer rating = payload.getOrDefault("rating", 5);
        g.setSatisfactionRating(rating);
        Grievance saved = grievanceRepository.save(g);
        analyticsService.evictAllCaches();
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/grievances/{id}/withdraw")
    @PreAuthorize("hasAnyRole('CITIZEN', 'MUNICIPAL_ADMIN')")
    public ResponseEntity<?> withdrawGrievance(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        Grievance g = grievanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Grievance ticket not found"));

        if (user != null && "CITIZEN".equalsIgnoreCase(user.getRole())) {
            if (g.getCitizenId() != null && !g.getCitizenId().equals(user.getId()) && !user.getFullName().equalsIgnoreCase(g.getCitizenName())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: You can only withdraw your own grievances.");
            }
        }

        g.setStatus("WITHDRAWN");
        g.setResolutionNotes("Application withdrawn voluntarily by citizen.");
        Grievance saved = grievanceRepository.save(g);
        analyticsService.evictAllCaches();
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/services/{id}/withdraw")
    @PreAuthorize("hasAnyRole('CITIZEN', 'MUNICIPAL_ADMIN')")
    public ResponseEntity<?> withdrawService(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {
        ServiceRequest s = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service request not found"));

        if (user != null && "CITIZEN".equalsIgnoreCase(user.getRole())) {
            if (s.getCitizenId() != null && !s.getCitizenId().equals(user.getId()) && !user.getFullName().equalsIgnoreCase(s.getCitizenName())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied: You can only withdraw your own service requests.");
            }
        }

        s.setStatus("WITHDRAWN");
        ServiceRequest saved = serviceRequestRepository.save(s);
        analyticsService.evictAllCaches();
        return ResponseEntity.ok(saved);
    }
}
