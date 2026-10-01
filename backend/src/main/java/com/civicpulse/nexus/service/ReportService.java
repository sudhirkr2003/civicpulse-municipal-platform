package com.civicpulse.nexus.service;

import com.civicpulse.nexus.dto.AuditLogDTO;
import com.civicpulse.nexus.model.ComplianceAuditLog;
import com.civicpulse.nexus.repository.ComplianceAuditLogRepository;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.FontFactory;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    @Autowired
    private ComplianceAuditLogRepository auditLogRepository;

    public AuditLogDTO getAuditLogs() {
        AuditLogDTO dto = new AuditLogDTO();
        List<ComplianceAuditLog> logs = auditLogRepository.findTop50ByOrderByTimestampDesc();
        dto.setLogs(logs);
        dto.setTotalLogsCount(auditLogRepository.count());
        dto.setStatutoryComplianceScore(98L);
        dto.setLastAuditTimestamp(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        List<Map<String, Object>> activity = new ArrayList<>();
        activity.add(Map.of("type", "LOGIN", "count", 142));
        activity.add(Map.of("type", "STATUS_UPDATE", "count", 89));
        activity.add(Map.of("type", "EXPORT_REPORT", "count", 34));
        activity.add(Map.of("type", "BUDGET_REALLOCATION", "count", 12));
        dto.setActivityByType(activity);

        return dto;
    }

    public byte[] generatePdfReport(String reportType) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4, 36, 36, 36, 36);

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            com.lowagie.text.Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, new Color(16, 185, 129));
            com.lowagie.text.Font subTitleFont = FontFactory.getFont(FontFactory.HELVETICA, 12, new Color(15, 30, 54));
            com.lowagie.text.Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.WHITE);
            com.lowagie.text.Font cellFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);

            Paragraph title = new Paragraph("CivicPulse Nexus \u2013 Governance Analytics Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            Paragraph meta = new Paragraph("Generated On: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")) + " | Classification: Statutory Executive", subTitleFont);
            meta.setAlignment(Element.ALIGN_CENTER);
            meta.setSpacingAfter(20);
            document.add(meta);

            PdfPTable summaryTable = new PdfPTable(2);
            summaryTable.setWidthPercentage(100);
            summaryTable.setSpacingAfter(20);

            PdfPCell c1 = new PdfPCell(new Phrase("Executive Governance Metric", headerFont));
            c1.setBackgroundColor(new Color(15, 30, 54));
            c1.setPadding(6);
            PdfPCell c2 = new PdfPCell(new Phrase("Telemetry Benchmark Value", headerFont));
            c2.setBackgroundColor(new Color(15, 30, 54));
            c2.setPadding(6);

            summaryTable.addCell(c1);
            summaryTable.addCell(c2);

            addTableRow(summaryTable, "Citizen Satisfaction Rating", "4.7 / 5.0 (Complaints \u2193 23%, Services \u2191 47%)", cellFont);
            addTableRow(summaryTable, "Municipal Service SLA Met", "94% (24.7K requests | Avg 2.4 days)", cellFont);
            addTableRow(summaryTable, "Total Municipal Revenue", "$12.4M Collected (+4.2% Surplus)", cellFont);
            addTableRow(summaryTable, "Budget Allocation & Utilization", "$47M Allocated | $41M Utilized (87% Burn Rate)", cellFont);
            addTableRow(summaryTable, "Grievance Redressal Rate", "94% Resolved (12.4K Filed | MTTR 47 hrs)", cellFont);
            addTableRow(summaryTable, "Top Performing Department", "Revenue & Treasury (95%), Water Management (94%)", cellFont);
            addTableRow(summaryTable, "Statutory Compliance Score", "98.4% (All Audits Verified)", cellFont);

            document.add(summaryTable);

            Paragraph deptHeader = new Paragraph("Departmental SLA Performance Breakdown", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, new Color(15, 30, 54)));
            deptHeader.setSpacingAfter(10);
            document.add(deptHeader);

            PdfPTable deptTable = new PdfPTable(4);
            deptTable.setWidthPercentage(100);

            String[] headers = {"Department", "Director", "SLA Score", "Budget Utilization"};
            for (String h : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
                cell.setBackgroundColor(new Color(16, 185, 129));
                cell.setPadding(6);
                deptTable.addCell(cell);
            }

            addDeptRow(deptTable, "Water Management", "Dr. Robert Sterling", "94%", "$11.2M / $12.5M (89.6%)", cellFont);
            addDeptRow(deptTable, "Public Health", "Dr. Evelyn Vance", "91%", "$8.9M / $10.2M (87.3%)", cellFont);
            addDeptRow(deptTable, "Civic Education", "Marcus Thorne", "89%", "$7.8M / $8.7M (89.7%)", cellFont);
            addDeptRow(deptTable, "Roads & Infrastructure", "Elena Rostova", "86%", "$8.4M / $9.8M (85.7%)", cellFont);
            addDeptRow(deptTable, "Revenue & Treasury", "Claire Beauchamp", "95%", "$4.7M / $5.8M (81.0%)", cellFont);

            document.add(deptTable);

            document.close();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF report", e);
        }

        return out.toByteArray();
    }

    public byte[] generateExcelReport() {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Governance Metrics");

            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());

            CellStyle headerCellStyle = workbook.createCellStyle();
            headerCellStyle.setFont(headerFont);
            headerCellStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerCellStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            Row headerRow = sheet.createRow(0);
            String[] headers = {"Metric / Department", "Current Status", "Benchmark Target", "Variance / Compliance"};
            for (int i = 0; i < headers.length; i++) {
                org.apache.poi.ss.usermodel.Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerCellStyle);
            }

            int rowIdx = 1;
            createExcelRow(sheet, rowIdx++, "Citizen Satisfaction", "4.7 / 5", "4.5 / 5", "+0.2 Rating");
            createExcelRow(sheet, rowIdx++, "Service SLA Compliance", "94%", "90%", "+4% SLA Exceeded");
            createExcelRow(sheet, rowIdx++, "Municipal Revenue Collected", "$12.4M", "$11.9M", "+4.2% Surplus");
            createExcelRow(sheet, rowIdx++, "Budget Utilization", "$41.0M", "$47.0M", "87% Utilized");
            createExcelRow(sheet, rowIdx++, "Grievance MTTR", "47 Hours", "48 Hours", "1 Hour Ahead");
            createExcelRow(sheet, rowIdx++, "Water Management SLA", "94%", "90%", "Compliant");
            createExcelRow(sheet, rowIdx++, "Public Health SLA", "91%", "90%", "Compliant");
            createExcelRow(sheet, rowIdx++, "Civic Education SLA", "89%", "90%", "Under Review");
            createExcelRow(sheet, rowIdx++, "Roads Infrastructure SLA", "86%", "85%", "Compliant");
            createExcelRow(sheet, rowIdx++, "Revenue Treasury SLA", "95%", "92%", "Compliant");

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating Excel report", e);
        }
    }

    private void addTableRow(PdfPTable table, String label, String value, com.lowagie.text.Font font) {
        PdfPCell c1 = new PdfPCell(new Phrase(label, font));
        c1.setPadding(5);
        PdfPCell c2 = new PdfPCell(new Phrase(value, font));
        c2.setPadding(5);
        table.addCell(c1);
        table.addCell(c2);
    }

    private void addDeptRow(PdfPTable table, String dept, String dir, String sla, String budget, com.lowagie.text.Font font) {
        table.addCell(new Phrase(dept, font));
        table.addCell(new Phrase(dir, font));
        table.addCell(new Phrase(sla, font));
        table.addCell(new Phrase(budget, font));
    }

    private void createExcelRow(Sheet sheet, int rowIdx, String col1, String col2, String col3, String col4) {
        Row row = sheet.createRow(rowIdx);
        row.createCell(0).setCellValue(col1);
        row.createCell(1).setCellValue(col2);
        row.createCell(2).setCellValue(col3);
        row.createCell(3).setCellValue(col4);
    }
}
