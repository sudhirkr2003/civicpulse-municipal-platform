import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  Download,
  Share2,
  Maximize2,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  DollarSign,
  Smile,
  Clock,
  Layers,
  Building,
  Activity,
  AlertTriangle,
  X,
  Copy,
  Check
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export const ExecutiveDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [drillDownOpen, setDrillDownOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareData, setShareData] = useState(null);
  const [drillDownData, setDrillDownData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/analytics/dashboard');
      setData(res.data);
    } catch (err) {
      setData({
        citizenSatisfaction: 4.7,
        satisfactionTrend: 'Complaints \u2193 23%',
        serviceSlaPercentage: 94.0,
        targetSlaPercentage: 90.0,
        revenueCollectedMillions: 12.4,
        revenueSurplus: '+4.2%',
        governanceKpis: {
          servicesSummary: '24.7K requests | 94% resolved | Avg 2.4 days',
          grievancesSummary: '12.4K filed | 94% resolved | MTTR 47 hrs',
          revenueSummary: '$12.4M | Property Tax 67% | Licenses 23% | Others 10%',
          budgetSummary: '$47M allocated | $41M utilized | 87%',
          departmentsSummary: 'Water 94% | Health 91% | Education 89%',
          citizenSatSummary: '4.7/5 | Complaints \u2193 23% | Services \u2191 47%',
        },
        departmentPerformance: [
          { departmentId: 1, departmentName: 'Water Management', departmentCode: 'WTR', directorName: 'Dr. Robert Sterling', currentSlaPerformance: 94.0, targetSlaPercentage: 90.0, budgetAllocated: 12.5, budgetUtilized: 11.2 },
          { departmentId: 2, departmentName: 'Public Health', departmentCode: 'HLT', directorName: 'Dr. Evelyn Vance', currentSlaPerformance: 91.0, targetSlaPercentage: 90.0, budgetAllocated: 10.2, budgetUtilized: 8.9 },
          { departmentId: 3, departmentName: 'Civic Education', departmentCode: 'EDU', directorName: 'Marcus Thorne', currentSlaPerformance: 89.0, targetSlaPercentage: 90.0, budgetAllocated: 8.7, budgetUtilized: 7.8 },
          { departmentId: 4, departmentName: 'Roads & Infrastructure', departmentCode: 'RDS', directorName: 'Elena Rostova', currentSlaPerformance: 86.0, targetSlaPercentage: 85.0, budgetAllocated: 9.8, budgetUtilized: 8.4 },
          { departmentId: 5, departmentName: 'Revenue & Treasury', departmentCode: 'REV', directorName: 'Claire Beauchamp', currentSlaPerformance: 95.0, targetSlaPercentage: 92.0, budgetAllocated: 5.8, budgetUtilized: 4.7 },
        ],
        wardPerformance: [
          { wardName: 'Ward 1 - Downtown Metro', population: 145000, serviceRequests: 6200, grievancesCount: 2100, slaPercentage: 96.2, satisfactionRating: 4.8, revenueCollected: 3850000 },
          { wardName: 'Ward 2 - Riverside North', population: 112000, serviceRequests: 4800, grievancesCount: 1950, slaPercentage: 94.5, satisfactionRating: 4.7, revenueCollected: 2740000 },
          { wardName: 'Ward 3 - Highland Park', population: 98000, serviceRequests: 3900, grievancesCount: 1620, slaPercentage: 93.8, satisfactionRating: 4.6, revenueCollected: 2190000 },
          { wardName: 'Ward 4 - Tech Corridor', population: 134000, serviceRequests: 5300, grievancesCount: 2480, slaPercentage: 95.1, satisfactionRating: 4.8, revenueCollected: 3120000 },
          { wardName: 'Ward 5 - Industrial Valley', population: 82000, serviceRequests: 2600, grievancesCount: 2350, slaPercentage: 91.4, satisfactionRating: 4.4, revenueCollected: 1850000 },
          { wardName: 'Ward 6 - Harborview Heights', population: 76000, serviceRequests: 1900, grievancesCount: 1900, slaPercentage: 93.1, satisfactionRating: 4.6, revenueCollected: 1650000 },
        ],
        monthlyTrends: [
          { month: 'Jan', requests: 3800, resolved: 3500, sla: 92.1, complaints: 2400, revenue: 1.8 },
          { month: 'Feb', requests: 4100, resolved: 3850, sla: 93.9, complaints: 2250, revenue: 2.1 },
          { month: 'Mar', requests: 3950, resolved: 3720, sla: 94.2, complaints: 2100, revenue: 2.3 },
          { month: 'Apr', requests: 4300, resolved: 4050, sla: 94.1, complaints: 1980, revenue: 1.9 },
          { month: 'May', requests: 4250, resolved: 4010, sla: 94.4, complaints: 1870, revenue: 2.0 },
          { month: 'Jun', requests: 4300, resolved: 4070, sla: 94.7, complaints: 1800, revenue: 2.3 },
        ],
        revenueBreakdown: [
          { category: 'Property Tax', amount: 8.31, percentage: 67.0, color: '#10B981' },
          { category: 'Business Licenses', amount: 2.85, percentage: 23.0, color: '#3B82F6' },
          { category: 'Permits & Others', amount: 1.24, percentage: 10.0, color: '#F59E0B' },
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportPdf = async () => {
    try {
      setExporting(true);
      const res = await api.get('/reports/export?format=pdf', { responseType: 'blob' });
      const blob = new Blob([res.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'CivicPulse_Governance_Analytics.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Unable to generate PDF report.');
    } finally {
      setExporting(false);
    }
  };

  const handleOpenDrillDown = async () => {
    setDrillDownOpen(true);
    try {
      const res = await api.get('/analytics/drill-down');
      setDrillDownData(res.data);
    } catch (err) {
      setDrillDownData({
        departmentDeepDive: [
          { department: 'Water Management', totalStaff: 340, activeSensors: 1420, leakDetectionsResolved: 98.4, budgetEfficiency: 89.6 },
          { department: 'Public Health', totalStaff: 420, activeClinics: 38, vaccinationCompliance: 96.1, budgetEfficiency: 87.2 },
          { department: 'Civic Education', totalStaff: 510, activeSchools: 45, studentEnrollmentRate: 98.8, budgetEfficiency: 89.7 },
          { department: 'Roads & Infrastructure', totalStaff: 290, potholeRepairsAvgHours: 18.2, roadMaintenanceMiles: 450, budgetEfficiency: 85.7 },
          { department: 'Revenue & Treasury', totalStaff: 180, ePaymentAdoptionRate: 91.5, auditComplianceRate: 99.8, budgetEfficiency: 81.0 }
        ]
      });
    }
  };

  const handleOpenShare = async () => {
    setShareOpen(true);
    try {
      const res = await api.get('/analytics/share-link');
      setShareData(res.data);
    } catch (err) {
      setShareData({
        shareUrl: 'http://localhost:5173/dashboard?viewToken=read-only-civic-2026',
        token: 'read-only-civic-2026',
        expiresAt: '2026-10-08T12:00:00',
        accessType: 'READ_ONLY_EXECUTIVE'
      });
    }
  };

  const handleCopyLink = () => {
    if (shareData?.shareUrl) {
      navigator.clipboard.writeText(shareData.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading && !data) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{ color: '#10B981', fontSize: '1.1rem', fontWeight: '600' }}>Loading Governance Analytics Telemetry...</div>
      </div>
    );
  }

  const kpis = data?.governanceKpis || {};

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '14px' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '1.35rem', fontWeight: '800' }}>
            Executive Governance Analytics
          </h1>
          <p className="page-description" style={{ fontSize: '0.8rem', marginTop: '2px' }}>
            Real-time municipal performance telemetry, SLA compliance tracking, and revenue benchmarks.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          <button onClick={handleExportPdf} disabled={exporting} className="btn btn-emerald" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
            <Download size={14} />
            <span>{exporting ? 'Exporting...' : 'Export Report'}</span>
          </button>
        </div>
      </div>

      <div className="citizen-collage-grid">
        <div className="card citizen-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '4px' }}>
            <div className="summary-label">Citizen SAT</div>
            <div className="kpi-icon-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
              <Smile size={16} />
            </div>
          </div>
          <div className="summary-value" style={{ color: '#10B981' }}>{data?.citizenSatisfaction || 4.7}/5</div>
          <div className="kpi-subtext">
            <span className="badge-trend success" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
              <TrendingDown size={11} />
              <span>{data?.satisfactionTrend || 'Complaints ↓ 23%'}</span>
            </span>
          </div>
        </div>

        <div className="card citizen-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '4px' }}>
            <div className="summary-label">Service SLA</div>
            <div className="kpi-icon-pill" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="summary-value" style={{ color: '#38BDF8' }}>{data?.serviceSlaPercentage || 94}%</div>
          <div className="kpi-subtext">
            <span className="badge-trend primary" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
              <CheckCircle2 size={11} />
              <span>Target: {data?.targetSlaPercentage || 90}%</span>
            </span>
          </div>
        </div>

        <div className="card citizen-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '4px' }}>
            <div className="summary-label">Revenue</div>
            <div className="kpi-icon-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
              <DollarSign size={16} />
            </div>
          </div>
          <div className="summary-value" style={{ color: '#F8FAFC' }}>${data?.revenueCollectedMillions || 12.4}M</div>
          <div className="kpi-subtext">
            <span className="badge-trend success" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
              <TrendingUp size={11} />
              <span>{data?.revenueSurplus || '+4.2%'}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="governance-panel" style={{ padding: '10px 12px', marginBottom: '14px' }}>
        <div className="governance-panel-title" style={{ fontSize: '0.82rem', marginBottom: '8px' }}>
          <Activity size={14} style={{ color: '#10B981' }} />
          <span>Analytics Dashboard - Governance KPIs</span>
        </div>

        <div className="telemetry-row" style={{ padding: '5px 8px', marginBottom: '5px' }}>
          <div className="telemetry-key" style={{ fontSize: '0.72rem', gap: '6px' }}>
            <Layers size={13} />
            <span>Services:</span>
          </div>
          <div className="telemetry-val" style={{ fontSize: '0.70rem' }}>
            {kpis.servicesSummary || '24.7K requests | 94% resolved | Avg 2.4 days'}
          </div>
        </div>

        <div className="telemetry-row" style={{ padding: '5px 8px', marginBottom: '5px' }}>
          <div className="telemetry-key" style={{ fontSize: '0.72rem', gap: '6px' }}>
            <AlertTriangle size={13} />
            <span>Grievances:</span>
          </div>
          <div className="telemetry-val" style={{ fontSize: '0.70rem' }}>
            {kpis.grievancesSummary || '12.4K filed | 94% resolved | MTTR 47 hrs'}
          </div>
        </div>

        <div className="telemetry-row" style={{ padding: '5px 8px', marginBottom: '5px' }}>
          <div className="telemetry-key" style={{ fontSize: '0.72rem', gap: '6px' }}>
            <DollarSign size={13} />
            <span>Revenue:</span>
          </div>
          <div className="telemetry-val" style={{ fontSize: '0.70rem' }}>
            {kpis.revenueSummary || '$12.4M | Property Tax 67% | Licenses 23% | Others 10%'}
          </div>
        </div>

        <div className="telemetry-row" style={{ padding: '5px 8px', marginBottom: '5px' }}>
          <div className="telemetry-key" style={{ fontSize: '0.72rem', gap: '6px' }}>
            <Building size={13} />
            <span>Budget:</span>
          </div>
          <div className="telemetry-val" style={{ fontSize: '0.70rem' }}>
            {kpis.budgetSummary || '$47M allocated | $41M utilized | 87%'}
          </div>
        </div>

        <div className="telemetry-row" style={{ padding: '5px 8px', marginBottom: '5px' }}>
          <div className="telemetry-key" style={{ fontSize: '0.72rem', gap: '6px' }}>
            <Activity size={13} />
            <span>Departments:</span>
          </div>
          <div className="telemetry-val" style={{ fontSize: '0.70rem' }}>
            {kpis.departmentsSummary || 'Water 94% | Health 91% | Education 89%'}
          </div>
        </div>

        <div className="telemetry-row" style={{ padding: '5px 8px', marginBottom: '5px' }}>
          <div className="telemetry-key" style={{ fontSize: '0.72rem', gap: '6px' }}>
            <Smile size={13} />
            <span>Citizen SAT:</span>
          </div>
          <div className="telemetry-val" style={{ fontSize: '0.70rem' }}>
            {kpis.citizenSatSummary || '4.7/5 | Complaints ↓ 23% | Services ↑ 47%'}
          </div>
        </div>

        <div className="action-bar" style={{ marginTop: '10px', paddingTop: '10px', gap: '8px' }}>
          <button onClick={handleExportPdf} disabled={exporting} className="btn btn-emerald" style={{ padding: '5px 10px', fontSize: '0.74rem' }}>
            <Download size={13} />
            <span>Export Report</span>
          </button>
          <button onClick={handleOpenDrillDown} className="btn btn-primary" style={{ padding: '5px 10px', fontSize: '0.74rem' }}>
            <Maximize2 size={13} />
            <span>Drill Down</span>
          </button>
          <button onClick={handleOpenShare} className="btn btn-outline" style={{ padding: '5px 10px', fontSize: '0.74rem' }}>
            <Share2 size={13} />
            <span>Share</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '16px', marginBottom: '20px' }}>
        <div className="card" style={{ padding: '14px 16px' }}>
          <h2 style={{ fontSize: '0.86rem', fontWeight: '700', marginBottom: '10px', color: '#F8FAFC' }}>
            Municipal SLA Compliance & Request Volume Trends
          </h2>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.monthlyTrends || []}>
                <defs>
                  <linearGradient id="slaColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="reqColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2C4A" />
                <XAxis dataKey="month" stroke="#94A3B8" />
                <YAxis stroke="#94A3B8" />
                <Tooltip contentStyle={{ background: '#0F1E36', borderColor: '#1E2C4A', color: '#F8FAFC', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="requests" name="Total Requests" stroke="#3B82F6" fillOpacity={1} fill="url(#reqColor)" />
                <Area type="monotone" dataKey="resolved" name="Resolved Requests" stroke="#10B981" fillOpacity={1} fill="url(#slaColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', color: '#F8FAFC' }}>
            Revenue Stream Composition ($12.4M)
          </h2>
          <div style={{ width: '100%', height: 260, display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.revenueBreakdown || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="amount"
                >
                  {(data?.revenueBreakdown || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#3B82F6'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0F1E36', borderColor: '#1E2C4A', color: '#F8FAFC', borderRadius: '8px' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#F8FAFC' }}>
            Departmental SLA Governance Scorecard
          </h2>
          <span style={{ fontSize: '0.8rem', color: '#10B981', background: 'rgba(16, 185, 129, 0.12)', padding: '4px 10px', borderRadius: '6px' }}>
            5 Departments Active
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>Department Name</th>
                <th>Director</th>
                <th>Current SLA</th>
                <th>Target SLA</th>
                <th>Compliance Status</th>
                <th>Budget Utilized</th>
              </tr>
            </thead>
            <tbody>
              {(data?.departmentPerformance || []).map((dept) => {
                const isMet = dept.currentSlaPerformance >= dept.targetSlaPercentage;
                return (
                  <tr key={dept.departmentId}>
                    <td style={{ fontWeight: '600' }}>{dept.departmentName}</td>
                    <td style={{ color: '#94A3B8' }}>{dept.directorName}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ color: isMet ? '#10B981' : '#F59E0B' }}>{dept.currentSlaPerformance}%</strong>
                        <div style={{ width: '60px', height: '6px', background: '#1E2C4A', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${dept.currentSlaPerformance}%`, height: '100%', background: isMet ? '#10B981' : '#F59E0B' }}></div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: '#94A3B8' }}>{dept.targetSlaPercentage}%</td>
                    <td>
                      <span className={`badge-trend ${isMet ? 'success' : 'danger'}`}>
                        {isMet ? 'COMPLIANT' : 'UNDER REVIEW'}
                      </span>
                    </td>
                    <td>${dept.budgetUtilized}M / ${dept.budgetAllocated}M</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '16px', color: '#F8FAFC' }}>
          Ward-Level Telemetry Breakdown
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>Ward Jurisdiction</th>
                <th>Population</th>
                <th>Service Requests</th>
                <th>Grievances</th>
                <th>SLA Compliance</th>
                <th>CSAT Rating</th>
                <th>Revenue Generated</th>
              </tr>
            </thead>
            <tbody>
              {(data?.wardPerformance || []).map((w, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: '600', color: '#38BDF8' }}>{w.wardName}</td>
                  <td>{w.population.toLocaleString()}</td>
                  <td>{w.serviceRequests.toLocaleString()}</td>
                  <td>{w.grievancesCount.toLocaleString()}</td>
                  <td>
                    <span style={{ color: '#10B981', fontWeight: '600' }}>{w.slaPercentage}%</span>
                  </td>
                  <td>{w.satisfactionRating} / 5.0</td>
                  <td>${(w.revenueCollected / 1000000).toFixed(2)}M</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {drillDownOpen && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #1E2C4A', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', color: '#F8FAFC' }}>
                  Departmental Operational Drill-Down
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>In-depth resource allocation and statutory audit metrics</p>
              </div>
              <button onClick={() => setDrillDownOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              {(drillDownData?.departmentDeepDive || []).map((item, i) => (
                <div key={i} style={{ background: '#0F1E36', border: '1px solid #1E2C4A', borderRadius: '10px', padding: '16px' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#10B981', marginBottom: '8px' }}>{item.department}</h4>
                  <div style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div>Staff Allocated: <strong style={{ color: '#F8FAFC' }}>{item.totalStaff}</strong></div>
                    <div>Budget Efficiency: <strong style={{ color: '#10B981' }}>{item.budgetEfficiency}%</strong></div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setDrillDownOpen(false)} className="btn btn-emerald">
                Close Drill Down
              </button>
            </div>
          </div>
        </div>
      )}

      {shareOpen && (
        <div className="modal-backdrop">
          <div className="modal-box" style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '8px', borderRadius: '8px', color: '#3B82F6' }}>
                  <Share2 size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#F8FAFC' }}>Share Executive Dashboard</h3>
                  <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Secure, time-bound read-only link for City Council</p>
                </div>
              </div>
              <button onClick={() => setShareOpen(false)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ background: '#0A0F1D', border: '1px solid #1E2C4A', borderRadius: '8px', padding: '12px', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '4px' }}>SECURE ACCESS URL</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#38BDF8', wordBreak: 'break-all' }}>
                {shareData?.shareUrl || 'http://localhost:5173/dashboard?viewToken=...'}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Valid for 7 days (Statutory)</span>
              <button onClick={handleCopyLink} className="btn btn-primary">
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Share Link'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExecutiveDashboard;
