import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Building2, CheckCircle2, DollarSign, Activity, AlertTriangle, Layers, Clock } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const DepartmentDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeptData();
  }, []);

  const fetchDeptData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/departments/performance');
      setData(res.data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const waterMonthlyTrends = [
    { month: 'Jan', requests: 1100, resolved: 1040, sla: 93.5 },
    { month: 'Feb', requests: 1250, resolved: 1180, sla: 94.1 },
    { month: 'Mar', requests: 1190, resolved: 1130, sla: 94.0 },
    { month: 'Apr', requests: 1300, resolved: 1230, sla: 94.3 },
    { month: 'May', requests: 1280, resolved: 1210, sla: 94.5 },
    { month: 'Jun', requests: 1320, resolved: 1250, sla: 94.7 },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Water Management Department Portal</h1>
          <p className="page-description">
            Scoped departmental supervisor cockpit: Water SLA telemetry, leak redressal, and dedicated fiscal ledger.
          </p>
        </div>
        <div style={{ background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.3)', padding: '6px 14px', borderRadius: '8px', color: '#06B6D4', fontSize: '0.85rem', fontWeight: '600' }}>
          Director: Dr. Robert Sterling
        </div>
      </div>

      <div className="citizen-collage-grid">
        <div className="card citizen-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '4px' }}>
            <div className="summary-label">Dept SLA</div>
            <div className="kpi-icon-pill" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4' }}>
              <Building2 size={16} />
            </div>
          </div>
          <div className="summary-value" style={{ color: '#06B6D4' }}>94.0%</div>
          <div className="kpi-subtext">
            <span className="badge-trend success" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
              <CheckCircle2 size={11} />
              <span>+4% Over Target</span>
            </span>
          </div>
        </div>

        <div className="card citizen-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '4px' }}>
            <div className="summary-label">Dept Budget</div>
            <div className="kpi-icon-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
              <DollarSign size={16} />
            </div>
          </div>
          <div className="summary-value" style={{ color: '#10B981' }}>$11.2M</div>
          <div className="kpi-subtext">
            <span className="badge-trend success" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
              <DollarSign size={11} />
              <span>89.6% Burn Rate</span>
            </span>
          </div>
        </div>

        <div className="card citizen-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '4px' }}>
            <div className="summary-label">Field Tasks</div>
            <div className="kpi-icon-pill" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>
              <Activity size={16} />
            </div>
          </div>
          <div className="summary-value" style={{ color: '#38BDF8' }}>210</div>
          <div className="kpi-subtext">
            <span className="badge-trend primary" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
              <Activity size={11} />
              <span>98.4% Resolved</span>
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="card">
          <h2 style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '12px', color: '#F8FAFC' }}>
            Water Service Request SLA Trends
          </h2>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={waterMonthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2C4A" />
                <XAxis dataKey="month" stroke="#94A3B8" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis stroke="#94A3B8" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip contentStyle={{ background: '#0F1E36', borderColor: '#1E2C4A', color: '#F8FAFC', borderRadius: '8px', fontSize: '0.74rem' }} />
                <Area type="monotone" dataKey="requests" name="Total Volume" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
                <Area type="monotone" dataKey="resolved" name="Resolved" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '12px', color: '#F8FAFC' }}>
            Water Department Operational Sub-Metrics
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="telemetry-row" style={{ padding: '6px 10px' }}>
              <span className="telemetry-key" style={{ fontSize: '0.72rem' }}>Acoustic Leak Detection:</span>
              <span className="telemetry-val" style={{ fontSize: '0.70rem' }}>98.4% Resolution Efficiency</span>
            </div>
            <div className="telemetry-row" style={{ padding: '6px 10px' }}>
              <span className="telemetry-key" style={{ fontSize: '0.72rem' }}>Smart Meters Installed:</span>
              <span className="telemetry-val" style={{ fontSize: '0.70rem' }}>42,800 Endpoints Online</span>
            </div>
            <div className="telemetry-row" style={{ padding: '6px 10px' }}>
              <span className="telemetry-key" style={{ fontSize: '0.72rem' }}>Chlorine & Purity Index:</span>
              <span className="telemetry-val" style={{ fontSize: '0.70rem' }}>99.8% Potability Standard</span>
            </div>
            <div className="telemetry-row" style={{ padding: '6px 10px' }}>
              <span className="telemetry-key" style={{ fontSize: '0.72rem' }}>Average Repair Time:</span>
              <span className="telemetry-val" style={{ fontSize: '0.70rem' }}>2.1 Days (Benchmark 3.0d)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDashboard;
