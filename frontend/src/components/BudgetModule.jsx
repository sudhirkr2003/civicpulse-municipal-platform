import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { DollarSign, PieChart as PieIcon, TrendingUp, CheckCircle2, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

export const BudgetModule = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBudgetData();
  }, []);

  const fetchBudgetData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/budget/utilization');
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
          <h1 className="page-title">Budget Allocation & Utilization</h1>
          <p className="page-description">
            Statutory municipal fiscal oversight, CapEx vs OpEx burn rates, and departmental appropriations.
          </p>
        </div>
      </div>

      <div className="citizen-collage-grid">
        <div className="card citizen-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '4px' }}>
            <div className="summary-label">Allocated</div>
            <div className="kpi-icon-pill" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>
              <DollarSign size={16} />
            </div>
          </div>
          <div className="summary-value" style={{ color: '#38BDF8' }}>$47.0M</div>
          <div className="kpi-subtext">
            <span className="badge-trend primary" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
              <ShieldCheck size={11} />
              <span>Appropriated</span>
            </span>
          </div>
        </div>

        <div className="card citizen-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '4px' }}>
            <div className="summary-label">Utilized</div>
            <div className="kpi-icon-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="summary-value" style={{ color: '#10B981' }}>$41.0M</div>
          <div className="kpi-subtext">
            <span className="badge-trend success" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
              <TrendingUp size={11} />
              <span>87% Burn Rate</span>
            </span>
          </div>
        </div>

        <div className="card citizen-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '4px' }}>
            <div className="summary-label">Reserve</div>
            <div className="kpi-icon-pill" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4' }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="summary-value" style={{ color: '#06B6D4' }}>$6.0M</div>
          <div className="kpi-subtext">
            <span className="badge-trend success" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
              <CheckCircle2 size={11} />
              <span>12.8% Buffer</span>
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="card">
          <h2 style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '12px', color: '#F8FAFC' }}>
            Department Budget Allocation vs Utilization ($M)
          </h2>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.departmentBreakdown || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2C4A" />
                <XAxis dataKey="department" stroke="#94A3B8" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis stroke="#94A3B8" unit="M" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip contentStyle={{ background: '#0F1E36', borderColor: '#1E2C4A', color: '#F8FAFC', borderRadius: '8px', fontSize: '0.74rem' }} />
                <Bar dataKey="allocated" name="Allocated ($M)" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="utilized" name="Utilized ($M)" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '12px', color: '#F8FAFC' }}>
            CapEx ($28.4M) vs OpEx ($12.6M) Proportions
          </h2>
          <div style={{ width: '100%', height: 260, display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.capexVsOpex || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="amount"
                >
                  {(data?.capexVsOpex || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#3B82F6'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0F1E36', borderColor: '#1E2C4A', color: '#F8FAFC', borderRadius: '8px', fontSize: '0.74rem' }} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '12px', color: '#F8FAFC' }}>
          Departmental Fiscal Appropriation Ledger
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>Department</th>
                <th>Allocated Budget</th>
                <th>Utilized Budget</th>
                <th>CapEx Split</th>
                <th>OpEx Split</th>
                <th>Burn Rate</th>
                <th>Fiscal Health</th>
              </tr>
            </thead>
            <tbody>
              {(data?.departmentBreakdown || []).map((d, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: '600', color: '#38BDF8' }}>{d.department}</td>
                  <td>${d.allocated}M</td>
                  <td style={{ color: '#10B981', fontWeight: '700' }}>${d.utilized}M</td>
                  <td>${d.capex}M</td>
                  <td>${d.opex}M</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{d.burnRate}%</span>
                      <div style={{ width: '60px', height: '6px', background: '#1E2C4A', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${d.burnRate}%`, height: '100%', background: d.burnRate > 90 ? '#F59E0B' : '#10B981' }}></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge-trend success">ON TRACK</span>
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

export default BudgetModule;
