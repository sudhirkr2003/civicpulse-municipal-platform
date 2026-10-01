import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, CheckCircle2, Clock, Plus, Search, Filter, Check, ShieldAlert, XCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

const defaultGrievanceAnalytics = {
  totalGrievances: 12400,
  resolvedGrievances: 11656,
  resolvedPercentage: 94.0,
  averageMttrHours: 47.0,
  categoryHeatmap: [
    { category: 'Water Supply', filed: 3800, resolved: 3572, mttr: 42.0, status: 'RESOLVED' },
    { category: 'Roads & Potholes', filed: 3100, resolved: 2821, mttr: 56.0, status: 'IN_PROGRESS' },
    { category: 'Sanitation & Waste', filed: 2600, resolved: 2522, mttr: 34.0, status: 'RESOLVED' },
    { category: 'Street Lighting', filed: 1700, resolved: 1632, mttr: 28.0, status: 'RESOLVED' },
    { category: 'Public Health', filed: 1200, resolved: 1109, mttr: 49.0, status: 'RESOLVED' }
  ],
  priorityDistribution: [
    { priority: 'CRITICAL', count: 920, color: '#EF4444', percentage: 7.4 },
    { priority: 'HIGH', count: 2850, color: '#F97316', percentage: 23.0 },
    { priority: 'MEDIUM', count: 5430, color: '#3B82F6', percentage: 43.8 },
    { priority: 'LOW', count: 3200, color: '#10B981', percentage: 25.8 }
  ],
  recentGrievances: [
    { id: 1, ticketNumber: 'GRV-2026-1021', citizenName: 'Eleanor Vance', category: 'Water Supply', priority: 'HIGH', ward: 'Ward 1 - Downtown Metro', status: 'RESOLVED', mttrHours: 44.0 },
    { id: 2, ticketNumber: 'GRV-2026-1022', citizenName: 'Julian Thorne', category: 'Roads & Potholes', priority: 'CRITICAL', ward: 'Ward 4 - Tech Corridor', status: 'RESOLVED', mttrHours: 48.0 },
    { id: 3, ticketNumber: 'GRV-2026-1023', citizenName: 'Samantha Hayes', category: 'Sanitation & Waste', priority: 'MEDIUM', ward: 'Ward 2 - Riverside North', status: 'RESOLVED', mttrHours: 32.0 },
    { id: 4, ticketNumber: 'GRV-2026-1024', citizenName: 'Arthur Pendelton', category: 'Street Lighting', priority: 'LOW', ward: 'Ward 3 - Highland Park', status: 'RESOLVED', mttrHours: 26.0 },
    { id: 5, ticketNumber: 'GRV-2026-1025', citizenName: 'Darius Morales', category: 'Water Supply', priority: 'HIGH', ward: 'Ward 5 - Industrial Valley', status: 'IN_PROGRESS', mttrHours: null },
    { id: 6, ticketNumber: 'GRV-2026-1026', citizenName: 'Nadia Al-Mansoor', category: 'Public Health', priority: 'MEDIUM', ward: 'Ward 6 - Harborview Heights', status: 'OPEN', mttrHours: null }
  ]
};

