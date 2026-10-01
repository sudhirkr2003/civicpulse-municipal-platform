import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Building2, Award, CheckCircle2, TrendingUp, ShieldCheck, AlertCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from 'recharts';

export const DepartmentScorecardModule = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartmentData();
  }, []);

  const fetchDepartmentData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/departments/performance');
      setData(res.data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Department Performance & Rankings</h1>
          <p className="page-description">
            Inter-departmental governance leaderboard, SLA compliance comparisons, and statutory accountability metrics.
          </p>
        </div>
      </div>

      <div className="citizen-collage-grid">
        <div className="card citizen-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '4px' }}>
            <div className="summary-label">Top Dept</div>
            <div className="kpi-icon-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
              <Award size={16} />
            </div>
          </div>
          <div className="summary-value" style={{ color: '#10B981', fontSize: '1.05rem' }}>Revenue (95%)</div>
          <div className="kpi-subtext">
            <span className="badge-trend success" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
              <Award size={11} />
              <span>#1 Leader</span>
            </span>
          </div>
        </div>

        <div className="card citizen-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '4px' }}>
            <div className="summary-label">Water Dept</div>
            <div className="kpi-icon-pill" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4' }}>
              <Building2 size={16} />
            </div>
          </div>
          <div className="summary-value" style={{ color: '#06B6D4' }}>94.0%</div>
          <div className="kpi-subtext">
            <span className="badge-trend success" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
              <CheckCircle2 size={11} />
              <span>+4% Target</span>
            </span>
          </div>
        </div>

        <div className="card citizen-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '4px' }}>
            <div className="summary-label">Health & Edu</div>
            <div className="kpi-icon-pill" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>
              <ShieldCheck size={16} />
            </div>
          </div>
          <div className="summary-value" style={{ color: '#38BDF8' }}>91% & 89%</div>
          <div className="kpi-subtext">
            <span className="badge-trend primary" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
              <ShieldCheck size={11} />
              <span>Compliant</span>
            </span>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '12px', color: '#F8FAFC' }}>
          Inter-Departmental SLA Compliance vs Statutory Targets
        </h2>
        <div style={{ width: '100%', height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.comparativeMetrics || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E2C4A" />
              <XAxis dataKey="name" stroke="#94A3B8" tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <YAxis stroke="#94A3B8" domain={[70, 100]} unit="%" tick={{ fontSize: 10, fill: '#94A3B8' }} />
              <Tooltip contentStyle={{ background: '#0F1E36', borderColor: '#1E2C4A', color: '#F8FAFC', borderRadius: '8px', fontSize: '0.74rem' }} />
              <Bar dataKey="sla" name="Current SLA Performance (%)" fill="#10B981" radius={[4, 4, 0, 0]}>
                {(data?.comparativeMetrics || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || '#10B981'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '12px', color: '#F8FAFC' }}>
          Municipal Department Performance Leaderboard
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Department Name</th>
                <th>Director</th>
                <th>Current SLA</th>
                <th>Statutory Target</th>
                <th>SLA Variance</th>
                <th>Budget Allocation</th>
              </tr>
            </thead>
            <tbody>
              {(data?.leaderboard || []).map((dept, index) => {
                const variance = (dept.currentSlaPerformance - dept.targetSlaPercentage).toFixed(1);
                const isPositive = parseFloat(variance) >= 0;
                return (
                  <tr key={dept.departmentId}>
                    <td style={{ fontWeight: '700', color: index === 0 ? '#10B981' : '#94A3B8' }}>
                      #{index + 1}
                    </td>
                    <td style={{ fontWeight: '600', color: '#38BDF8' }}>{dept.departmentName}</td>
                    <td style={{ color: '#94A3B8' }}>{dept.directorName}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ color: isPositive ? '#10B981' : '#F59E0B' }}>
                          {dept.currentSlaPerformance}%
                        </strong>
                        <div style={{ width: '60px', height: '6px', background: '#1E2C4A', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${dept.currentSlaPerformance}%`, height: '100%', background: isPositive ? '#10B981' : '#F59E0B' }}></div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: '#94A3B8' }}>{dept.targetSlaPercentage}%</td>
                    <td>
                      <span className={`badge-trend ${isPositive ? 'success' : 'danger'}`}>
                        {isPositive ? `+${variance}%` : `${variance}%`}
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
    </div>
  );
};

export default DepartmentScorecardModule;
