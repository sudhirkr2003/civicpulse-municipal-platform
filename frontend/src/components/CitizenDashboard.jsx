import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Star, 
  Plus, 
  Search, 
  MapPin, 
  Activity, 
  XCircle, 
  ShieldCheck,
  ChevronRight,
  Sparkles,
  X,
  Droplets,
  Layers,
  AlertTriangle,
  Building2,
  DollarSign,
  Calendar,
  Bell,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const CitizenDashboard = () => {
  const { user } = useAuth();
  const [portalData, setPortalData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showGrievanceModal, setShowGrievanceModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [grievanceForm, setGrievanceForm] = useState({
    category: 'Water Supply',
    priority: 'HIGH',
    landmark: '',
    description: ''
  });

  const [serviceForm, setServiceForm] = useState({
    serviceType: 'Smart Water Meter Calibration',
    propertyAddress: '',
    phone: '+91 98765 43210'
  });

  useEffect(() => {
    fetchPortalData();
  }, []);

  const fetchPortalData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/citizen/portal');
      setPortalData(res.data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGrievance = async (e) => {
    e.preventDefault();
    if (!grievanceForm.description.trim()) return;

    setIsSubmitting(true);
    try {
      await api.post('/citizen/grievances', {
        citizenName: user?.fullName || 'Rahul Sharma',
        category: grievanceForm.category,
        priority: grievanceForm.priority,
        ward: user?.ward || 'Ward 1 - Central Zone',
        description: `${grievanceForm.description} ${grievanceForm.landmark ? `(Landmark: ${grievanceForm.landmark})` : ''}`,
        status: 'SUBMITTED',
        department: { id: 1 }
      });
      setShowGrievanceModal(false);
      setGrievanceForm({ category: 'Water Supply', priority: 'HIGH', landmark: '', description: '' });
      setActionSuccess('Your complaint was successfully logged and dispatched to your ward officer!');
      fetchPortalData();
      setTimeout(() => setActionSuccess(''), 5000);
    } catch (err) {
      alert('Failed to submit complaint.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post('/citizen/services', {
        citizenName: user?.fullName || 'Rahul Sharma',
        serviceType: serviceForm.serviceType,
        ward: user?.ward || 'Ward 1 - Central Zone',
        status: 'SUBMITTED',
        department: { id: 1 }
      });
      setShowServiceModal(false);
      setServiceForm({ serviceType: 'Smart Water Meter Calibration', propertyAddress: '', phone: '+91 98765 43210' });
      setActionSuccess('Your civic service application was submitted successfully!');
      fetchPortalData();
      setTimeout(() => setActionSuccess(''), 5000);
    } catch (err) {
      alert('Failed to submit service application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const grievances = portalData?.grievances || [];
  const serviceRequests = portalData?.serviceRequests || [];

  const activeGrievances = grievances.filter(g => g.status !== 'RESOLVED' && g.status !== 'WITHDRAWN');
  const activeServices = serviceRequests.filter(s => s.status !== 'RESOLVED' && s.status !== 'WITHDRAWN');
  const totalActive = activeGrievances.length + activeServices.length;
  const totalResolved = grievances.filter(g => g.status === 'RESOLVED').length + serviceRequests.filter(s => s.status === 'RESOLVED').length;

  const inFlightList = [
    ...activeGrievances.map(g => ({ id: g.ticketNumber, title: g.category, type: 'Complaint', status: g.status, time: '47h MTTR SLA' })),
    ...activeServices.map(s => ({ id: s.requestNumber, title: s.serviceType, type: 'Service', status: s.status, time: '2.4d SLA' }))
  ];

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
        <div>
          <h1 className="page-title" style={{ fontSize: '1.35rem', fontWeight: '800' }}>
            Welcome back, {portalData?.citizenName || user?.fullName || 'Rahul S.'}
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setShowGrievanceModal(true)} 
            className="btn btn-emerald citizen-top-action-btn"
            style={{ padding: '7px 14px', fontSize: '0.84rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={15} />
            <span className="desktop-btn-label">Lodge New Complaint</span>
            <span className="mobile-btn-label">Complaint</span>
          </button>

          <button 
            onClick={() => setShowServiceModal(true)} 
            className="btn btn-outline citizen-top-action-btn"
            style={{ padding: '7px 14px', fontSize: '0.84rem', fontWeight: '600', borderColor: 'rgba(6, 182, 212, 0.4)', color: '#06B6D4', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Activity size={15} />
            <span className="desktop-btn-label">Apply for Service</span>
            <span className="mobile-btn-label">Service</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="alert-box alert-success" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#10B981', marginBottom: '20px' }}>
          <CheckCircle2 size={20} />
          <span>{actionSuccess}</span>
        </div>
      )}

      <div className="citizen-collage-grid">
        <div className="card citizen-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '4px' }}>
            <div className="summary-label">Active Dockets</div>
            <div className="kpi-icon-pill" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>
              <Clock size={16} />
            </div>
          </div>
          <div className="summary-value" style={{ color: '#38BDF8' }}>{totalActive}</div>
          <div className="kpi-subtext">
            Pending Redressal
          </div>
        </div>

        <div className="card citizen-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '4px' }}>
            <div className="summary-label">Resolved</div>
            <div className="kpi-icon-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="summary-value" style={{ color: '#10B981' }}>{totalResolved}</div>
          <div className="kpi-subtext">
            94% SLA Compliance
          </div>
        </div>

        <div className="card citizen-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '4px' }}>
            <div className="summary-label">My Ward</div>
            <div className="kpi-icon-pill" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4' }}>
              <MapPin size={16} />
            </div>
          </div>
          <div className="summary-value" style={{ fontSize: '1.15rem' }}>
            {portalData?.ward ? (portalData.ward.includes(' - ') ? portalData.ward.split(' - ')[0] : portalData.ward) : (user?.ward ? (user.ward.includes(' - ') ? user.ward.split(' - ')[0] : user.ward) : 'Ward 1')}
          </div>
          <div className="kpi-subtext" style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <ShieldCheck size={11} />
            <span>Verified Account</span>
          </div>
        </div>
      </div>

      <div className="citizen-collage-grid" style={{ marginBottom: '20px' }}>
        
        <div 
          onClick={() => setShowGrievanceModal(true)}
          className="card citizen-action-card" 
          style={{ cursor: 'pointer', border: '1px solid rgba(239, 68, 68, 0.3)', background: 'linear-gradient(180deg, #131C31 0%, rgba(239, 68, 68, 0.05) 100%)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div className="action-icon-pill" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' }}>
              <AlertTriangle size={15} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h3 className="action-card-title">Lodge Complaint</h3>
              <p className="action-card-desc">Water, roads, waste</p>
            </div>
          </div>
          <div className="action-card-footer" style={{ color: '#EF4444' }}>
            <span>47h MTTR Clock</span>
            <ArrowRight size={12} />
          </div>
        </div>

        <div 
          onClick={() => setShowServiceModal(true)}
          className="card citizen-action-card" 
          style={{ cursor: 'pointer', border: '1px solid rgba(6, 182, 212, 0.3)', background: 'linear-gradient(180deg, #131C31 0%, rgba(6, 182, 212, 0.05) 100%)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div className="action-icon-pill" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06B6D4' }}>
              <Activity size={15} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h3 className="action-card-title">Apply for Service</h3>
              <p className="action-card-desc">Meters, licenses, NOC</p>
            </div>
          </div>
          <div className="action-card-footer" style={{ color: '#06B6D4' }}>
            <span>Digital Application</span>
            <ArrowRight size={12} />
          </div>
        </div>

        <Link 
          to="/citizen-receipts" 
          className="card citizen-action-card" 
          style={{ textDecoration: 'none', border: '1px solid rgba(16, 185, 129, 0.3)', background: 'linear-gradient(180deg, #131C31 0%, rgba(16, 185, 129, 0.05) 100%)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <div className="action-icon-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
              <DollarSign size={15} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h3 className="action-card-title">Bills & Receipts</h3>
              <p className="action-card-desc">Tax clearance slips</p>
            </div>
          </div>
          <div className="action-card-footer" style={{ color: '#10B981' }}>
            <span>Verified Receipts</span>
            <ArrowRight size={12} />
          </div>
        </Link>

      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
        
        <div className="card" style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#F8FAFC' }}>
              Active Dockets In-Progress ({inFlightList.length})
            </h3>
            <Link to="/citizen-tracking" style={{ fontSize: '0.78rem', color: '#06B6D4', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <span>View Full Tracker</span>
              <ChevronRight size={13} />
            </Link>
          </div>

          {inFlightList.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '18px 12px', color: '#94A3B8' }}>
              <CheckCircle2 size={26} style={{ color: '#10B981', margin: '0 auto 6px auto' }} />
              <p style={{ fontSize: '0.82rem', color: '#F8FAFC', fontWeight: '600' }}>All clear! No active dockets in progress.</p>
              <p style={{ fontSize: '0.72rem', marginTop: '2px' }}>Click "+ Lodge New Complaint" if you spot an issue.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {inFlightList.slice(0, 4).map((item, idx) => (
                <div key={idx} style={{ background: '#0A0F1D', border: '1px solid #1E2C4A', borderRadius: '8px', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', color: '#38BDF8', fontSize: '0.75rem', fontWeight: '700' }}>{item.id}</span>
                      <span style={{ fontSize: '0.65rem', padding: '1px 5px', borderRadius: '4px', background: item.type === 'Complaint' ? 'rgba(239,68,68,0.15)' : 'rgba(6,182,212,0.15)', color: item.type === 'Complaint' ? '#EF4444' : '#06B6D4' }}>{item.type}</span>
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#F8FAFC', marginTop: '2px' }}>{item.title}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="badge-trend primary" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>{item.status}</span>
                    <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '2px' }}>{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card" style={{ padding: '14px 16px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#F8FAFC', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Bell size={15} style={{ color: '#F59E0B' }} />
            <span>Ward 1 Public Notices & Utility Schedule</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem' }}>
            <div style={{ background: '#0A0F1D', border: '1px solid #1E2C4A', borderRadius: '8px', padding: '8px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981', fontWeight: '700', fontSize: '0.78rem', marginBottom: '2px' }}>
                <span>🚰 Water Supply Timings</span>
                <span>06:00 AM - 09:30 AM</span>
              </div>
              <div style={{ color: '#94A3B8', fontSize: '0.72rem', lineHeight: '1.3' }}>Morning supply active. Pressure normal at 3.2 bar across Central Ward blocks.</div>
            </div>

            <div style={{ background: '#0A0F1D', border: '1px solid #1E2C4A', borderRadius: '8px', padding: '8px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#06B6D4', fontWeight: '700', fontSize: '0.78rem', marginBottom: '2px' }}>
                <span>🚛 Door-to-Door Waste Collection</span>
                <span>08:00 AM - 11:30 AM</span>
              </div>
              <div style={{ color: '#94A3B8', fontSize: '0.72rem', lineHeight: '1.3' }}>Daily segregated solid waste collection vehicle en-route Sector 3 & 4.</div>
            </div>

            <div style={{ background: '#0A0F1D', border: '1px solid #1E2C4A', borderRadius: '8px', padding: '8px 12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#F59E0B', fontWeight: '700', fontSize: '0.78rem', marginBottom: '2px' }}>
                <span>🏥 Free Municipal Health Camp</span>
                <span>Saturday 10 AM</span>
              </div>
              <div style={{ color: '#94A3B8', fontSize: '0.72rem', lineHeight: '1.3' }}>Community Center Ward 1: Blood pressure, sugar screening, and vector-borne disease check.</div>
            </div>
          </div>
        </div>

      </div>

      {showGrievanceModal && (
        <div className="modal-backdrop">
          <div className="modal-box" style={{ maxWidth: '540px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#F8FAFC' }}>
                Lodge Municipal Complaint
              </h3>
              <button onClick={() => setShowGrievanceModal(false)} className="input-icon-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateGrievance}>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  className="form-input"
                  value={grievanceForm.category}
                  onChange={(e) => setGrievanceForm({ ...grievanceForm, category: e.target.value })}
                >
                  <option value="Water Supply">Water Pipeline Leak / Low Pressure</option>
                  <option value="Roads & Potholes">Road Potholes / Damaged Footpath</option>
                  <option value="Sanitation & Waste">Garbage Accumulation & Street Cleaning</option>
                  <option value="Street Lighting">Streetlight Fault / Dark Zone</option>
                  <option value="Public Health">Public Health & Open Drainage</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Location / Landmark *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Near Community Center, Main Road"
                  value={grievanceForm.landmark}
                  onChange={(e) => setGrievanceForm({ ...grievanceForm, landmark: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description of Issue *</label>
                <textarea
                  className="form-input"
                  rows="3"
                  placeholder="Describe what needs to be fixed..."
                  value={grievanceForm.description}
                  onChange={(e) => setGrievanceForm({ ...grievanceForm, description: e.target.value })}
                  required
                ></textarea>
              </div>

              <div style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.25)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.8rem', color: '#06B6D4', margin: '14px 0' }}>
                ⚡ Guaranteed 47-Hour Mean Resolution SLA Clock starts immediately upon submission.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button type="button" onClick={() => setShowGrievanceModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-emerald">
                  {isSubmitting ? 'Logging...' : 'Submit Complaint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showServiceModal && (
        <div className="modal-backdrop">
          <div className="modal-box" style={{ maxWidth: '540px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#F8FAFC' }}>
                Apply for Civic Service
              </h3>
              <button onClick={() => setShowServiceModal(false)} className="input-icon-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateService}>
              <div className="form-group">
                <label className="form-label">Select Service *</label>
                <select
                  className="form-input"
                  value={serviceForm.serviceType}
                  onChange={(e) => setServiceForm({ ...serviceForm, serviceType: e.target.value })}
                >
                  <option value="Smart Water Meter Calibration">Smart Water Meter Calibration (2.1 days SLA)</option>
                  <option value="Commercial Trade License Renewal">Commercial Trade License Renewal (2.4 days SLA)</option>
                  <option value="Commercial Property Assessment">Property Tax Self-Assessment (1.8 days SLA)</option>
                  <option value="Building Plan Scrutiny">Building Plan Clearance NOC (3.0 days SLA)</option>
                  <option value="Birth & Civil Registration Certificate">Civil Certificate Issuance (1.5 days SLA)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Premises Address *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Flat 102, MG Road, Ward 1"
                  value={serviceForm.propertyAddress}
                  onChange={(e) => setServiceForm({ ...serviceForm, propertyAddress: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="text"
                  className="form-input"
                  value={serviceForm.phone}
                  onChange={(e) => setServiceForm({ ...serviceForm, phone: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '18px' }}>
                <button type="button" onClick={() => setShowServiceModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-emerald">
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CitizenDashboard;
