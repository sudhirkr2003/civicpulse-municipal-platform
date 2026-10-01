import React, { useState } from 'react';
import {
  BarChart3,
  Clock,
  DollarSign,
  Layers,
  Building,
  Star,
  Activity
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export default function AnalyticsValidationModule() {
  const [activeScreen, setActiveScreen] = useState('all');

  const screens = [
    { id: 'all', label: 'All 6 Validation Metrics', icon: Activity },
    { id: 'service', label: '1. Service Metrics (24.7K requests, 94% SLA)', icon: BarChart3 },
    { id: 'grievance', label: '2. Grievance Analytics (12.4K filed, 47h MTTR)', icon: Clock },
    { id: 'revenue', label: '3. Revenue Tracking ($12.4M, 67% Prop Tax)', icon: DollarSign },
    { id: 'budget', label: '4. Budget Utilization ($47M / $41M, 87%)', icon: Layers },
    { id: 'dept', label: '5. Department Performance (Water 94%, Health 91%)', icon: Building },
    { id: 'sat', label: '6. Citizen Satisfaction (4.7/5 rating)', icon: Star },
  ];

  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
          📈 Validation Screens & Analytics Suite
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>
          Governance validation matrix auditing Service metrics, Grievance analytics, Revenue tracking, Budget utilization, Department performance, and Citizen satisfaction.
        </p>
      </div>

      <div className="sub-tabs-bar" style={{ marginBottom: '24px' }}>
        {screens.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              className={`sub-tab-btn ${activeScreen === s.id ? 'active' : ''}`}
              onClick={() => setActiveScreen(s.id)}
            >
              <Icon size={16} />
              {s.label}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {(activeScreen === 'all' || activeScreen === 'service') && (
          <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '8px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1.05rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart3 size={18} className="text-sky-400" />
                Service Metrics SLA Validation
              </h3>
              <span className="badge badge-green">94% SLA Met</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '14px' }}>
              24.7K requests handled with 2.4 days average turnaround across 8 core public services.
            </p>
            <div style={{ height: '180px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Water', sla: 95 },
                  { name: 'Permits', sla: 92 },
                  { name: 'Health', sla: 91 },
                  { name: 'Trade', sla: 97 },
                  { name: 'Waste', sla: 95 },
                  { name: 'Street', sla: 96 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis domain={[80, 100]} stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                  <Bar dataKey="sla" name="SLA Met %" fill="#0284c7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {(activeScreen === 'all' || activeScreen === 'grievance') && (
          <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '8px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1.05rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={18} className="text-amber-400" />
                Grievance Analytics & MTTR
              </h3>
              <span className="badge badge-green">47 hrs MTTR</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '14px' }}>
              12.4K complaints registered, 94% resolved. 23% overall reduction in new complaint filings.
            </p>
            <div style={{ height: '180px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { m: 'W1', mttr: 42 },
                  { m: 'W2', mttr: 45 },
                  { m: 'W3', mttr: 51 },
                  { m: 'W4', mttr: 46 },
                  { m: 'W5', mttr: 49 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="m" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                  <Area type="monotone" dataKey="mttr" name="Ward MTTR (Hours)" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {(activeScreen === 'all' || activeScreen === 'revenue') && (
          <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '8px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1.05rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <DollarSign size={18} className="text-emerald-400" />
                Revenue Tracking & Audits
              </h3>
              <span className="badge badge-blue">$12.4M Collected</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '14px' }}>
              Property Tax 67% ($8.31M) | Licenses 23% ($2.85M) | Utilities 10% ($1.24M).
            </p>
            <div style={{ height: '180px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Property Tax (67%)', value: 67, color: '#0ea5e9' },
                      { name: 'Licenses (23%)', value: 23, color: '#10b981' },
                      { name: 'Utilities (10%)', value: 10, color: '#8b5cf6' }
                    ]}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={65}
                    label={({ name }) => name}
                  >
                    <Cell fill="#0ea5e9" />
                    <Cell fill="#10b981" />
                    <Cell fill="#8b5cf6" />
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {(activeScreen === 'all' || activeScreen === 'budget') && (
          <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '8px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1.05rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={18} className="text-purple-400" />
                Budget Utilization ($47M / $41M)
              </h3>
              <span className="badge badge-green">87% Utilized</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '14px' }}>
              Capital expenditure across municipal programs currently stands at 87.2% execution.
            </p>
            <div style={{ height: '180px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { dept: 'Water', percent: 93.8 },
                  { dept: 'Health', percent: 90.9 },
                  { dept: 'Edu', percent: 89.4 },
                  { dept: 'Roads', percent: 82.8 },
                  { dept: 'IT', percent: 66.7 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="dept" stroke="#64748b" />
                  <YAxis stroke="#64748b" domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                  <Bar dataKey="percent" name="Utilized %" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {(activeScreen === 'all' || activeScreen === 'dept') && (
          <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '8px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1.05rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building size={18} className="text-emerald-400" />
                Department Performance SLA
              </h3>
              <span className="badge badge-blue">Water 94% | Health 91%</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '14px' }}>
              Water 94% | Health 91% | Education 89% | Public Works 86% | Transit 88%.
            </p>
            <div style={{ height: '180px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Water', score: 94 },
                  { name: 'Health', score: 91 },
                  { name: 'Education', score: 89 },
                  { name: 'Transit', score: 88 },
                  { name: 'Public Works', score: 86 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis domain={[80, 100]} stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                  <Bar dataKey="score" name="SLA Efficiency %" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {(activeScreen === 'all' || activeScreen === 'sat') && (
          <div style={{ background: '#111827', border: '1px solid #1e293b', borderRadius: '8px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1.05rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Star size={18} className="text-yellow-400" />
                Citizen Satisfaction (4.7 / 5)
              </h3>
              <span className="badge badge-green">74% 5-Star Reviews</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '14px' }}>
              18,450 survey submissions with 4.7/5 average citizen confidence rating.
            </p>
            <div style={{ height: '180px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { stars: '5 ★', count: 74 },
                  { stars: '4 ★', count: 19 },
                  { stars: '3 ★', count: 5 },
                  { stars: '2 ★', count: 1.5 },
                  { stars: '1 ★', count: 0.5 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="stars" stroke="#64748b" />
                  <YAxis stroke="#64748b" />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }} />
                  <Bar dataKey="count" name="Response Share %" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
