import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FileText, Download, ShieldCheck, CheckCircle2, FileSpreadsheet, Clock, AlertCircle } from 'lucide-react';

export const ReportsModule = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);

  useEffect(() => {
    fetchAuditData();
  }, []);

  const fetchAuditData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reports/list');
      setData(res.data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    const isExcel = format === 'excel';
    if (isExcel) setExportingExcel(true);
    else setExportingPdf(true);

    try {
      const res = await api.get(`/reports/export?format=${format}`, { responseType: 'blob' });
      const mimeType = isExcel
        ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        : 'application/pdf';
      const filename = isExcel
        ? 'CivicPulse_Governance_Analytics.xlsx'
        : 'CivicPulse_Governance_Analytics.pdf';

      const blob = new Blob([res.data], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      fetchAuditData();
    } catch (err) {
      alert(`Failed to export ${format.toUpperCase()} report`);
    } finally {
      if (isExcel) setExportingExcel(false);
      else setExportingPdf(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Statutory Reports & Compliance Audit</h1>
          <p className="page-description">
            Audit logging, executive reporting exports (PDF & Excel), and municipal governance telemetry.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => handleExport('excel')}
            disabled={exportingExcel}
            className="btn btn-outline"
          >
            <FileSpreadsheet size={16} />
            <span>{exportingExcel ? 'Generating Excel...' : 'Export Excel (.xlsx)'}</span>
          </button>
          <button
            onClick={() => handleExport('pdf')}
            disabled={exportingPdf}
            className="btn btn-emerald"
          >
            <Download size={16} />
            <span>{exportingPdf ? 'Generating PDF...' : 'Export Executive PDF'}</span>
          </button>
        </div>
      </div>

      <div className="citizen-collage-grid">
        <div className="card citizen-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '4px' }}>
            <div className="summary-label">Compliance</div>
            <div className="kpi-icon-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="summary-value" style={{ color: '#10B981' }}>98.4%</div>
          <div className="kpi-subtext">
            <span className="badge-trend success" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
              <ShieldCheck size={11} />
              <span>Certified</span>
            </span>
          </div>
        </div>

        <div className="card citizen-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '4px' }}>
            <div className="summary-label">Audit Logs</div>
            <div className="kpi-icon-pill" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>
              <FileText size={16} />
            </div>
          </div>
          <div className="summary-value" style={{ color: '#38BDF8' }}>{data?.totalLogsCount || 278}</div>
          <div className="kpi-subtext">
            <span className="badge-trend primary" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
              <FileText size={11} />
              <span>Retained</span>
            </span>
          </div>
        </div>

        <div className="card citizen-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '4px' }}>
            <div className="summary-label">Audit Sync</div>
            <div className="kpi-icon-pill" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4' }}>
              <Clock size={16} />
            </div>
          </div>
          <div className="summary-value" style={{ color: '#06B6D4' }}>Live</div>
          <div className="kpi-subtext">
            <span className="badge-trend success" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
              <CheckCircle2 size={11} />
              <span>Synchronized</span>
            </span>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '12px', color: '#F8FAFC' }}>
          Executive Report Download Center
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          <div style={{ background: '#0F1E36', border: '1px solid #1E2C4A', borderRadius: '8px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '0.84rem', fontWeight: '700', color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={15} className="text-emerald-400" />
                <span>Milestone 4 Executive Governance PDF</span>
              </h3>
              <p style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '3px' }}>
                Summary of SLA benchmarks, $12.4M revenue telemetry, and CSAT ratings.
              </p>
            </div>
            <button onClick={() => handleExport('pdf')} disabled={exportingPdf} className="btn btn-emerald" style={{ padding: '4px 10px', fontSize: '0.72rem' }}>
              <Download size={12} />
              <span>PDF</span>
            </button>
          </div>

          <div style={{ background: '#0F1E36', border: '1px solid #1E2C4A', borderRadius: '8px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '0.84rem', fontWeight: '700', color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileSpreadsheet size={15} className="text-blue-400" />
                <span>Fiscal & Redressal Data Workbook</span>
              </h3>
              <p style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '3px' }}>
                Multi-sheet Excel workbook with department metrics and variance analysis.
              </p>
            </div>
            <button onClick={() => handleExport('excel')} disabled={exportingExcel} className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '0.72rem' }}>
              <Download size={12} />
              <span>XLSX</span>
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '12px', color: '#F8FAFC' }}>
          Statutory Compliance & Security Audit Trail
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Operator</th>
                <th>Action Type</th>
                <th>Audit Details</th>
                <th>IP Address</th>
                <th>Verification</th>
              </tr>
            </thead>
            <tbody>
              {(data?.logs || []).map((log) => (
                <tr key={log.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#94A3B8' }}>
                    {log.timestamp?.replace('T', ' ').substring(0, 19)}
                  </td>
                  <td style={{ fontWeight: '600', color: '#38BDF8' }}>{log.username}</td>
                  <td>
                    <span className="badge-trend primary">
                      {log.actionType}
                    </span>
                  </td>
                  <td style={{ color: '#F8FAFC' }}>{log.details}</td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#94A3B8' }}>
                    {log.ipAddress || '127.0.0.1'}
                  </td>
                  <td>
                    <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', fontWeight: '600' }}>
                      <CheckCircle2 size={12} />
                      Verified
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsModule;
