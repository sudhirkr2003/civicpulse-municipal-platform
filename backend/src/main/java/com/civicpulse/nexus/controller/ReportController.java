package com.civicpulse.nexus.controller;

import com.civicpulse.nexus.dto.AuditLogDTO;
import com.civicpulse.nexus.model.ComplianceAuditLog;
import com.civicpulse.nexus.model.User;
import com.civicpulse.nexus.repository.ComplianceAuditLogRepository;
import com.civicpulse.nexus.service.ReportService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @Autowired
    private ComplianceAuditLogRepository auditLogRepository;

    @GetMapping({"/compliance", "/list"})
    public ResponseEntity<AuditLogDTO> getAuditLogs() {
        return ResponseEntity.ok(reportService.getAuditLogs());
    }

    @RequestMapping(value = "/export", method = {RequestMethod.GET, RequestMethod.POST})
    public ResponseEntity<byte[]> exportReport(
            @RequestParam(defaultValue = "pdf") String format,
            @AuthenticationPrincipal User currentUser,
            HttpServletRequest request) {

        String username = (currentUser != null) ? currentUser.getUsername() : "admin";
        Long userId = (currentUser != null) ? currentUser.getId() : 1L;

        auditLogRepository.save(new ComplianceAuditLog(
                userId,
                username,
                "EXPORT_REPORT",
                "Exported governance analytics summary in " + format.toUpperCase() + " format",
                request.getRemoteAddr()
        ));

        if ("excel".equalsIgnoreCase(format) || "xlsx".equalsIgnoreCase(format)) {
            byte[] excelContent = reportService.generateExcelReport();
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=CivicPulse_Governance_Analytics.xlsx")
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(excelContent);
        }

        byte[] pdfContent = reportService.generatePdfReport(format);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=CivicPulse_Governance_Analytics.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfContent);
    }
}
