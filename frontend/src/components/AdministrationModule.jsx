import React, { useState } from 'react';
import { UserCheck, Activity, ShieldCheck, Lock } from 'lucide-react';

export default function AdministrationModule() {
  const users = [
    { id: 1, username: 'admin', fullName: 'Municipal Administrator', email: 'admin@civicpulse.gov', role: 'MUNICIPAL_ADMIN', department: 'Executive Council', status: 'ACTIVE' },
    { id: 2, username: 'officer_water', fullName: 'David Chen', email: 'david.chen@civicpulse.gov', role: 'DEPT_HEAD', department: 'Water & Sanitation', status: 'ACTIVE' },
    { id: 3, username: 'officer_health', fullName: 'Dr. Sarah Jenkins', email: 'sarah.j@civicpulse.gov', role: 'DEPT_HEAD', department: 'Public Health', status: 'ACTIVE' },
    { id: 4, username: 'auditor', fullName: 'Elena Rostova', email: 'elena.r@civicpulse.gov', role: 'AUDITOR', department: 'Compliance & Audit', status: 'ACTIVE' },
    { id: 5, username: 'field_officer', fullName: 'Officer Jake Miller', email: 'jake.m@civicpulse.gov', role: 'FIELD_OFFICER', department: 'Public Works Operations', status: 'ACTIVE' },
    { id: 6, username: 'citizen_alex', fullName: 'Alexander Wright', email: 'a.wright@example.com', role: 'CITIZEN', department: 'Ward 1 Resident', status: 'ACTIVE' },
  ];

  const rbacMatrix = [
    { feature: 'Executive Dashboard & KPIs', admin: 'Full Access', deptHead: 'Dept Scoped', auditor: 'Read-Only', field: 'No Access', citizen: 'No Access' },
    { feature: 'Grievance Redressal', admin: 'Full Control', deptHead: 'Manage Dept', auditor: 'View & Audit', field: 'Update Status', citizen: 'Submit & Track Own' },
    { feature: 'Service Applications', admin: 'Full Control', deptHead: 'Manage Dept', auditor: 'View & Audit', field: 'Process Requests', citizen: 'Apply & View Own' },
    { feature: 'Revenue Tracking', admin: 'Full Control', deptHead: 'No Access', auditor: 'Read-Only Audit', field: 'No Access', citizen: 'Pay Fees' },
    { feature: 'Budget Allocations', admin: 'Full Control', deptHead: 'View Own Dept', auditor: 'Read-Only Audit', field: 'No Access', citizen: 'No Access' },
    { feature: 'Department Leaderboards', admin: 'Full Access', deptHead: 'Full Access', auditor: 'Read-Only', field: 'No Access', citizen: 'Public View' },
    { feature: 'Statutory Report Exports', admin: 'Generate & Share', deptHead: 'Generate Dept', auditor: 'Full Audit Export', field: 'No Access', citizen: 'No Access' },
    { feature: 'Compliance Audit Logs', admin: 'View Logs', deptHead: 'No Access', auditor: 'Full Audit Access', field: 'No Access', citizen: 'No Access' },
  ];

  const [logs] = useState([
    { id: 1, time: '2 mins ago', user: 'admin', role: 'MUNICIPAL_ADMIN', action: 'EXPORT', module: 'REPORTS', details: 'Exported Executive Governance Report PDF (Records: 24.7K)', ip: '192.168.1.10', status: 'SUCCESS' },
    { id: 2, time: '14 mins ago', user: 'officer_water', role: 'DEPT_HEAD', action: 'UPDATE', module: 'GRIEVANCES', details: 'Resolved GRV-2026-0891 (Water Pressure Elm St)', ip: '192.168.1.45', status: 'SUCCESS' },
    { id: 3, time: '45 mins ago', user: 'admin', role: 'MUNICIPAL_ADMIN', action: 'APPROVE', module: 'PERMITS', details: 'Approved Commercial Building Permit PMT-2026-4412 ($12.5K)', ip: '192.168.1.10', status: 'SUCCESS' },
    { id: 4, time: '2 hours ago', user: 'auditor', role: 'AUDITOR', action: 'DRILLDOWN', module: 'ANALYTICS', details: 'Generated Department Performance audit snapshot', ip: '192.168.1.88', status: 'SUCCESS' },
    { id: 5, time: '4 hours ago', user: 'field_officer', role: 'FIELD_OFFICER', action: 'INSPECTION', module: 'SERVICES', details: 'Completed onsite inspection for utility excavation PMT-4414', ip: '192.168.1.102', status: 'SUCCESS' },
    { id: 6, time: '6 hours ago', user: 'admin', role: 'MUNICIPAL_ADMIN', action: 'LOGIN', module: 'AUTH', details: 'Session authenticated via JWT token', ip: '192.168.1.10', status: 'SUCCESS' },
  ]);

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
          🔐 Role-Based Access Control (RBAC) & Compliance Audits
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
          Statutory security administration: Enforcing role-based access control, operator credential bounds, and non-repudiation audit trails.
        </p>
      </div>

      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Lock size={18} className="text-sky-400" />
          Statutory Role-Based Access Control (RBAC) Matrix
        </h2>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Feature / Governance Module</th>
                <th>Municipal Admin</th>
                <th>Department Head</th>
                <th>Compliance Auditor</th>
                <th>Field Officer</th>
                <th>Citizen</th>
              </tr>
            </thead>
            <tbody>
              {rbacMatrix.map((r, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600, color: '#f8fafc' }}>{r.feature}</td>
                  <td><span className="badge badge-green">{r.admin}</span></td>
                  <td><span className="badge badge-blue">{r.deptHead}</span></td>
                  <td><span className="badge badge-purple">{r.auditor}</span></td>
                  <td><span className={`badge ${r.field === 'No Access' ? 'badge-red' : 'badge-amber'}`}>{r.field}</span></td>
                  <td><span className={`badge ${r.citizen === 'No Access' ? 'badge-red' : 'badge-blue'}`}>{r.citizen}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserCheck size={18} className="text-emerald-400" />
          Authorized Municipal Personnel & Directory
        </h2>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Operator Name & Contact</th>
                <th>Assigned Role</th>
                <th>Departmental Boundary</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', color: '#38bdf8' }}>{u.username}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{u.fullName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{u.email}</div>
                  </td>
                  <td>
                    <span className="badge badge-purple">{u.role}</span>
                  </td>
                  <td>{u.department}</td>
                  <td>
                    <span className="badge badge-green">{u.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '1.1rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} className="text-emerald-400" />
            Immutable Compliance Audit Trail & Non-Repudiation Log
          </h2>
          <span className="badge badge-blue">Append-Only Active</span>
        </div>

        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Actor Identity</th>
                <th>Action Type</th>
                <th>Module</th>
                <th>Audit Details & State Diffs</th>
                <th>Origin IP</th>
                <th>Audit Result</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id}>
                  <td style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{l.time}</td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#f1f5f9' }}>{l.user}</span>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>{l.role}</span>
                  </td>
                  <td>
                    <span className="badge badge-blue">{l.action}</span>
                  </td>
                  <td>{l.module}</td>
                  <td style={{ color: '#cbd5e1' }}>{l.details}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#64748b' }}>{l.ip}</td>
                  <td>
                    <span className="badge badge-green">{l.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
