# CivicPulse Nexus – Municipal Governance & Analytics Platform

CivicPulse Nexus is a full-stack Municipal Governance Management and Executive Analytics Platform designed to help municipal administrators oversee citizen records, service SLAs, grievance redressal, construction/trade permits, capital budgets, revenue streams, and department performance.

## Key Platform Highlights

- Executive Governance Dashboard: 
  - Citizen Satisfaction: `4.7/5` (Rating)
  - Service SLA: `94%` (Met)
  - Revenue Collected: `$12.4M`
- Analytics KPIs Overview:
  - Services: `24.7K requests | 94% resolved | Avg 2.4 days`
  - Grievances: `12.4K filed | 94% resolved | MTTR 47 hrs`
  - Revenue: `$12.4M | Property Tax 67% | Licenses 23% | Utilities 10%`
  - Budget: `$47M allocated | $41M utilized | 87%`
  - Departments: `Water 94% | Health 91% | Education 89% | Transport 88% | Public Works 86%`
  - Citizen SAT: `4.7/5 | Complaints ↓ 23% | Services ↑ 47%`
  - Actions: `[Export Report]`, `[Drill Down]`, `[Share]`

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.2.5 (Spring Web, Spring Data JPA, Hibernate)
- H2 In-Memory Database (switchable MySQL dialect support)
- Maven 3.9

### Frontend
- React 19
- Vite 8
- Recharts (Interactive Area, Bar, and Donut charts)
- Lucide Icons
- Axios (REST API layer with automatic failover fallback)
- Custom Modern Dark Design System matching `#0c584a` header banner and `#111827` card layouts.

## Running the Application

### 1. Spring Boot Backend
```bash
cd backend
mvn spring-boot:run
```
- Server URL: `http://localhost:8080`
- REST APIs: `http://localhost:8080/api/analytics/overview`
- H2 Console: `http://localhost:8080/h2-console`

### 2. React Frontend
```bash
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:5173/`

## Modules Included

1. Executive Dashboard: Real-time KPI summaries, drill-down modals, CSV/Excel export, and shareable reports.
2. Citizens Registry: Searchable directory by ward and National ID with citizen profiles and grievance histories.
3. Services Catalog: SLA tracking, fee schedule, request count, and turnaround monitoring.
4. Grievances & Redressal: Ticket tracking, priority categorization, status workflow (Submitted → In Progress → Resolved), and MTTR benchmarking.
5. Permits & Licensing: Trade and construction permit approvals, fee calculations, and validity inspection.
6. Budget Management: Departmental allocation vs utilization tracker ($47M allocated / $41M utilized).
7. Revenue Tracking: Tax yield analysis (Property tax 67%, Licenses 23%, Utilities 10%).
8. Reports & Compliance Audits: On-demand report generator with PDF/CSV export.
9. Analytics Validation Suite: Deep-dive charts for all 6 validation screens.
10. Administration & RBAC: Municipal user roles and immutable audit logging.
