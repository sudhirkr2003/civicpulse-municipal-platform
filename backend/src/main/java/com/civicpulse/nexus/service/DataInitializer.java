package com.civicpulse.nexus.service;

import com.civicpulse.nexus.model.*;
import com.civicpulse.nexus.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private GrievanceRepository grievanceRepository;

    @Autowired
    private RevenueRepository revenueRepository;

    @Autowired
    private BudgetAllocationRepository budgetAllocationRepository;

    @Autowired
    private PermitRepository permitRepository;

    @Autowired
    private ComplianceAuditLogRepository auditLogRepository;

    @Autowired
    private CitizenRepository citizenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedDepartments();
        seedUsers();
        seedBudgetAllocations();
        seedCitizens();
        seedServiceRequests();
        seedGrievances();
        seedRevenueTransactions();
        seedPermits();
        seedAuditLogs();
    }

    private void seedUsers() {
        if (userRepository.count() < 5) {
            User admin = new User(
                    null,
                    "admin",
                    "admin@civicpulse.gov",
                    passwordEncoder.encode("Admin@123"),
                    "MUNICIPAL_ADMIN",
                    "Municipal Admin",
                    null,
                    null,
                    true
            );
            User waterHead = new User(
                    null,
                    "water_head",
                    "water.head@civicpulse.gov",
                    passwordEncoder.encode("Water@123"),
                    "DEPT_HEAD",
                    "Water Dept Head",
                    1L,
                    null,
                    true
            );
            User auditor = new User(
                    null,
                    "auditor",
                    "auditor@civicpulse.gov",
                    passwordEncoder.encode("Audit@123"),
                    "COMPLIANCE_AUDITOR",
                    "Compliance Auditor",
                    null,
                    null,
                    true
            );
            User fieldOfficer = new User(
                    null,
                    "officer_ward4",
                    "officer.ward4@civicpulse.gov",
                    passwordEncoder.encode("Officer@123"),
                    "FIELD_OFFICER",
                    "Field Officer (Ward 4)",
                    1L,
                    "Ward 4 - Tech Corridor",
                    true
            );
            User citizen = new User(
                    null,
                    "citizen_rahul",
                    "rahul.s@civicpulse.org",
                    passwordEncoder.encode("Citizen@123"),
                    "CITIZEN",
                    "Citizen (Rahul S.)",
                    null,
                    "Ward 1 - Downtown Metro",
                    true
            );

            for (User u : Arrays.asList(admin, waterHead, auditor, fieldOfficer, citizen)) {
                if (!userRepository.existsByUsername(u.getUsername())) {
                    userRepository.save(u);
                }
            }
        }
    }

    private void seedDepartments() {
        if (departmentRepository.count() == 0) {
            Department wtr = new Department("Water Management", "WTR", 90.0, "Dr. Robert Sterling", 12500000.0, 11200000.0, 94.0);
            Department hlt = new Department("Public Health", "HLT", 90.0, "Dr. Evelyn Vance", 10200000.0, 8900000.0, 91.0);
            Department edu = new Department("Civic Education", "EDU", 90.0, "Marcus Thorne", 8700000.0, 7800000.0, 89.0);
            Department rds = new Department("Roads & Infrastructure", "RDS", 85.0, "Elena Rostova", 9800000.0, 8400000.0, 86.0);
            Department rev = new Department("Revenue & Treasury", "REV", 92.0, "Claire Beauchamp", 5800000.0, 4700000.0, 95.0);

            departmentRepository.saveAll(Arrays.asList(wtr, hlt, edu, rds, rev));
        }
    }

    private void seedBudgetAllocations() {
        if (budgetAllocationRepository.count() == 0) {
            List<Department> depts = departmentRepository.findAll();
            for (Department d : depts) {
                if ("WTR".equals(d.getCode())) {
                    budgetAllocationRepository.save(new BudgetAllocation(d, "FY-2026", 12500000.0, 11200000.0, 8200000.0, 3000000.0));
                } else if ("HLT".equals(d.getCode())) {
                    budgetAllocationRepository.save(new BudgetAllocation(d, "FY-2026", 10200000.0, 8900000.0, 5800000.0, 3100000.0));
                } else if ("EDU".equals(d.getCode())) {
                    budgetAllocationRepository.save(new BudgetAllocation(d, "FY-2026", 8700000.0, 7800000.0, 4900000.0, 2900000.0));
                } else if ("RDS".equals(d.getCode())) {
                    budgetAllocationRepository.save(new BudgetAllocation(d, "FY-2026", 9800000.0, 8400000.0, 6800000.0, 1600000.0));
                } else if ("REV".equals(d.getCode())) {
                    budgetAllocationRepository.save(new BudgetAllocation(d, "FY-2026", 5800000.0, 4700000.0, 2700000.0, 2000000.0));
                }
            }
        }
    }

    private void seedCitizens() {
        if (citizenRepository.count() == 0) {
            List<Citizen> citizens = Arrays.asList(
                    new Citizen("CTZ-90412", "Eleanor Vance", "eleanor.vance@metro.org", "+1 (555) 234-8901", "Ward 1 - Downtown Metro", 4.9, 12),
                    new Citizen("CTZ-88319", "Julian Thorne", "julian.t@techcore.io", "+1 (555) 872-1049", "Ward 4 - Tech Corridor", 4.8, 8),
                    new Citizen("CTZ-77102", "Samantha Hayes", "s.hayes@riverside.net", "+1 (555) 439-0912", "Ward 2 - Riverside North", 4.7, 5),
                    new Citizen("CTZ-65239", "Arthur Pendelton", "arthur.p@highland.org", "+1 (555) 902-3341", "Ward 3 - Highland Park", 4.6, 9),
                    new Citizen("CTZ-54128", "Darius Morales", "dmorales@industrial.com", "+1 (555) 312-8874", "Ward 5 - Industrial Valley", 4.5, 14),
                    new Citizen("CTZ-43991", "Nadia Al-Mansoor", "nadia.mansoor@harbor.org", "+1 (555) 761-4420", "Ward 6 - Harborview Heights", 4.8, 6),
                    new Citizen("CTZ-32104", "Lucas Bennett", "lucas.b@metro.org", "+1 (555) 543-9912", "Ward 1 - Downtown Metro", 4.9, 11),
                    new Citizen("CTZ-21980", "Chloe Davenport", "c.davenport@techcorridor.io", "+1 (555) 674-1234", "Ward 4 - Tech Corridor", 4.7, 4)
            );
            citizenRepository.saveAll(citizens);
        }
    }

    private void seedServiceRequests() {
        if (serviceRequestRepository.count() == 0) {
            Department wtr = departmentRepository.findByCode("WTR").orElse(null);
            Department hlt = departmentRepository.findByCode("HLT").orElse(null);
            Department rds = departmentRepository.findByCode("RDS").orElse(null);
            Department rev = departmentRepository.findByCode("REV").orElse(null);

            List<ServiceRequest> requests = Arrays.asList(
                    new ServiceRequest("SR-2026-9041", wtr, 1L, "Eleanor Vance", "Smart Water Meter Calibration", "RESOLVED", LocalDateTime.now().minusDays(5), LocalDateTime.now().minusDays(3), true, 2.1, "Ward 1 - Downtown Metro"),
                    new ServiceRequest("SR-2026-9042", hlt, 2L, "Julian Thorne", "Commercial Food Safety Certification", "RESOLVED", LocalDateTime.now().minusDays(6), LocalDateTime.now().minusDays(4), true, 2.4, "Ward 4 - Tech Corridor"),
                    new ServiceRequest("SR-2026-9043", rds, 3L, "Arthur Pendelton", "Pedestrian Crossing Signal Repair", "RESOLVED", LocalDateTime.now().minusDays(4), LocalDateTime.now().minusDays(1), true, 2.8, "Ward 3 - Highland Park"),
                    new ServiceRequest("SR-2026-9044", rev, 4L, "Samantha Hayes", "Commercial Property Assessment", "RESOLVED", LocalDateTime.now().minusDays(3), LocalDateTime.now().minusDays(1), true, 1.8, "Ward 2 - Riverside North"),
                    new ServiceRequest("SR-2026-9045", wtr, 5L, "Darius Morales", "Industrial Wastewater Pipeline Inspection", "IN_PROGRESS", LocalDateTime.now().minusDays(1), null, true, null, "Ward 5 - Industrial Valley"),
                    new ServiceRequest("SR-2026-9046", hlt, 6L, "Nadia Al-Mansoor", "Community Clinic Air Quality Audit", "PENDING", LocalDateTime.now(), null, true, null, "Ward 6 - Harborview Heights")
            );
            serviceRequestRepository.saveAll(requests);
        }
    }

    private void seedGrievances() {
        if (grievanceRepository.count() == 0) {
            Department wtr = departmentRepository.findByCode("WTR").orElse(null);
            Department rds = departmentRepository.findByCode("RDS").orElse(null);
            Department hlt = departmentRepository.findByCode("HLT").orElse(null);

            List<Grievance> grievances = Arrays.asList(
                    new Grievance("GRV-2026-1021", wtr, 1L, 4L, "Eleanor Vance", "Water Supply", "Low pressure during peak morning hours in Sector 4", "RESOLVED", "HIGH", LocalDateTime.now().minusDays(3), LocalDateTime.now().minusDays(1), 44.0, 5, "Ward 1 - Downtown Metro"),
                    new Grievance("GRV-2026-1022", rds, 2L, 4L, "Julian Thorne", "Roads & Potholes", "Major asphalt depression near Tech Hub crossroad", "RESOLVED", "CRITICAL", LocalDateTime.now().minusDays(4), LocalDateTime.now().minusDays(2), 48.0, 5, "Ward 4 - Tech Corridor"),
                    new Grievance("GRV-2026-1023", hlt, 3L, 4L, "Samantha Hayes", "Sanitation & Waste", "Delayed weekend municipal dumpster collection", "RESOLVED", "MEDIUM", LocalDateTime.now().minusDays(2), LocalDateTime.now().minusHours(3), 32.0, 4, "Ward 2 - Riverside North"),
                    new Grievance("GRV-2026-1024", rds, 4L, 4L, "Arthur Pendelton", "Street Lighting", "Multiple LED fixture outages along Park Avenue", "RESOLVED", "LOW", LocalDateTime.now().minusDays(5), LocalDateTime.now().minusDays(3), 26.0, 5, "Ward 3 - Highland Park"),
                    new Grievance("GRV-2026-1025", wtr, 5L, 4L, "Darius Morales", "Water Supply", "Suspected valve leakage near industrial boundary", "IN_PROGRESS", "HIGH", LocalDateTime.now().minusHours(18), null, null, null, "Ward 5 - Industrial Valley"),
                    new Grievance("GRV-2026-1026", hlt, 6L, 4L, "Nadia Al-Mansoor", "Public Health", "Acoustic decibel violation from night logistics terminal", "OPEN", "MEDIUM", LocalDateTime.now().minusHours(6), null, null, null, "Ward 6 - Harborview Heights")
            );
            grievanceRepository.saveAll(grievances);
        }
    }

    private void seedRevenueTransactions() {
        if (revenueRepository.count() == 0) {
            List<RevenueTransaction> txns = Arrays.asList(
                    new RevenueTransaction("TXN-REV-8801", "PROPERTY_TAX", 8310000.0, "Apex Real Estate Holdings", "COMPLETED", LocalDateTime.now().minusDays(10), "ACH_TRANSFER", "Ward 1 - Downtown Metro"),
                    new RevenueTransaction("TXN-REV-8802", "BUSINESS_LICENSE", 2850000.0, "TechVentures Global Inc", "COMPLETED", LocalDateTime.now().minusDays(7), "ONLINE_CARD", "Ward 4 - Tech Corridor"),
                    new RevenueTransaction("TXN-REV-8803", "PERMITS", 1240000.0, "Harbor Infrastructure Consortium", "COMPLETED", LocalDateTime.now().minusDays(3), "ACH_TRANSFER", "Ward 6 - Harborview Heights")
            );
            revenueRepository.saveAll(txns);
        }
    }

    private void seedPermits() {
        if (permitRepository.count() == 0) {
            List<Permit> permits = Arrays.asList(
                    new Permit("PMT-2026-4401", "Horizon Commercial Real Estate", "Commercial Building", "APPROVED", 14500000.0, 450000.0, LocalDateTime.now().minusDays(14), LocalDateTime.now().minusDays(2), "Ward 1 - Downtown Metro"),
                    new Permit("PMT-2026-4402", "Skyline Developers LLC", "Residential Construction", "APPROVED", 8200000.0, 260000.0, LocalDateTime.now().minusDays(10), LocalDateTime.now().minusDays(3), "Ward 4 - Tech Corridor"),
                    new Permit("PMT-2026-4403", "Metro Digital Media", "Signage & Billboard", "INSPECTION_SCHEDULED", 340000.0, 25000.0, LocalDateTime.now().minusDays(4), null, "Ward 2 - Riverside North"),
                    new Permit("PMT-2026-4404", "Green Leaf Organic Market", "Street Vendor License", "UNDER_REVIEW", 120000.0, 15000.0, LocalDateTime.now().minusDays(2), null, "Ward 3 - Highland Park"),
                    new Permit("PMT-2026-4405", "Industrial Solar Works", "Environmental Clearance", "SUBMITTED", 5600000.0, 180000.0, LocalDateTime.now().minusDays(1), null, "Ward 5 - Industrial Valley")
            );
            permitRepository.saveAll(permits);
        }
    }

    private void seedAuditLogs() {
        if (auditLogRepository.count() == 0) {
            List<ComplianceAuditLog> logs = Arrays.asList(
                    new ComplianceAuditLog(1L, "admin", "SYSTEM_STARTUP", "CivicPulse Nexus Governance Platform booted and cache warmed", "127.0.0.1"),
                    new ComplianceAuditLog(1L, "admin", "AUDIT_VERIFICATION", "Statutory SLA baseline validation verified across all 5 municipal departments", "127.0.0.1"),
                    new ComplianceAuditLog(1L, "admin", "EXPORT_REPORT", "Executive Governance Analytics PDF report generated for City Council", "127.0.0.1"),
                    new ComplianceAuditLog(1L, "admin", "BUDGET_REALLOCATION", "Quarterly capital expenditure balance sheet synced with municipal treasury", "127.0.0.1")
            );
            auditLogRepository.saveAll(logs);
        }
    }
}
