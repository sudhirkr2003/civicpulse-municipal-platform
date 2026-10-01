import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Activity, CheckCircle2, Clock, Plus, Search, Check, AlertCircle, XCircle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

const defaultServiceMetrics = {
  totalRequests: 24700,
  resolvedRequests: 23218,
  slaCompliancePercentage: 94.0,
  averageTurnaroundDays: 2.4,
  volumeByDepartment: [
    { department: 'Water Management', requests: 7200, resolved: 6768, slaRate: 94.0, avgDays: 2.2 },
    { department: 'Public Health', requests: 5800, resolved: 5278, slaRate: 91.0, avgDays: 2.5 },
    { department: 'Civic Education', requests: 3400, resolved: 3026, slaRate: 89.0, avgDays: 2.9 },
    { department: 'Roads & Infra', requests: 4900, resolved: 4214, slaRate: 86.0, avgDays: 2.8 },
    { department: 'Revenue & Treasury', requests: 3400, resolved: 3230, slaRate: 95.0, avgDays: 1.6 }
  ],
  turnaroundByType: [
    { service: 'Water Connection New/Transfer', avgDays: 2.1, targetDays: 3.0, slaStatus: 'EXCELLENT' },
    { service: 'Commercial Health Inspection', avgDays: 2.6, targetDays: 3.0, slaStatus: 'ON_TRACK' },
    { service: 'School Admission Clearance', avgDays: 2.8, targetDays: 4.0, slaStatus: 'ON_TRACK' },
    { service: 'Road Cut / Repair Permit', avgDays: 2.9, targetDays: 3.0, slaStatus: 'NEARING_LIMIT' },
    { service: 'Property Assessment Certificate', avgDays: 1.6, targetDays: 2.0, slaStatus: 'EXCELLENT' }
  ],
  serviceRequests: [
    { id: 1, requestNumber: 'SR-2026-9041', citizenName: 'Eleanor Vance', serviceType: 'Smart Water Meter Calibration', ward: 'Ward 1 - Downtown Metro', status: 'RESOLVED', turnaroundDays: 2.1 },
    { id: 2, requestNumber: 'SR-2026-9042', citizenName: 'Julian Thorne', serviceType: 'Commercial Food Safety Certification', ward: 'Ward 4 - Tech Corridor', status: 'RESOLVED', turnaroundDays: 2.4 },
    { id: 3, requestNumber: 'SR-2026-9043', citizenName: 'Arthur Pendelton', serviceType: 'Pedestrian Crossing Signal Repair', ward: 'Ward 3 - Highland Park', status: 'RESOLVED', turnaroundDays: 2.8 },
    { id: 4, requestNumber: 'SR-2026-9044', citizenName: 'Samantha Hayes', serviceType: 'Commercial Property Assessment', ward: 'Ward 2 - Riverside North', status: 'RESOLVED', turnaroundDays: 1.8 },
    { id: 5, requestNumber: 'SR-2026-9045', citizenName: 'Darius Morales', serviceType: 'Industrial Wastewater Pipeline Inspection', ward: 'Ward 5 - Industrial Valley', status: 'IN_PROGRESS', turnaroundDays: null },
    { id: 6, requestNumber: 'SR-2026-9046', citizenName: 'Nadia Al-Mansoor', serviceType: 'Community Clinic Air Quality Audit', ward: 'Ward 6 - Harborview Heights', status: 'PENDING', turnaroundDays: null }
  ]
};

