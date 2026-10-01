import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { FileCheck, DollarSign, Building, Plus, Search, CheckCircle2, Clock, Check, X } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const PermitsModule = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPermit, setNewPermit] = useState({
    applicantName: '',
    permitType: 'Commercial Building',
    estimatedCost: 250000,
    feeCollected: 15000,
    ward: 'Ward 1 - Downtown Metro'
  });

  useEffect(() => {
    fetchPermitsData();
  }, []);

  const fetchPermitsData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/permits/summary');
      setData(res.data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePermit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/permits', {
        ...newPermit,
        status: 'UNDER_REVIEW',
        estimatedCost: parseFloat(newPermit.estimatedCost),
        feeCollected: parseFloat(newPermit.feeCollected)
      });
      setShowAddModal(false);
      fetchPermitsData();
    } catch (err) {
      alert('Error creating permit application');
    }
  };

  const handleApprovePermit = async (id) => {
    try {
      await api.patch(`/permits/${id}/status`, { status: 'APPROVED', notes: 'All statutory architectural clearances met' });
      fetchPermitsData();
    } catch (err) {
      alert('Failed to approve permit');
    }
  };

  const permitsList = data?.recentPermits || [];
  const filteredPermits = permitsList.filter(p =>
    p.applicantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.permitNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.permitType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.ward?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Permits & Zoning Workflow</h1>
          <p className="page-description">
            Commercial & residential construction permits, pipeline workflow status, and municipal fees collected.
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-emerald">
          <Plus size={16} />
          <span>File Permit Application</span>
        </button>
      </div>

      <div className="citizen-collage-grid">
        <div className="card citizen-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '4px' }}>
            <div className="summary-label">Total Permits</div>
            <div className="kpi-icon-pill" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>
              <FileCheck size={16} />
            </div>
          </div>
          <div className="summary-value" style={{ color: '#38BDF8' }}>3,840</div>
          <div className="kpi-subtext">
            <span className="badge-trend success" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
              <CheckCircle2 size={11} />
              <span>87% Approved</span>
            </span>
          </div>
        </div>

        <div className="card citizen-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '4px' }}>
            <div className="summary-label">Fees Collected</div>
            <div className="kpi-icon-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
              <DollarSign size={16} />
            </div>
          </div>
          <div className="summary-value" style={{ color: '#10B981' }}>$1.24M</div>
          <div className="kpi-subtext">
            <span className="badge-trend success" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
              <DollarSign size={11} />
              <span>+12.8% YoY</span>
            </span>
          </div>
        </div>

        <div className="card citizen-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '4px' }}>
            <div className="summary-label">Valuation</div>
            <div className="kpi-icon-pill" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4' }}>
              <Building size={16} />
            </div>
          </div>
          <div className="summary-value" style={{ color: '#06B6D4' }}>$184.5M</div>
          <div className="kpi-subtext">
            <span className="badge-trend primary" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
              <Building size={11} />
              <span>CapEx Pipeline</span>
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="card">
          <h2 style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '12px', color: '#F8FAFC' }}>
            Permits Volume & Fees by Category
          </h2>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.permitsByType || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2C4A" />
                <XAxis dataKey="type" stroke="#94A3B8" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis stroke="#94A3B8" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip contentStyle={{ background: '#0F1E36', borderColor: '#1E2C4A', color: '#F8FAFC', borderRadius: '8px', fontSize: '0.74rem' }} />
                <Bar dataKey="count" name="Permit Applications" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '12px', color: '#F8FAFC' }}>
            Approval Pipeline Stage Funnel
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table className="table-custom">
              <thead>
                <tr>
                  <th>Pipeline Stage</th>
                  <th>Applications</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                {(data?.pipelineStatus || []).map((p, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: '600' }}>{p.stage}</td>
                    <td style={{ color: '#10B981', fontWeight: '700' }}>{p.count.toLocaleString()}</td>
                    <td>{p.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#F8FAFC' }}>
            Permit Registry & Approvals
          </h2>
          <div style={{ width: '280px' }}>
            <input
              type="text"
              className="form-input"
              style={{ fontSize: '0.78rem', padding: '6px 10px' }}
              placeholder="Search applicant or permit #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>Permit #</th>
                <th>Applicant / Developer</th>
                <th>Permit Type</th>
                <th>Ward</th>
                <th>Est. Cost</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPermits.map((p) => {
                const isApproved = p.status === 'APPROVED';
                return (
                  <tr key={p.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#38BDF8', fontWeight: '600' }}>{p.permitNumber}</td>
                    <td style={{ fontWeight: '600' }}>{p.applicantName}</td>
                    <td>{p.permitType}</td>
                    <td style={{ color: '#94A3B8' }}>{p.ward}</td>
                    <td>${(p.estimatedCost / 1000).toFixed(0)}K</td>
                    <td style={{ color: '#10B981' }}>${p.feeCollected?.toLocaleString()}</td>
                    <td>
                      <span className={`badge-trend ${isApproved ? 'success' : 'primary'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td>
                      {!isApproved ? (
                        <button
                          onClick={() => handleApprovePermit(p.id)}
                          className="btn btn-emerald"
                          style={{ padding: '3px 8px', fontSize: '0.70rem' }}
                        >
                          <Check size={11} />
                          <span>Approve</span>
                        </button>
                      ) : (
                        <span style={{ color: '#10B981', fontSize: '0.72rem', fontWeight: '600' }}>Issued</span>
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
              Submit Permit Application
            </h3>
            <form onSubmit={handleCreatePermit}>
              <div className="form-group">
                <label className="form-label">Applicant / Entity Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={newPermit.applicantName}
                  onChange={(e) => setNewPermit({ ...newPermit, applicantName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Permit Classification</label>
                <select
                  className="form-input"
                  value={newPermit.permitType}
                  onChange={(e) => setNewPermit({ ...newPermit, permitType: e.target.value })}
                >
                  <option value="Commercial Building">Commercial Building</option>
                  <option value="Residential Construction">Residential Construction</option>
                  <option value="Signage & Billboard">Signage & Billboard</option>
                  <option value="Street Vendor License">Street Vendor License</option>
                  <option value="Environmental Clearance">Environmental Clearance</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Estimated Project Value ($)</label>
                <input
                  type="number"
                  required
                  className="form-input"
                  value={newPermit.estimatedCost}
                  onChange={(e) => setNewPermit({ ...newPermit, estimatedCost: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Statutory Fee ($)</label>
                <input
                  type="number"
                  required
                  className="form-input"
                  value={newPermit.feeCollected}
                  onChange={(e) => setNewPermit({ ...newPermit, feeCollected: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Ward Jurisdiction</label>
                <select
                  className="form-input"
                  value={newPermit.ward}
                  onChange={(e) => setNewPermit({ ...newPermit, ward: e.target.value })}
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
                  Submit Permit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermitsModule;
