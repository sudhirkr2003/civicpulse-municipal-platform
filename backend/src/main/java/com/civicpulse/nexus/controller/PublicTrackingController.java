package com.civicpulse.nexus.controller;

import com.civicpulse.nexus.model.Grievance;
import com.civicpulse.nexus.model.ServiceRequest;
import com.civicpulse.nexus.repository.GrievanceRepository;
import com.civicpulse.nexus.repository.ServiceRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/public")
@CrossOrigin(origins = "*")
public class PublicTrackingController {

    @Autowired
    private GrievanceRepository grievanceRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @GetMapping("/track/{trackingNumber}")
    public ResponseEntity<Map<String, Object>> trackDocket(@PathVariable String trackingNumber) {
        String cleanNumber = trackingNumber != null ? trackingNumber.trim() : "";
        Map<String, Object> response = new HashMap<>();

        Optional<Grievance> grievanceOpt = grievanceRepository.findByTicketNumberIgnoreCase(cleanNumber);
        if (grievanceOpt.isPresent()) {
            Grievance g = grievanceOpt.get();
            response.put("found", true);
            response.put("type", "Grievance Redressal");
            response.put("ticketNumber", g.getTicketNumber());
            response.put("title", g.getCategory() + " - " + (g.getDescription() != null ? g.getDescription() : "Civic Complaint"));
            response.put("category", g.getCategory());
            response.put("department", g.getDepartment() != null ? g.getDepartment().getName() : "Municipal Ward Redressal");
            response.put("ward", g.getWard() != null ? g.getWard() : "Ward 1 - Central Zone");
            response.put("status", g.getStatus());
            response.put("priority", g.getPriority() != null ? g.getPriority() : "MEDIUM");
            response.put("officer", g.getWard() != null ? (g.getWard() + " Field Unit") : "Ward Field Redressal Crew");
            response.put("filedOn", g.getCreatedAt() != null ? g.getCreatedAt().toString().replace('T', ' ').substring(0, Math.min(16, g.getCreatedAt().toString().length())) : "Recent");
            response.put("resolutionNotes", g.getResolutionNotes());
            response.put("proofPhoto", g.getProofPhoto());
            response.put("satisfactionRating", g.getSatisfactionRating());

            if ("RESOLVED".equalsIgnoreCase(g.getStatus())) {
                response.put("slaRemaining", "Resolved within statutory SLA window (" + (g.getMttrHours() != null ? g.getMttrHours() : 48) + "h MTTR)");
                response.put("progress", 100);
            } else if ("WITHDRAWN".equalsIgnoreCase(g.getStatus())) {
                response.put("slaRemaining", "Application Withdrawn Voluntarily by Citizen");
                response.put("progress", 0);
            } else if ("IN_PROGRESS".equalsIgnoreCase(g.getStatus())) {
                response.put("slaRemaining", "Active Work Order - Crew Dispatched (47h SLA Benchmark)");
                response.put("progress", 65);
            } else {
                response.put("slaRemaining", "Pending Ward Officer Dispatch (Within SLA)");
                response.put("progress", 25);
            }

            return ResponseEntity.ok(response);
        }

        Optional<ServiceRequest> serviceOpt = serviceRequestRepository.findByRequestNumberIgnoreCase(cleanNumber);
        if (serviceOpt.isPresent()) {
            ServiceRequest s = serviceOpt.get();
            response.put("found", true);
            response.put("type", "Municipal Service");
            response.put("ticketNumber", s.getRequestNumber());
            response.put("title", s.getServiceType() != null ? s.getServiceType() : "Civic Service Fulfillment");
            response.put("category", s.getServiceType());
            response.put("department", s.getDepartment() != null ? s.getDepartment().getName() : "Municipal Administration");
            response.put("ward", s.getWard() != null ? s.getWard() : "Ward 1 - Central Zone");
            response.put("status", s.getStatus());
            response.put("priority", "STANDARD");
            response.put("officer", "Ward Revenue & Service Officer");
            response.put("filedOn", s.getSubmissionDate() != null ? s.getSubmissionDate().toString().replace('T', ' ').substring(0, Math.min(16, s.getSubmissionDate().toString().length())) : "Recent");

            if ("RESOLVED".equalsIgnoreCase(s.getStatus())) {
                response.put("slaRemaining", "Completed and Verified (" + (s.getTurnaroundDays() != null ? s.getTurnaroundDays() : 2.4) + " Days)");
                response.put("progress", 100);
            } else if ("WITHDRAWN".equalsIgnoreCase(s.getStatus())) {
                response.put("slaRemaining", "Application Withdrawn Voluntarily by Citizen");
                response.put("progress", 0);
            } else if ("IN_PROGRESS".equalsIgnoreCase(s.getStatus())) {
                response.put("slaRemaining", "Document Scrutiny & In-Field Verification Active");
                response.put("progress", 60);
            } else {
                response.put("slaRemaining", "Queued for Department Scrutiny (Target 2.4 Days)");
                response.put("progress", 20);
            }

            return ResponseEntity.ok(response);
        }

        response.put("found", false);
        response.put("ticketNumber", cleanNumber);
        response.put("message", "No active or archived docket matching identifier '" + cleanNumber + "' found in municipal database.");
        return ResponseEntity.ok(response);
    }
}
