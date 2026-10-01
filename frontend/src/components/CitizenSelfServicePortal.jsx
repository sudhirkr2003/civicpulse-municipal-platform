import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Star, 
  AlertCircle, 
  Plus, 
  Search, 
  MapPin, 
  Activity, 
  XCircle, 
  Download, 
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Camera,
  X,
  Droplets,
  Layers,
  AlertTriangle,
  Building2,
  Check,
  Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const CitizenSelfServicePortal = () => {
  const { user } = useAuth();
  const [portalData, setPortalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const [showGrievanceModal, setShowGrievanceModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);

  const [ratingTicketId, setRatingTicketId] = useState(null);
  const [selectedRating, setSelectedRating] = useState(5);

  const [actionSuccess, setActionSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [grievanceForm, setGrievanceForm] = useState({
    category: 'Water Supply',
    priority: 'HIGH',
    landmark: '',
    description: ''
  });
  const [photoPreview, setPhotoPreview] = useState('https://images.unsplash.com/photo-1584467735815-f778f274e296?w=400');

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

  const handleWithdrawGrievance = async (id, ticketNo) => {
    if (!window.confirm(`Do you want to cancel and withdraw complaint ${ticketNo}?`)) return;
    try {
      await api.post(`/citizen/grievances/${id}/withdraw`);
      setActionSuccess(`Complaint ${ticketNo} was successfully withdrawn.`);
      fetchPortalData();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (e) {
      alert('Failed to withdraw complaint.');
    }
  };

  const handleWithdrawService = async (id, requestNo) => {
    if (!window.confirm(`Do you want to cancel and withdraw application ${requestNo}?`)) return;
    try {
      await api.post(`/citizen/services/${id}/withdraw`);
      setActionSuccess(`Application ${requestNo} was successfully withdrawn.`);
      fetchPortalData();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (e) {
      alert('Failed to withdraw service request.');
    }
  };

  const handleSubmitRating = async (ticketId) => {
    try {
      await api.post(`/citizen/rate/${ticketId}`, { rating: selectedRating });
      setActionSuccess(`Thank you! Your ${selectedRating}-star rating has been recorded.`);
      setRatingTicketId(null);
      fetchPortalData();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (e) {
      alert('Failed to save rating.');
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
        proofPhoto: photoPreview,
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

  const handlePhotoUploadSimulate = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setPhotoPreview(uploadEvent.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const grievances = portalData?.grievances || [];
  const serviceRequests = portalData?.serviceRequests || [];

  const allItems = [
    ...grievances.map(g => ({
      id: g.id,
      docId: g.ticketNumber,
      type: 'Complaint',
      title: g.category,
      details: g.description,
      ward: g.ward,
      status: g.status,
      sla: g.mttrHours ? `${g.mttrHours}h MTTR` : '47 Hours Standard SLA',
      isComplaint: true,
      satisfactionRating: g.satisfactionRating,
      rawItem: g
    })),
    ...serviceRequests.map(s => ({
      id: s.id,
      docId: s.requestNumber,
      type: 'Service Request',
      title: s.serviceType,
      details: s.serviceType,
      ward: s.ward,
      status: s.status,
      sla: s.turnaroundDays ? `${s.turnaroundDays} days` : '2.4 Days Target',
      isComplaint: false,
      satisfactionRating: null,
      rawItem: s
    }))
  ];

  const totalActive = allItems.filter(item => item.status !== 'RESOLVED' && item.status !== 'WITHDRAWN').length;
  const totalResolved = allItems.filter(item => item.status === 'RESOLVED').length;

  const filteredItems = allItems.filter(item => {
    const matchesSearch = 
      item.docId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ward?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'ALL') return true;
    if (filterType === 'COMPLAINTS') return item.isComplaint;
    if (filterType === 'SERVICES') return !item.isComplaint;
    if (filterType === 'ACTIVE') return item.status !== 'RESOLVED' && item.status !== 'WITHDRAWN';
    if (filterType === 'RESOLVED') return item.status === 'RESOLVED';
    return true;
  });

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="page-title">My Citizen Dashboard</h1>
          <p className="page-description">
            Welcome back, {portalData?.citizenName || user?.fullName || 'Rahul S.'}! View and manage all your municipal complaints and service applications in one place.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => setShowGrievanceModal(true)} 
            className="btn btn-emerald"
            style={{ padding: '10px 18px', fontSize: '0.9rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Plus size={18} />
            <span>+ Lodge New Complaint</span>
          </button>

          <button 
            onClick={() => setShowServiceModal(true)} 
            className="btn btn-outline"
            style={{ padding: '10px 18px', fontSize: '0.9rem', fontWeight: '600', borderColor: 'rgba(6, 182, 212, 0.4)', color: '#06B6D4', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Activity size={18} />
            <span>+ Apply for Service</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="alert-box alert-success" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#10B981', marginBottom: '20px' }}>
          <CheckCircle2 size={20} />
          <span>{actionSuccess}</span>
        </div>
      )}

      <div className="kpi-grid-3" style={{ marginBottom: '24px' }}>
        <div className="card summary-card">
          <div>
            <div className="summary-label">Active In-Progress Requests</div>
            <div className="summary-value" style={{ color: '#38BDF8' }}>{totalActive}</div>
            <div style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '4px' }}>
              Currently assigned to your ward field staff
            </div>
          </div>
          <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '16px', borderRadius: '12px', color: '#3B82F6' }}>
            <Clock size={32} />
          </div>
        </div>

        <div className="card summary-card">
          <div>
            <div className="summary-label">Completed & Resolved</div>
            <div className="summary-value" style={{ color: '#10B981' }}>{totalResolved}</div>
            <div style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '4px' }}>
              Completed within statutory SLA target
            </div>
          </div>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '16px', borderRadius: '12px', color: '#10B981' }}>
            <CheckCircle2 size={32} />
          </div>
        </div>

        <div className="card summary-card">
          <div>
            <div className="summary-label">My Registered Ward</div>
            <div className="summary-value" style={{ fontSize: '1.3rem' }}>{portalData?.ward || user?.ward || 'Ward 1 - Central Zone'}</div>
            <div style={{ fontSize: '0.82rem', color: '#10B981', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} />
              <span>Verified Resident Account</span>
            </div>
          </div>
          <div style={{ background: 'rgba(6, 182, 212, 0.15)', padding: '16px', borderRadius: '12px', color: '#06B6D4' }}>
            <MapPin size={32} />
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#F8FAFC' }}>
              My Requests & Dockets ({filteredItems.length})
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '2px' }}>
              Unified list of all your complaints and service applications. You can cancel pending ones or rate completed ones.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: '6px', background: '#0A0F1D', padding: '4px', borderRadius: '8px', border: '1px solid #1E2C4A' }}>
              <button
                onClick={() => setFilterType('ALL')}
                style={{
                  background: filterType === 'ALL' ? '#10B981' : 'transparent',
                  color: filterType === 'ALL' ? '#0A0F1D' : '#94A3B8',
                  fontWeight: filterType === 'ALL' ? '700' : '500',
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                All ({allItems.length})
              </button>
              <button
                onClick={() => setFilterType('ACTIVE')}
                style={{
                  background: filterType === 'ACTIVE' ? '#3B82F6' : 'transparent',
                  color: filterType === 'ACTIVE' ? '#F8FAFC' : '#94A3B8',
                  fontWeight: filterType === 'ACTIVE' ? '700' : '500',
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                Active ({totalActive})
              </button>
              <button
                onClick={() => setFilterType('RESOLVED')}
                style={{
                  background: filterType === 'RESOLVED' ? '#10B981' : 'transparent',
                  color: filterType === 'RESOLVED' ? '#0A0F1D' : '#94A3B8',
                  fontWeight: filterType === 'RESOLVED' ? '700' : '500',
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                Resolved ({totalResolved})
              </button>
              <button
                onClick={() => setFilterType('COMPLAINTS')}
                style={{
                  background: filterType === 'COMPLAINTS' ? '#EF4444' : 'transparent',
                  color: filterType === 'COMPLAINTS' ? '#F8FAFC' : '#94A3B8',
                  fontWeight: filterType === 'COMPLAINTS' ? '700' : '500',
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                Complaints ({grievances.length})
              </button>
              <button
                onClick={() => setFilterType('SERVICES')}
                style={{
                  background: filterType === 'SERVICES' ? '#06B6D4' : 'transparent',
                  color: filterType === 'SERVICES' ? '#0A0F1D' : '#94A3B8',
                  fontWeight: filterType === 'SERVICES' ? '700' : '500',
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  cursor: 'pointer'
                }}
              >
                Services ({serviceRequests.length})
              </button>
            </div>

            <div style={{ width: '220px' }}>
              <input
                type="text"
                className="form-input"
                style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                placeholder="Search by ID or title..."
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
                <th>Docket ID</th>
                <th>Category / Type</th>
                <th>Request Details</th>
                <th>Ward</th>
                <th>Status</th>
                <th>Target SLA</th>
                <th>Your Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: '#94A3B8' }}>
                    No items match your filter. Click "+ Lodge New Complaint" or "+ Apply for Service" to create one.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => {
                  const isResolved = item.status === 'RESOLVED';
                  const isWithdrawn = item.status === 'WITHDRAWN';

                  return (
                    <tr key={`${item.docId}-${idx}`}>
                      <td style={{ fontFamily: 'var(--font-mono)', color: '#38BDF8', fontWeight: '700' }}>
                        {item.docId}
                      </td>
                      <td>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          background: item.isComplaint ? 'rgba(239, 68, 68, 0.12)' : 'rgba(6, 182, 212, 0.12)',
                          color: item.isComplaint ? '#EF4444' : '#06B6D4',
                          border: `1px solid ${item.isComplaint ? 'rgba(239, 68, 68, 0.3)' : 'rgba(6, 182, 212, 0.3)'}`
                        }}>
                          {item.type}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: '600', color: '#F8FAFC' }}>{item.title}</div>
                        <div style={{ fontSize: '0.78rem', color: '#94A3B8', maxWidth: '320px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.details}
                        </div>
                      </td>
                      <td style={{ color: '#94A3B8' }}>{item.ward}</td>
                      <td>
                        <span className={`badge-trend ${isResolved ? 'success' : isWithdrawn ? 'danger' : 'primary'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ color: '#94A3B8', fontSize: '0.82rem' }}>
                        {item.sla}
                      </td>
                      <td>
                        {isWithdrawn ? (
                          <span style={{ color: '#EF4444', fontSize: '0.78rem', fontWeight: '600' }}>Cancelled</span>
                        ) : isResolved ? (
                          item.isComplaint ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {item.satisfactionRating ? (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#F59E0B', fontSize: '0.82rem', fontWeight: '700' }}>
                                  <Star size={14} fill="#F59E0B" />
                                  <span>{item.satisfactionRating}/5 Rated</span>
                                </span>
                              ) : (
                                <button
                                  onClick={() => setRatingTicketId(item.id)}
                                  className="btn btn-outline"
                                  style={{ padding: '4px 10px', fontSize: '0.75rem', color: '#F59E0B', borderColor: 'rgba(245, 158, 11, 0.4)' }}
                                >
                                  <Star size={12} />
                                  <span>Rate (1-5 ⭐)</span>
                                </button>
                              )}
                            </div>
                          ) : (
                            <span style={{ color: '#10B981', fontSize: '0.8rem', fontWeight: '600' }}>Approved & Complete</span>
                          )
                        ) : (
                          <button
                            onClick={() => item.isComplaint ? handleWithdrawGrievance(item.id, item.docId) : handleWithdrawService(item.id, item.docId)}
                            className="btn btn-outline"
                            style={{ padding: '4px 10px', fontSize: '0.75rem', color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                            title="Cancel and withdraw request"
                          >
                            <XCircle size={12} />
                            <span>Cancel Request</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
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

              <div className="form-group">
                <label className="form-label">Photo Evidence (Optional)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <img src={photoPreview} alt="Evidence" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                  <label className="btn btn-outline" style={{ cursor: 'pointer', fontSize: '0.8rem', padding: '6px 12px' }}>
                    <Camera size={14} />
                    <span>Upload Photo</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUploadSimulate} style={{ display: 'none' }} />
                  </label>
                </div>
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

      {ratingTicketId && (
        <div className="modal-backdrop">
          <div className="modal-box" style={{ maxWidth: '440px' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#F8FAFC', marginBottom: '10px' }}>
              Rate Redressal Quality
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8', marginBottom: '18px' }}>
              How satisfied are you with the officer's resolution? This directly feeds the city's 4.7/5 CSAT rating.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', margin: '20px 0' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelectedRating(star)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    transform: selectedRating >= star ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.15s'
                  }}
                >
                  <Star
                    size={32}
                    color="#F59E0B"
                    fill={selectedRating >= star ? '#F59E0B' : 'transparent'}
                  />
                </button>
              ))}
            </div>

            <div style={{ textAlign: 'center', color: '#F59E0B', fontWeight: '700', fontSize: '1rem', marginBottom: '18px' }}>
              {selectedRating === 5 && '⭐⭐⭐⭐⭐ Excellent (Fast & Clean)'}
              {selectedRating === 4 && '⭐⭐⭐⭐ Good (Resolved as expected)'}
              {selectedRating === 3 && '⭐⭐⭐ Satisfactory'}
              {selectedRating === 2 && '⭐⭐ Needs Improvement'}
              {selectedRating === 1 && '⭐ Poor Turnaround'}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setRatingTicketId(null)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSubmitRating(ratingTicketId)}
                className="btn btn-emerald"
              >
                Submit Citizen Rating
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CitizenSelfServicePortal;
