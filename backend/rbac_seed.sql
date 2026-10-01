DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS compliance_audit_logs;
DROP TABLE IF EXISTS grievances;
DROP TABLE IF EXISTS service_requests;
DROP TABLE IF EXISTS permits;
DROP TABLE IF EXISTS revenue_transactions;
DROP TABLE IF EXISTS budget_allocations;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS citizens;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    department_id BIGINT,
    ward VARCHAR(50),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE refresh_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    token_hash VARCHAR(500) NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE departments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    target_sla_percentage DOUBLE NOT NULL,
    director_name VARCHAR(100),
    budget_allocated DOUBLE,
    budget_utilized DOUBLE,
    current_sla_performance DOUBLE
);

CREATE TABLE budget_allocations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    department_id BIGINT,
    fiscal_year VARCHAR(20) NOT NULL,
    allocated_amount DOUBLE NOT NULL,
    utilized_amount DOUBLE NOT NULL,
    capex_amount DOUBLE NOT NULL,
    opex_amount DOUBLE NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE citizens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    national_id VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(30),
    ward VARCHAR(50),
    satisfaction_score DOUBLE,
    total_requests INT DEFAULT 0,
    registered_date DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE service_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    request_number VARCHAR(50) NOT NULL UNIQUE,
    department_id BIGINT,
    citizen_id BIGINT,
    citizen_name VARCHAR(100) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    status VARCHAR(30) NOT NULL,
    submission_date DATETIME NOT NULL,
    resolved_date DATETIME,
    sla_met BOOLEAN DEFAULT TRUE,
    turnaround_days DOUBLE,
    ward VARCHAR(50),
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE grievances (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ticket_number VARCHAR(50) NOT NULL UNIQUE,
    department_id BIGINT,
    citizen_id BIGINT,
    assigned_officer_id BIGINT,
    citizen_name VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    status VARCHAR(30) NOT NULL,
    priority VARCHAR(30) NOT NULL,
    created_at DATETIME NOT NULL,
    resolved_at DATETIME,
    mttr_hours DOUBLE,
    satisfaction_rating INT,
    ward VARCHAR(50),
    proof_photo TEXT,
    resolution_notes TEXT,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE revenue_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_ref VARCHAR(50) NOT NULL UNIQUE,
    category VARCHAR(50) NOT NULL,
    amount DOUBLE NOT NULL,
    payer_name VARCHAR(100) NOT NULL,
    payment_status VARCHAR(30) NOT NULL,
    payment_date DATETIME NOT NULL,
    payment_method VARCHAR(50),
    ward VARCHAR(50)
);

CREATE TABLE permits (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    permit_number VARCHAR(50) NOT NULL UNIQUE,
    applicant_name VARCHAR(100) NOT NULL,
    permit_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    estimated_cost DOUBLE,
    fee_collected DOUBLE,
    submission_date DATETIME NOT NULL,
    approval_date DATETIME,
    ward VARCHAR(50)
);

CREATE TABLE compliance_audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    username VARCHAR(50) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    details TEXT,
    ip_address VARCHAR(50),
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (id, username, email, password_hash, role, full_name, department_id, ward, is_active)
VALUES 
(1, 'admin', 'admin@civicpulse.gov', '$2a$10$w3U6gWj8yG2oVJnKk7R6ce5mF8iIeH.O1g2h5hR2a2T3Y4u5v6W7X', 'MUNICIPAL_ADMIN', 'Municipal Admin', NULL, NULL, TRUE),
(2, 'water_head', 'water.head@civicpulse.gov', '$2a$10$w3U6gWj8yG2oVJnKk7R6ce5mF8iIeH.O1g2h5hR2a2T3Y4u5v6W7X', 'DEPT_HEAD', 'Water Dept Head', 1, NULL, TRUE),
(3, 'auditor', 'auditor@civicpulse.gov', '$2a$10$w3U6gWj8yG2oVJnKk7R6ce5mF8iIeH.O1g2h5hR2a2T3Y4u5v6W7X', 'COMPLIANCE_AUDITOR', 'Compliance Auditor', NULL, NULL, TRUE),
(4, 'officer_ward4', 'officer.ward4@civicpulse.gov', '$2a$10$w3U6gWj8yG2oVJnKk7R6ce5mF8iIeH.O1g2h5hR2a2T3Y4u5v6W7X', 'FIELD_OFFICER', 'Field Officer (Ward 4)', 1, 'Ward 4 - Tech Corridor', TRUE),
(5, 'citizen_rahul', 'rahul.s@civicpulse.org', '$2a$10$w3U6gWj8yG2oVJnKk7R6ce5mF8iIeH.O1g2h5hR2a2T3Y4u5v6W7X', 'CITIZEN', 'Citizen (Rahul S.)', NULL, 'Ward 1 - Downtown Metro', TRUE);

