# CivicPulse Nexus – Municipal Governance & Analytics Platform

Enterprise-grade municipal governance, urban service delivery, and citizen grievance redressal platform. Built with Spring Boot 3.2.5, React 18, Vite, and Aiven Cloud MySQL 8.4.

---

## 🌐 Live Deployments & Repository

- **Live Application**: [https://civicpulse-portal.onrender.com](https://civicpulse-portal.onrender.com)
- **Backend API**: [https://civicpulse-backend-xwsx.onrender.com](https://civicpulse-backend-xwsx.onrender.com)
- **Health Check**: [https://civicpulse-backend-xwsx.onrender.com/health](https://civicpulse-backend-xwsx.onrender.com/health)
- **GitHub Repository**: [https://github.com/sudhirkr2003/civicpulse-municipal-platform](https://github.com/sudhirkr2003/civicpulse-municipal-platform)

---

## 🏛️ System Overview

CivicPulse Nexus digitizes municipal interactions across city administrative wards and departments. It provides seamless public tracking for citizens and operational command centers for city administrators, department supervisors, compliance auditors, and field officers.

### Key Capabilities

- **Public Docket Tracking**: Real-time docket lookup by ticket ID (`GRV-...` or `SR-...`) with live status and resolution audit notes without requiring prior login.
- **5 Role-Based Operational Portals**: Dedicated portals for Municipal Administrators, Department Heads (Water, Health, Revenue, Roads), Compliance Auditors, Field Officers, and Residents.
- **Statutory SLA & MTTR Compliance**: Mean Time to Resolution calculation with 47-hour benchmark tracking and visual compliance indicators (94.0% SLA target achieved).
- **Municipal Treasury Accounting**: Real-time tracking of $12.4M municipal revenue collections across Property Tax (67%), Trade Licenses (23%), and Utility Fees (10%), alongside $47M allocated capital budgets.
- **Dual-Theme Design System**: Primary soft slate-gray light mode with architectural municipal watermarks alongside a high-contrast dark mode with instant switching and persistent state.
- **Immutable Audit Logging**: Every state change, login attempt, and financial disbursement is recorded in an audit trail table with IP logging.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Backend** | Java 17, Spring Boot 3.2.5, Spring Security 6, Spring Data JPA, Hibernate ORM |
| **Frontend** | React 18, Vite 5.4, Vanilla CSS Design System, Lucide Icons, Recharts |
| **Database** | Aiven Cloud Managed MySQL 8.4 (SSL Enforced) / H2 In-Memory for Local Dev |
| **Authentication** | Stateless JWT (HMAC-SHA256) + BCrypt Password Hashing + HTTP-Only Cookies |
| **Caching** | Caffeine In-Memory Cache for Real-Time Governance KPIs |
| **Deployment** | Docker Containerization on Render Web Service & Render Static Site |

---

## 🏗️ Architecture

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

## 👥 Role-Based Access Control (RBAC)

The platform supports 5 distinct role tiers:

1. **Municipal Administrator (`MUNICIPAL_ADMIN`)**: City-wide command cockpit, full access across all 6 departments, budget disbursement oversight, and user management.
2. **Department Head (`DEPT_HEAD`)**: Department-specific telemetry and analytics (e.g., Water Management, Roads, Health), field inspection reviews, and departmental SLA monitoring.
3. **Compliance Auditor (`COMPLIANCE_AUDITOR`)**: Read-only oversight across all municipal transactions, statutory SLA compliance verification, and regulatory report exports.
4. **Field Officer (`FIELD_OFFICER`)**: Ward-level task execution queue, on-site inspection logging, resolution notes, and docket verification.
5. **Citizen (`CITIZEN`)**: Resident self-service portal, grievance lodging with category tagging, municipal service applications, and tax assessment view.

---

## 🚀 Local Development Setup

### Prerequisites

- Java Development Kit (JDK) 17+
- Apache Maven 3.8+
- Node.js 18+ and npm
- MySQL 8.0+ or default auto-configured database

### 1. Start Backend REST API

```bash
cd backend
mvn clean compile
mvn spring-boot:run
```

- REST API runs at: `http://localhost:8080`
- Public Health Check: `http://localhost:8080/health`

### 2. Start Frontend Web Application

```bash
cd frontend
npm install
npm run dev -- --port 5173
```

- Frontend launches at: `http://localhost:5173`

---

## 📡 REST API Summary

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Public | System health check and database connection status |
| `POST` | `/api/v1/auth/register` | Public | Resident self-registration |
| `POST` | `/api/v1/auth/login` | Public | User authentication and JWT generation |
| `GET` | `/api/v1/auth/me` | Authenticated | Current authenticated user profile |
| `GET` | `/api/v1/public/track/{id}` | Public | Public docket lookup for grievances and services |
| `GET` | `/api/v1/analytics/governance-kpis` | Authenticated | Executive city-wide governance KPIs |
| `GET` | `/api/v1/grievances` | Authenticated | Grievance dockets scoped by role |
| `POST` | `/api/v1/grievances` | Citizen / Admin | Lodge new grievance docket |
| `PATCH` | `/api/v1/grievances/{id}/status` | Staff / Admin | Update grievance resolution status |
| `GET` | `/api/v1/services` | Authenticated | Municipal service requests catalog |
| `GET` | `/api/v1/revenue/summary` | Admin / Auditor | Revenue collection by source |
| `GET` | `/api/v1/budget/summary` | Admin / Auditor | Department budget allocation vs utilization |
| `GET` | `/api/v1/departments/scorecard` | Authenticated | 6-department performance scorecard and MTTR |
| `GET` | `/api/v1/reports/audit-logs` | Admin / Auditor | Immutable compliance audit ledger |

---

## 📄 Documentation

- Full Technical Specification: [DOCUMENTATION.md](DOCUMENTATION.md)
- Printable Architecture Report: [DOCUMENTATION.html](DOCUMENTATION.html)
