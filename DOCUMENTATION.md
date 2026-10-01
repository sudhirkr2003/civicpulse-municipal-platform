# TECHNICAL SPECIFICATION & SYSTEM ARCHITECTURE

# CivicPulse Nexus – Municipal Governance & Analytics Platform

Comprehensive engineering report covering municipal system design, role-based access control (RBAC), relational database architecture, real-time telemetry, SLA compliance, and REST API specification.

---

### METADATA & DEPLOYMENT LINKS

| Item | Details |
| :--- | :--- |
| **Candidate / Author** | Sudhir Kumar (GitHub: [sudhirkr2003](https://github.com/sudhirkr2003)) |
| **GitHub Repository** | [https://github.com/sudhirkr2003/civicpulse-municipal-platform](https://github.com/sudhirkr2003/civicpulse-municipal-platform) |
| **Live Frontend Application** | [https://civicpulse-portal.onrender.com](https://civicpulse-portal.onrender.com) |
| **Live Backend REST API** | [https://civicpulse-backend-xwsx.onrender.com](https://civicpulse-backend-xwsx.onrender.com) |
| **Technology Stack** | Spring Boot 3.2.5 (Java 17) + React 18 (Vite) + Aiven Cloud MySQL 8.4 + JWT Security + Caffeine Cache + Render |
| **Submission Date** | 02 October 2026 |

---

## 1. Project Overview

The **CivicPulse Nexus** is an enterprise-grade municipal governance, urban service delivery, and citizen grievance redressal platform. It digitizes municipal interactions across multiple administrative wards and city departments, tracking service requests, citizen grievances, commercial trade permits, municipal property tax revenues, and capital expenditure budgets. Every citizen filing and field officer resolution is linked to an immutable audit ledger with automated SLA tracking.

### 1.1 Core System Capabilities

- **Unified Public Docket Tracker**: Citizens can track any grievance docket (`GRV-...`) or municipal service filing (`SR-...`) across city wards with real-time status and resolution audit notes without requiring prior authentication.
- **Role-Based Portals (RBAC)**: Five distinct operational portals tailored for Municipal Administrators, Department Supervisors (e.g., Water, Health, Revenue), Compliance Auditors, Ground Field Officers, and Registered Residents.
- **Statutory SLA & MTTR Compliance**: Real-time Mean Time to Resolution (MTTR) calculation with strict 47-hour benchmark tracking and visual SLA threshold indicators.
- **Municipal Financial Accounting**: Tracks $12.4M municipal revenue collections across Property Tax (67%), Trade Licenses (23%), and Utility Fees (10%), alongside $47M allocated capital budgets.
- **Dual-Theme Design System**: Primary soft slate-gray light mode with architectural municipal watermarks and high-contrast dark mode with instant theme toggling and persistent browser state.
- **Automated Schema & Seeding**: Self-bootstrapping database initialization via Hibernate DDL-Auto and `DataInitializer` pre-populating departments, budget allocations, and demo users on first launch.

### 1.2 Mathematical & Performance Metrics

1. **SLA Compliance Rate**:
   $$\text{SLA Compliance \%} = \left( \frac{\text{Resolved Requests Within Benchmark}}{\text{Total Closed Requests}} \right) \times 100$$
   *Current City Benchmark: 94.0% Statutory Target (Target threshold: $\ge 90.0\%$)*.

2. **Budget Utilization Efficiency**:
   $$\text{Budget Utilization \%} = \left( \frac{\text{Disbursed Capital Expenditures}}{\text{Total Allocated Municipal Budget}} \right) \times 100$$
   *Current Metric: 87.2% Utilization ($41.0M utilized of $47.0M allocated)*.

3. **Citizen Satisfaction (CSAT)**:
   $$\text{CSAT Average} = \frac{\sum \text{Citizen Ratings (1 to 5 Stars)}}{\text{Total Feedback Count}} = 4.7 / 5.0$$

---

## 2. Tech Stack & Architecture

| Layer | Technology | Engineering Rationale |
| :--- | :--- | :--- |
| **Backend Framework** | Spring Boot 3.2.5 on Java 17 | Strong type safety, declarative transaction management (`@Transactional`), method-level security (`@PreAuthorize`), and HikariCP connection pooling. |
| **Frontend Framework** | React 18, Vite 5.4, Vanilla CSS | Fast Hot Module Replacement (HMR), lightweight bundle size (< 540 KB), Lucide icon ecosystem, and zero bloated CSS dependencies. |
| **Database** | Aiven Managed MySQL 8.4 | Cloud-hosted relational database with mandatory SSL encryption (`sslmode=REQUIRED`), ACID compliance, and foreign key integrity. |
| **Security & Auth** | Spring Security 6 + Stateless JWT | HMAC-SHA256 signed access tokens with BCrypt password hashing and refresh token rotation in HTTP-only cookies. |
| **In-Memory Cache** | Caffeine Cache | High-concurrency in-memory caching for executive governance KPIs and telemetry metrics. |
| **Containerization** | Multi-stage Docker | Minimal Eclipse Temurin 17 JRE Alpine runtime image ensuring reproducible builds. |
| **Hosting & Cloud** | Render (Web Service + Static Site) | Automatic GitHub continuous deployment pipeline with health check monitoring at `/health`. |

### 2.1 System Architecture Flow

```
[ Citizen / Official Browser Client ]
                │
                ▼ (HTTPS / TLS 1.3)
[ React 18 Frontend - Render Static Site ]
                │
                ▼ (REST API / Bearer JWT)
[ Spring Boot 3.2.5 Backend - Render Web Service (Docker) ]
        ├── JwtAuthenticationFilter (Security Context)
        ├── Caffeine In-Memory Cache (KPI Telemetry)
        ├── Business Service Layer (@Transactional)
        └── Spring Data JPA / Hibernate ORM
                │
                ▼ (Encrypted TLS MySQL Protocol :23376)
[ Aiven Managed Cloud MySQL 8.4 Database ]
```

---

## 3. Data Models / Relational Schema

| Entity / Table | Primary Attributes | Key Relationships & Constraints |
| :--- | :--- | :--- |
| **`users`** | `id`, `username`, `email`, `password`, `role`, `full_name`, `department_id`, `ward`, `active` | Stores credentials and authorization roles (`MUNICIPAL_ADMIN`, `DEPT_HEAD`, `COMPLIANCE_AUDITOR`, `FIELD_OFFICER`, `CITIZEN`). Password hashed with BCrypt. Foreign key to `departments.id`. |
| **`departments`** | `id`, `name`, `code`, `head_name`, `contact_email`, `budget_allocated`, `budget_spent`, `sla_target_hours`, `active` | Master list of city departments (Water, Health, Revenue, Roads, Permits, Education). `code` and `name` are unique. |
| **`grievances`** | `id`, `ticket_number`, `citizen_id`, `title`, `description`, `category`, `department_id`, `ward`, `status`, `priority`, `assigned_to`, `resolution_notes`, `created_at` | Citizen complaints. `ticket_number` is unique (`GRV-YYYY-XXXX`). Status workflow: `SUBMITTED` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `RESOLVED` / `WITHDRAWN`. |
| **`service_requests`** | `id`, `request_number`, `citizen_id`, `service_type`, `department_id`, `ward`, `status`, `sla_days`, `assigned_inspector`, `created_at` | Formal municipal service filings (`SR-YYYY-XXXX`). |
| **`citizens`** | `id`, `national_id`, `full_name`, `email`, `phone`, `ward`, `satisfaction_rating`, `total_filings` | Master citizen registry. `national_id` (Aadhaar/Voter ID) and `email` are unique. |
| **`budget_allocations`** | `id`, `department_id`, `fiscal_year`, `allocated_amount`, `utilized_amount`, `quarter`, `status` | Municipal treasury budget distributions. |
| **`revenue_transactions`** | `id`, `receipt_number`, `payer_name`, `source_type`, `amount`, `payment_method`, `transaction_date` | Revenue audit ledger across Property Tax, Licenses, and Fees. |
| **`permits`** | `id`, `permit_number`, `applicant_name`, `permit_type`, `department_id`, `ward`, `status`, `issued_date` | Building approvals and trade licenses. |
| **`compliance_audit_logs`** | `id`, `user_id`, `username`, `action`, `details`, `ip_address`, `timestamp` | Immutable compliance ledger capturing every state mutation and login event. |

---

## 4. Role-Based Access Control (RBAC) Matrix

| Operational Action | MUNICIPAL_ADMIN | DEPT_HEAD | COMPLIANCE_AUDITOR | FIELD_OFFICER | CITIZEN |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **City-wide Executive Analytics** | Full Access | Department Scoped | Read-Only | No | No |
| **Department Scorecard & SLA** | All Depts | Own Dept Only | Read-Only | No | No |
| **Field Task Execution & Proofs** | Yes | Yes | No | Own Assigned Ward | No |
| **Citizen Self-Service & Lodging** | View All | View Dept | No | No | Own Filings Only |
| **Public Docket Search** | Yes | Yes | Yes | Yes | Public Access |
| **Budget & Revenue Accounting** | Full ($47M) | Dept Quota | Audit View | No | Tax Receipts Only |
| **Audit Log & Export (PDF/CSV)** | Full Admin | Dept Logs | Full Regulatory | No | Personal History |

### 4.1 Role Descriptions

1. **`MUNICIPAL_ADMIN`**: Headquarters-level administrator with comprehensive privileges across all wards, revenue streams, and user administration.
2. **`DEPT_HEAD`**: Departmental supervisor managing a specific utility domain (e.g. Water Management). Monitors SLA adherence, acoustic sensors, and work orders.
3. **`COMPLIANCE_AUDITOR`**: Regulatory oversight officer with read-only audit privileges, compliance telemetry inspection, and immutable ledger export capabilities.
4. **`FIELD_OFFICER`**: Ground field unit officer managing ward work orders, uploading completion proofs, and resolving dockets.
5. **`CITIZEN`**: Resident self-service portal user. Can submit applications, file geotagged grievances, view payment receipts, and submit 1-5 star CSAT feedback.

---

## 5. Security & Transaction Audit Trail

- **BCrypt Encryption**: Passwords hashed with standard 10-round salt rounds.
- **JWT Authorization**: All secured API requests validate Bearer tokens in the `Authorization` header.
- **Dynamic CORS Isolation**: Configured via `FRONTEND_URL` to restrict cross-origin requests exclusively to trusted domains (`https://civicpulse-portal.onrender.com`).
- **Immutable Audit Logging**: Every registration, login, status transition, and budget disbursement writes an audit row to `compliance_audit_logs` recording the user, action, timestamp, and client IP address.

---

## 6. Setup & Local Execution Guide

### 6.1 Prerequisites
- **Java Development Kit (JDK)**: 17 or higher
- **Apache Maven**: 3.8 or higher
- **Node.js**: 18.x or higher, with npm
- **MySQL**: 8.0+ (or cloud Aiven MySQL instance)

### 6.2 Running Backend Locally
```bash
cd backend
mvn clean compile
mvn spring-boot:run
```
*Backend initializes at `http://localhost:8080`. Automated health check responds at `http://localhost:8080/health`.*

### 6.3 Running Frontend Locally
```bash
cd frontend
npm install
npm run dev -- --port 5173
```
*Frontend launches at `http://localhost:5173` with instant Vite Hot Module Replacement.*

---

## 7. REST API Endpoints Specification

| Method | Endpoint | Authorization | Description & Functionality |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` / `/api/v1/health` | **Public** | Health diagnostic returning DB status, engine version, and uptime. |
| `POST` | `/api/v1/auth/register` | **Public** | Registers a new resident account and initializes an empty citizen docket. |
| `POST` | `/api/v1/auth/login` | **Public** | Authenticates user credentials and returns signed JWT access token. |
| `GET` | `/api/v1/auth/me` | **Authenticated** | Returns currently authenticated user profile and assigned ward/department. |
| `GET` | `/api/v1/public/track/{id}` | **Public** | Public docket lookup for grievances (`GRV-...`) and services (`SR-...`). |
| `GET` | `/api/v1/analytics/governance-kpis` | **Authenticated** | Returns city-wide aggregated SLA, satisfaction, and revenue metrics. |
| `GET` | `/api/v1/grievances` | **Authenticated** | Returns role-scoped grievance complaints (filtered by citizen, ward, or dept). |
| `POST` | `/api/v1/grievances` | **Citizen / Admin** | Lodges a new geotagged grievance docket with statutory SLA assignment. |
| `PATCH`| `/api/v1/grievances/{id}/status` | **Staff / Admin** | Updates grievance status (`IN_PROGRESS`, `RESOLVED`, `WITHDRAWN`) with notes. |
| `GET` | `/api/v1/services` | **Authenticated** | Queries municipal service requests across all city departments. |
| `POST` | `/api/v1/services` | **Citizen / Admin** | Submits a new application for utility connections or tax assessment. |
| `GET` | `/api/v1/revenue/summary` | **Admin / Auditor** | Returns revenue breakdown across Property Tax, Licenses, and Fees. |
| `GET` | `/api/v1/budget/summary` | **Admin / Auditor** | Returns municipal capital budget utilization and expenditure tracking. |
| `GET` | `/api/v1/departments/scorecard` | **Authenticated** | Returns performance scorecards and MTTR compliance across all 6 departments. |
| `GET` | `/api/v1/reports/audit-logs` | **Admin / Auditor** | Queries immutable compliance audit ledger with timestamp filters. |

---

## 8. Working Demo Credentials

| Role | Username | Password | Assigned Scope & Purpose |
| :--- | :--- | :--- | :--- |
| **Municipal Admin** | `admin` | `Admin@123` | Full city-wide cockpit, all departments, $47M budget, $12.4M revenue. |
| **Department Head (Water)** | `water_head` | `Water@123` | Water management telemetry, acoustic sensors, 94% SLA compliance. |
| **Compliance Auditor** | `auditor` | `Audit@123` | Read-only regulatory compliance inspection and audit trail exports. |
| **Field Officer** | `officer_ward4` | `Officer@123` | Ward 4 task queue, field work orders, photo resolution verification. |
| **Citizen (Public)** | `citizen_rahul` | `Citizen@123` | Resident self-service portal, docket tracker, and grievance filing. |

> **Live Deployment Tip**: On Render's free hosting tier, if the backend is waking from an idle state, please allow 30–45 seconds for container spin-up. Subsequent API requests execute with sub-50ms latency.