export const ServicesModule = () => {
  const { user } = useAuth();
  const isCitizen = user?.role === 'CITIZEN';
  const isDeptHead = user?.role === 'DEPT_HEAD';
  const [data, setData] = useState(defaultServiceMetrics);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newService, setNewService] = useState({
    citizenName: user?.fullName || '',
    serviceType: 'Smart Water Meter Calibration',
    ward: user?.ward || 'Ward 1 - Downtown Metro',
    departmentId: 1
  });

  useEffect(() => {
    fetchServicesData();
  }, []);

  const fetchServicesData = async () => {
    try {
      setLoading(true);
      const [metricsRes, requestsRes] = await Promise.allSettled([
        api.get('/services/metrics'),
        api.get('/services')
      ]);

      const metrics = (metricsRes.status === 'fulfilled' && metricsRes.value?.data) ? metricsRes.value.data : defaultServiceMetrics;
      const requests = (requestsRes.status === 'fulfilled' && Array.isArray(requestsRes.value?.data)) 
        ? requestsRes.value.data 
        : (metrics.serviceRequests || defaultServiceMetrics.serviceRequests);

      let volumeChart = metrics.volumeByDepartment || defaultServiceMetrics.volumeByDepartment;
      if (isDeptHead && user?.departmentId === 1) {
        volumeChart = volumeChart.filter(v => v.department.toLowerCase().includes('water'));
      }

      setData({
        ...metrics,
        volumeByDepartment: volumeChart.length > 0 ? volumeChart : defaultServiceMetrics.volumeByDepartment,
        turnaroundByType: metrics.turnaroundByType || defaultServiceMetrics.turnaroundByType,
        serviceRequests: requests.length > 0 ? requests : defaultServiceMetrics.serviceRequests
      });
    } catch (e) {
      setData(defaultServiceMetrics);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    try {
      await api.post('/services', {
        citizenName: newService.citizenName,
        serviceType: newService.serviceType,
        ward: newService.ward,
        status: 'PENDING',
        department: { id: newService.departmentId }
      });
      setShowAddModal(false);
      fetchServicesData();
    } catch (err) {
      alert('Error creating service request');
    }
  };

  const handleResolve = async (id) => {
    try {
      await api.patch(`/services/${id}/status`, { status: 'RESOLVED', notes: 'Completed within SLA benchmark' });
      fetchServicesData();
    } catch (err) {
      alert('Failed to update service status');
    }
  };

  const handleWithdraw = async (id) => {
    try {
      await api.post(`/citizen/services/${id}/withdraw`);
      fetchServicesData();
    } catch (err) {
      alert('Failed to withdraw request');
    }
  };

  const requestsList = data?.serviceRequests || defaultServiceMetrics.serviceRequests;
  const filteredRequests = requestsList.filter(r =>
    r.citizenName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.requestNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.serviceType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.ward?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Municipal Services & SLA Metrics</h1>
          <p className="page-description">
            Tracking 24.7K municipal service fulfillment requests, turnaround speed, and 94% SLA compliance.
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-emerald">
          <Plus size={16} />
          <span>New Service Request</span>
        </button>
      </div>

      <div className="citizen-collage-grid">
        <div className="card citizen-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '4px' }}>
            <div className="summary-label">Total Requests</div>
            <div className="kpi-icon-pill" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>
              <Activity size={16} />
            </div>
          </div>
          <div className="summary-value" style={{ color: '#38BDF8' }}>24.7K</div>
          <div className="kpi-subtext">
            <span className="badge-trend success" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
              <CheckCircle2 size={11} />
              <span>94% Resolved</span>
            </span>
          </div>
        </div>

        <div className="card citizen-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '4px' }}>
            <div className="summary-label">SLA Compliance</div>
            <div className="kpi-icon-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="summary-value" style={{ color: '#10B981' }}>94%</div>
          <div className="kpi-subtext">
            <span className="badge-trend success" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
              <CheckCircle2 size={11} />
              <span>+4.0% Target</span>
            </span>
          </div>
        </div>

        <div className="card citizen-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '4px' }}>
            <div className="summary-label">Avg Turnaround</div>
            <div className="kpi-icon-pill" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4' }}>
              <Clock size={16} />
            </div>
          </div>
          <div className="summary-value" style={{ color: '#06B6D4' }}>2.4 Days</div>
          <div className="kpi-subtext">
            <span className="badge-trend primary" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
              <Clock size={11} />
              <span>0.6d Ahead</span>
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="card">
          <h2 style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '12px', color: '#F8FAFC' }}>
            Department Service Request Load (24.7K Total)
          </h2>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.volumeByDepartment || defaultServiceMetrics.volumeByDepartment}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E2C4A" />
                <XAxis dataKey="department" stroke="#94A3B8" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <YAxis stroke="#94A3B8" tick={{ fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip contentStyle={{ background: '#0F1E36', borderColor: '#1E2C4A', color: '#F8FAFC', borderRadius: '8px', fontSize: '0.74rem' }} />
                <Bar dataKey="requests" name="Total Requests" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '12px', color: '#F8FAFC' }}>
            Turnaround Speed vs SLA Limits
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table className="table-custom">
              <thead>
                <tr>
                  <th>Service Type</th>
                  <th>Avg Days</th>
                  <th>Target Days</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(data?.turnaroundByType || defaultServiceMetrics.turnaroundByType).map((t, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: '600' }}>{t.service}</td>
                    <td style={{ color: '#10B981', fontWeight: '700' }}>{t.avgDays} d</td>
                    <td style={{ color: '#94A3B8' }}>{t.targetDays} d</td>
                    <td>
                      <span className="badge-trend success">{t.slaStatus}</span>
                    </td>
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
            Live Municipal Service Log
          </h2>
          <div style={{ width: '280px' }}>
            <input
              type="text"
              className="form-input"
              style={{ fontSize: '0.78rem', padding: '6px 10px' }}
              placeholder="Search request or citizen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Citizen Name</th>
                <th>Service Name</th>
                <th>Ward Location</th>
                <th>Status</th>
                <th>Turnaround</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((r) => {
                const isResolved = r.status === 'RESOLVED';
                return (
                  <tr key={r.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#38BDF8', fontWeight: '600' }}>{r.requestNumber}</td>
                    <td style={{ fontWeight: '600' }}>{r.citizenName}</td>
                    <td>{r.serviceType}</td>
                    <td style={{ color: '#94A3B8' }}>{r.ward}</td>
                    <td>
                      <span className={`badge-trend ${isResolved ? 'success' : 'primary'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>{r.turnaroundDays ? `${r.turnaroundDays} days` : 'In Progress'}</td>
                    <td>
                      {r.status === 'WITHDRAWN' ? (
                        <span style={{ color: '#EF4444', fontSize: '0.72rem', fontWeight: '600' }}>Withdrawn</span>
                      ) : isCitizen ? (
                        !isResolved ? (
                          <button
                            onClick={() => handleWithdraw(r.id)}
                            className="btn btn-outline"
                            style={{ padding: '3px 7px', fontSize: '0.70rem', color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                            title="Cancel and withdraw application"
                          >
                            <XCircle size={11} />
                            <span>Withdraw</span>
                          </button>
                        ) : (
                          <span style={{ color: '#10B981', fontSize: '0.72rem', fontWeight: '600' }}>Completed</span>
                        )
                      ) : (
                        !isResolved ? (
                          <button
                            onClick={() => handleResolve(r.id)}
                            className="btn btn-emerald"
                            style={{ padding: '3px 8px', fontSize: '0.70rem' }}
                          >
                            <Check size={11} />
                            <span>Resolve</span>
                          </button>
                        ) : (
                          <span style={{ color: '#10B981', fontSize: '0.72rem', fontWeight: '600' }}>Closed</span>
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
              Create Municipal Service Request
            </h3>
            <form onSubmit={handleCreateService}>
              <div className="form-group">
                <label className="form-label">Citizen Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  value={newService.citizenName}
                  onChange={(e) => setNewService({ ...newService, citizenName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Service Type</label>
                <select
                  className="form-input"
                  value={newService.serviceType}
                  onChange={(e) => setNewService({ ...newService, serviceType: e.target.value })}
                >
                  <option value="Smart Water Meter Calibration">Smart Water Meter Calibration</option>
                  <option value="Commercial Food Safety Certification">Commercial Food Safety Certification</option>
                  <option value="Pedestrian Crossing Signal Repair">Pedestrian Crossing Signal Repair</option>
                  <option value="Commercial Property Assessment">Commercial Property Assessment</option>
                  <option value="School Admission Clearance">School Admission Clearance</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Ward Jurisdiction</label>
                <select
                  className="form-input"
                  value={newService.ward}
                  onChange={(e) => setNewService({ ...newService, ward: e.target.value })}
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
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesModule;