INSERT INTO departments (id, name, code, target_sla_percentage, director_name, budget_allocated, budget_utilized, current_sla_performance) VALUES
(1, 'Water Management', 'WTR', 90.0, 'Dr. Robert Sterling', 12500000.0, 11200000.0, 94.0),
(2, 'Public Health', 'HLT', 90.0, 'Dr. Evelyn Vance', 10200000.0, 8900000.0, 91.0),
(3, 'Civic Education', 'EDU', 90.0, 'Marcus Thorne', 8700000.0, 7800000.0, 89.0),
(4, 'Roads & Infrastructure', 'RDS', 85.0, 'Elena Rostova', 9800000.0, 8400000.0, 86.0),
(5, 'Revenue & Treasury', 'REV', 92.0, 'Claire Beauchamp', 5800000.0, 4700000.0, 95.0);

INSERT INTO budget_allocations (id, department_id, fiscal_year, allocated_amount, utilized_amount, capex_amount, opex_amount) VALUES
(1, 1, 'FY-2026', 12500000.0, 11200000.0, 8200000.0, 3000000.0),
(2, 2, 'FY-2026', 10200000.0, 8900000.0, 5800000.0, 3100000.0),
(3, 3, 'FY-2026', 8700000.0, 7800000.0, 4900000.0, 2900000.0),
(4, 4, 'FY-2026', 9800000.0, 8400000.0, 6800000.0, 1600000.0),
(5, 5, 'FY-2026', 5800000.0, 4700000.0, 2700000.0, 2000000.0);

INSERT INTO citizens (id, national_id, full_name, email, phone, ward, satisfaction_score, total_requests) VALUES
(1, 'CTZ-90412', 'Eleanor Vance', 'eleanor.vance@metro.org', '+1 (555) 234-8901', 'Ward 1 - Downtown Metro', 4.9, 12),
(2, 'CTZ-88319', 'Julian Thorne', 'julian.t@techcore.io', '+1 (555) 872-1049', 'Ward 4 - Tech Corridor', 4.8, 8),
(3, 'CTZ-77102', 'Samantha Hayes', 's.hayes@riverside.net', '+1 (555) 439-0912', 'Ward 2 - Riverside North', 4.7, 5),
(4, 'CTZ-65239', 'Arthur Pendelton', 'arthur.p@highland.org', '+1 (555) 902-3341', 'Ward 3 - Highland Park', 4.6, 9),
(5, 'CTZ-54128', 'Darius Morales', 'dmorales@industrial.com', '+1 (555) 312-8874', 'Ward 5 - Industrial Valley', 4.5, 14),
(6, 'CTZ-43991', 'Nadia Al-Mansoor', 'nadia.mansoor@harbor.org', '+1 (555) 761-4420', 'Ward 6 - Harborview Heights', 4.8, 6),
(7, 'CTZ-32104', 'Lucas Bennett', 'lucas.b@metro.org', '+1 (555) 543-9912', 'Ward 1 - Downtown Metro', 4.9, 11),
(8, 'CTZ-21980', 'Chloe Davenport', 'c.davenport@techcorridor.io', '+1 (555) 674-1234', 'Ward 4 - Tech Corridor', 4.7, 4);

INSERT INTO service_requests (id, request_number, department_id, citizen_id, citizen_name, service_type, status, submission_date, resolved_date, sla_met, turnaround_days, ward) VALUES
(1, 'SR-2026-9041', 1, 1, 'Eleanor Vance', 'Smart Water Meter Calibration', 'RESOLVED', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY), TRUE, 2.1, 'Ward 1 - Downtown Metro'),
(2, 'SR-2026-9042', 2, 2, 'Julian Thorne', 'Commercial Food Safety Certification', 'RESOLVED', DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY), TRUE, 2.4, 'Ward 4 - Tech Corridor'),
(3, 'SR-2026-9043', 4, 4, 'Arthur Pendelton', 'Pedestrian Crossing Signal Repair', 'RESOLVED', DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), TRUE, 2.8, 'Ward 3 - Highland Park'),
(4, 'SR-2026-9044', 5, 3, 'Samantha Hayes', 'Commercial Property Assessment', 'RESOLVED', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), TRUE, 1.8, 'Ward 2 - Riverside North'),
(5, 'SR-2026-9045', 1, 5, 'Darius Morales', 'Industrial Wastewater Pipeline Inspection', 'IN_PROGRESS', DATE_SUB(NOW(), INTERVAL 1 DAY), NULL, TRUE, NULL, 'Ward 5 - Industrial Valley'),
(6, 'SR-2026-9046', 2, 6, 'Nadia Al-Mansoor', 'Community Clinic Air Quality Audit', 'SUBMITTED', NOW(), NULL, TRUE, NULL, 'Ward 6 - Harborview Heights');

