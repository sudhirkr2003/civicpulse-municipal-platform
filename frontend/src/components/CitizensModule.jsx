import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Smile, UserCheck, TrendingDown, TrendingUp, Search, Plus, Filter, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

export const CitizensModule = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCitizen, setNewCitizen] = useState({
    nationalId: '',
    fullName: '',
    email: '',
    phone: '',
    ward: 'Ward 1 - Downtown Metro',
    satisfactionScore: 5.0
  });

  useEffect(() => {
    fetchCitizenData();
  }, []);

  const fetchCitizenData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/citizens/analytics');
      setData(res.data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleAddCitizen = async (e) => {
    e.preventDefault();
    try {
      await api.post('/citizens', {
        ...newCitizen,
        totalRequests: 1,
        nationalId: newCitizen.nationalId || `CTZ-${Math.floor(10000 + Math.random() * 90000)}`
      });
      setShowAddModal(false);
      fetchCitizenData();
    } catch (err) {
      alert('Error registering citizen');
    }
  };

  const citizensList = data?.recentCitizens || [];
  const filteredCitizens = citizensList.filter(c =>
    c.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.nationalId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.ward?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Citizen Analytics & Engagement</h1>
          <p className="page-description">
            Demographic trends, CSAT distribution benchmarks, and municipal satisfaction scores.
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-emerald">
          <Plus size={16} />
          <span>Register Citizen</span>
        </button>
      </div>

      <div className="citizen-collage-grid">
        <div className="card citizen-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '4px' }}>
            <div className="summary-label">Total Citizens</div>
            <div className="kpi-icon-pill" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>
              <Users size={16} />
            </div>
          </div>
          <div className="summary-value" style={{ color: '#38BDF8' }}>647K</div>
          <div className="kpi-subtext">
            <span className="badge-trend primary" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
              <Users size={11} />
              <span>482K Voters</span>
            </span>
          </div>
        </div>

        <div className="card citizen-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '4px' }}>
            <div className="summary-label">Satisfaction</div>
            <div className="kpi-icon-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
              <Smile size={16} />
            </div>
          </div>
          <div className="summary-value" style={{ color: '#10B981' }}>4.7/5</div>
          <div className="kpi-subtext">
            <span className="badge-trend success" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
              <TrendingDown size={11} />
              <span>Complaints ↓ 23%</span>
            </span>
          </div>
        </div>

        <div className="card citizen-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '4px' }}>
            <div className="summary-label">Adoption</div>
            <div className="kpi-icon-pill" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4' }}>
              <UserCheck size={16} />
            </div>
          </div>
          <div className="summary-value" style={{ color: '#06B6D4' }}>84.6%</div>
          <div className="kpi-subtext">
            <span className="badge-trend success" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
              <TrendingUp size={11} />
              <span>Services ↑ 47%</span>
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="card">
          <h2 style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '12px', color: '#F8FAFC' }}>
            Age Demographic Distribution
          </h2>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.ageDemographics || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2C4A" />
                <XAxis dataKey="bracket" stroke="#94A3B8" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis stroke="#94A3B8" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip contentStyle={{ background: '#0F1E36', borderColor: '#1E2C4A', color: '#F8FAFC', borderRadius: '8px', fontSize: '0.74rem' }} />
                <Bar dataKey="count" name="Citizens" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '12px', color: '#F8FAFC' }}>
            CSAT Rating Proportions
          </h2>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={data?.satisfactionDistribution || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2C4A" />
                <XAxis type="number" stroke="#94A3B8" unit="%" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis dataKey="stars" type="category" stroke="#94A3B8" width={140} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip contentStyle={{ background: '#0F1E36', borderColor: '#1E2C4A', color: '#F8FAFC', borderRadius: '8px', fontSize: '0.74rem' }} />
                <Bar dataKey="percentage" fill="#10B981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#F8FAFC' }}>
            Registered Citizen Directory
          </h2>
          <div style={{ display: 'flex', gap: '8px', width: '280px' }}>
            <div className="input-icon-wrapper" style={{ width: '100%' }}>
              <input
                type="text"
                className="form-input"
                style={{ fontSize: '0.78rem', padding: '6px 10px' }}
                placeholder="Search citizen by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>National ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Contact Phone</th>
                <th>Ward Allocation</th>
                <th>CSAT Score</th>
              </tr>
            </thead>
            <tbody>
              {filteredCitizens.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#94A3B8', padding: '24px' }}>
                    No matching citizen records found.
                  </td>
                </tr>
              ) : (
                filteredCitizens.map((c, i) => (
                  <tr key={c.id || i}>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#38BDF8', fontWeight: '600' }}>{c.nationalId}</td>
                    <td style={{ fontWeight: '600' }}>{c.fullName}</td>
                    <td style={{ color: '#94A3B8' }}>{c.email}</td>
                    <td style={{ color: '#94A3B8' }}>{c.phone}</td>
                    <td>{c.ward}</td>
                    <td>
                      <span style={{ color: '#10B981', fontWeight: '700' }}>{c.satisfactionScore} / 5.0</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="modal-backdrop">
          <div className="modal-box" style={{ maxWidth: '480px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#F8FAFC', marginBottom: '16px' }}>
              Register Citizen in Municipal Pulse
            </h3>
            <form onSubmit={handleAddCitizen}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={newCitizen.fullName}
                  onChange={(e) => setNewCitizen({ ...newCitizen, fullName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  required
                  className="form-input"
                  value={newCitizen.email}
                  onChange={(e) => setNewCitizen({ ...newCitizen, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-input"
                  value={newCitizen.phone}
                  onChange={(e) => setNewCitizen({ ...newCitizen, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Ward Jurisdiction</label>
                <select
                  className="form-input"
                  value={newCitizen.ward}
                  onChange={(e) => setNewCitizen({ ...newCitizen, ward: e.target.value })}
                >
                  <option value="Ward 1 - Downtown Metro">Ward 1 - Downtown Metro</option>
                  <option value="Ward 2 - Riverside North">Ward 2 - Riverside North</option>
                  <option value="Ward 3 - Highland Park">Ward 3 - Highland Park</option>
                  <option value="Ward 4 - Tech Corridor">Ward 4 - Tech Corridor</option>
                  <option value="Ward 5 - Industrial Valley">Ward 5 - Industrial Valley</option>
                  <option value="Ward 6 - Harborview Heights">Ward 6 - Harborview Heights</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" className="btn btn-emerald">
                  Save Citizen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizensModule;
