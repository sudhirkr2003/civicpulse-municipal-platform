package com.civicpulse.nexus.controller;

import com.civicpulse.nexus.dto.ServiceMetricsDTO;
import com.civicpulse.nexus.dto.StatusUpdateDTO;
import com.civicpulse.nexus.model.ServiceRequest;
import com.civicpulse.nexus.model.User;
import com.civicpulse.nexus.repository.ServiceRequestRepository;
import com.civicpulse.nexus.service.MunicipalServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/services")
public class MunicipalServiceController {

    @Autowired
    private MunicipalServiceService municipalServiceService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @GetMapping("/metrics")
    public ResponseEntity<ServiceMetricsDTO> getServiceMetrics() {
        return ResponseEntity.ok(municipalServiceService.getServiceMetrics());
    }

    @GetMapping
    public ResponseEntity<List<ServiceRequest>> getAllServices(@AuthenticationPrincipal User user) {
        if (user != null) {
            String role = user.getRole();
            if ("DEPT_HEAD".equalsIgnoreCase(role) && user.getDepartmentId() != null) {
                return ResponseEntity.ok(serviceRequestRepository.findByDepartmentId(user.getDepartmentId()));
            }
            if ("FIELD_OFFICER".equalsIgnoreCase(role)) {
                if (user.getDepartmentId() != null) {
                    return ResponseEntity.ok(serviceRequestRepository.findByDepartmentId(user.getDepartmentId()));
                }
                if (user.getWard() != null) {
                    return ResponseEntity.ok(serviceRequestRepository.findByWard(user.getWard()));
                }
            }
            if ("CITIZEN".equalsIgnoreCase(role)) {
                String name = user.getFullName() != null ? user.getFullName() : user.getUsername();
                List<ServiceRequest> citizenList = serviceRequestRepository.findAll().stream()
                        .filter(s -> (user.getId() != null && user.getId().equals(s.getCitizenId()))
                                || (s.getCitizenName() != null && name != null && s.getCitizenName().trim().equalsIgnoreCase(name.trim())))
                        .toList();
                return ResponseEntity.ok(citizenList);
            }
        }
        return ResponseEntity.ok(municipalServiceService.getAllServiceRequests());
    }

    @PostMapping
    public ResponseEntity<ServiceRequest> createServiceRequest(
            @RequestBody ServiceRequest request,
            @AuthenticationPrincipal User user) {
        if (user != null && "CITIZEN".equalsIgnoreCase(user.getRole())) {
            request.setCitizenId(user.getId());
            request.setCitizenName(user.getFullName() != null ? user.getFullName() : user.getUsername());
            if (request.getWard() == null) {
                request.setWard(user.getWard() != null ? user.getWard() : "Ward 1 - Downtown Metro");
            }
        }
        return ResponseEntity.ok(municipalServiceService.createServiceRequest(request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ServiceRequest> updateServiceStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateDTO statusUpdateDTO) {
        return ResponseEntity.ok(municipalServiceService.updateStatus(id, statusUpdateDTO));
    }
}