INSERT INTO grievances (id, ticket_number, department_id, citizen_id, assigned_officer_id, citizen_name, category, description, status, priority, created_at, resolved_at, mttr_hours, satisfaction_rating, ward, proof_photo, resolution_notes) VALUES
(1, 'GRV-2026-1021', 1, 1, 4, 'Eleanor Vance', 'Water Supply', 'Low pressure during peak morning hours in Sector 4', 'RESOLVED', 'HIGH', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), 44.0, 5, 'Ward 1 - Downtown Metro', 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=400', 'Main distribution valve recalibrated and pressure equalized'),
(2, 'GRV-2026-1022', 4, 2, 4, 'Julian Thorne', 'Roads & Potholes', 'Major asphalt depression near Tech Hub crossroad', 'RESOLVED', 'CRITICAL', DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), 48.0, 5, 'Ward 4 - Tech Corridor', 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400', 'Hot-mix asphalt patch laid and roller compacted'),
(3, 'GRV-2026-1023', 2, 3, 4, 'Samantha Hayes', 'Sanitation & Waste', 'Delayed weekend municipal dumpster collection', 'RESOLVED', 'MEDIUM', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 3 HOUR), 32.0, 4, 'Ward 2 - Riverside North', 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400', 'Compactor route rerouted and bin emptied'),
(4, 'GRV-2026-1024', 4, 4, 4, 'Arthur Pendelton', 'Street Lighting', 'Multiple LED fixture outages along Park Avenue', 'RESOLVED', 'LOW', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY), 26.0, 5, 'Ward 3 - Highland Park', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400', 'Driver circuit replaced on 3 light poles'),
(5, 'GRV-2026-1025', 1, 5, 4, 'Darius Morales', 'Water Supply', 'Suspected valve leakage near industrial boundary', 'IN_PROGRESS', 'HIGH', DATE_SUB(NOW(), INTERVAL 18 HOUR), NULL, NULL, NULL, 'Ward 4 - Tech Corridor', NULL, 'Field crew dispatched for ultrasonic acoustic leak detection'),
(6, 'GRV-2026-1026', 2, 6, 4, 'Nadia Al-Mansoor', 'Public Health', 'Acoustic decibel violation from night logistics terminal', 'SUBMITTED', 'MEDIUM', DATE_SUB(NOW(), INTERVAL 6 HOUR), NULL, NULL, NULL, 'Ward 4 - Tech Corridor', NULL, NULL);

INSERT INTO revenue_transactions (id, transaction_ref, category, amount, payer_name, payment_status, payment_date, payment_method, ward) VALUES
(1, 'TXN-REV-8801', 'PROPERTY_TAX', 8310000.0, 'Apex Real Estate Holdings', 'COMPLETED', DATE_SUB(NOW(), INTERVAL 10 DAY), 'ACH_TRANSFER', 'Ward 1 - Downtown Metro'),
(2, 'TXN-REV-8802', 'BUSINESS_LICENSE', 2850000.0, 'TechVentures Global Inc', 'COMPLETED', DATE_SUB(NOW(), INTERVAL 7 DAY), 'ONLINE_CARD', 'Ward 4 - Tech Corridor'),
(3, 'TXN-REV-8803', 'PERMITS', 1240000.0, 'Harbor Infrastructure Consortium', 'COMPLETED', DATE_SUB(NOW(), INTERVAL 3 DAY), 'ACH_TRANSFER', 'Ward 6 - Harborview Heights');

INSERT INTO permits (id, permit_number, applicant_name, permit_type, status, estimated_cost, fee_collected, submission_date, approval_date, ward) VALUES
(1, 'PMT-2026-4401', 'Horizon Commercial Real Estate', 'Commercial Building', 'APPROVED', 14500000.0, 450000.0, DATE_SUB(NOW(), INTERVAL 14 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), 'Ward 1 - Downtown Metro'),
(2, 'PMT-2026-4402', 'Skyline Developers LLC', 'Residential Construction', 'APPROVED', 8200000.0, 260000.0, DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY), 'Ward 4 - Tech Corridor'),
(3, 'PMT-2026-4403', 'Metro Digital Media', 'Signage & Billboard', 'INSPECTION_SCHEDULED', 340000.0, 25000.0, DATE_SUB(NOW(), INTERVAL 4 DAY), NULL, 'Ward 2 - Riverside North'),
(4, 'PMT-2026-4404', 'Green Leaf Organic Market', 'Street Vendor License', 'UNDER_REVIEW', 120000.0, 15000.0, DATE_SUB(NOW(), INTERVAL 2 DAY), NULL, 'Ward 3 - Highland Park'),
(5, 'PMT-2026-4405', 'Industrial Solar Works', 'Environmental Clearance', 'SUBMITTED', 5600000.0, 180000.0, DATE_SUB(NOW(), INTERVAL 1 DAY), NULL, 'Ward 5 - Industrial Valley');

INSERT INTO compliance_audit_logs (id, user_id, username, action_type, details, ip_address, timestamp) VALUES
(1, 1, 'admin', 'SYSTEM_STARTUP', 'CivicPulse Nexus Governance Platform booted and cache warmed', '127.0.0.1', NOW()),
(2, 1, 'admin', 'AUDIT_VERIFICATION', 'Statutory SLA baseline validation verified across all 5 municipal departments', '127.0.0.1', NOW()),
(3, 1, 'admin', 'EXPORT_REPORT', 'Executive Governance Analytics PDF report generated for City Council', '127.0.0.1', NOW()),
(4, 1, 'admin', 'BUDGET_REALLOCATION', 'Quarterly capital expenditure balance sheet synced with municipal treasury', '127.0.0.1', NOW());