export const GrievancesModule = () => {
  const { user } = useAuth();
  const isCitizen = user?.role === 'CITIZEN';
  const isDeptHead = user?.role === 'DEPT_HEAD';
  const [data, setData] = useState(defaultGrievanceAnalytics);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGrievance, setNewGrievance] = useState({
    citizenName: user?.fullName || '',
    category: 'Water Supply',
    description: '',
    priority: 'HIGH',
    ward: user?.ward || 'Ward 1 - Downtown Metro',
    departmentId: 1
  });

  useEffect(() => {
    fetchGrievancesData();
  }, []);

  const fetchGrievancesData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, grievancesRes] = await Promise.allSettled([
        api.get('/grievances/analytics'),
        api.get('/grievances')
      ]);

      const analytics = (analyticsRes.status === 'fulfilled' && analyticsRes.value?.data) ? analyticsRes.value.data : defaultGrievanceAnalytics;
      const grievances = (grievancesRes.status === 'fulfilled' && Array.isArray(grievancesRes.value?.data)) 
        ? grievancesRes.value.data 
        : (analytics.recentGrievances || defaultGrievanceAnalytics.recentGrievances);

      let categoryHeatmap = analytics.categoryHeatmap || defaultGrievanceAnalytics.categoryHeatmap;
      if (isDeptHead && user?.departmentId === 1) {
        categoryHeatmap = categoryHeatmap.filter(c => c.category.toLowerCase().includes('water'));
      }

      setData({
        ...analytics,
        categoryHeatmap: categoryHeatmap.length > 0 ? categoryHeatmap : defaultGrievanceAnalytics.categoryHeatmap,
        priorityDistribution: analytics.priorityDistribution || defaultGrievanceAnalytics.priorityDistribution,
        recentGrievances: grievances.length > 0 ? grievances : defaultGrievanceAnalytics.recentGrievances
      });
    } catch (e) {
      setData(defaultGrievanceAnalytics);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGrievance = async (e) => {
    e.preventDefault();
    try {
      await api.post('/grievances', {
        citizenName: newGrievance.citizenName,
        category: newGrievance.category,
        description: newGrievance.description,
        priority: newGrievance.priority,
        ward: newGrievance.ward,
        status: 'OPEN',
        department: { id: newGrievance.departmentId }
      });
      setShowAddModal(false);
      fetchGrievancesData();
    } catch (err) {
      alert('Error filing grievance ticket');
    }
  };

  const handleResolveGrievance = async (id) => {
    try {
      await api.patch(`/grievances/${id}/status`, { status: 'RESOLVED', notes: 'Issue resolved on-site and verified with citizen' });
      fetchGrievancesData();
    } catch (err) {
      alert('Failed to resolve grievance');
    }
  };

  const handleWithdrawGrievance = async (id) => {
    try {
      await api.post(`/citizen/grievances/${id}/withdraw`);
      fetchGrievancesData();
    } catch (err) {
      alert('Failed to withdraw grievance');
    }
  };

  const grievancesList = data?.recentGrievances || defaultGrievanceAnalytics.recentGrievances;
  const filteredGrievances = grievancesList.filter(g =>
    g.citizenName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.ticketNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.ward?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Grievance Redressal & MTTR Tracker</h1>
          <p className="page-description">
            Monitoring 12.4K complaints filed, 94% resolution rate, and 47-hour Mean Time to Resolution.
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-emerald">
          <Plus size={16} />
          <span>Log Grievance Ticket</span>
        </button>
      </div>

      <div className="citizen-collage-grid">
        <div className="card citizen-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '4px' }}>
            <div className="summary-label">Total Filed</div>
            <div className="kpi-icon-pill" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' }}>
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="summary-value" style={{ color: '#EF4444' }}>12.4K</div>
          <div className="kpi-subtext">
            <span className="badge-trend success" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
              <span>94% Resolved</span>
            </span>
          </div>
        </div>

        <div className="card citizen-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '4px' }}>
            <div className="summary-label">Resolution</div>
            <div className="kpi-icon-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="summary-value" style={{ color: '#10B981' }}>94.0%</div>
          <div className="kpi-subtext">
            <span className="badge-trend success" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
              <span>11.6K Closed</span>
            </span>
          </div>
        </div>

        <div className="card citizen-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '4px' }}>
            <div className="summary-label">MTTR SLA</div>
            <div className="kpi-icon-pill" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>
              <Clock size={16} />
            </div>
          </div>
          <div className="summary-value" style={{ color: '#38BDF8' }}>47 Hours</div>
          <div className="kpi-subtext">
            <span className="badge-trend success" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
              <span>1h Ahead of SLA</span>
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="card">
          <h2 style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '12px', color: '#F8FAFC' }}>
            Category Volume & Redressal MTTR
          </h2>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.categoryHeatmap || defaultGrievanceAnalytics.categoryHeatmap}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2C4A" />
                <XAxis dataKey="category" stroke="#94A3B8" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis stroke="#94A3B8" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip contentStyle={{ background: '#0F1E36', borderColor: '#1E2C4A', color: '#F8FAFC', borderRadius: '8px', fontSize: '0.74rem' }} />
                <Bar dataKey="filed" name="Complaints Filed" fill="#EF4444" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '12px', color: '#F8FAFC' }}>
            Priority Level Distribution
          </h2>
          <div style={{ width: '100%', height: 260, display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.priorityDistribution || defaultGrievanceAnalytics.priorityDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="priority"
                >
                  {(data?.priorityDistribution || defaultGrievanceAnalytics.priorityDistribution).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || '#3B82F6'} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0F1E36', borderColor: '#1E2C4A', color: '#F8FAFC', borderRadius: '8px', fontSize: '0.74rem' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#F8FAFC' }}>
            Live Grievance Redressal Feed
          </h2>
          <div style={{ width: '280px' }}>
            <input
              type="text"
              className="form-input"
              style={{ fontSize: '0.78rem', padding: '6px 10px' }}
              placeholder="Search ticket number or citizen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Citizen Name</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Ward Jurisdiction</th>
                <th>Status</th>
                <th>MTTR (hrs)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrievances.map((g) => {
                const isResolved = g.status === 'RESOLVED';
                return (
                  <tr key={g.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#38BDF8', fontWeight: '600' }}>{g.ticketNumber}</td>
                    <td style={{ fontWeight: '600' }}>{g.citizenName}</td>
                    <td>{g.category}</td>
                    <td>
                      <span className={`badge-trend ${g.priority === 'CRITICAL' || g.priority === 'HIGH' ? 'danger' : 'primary'}`}>
                        {g.priority}
                      </span>
                    </td>
                    <td style={{ color: '#94A3B8' }}>{g.ward}</td>
                    <td>
                      <span className={`badge-trend ${isResolved ? 'success' : 'danger'}`}>
                        {g.status}
                      </span>
                    </td>
                    <td>{g.mttrHours ? `${g.mttrHours}h` : 'Tracking...'}</td>
                    <td>
                      {g.status === 'WITHDRAWN' ? (
                        <span style={{ color: '#EF4444', fontSize: '0.72rem', fontWeight: '600' }}>Withdrawn</span>
                      ) : isCitizen ? (
                        !isResolved ? (
                          <button
                            onClick={() => handleWithdrawGrievance(g.id)}
                            className="btn btn-outline"
                            style={{ padding: '3px 7px', fontSize: '0.70rem', color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                            title="Withdraw voluntary complaint"
                          >
                            <XCircle size={11} />
                            <span>Withdraw</span>
                          </button>
                        ) : (
                          <span style={{ color: '#10B981', fontSize: '0.72rem', fontWeight: '600' }}>Resolved (Closed)</span>
                        )
                      ) : (
                        !isResolved ? (
                          <button
                            onClick={() => handleResolveGrievance(g.id)}
                            className="btn btn-emerald"
                            style={{ padding: '3px 8px', fontSize: '0.70rem' }}
                          >
                            <Check size={11} />
                            <span>Close Ticket</span>
                          </button>
                        ) : (
                          <span style={{ color: '#10B981', fontSize: '0.72rem', fontWeight: '600' }}>Resolved</span>
                        )
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-box" style={{ maxWidth: '480px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#F8FAFC', marginBottom: '16px' }}>
              Log Municipal Grievance Ticket
            </h3>
            <form onSubmit={handleCreateGrievance}>
              <div className="form-group">
                <label className="form-label">Citizen Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={newGrievance.citizenName}
                  onChange={(e) => setNewGrievance({ ...newGrievance, citizenName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-input"
                  value={newGrievance.category}
                  onChange={(e) => setNewGrievance({ ...newGrievance, category: e.target.value })}
                >
                  <option value="Water Supply">Water Supply & Pipeline</option>
                  <option value="Roads & Potholes">Roads & Potholes</option>
                  <option value="Sanitation & Waste">Sanitation & Solid Waste</option>
                  <option value="Street Lighting">Street Lighting</option>
                  <option value="Public Health">Public Health</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Priority Level</label>
                <select
                  className="form-input"
                  value={newGrievance.priority}
                  onChange={(e) => setNewGrievance({ ...newGrievance, priority: e.target.value })}
                >
                  <option value="CRITICAL">CRITICAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Ward</label>
                <select
                  className="form-input"
                  value={newGrievance.ward}
                  onChange={(e) => setNewGrievance({ ...newGrievance, ward: e.target.value })}
                >
                  <option value="Ward 1 - Downtown Metro">Ward 1 - Downtown Metro</option>
                  <option value="Ward 2 - Riverside North">Ward 2 - Riverside North</option>
                  <option value="Ward 3 - Highland Park">Ward 3 - Highland Park</option>
                  <option value="Ward 4 - Tech Corridor">Ward 4 - Tech Corridor</option>
                  <option value="Ward 5 - Industrial Valley">Ward 5 - Industrial Valley</option>
                  <option value="Ward 6 - Harborview Heights">Ward 6 - Harborview Heights</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  rows="3"
                  value={newGrievance.description}
                  onChange={(e) => setNewGrievance({ ...newGrievance, description: e.target.value })}
                  placeholder="Details of the civic issue..."
                ></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-emerald">
                  Save Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrievancesModule;
