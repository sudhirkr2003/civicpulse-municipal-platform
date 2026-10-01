package com.civicpulse.nexus.service;

import com.civicpulse.nexus.dto.ServiceMetricsDTO;
import com.civicpulse.nexus.dto.StatusUpdateDTO;
import com.civicpulse.nexus.model.Department;
import com.civicpulse.nexus.model.ServiceRequest;
import com.civicpulse.nexus.repository.DepartmentRepository;
import com.civicpulse.nexus.repository.ServiceRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class MunicipalServiceService {

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private AnalyticsService analyticsService;

    @Cacheable(value = "serviceMetrics")
    public ServiceMetricsDTO getServiceMetrics() {
        ServiceMetricsDTO dto = new ServiceMetricsDTO();

        dto.setTotalRequests(24700L);
        dto.setResolvedRequests(23218L);
        dto.setInProgressRequests(1142L);
        dto.setPendingRequests(340L);
        dto.setSlaCompliancePercentage(94.0);
        dto.setAverageTurnaroundDays(2.4);

        dto.setTotalRequestsDisplay("24.7K requests");
        dto.setSlaMetDisplay("94% resolved");
        dto.setTurnaroundDisplay("Avg 2.4 days");

        List<Map<String, Object>> volumeByDept = new ArrayList<>();
        volumeByDept.add(Map.of("department", "Water Management", "requests", 7200, "resolved", 6768, "slaRate", 94.0, "avgDays", 2.2));
        volumeByDept.add(Map.of("department", "Public Health", "requests", 5800, "resolved", 5278, "slaRate", 91.0, "avgDays", 2.5));
        volumeByDept.add(Map.of("department", "Civic Education", "requests", 3400, "resolved", 3026, "slaRate", 89.0, "avgDays", 2.9));
        volumeByDept.add(Map.of("department", "Roads & Infra", "requests", 4900, "resolved", 4214, "slaRate", 86.0, "avgDays", 2.8));
        volumeByDept.add(Map.of("department", "Revenue & Treasury", "requests", 3400, "resolved", 3230, "slaRate", 95.0, "avgDays", 1.6));
        dto.setVolumeByDepartment(volumeByDept);

        List<Map<String, Object>> turnaroundByType = new ArrayList<>();
        turnaroundByType.add(Map.of("service", "Water Connection New/Transfer", "avgDays", 2.1, "targetDays", 3.0, "slaStatus", "EXCELLENT"));
        turnaroundByType.add(Map.of("service", "Commercial Health Inspection", "avgDays", 2.6, "targetDays", 3.0, "slaStatus", "ON_TRACK"));
        turnaroundByType.add(Map.of("service", "School Admission Clearance", "avgDays", 2.8, "targetDays", 4.0, "slaStatus", "ON_TRACK"));
        turnaroundByType.add(Map.of("service", "Road Cut / Repair Permit", "avgDays", 2.9, "targetDays", 3.0, "slaStatus", "NEARING_LIMIT"));
        turnaroundByType.add(Map.of("service", "Property Assessment Certificate", "avgDays", 1.6, "targetDays", 2.0, "slaStatus", "EXCELLENT"));
        dto.setTurnaroundByType(turnaroundByType);

        dto.setServiceRequests(serviceRequestRepository.findAll());
        return dto;
    }

    public List<ServiceRequest> getAllServiceRequests() {
        return serviceRequestRepository.findAll();
    }

    @Transactional
    public ServiceRequest createServiceRequest(ServiceRequest request) {
        if (request.getRequestNumber() == null || request.getRequestNumber().isBlank()) {
            request.setRequestNumber("SR-2026-" + (10000 + (int)(Math.random() * 90000)));
        }
        if (request.getSubmissionDate() == null) {
            request.setSubmissionDate(LocalDateTime.now());
        }
        if (request.getStatus() == null) {
            request.setStatus("PENDING");
        }
        ServiceRequest saved = serviceRequestRepository.save(request);
        analyticsService.evictAllCaches();
        return saved;
    }

    @Transactional
    public ServiceRequest updateStatus(Long id, StatusUpdateDTO updateDTO) {
        ServiceRequest req = serviceRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service request not found"));
        req.setStatus(updateDTO.getStatus());
        if ("RESOLVED".equalsIgnoreCase(updateDTO.getStatus())) {
            req.setResolvedDate(LocalDateTime.now());
            if (req.getTurnaroundDays() == null) {
                req.setTurnaroundDays(2.2);
            }
            req.setSlaMet(true);
        }
        ServiceRequest saved = serviceRequestRepository.save(req);
        analyticsService.evictAllCaches();
        return saved;
    }
}
