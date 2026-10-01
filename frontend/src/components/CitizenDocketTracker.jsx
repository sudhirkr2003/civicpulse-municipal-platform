import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  Star, 
  AlertCircle, 
  XCircle, 
  Filter, 
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  Layers,
  Activity,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const CitizenDocketTracker = () => {
  const { user } = useAuth();
  const [portalData, setPortalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const [ratingTicketId, setRatingTicketId] = useState(null);
  const [selectedRating, setSelectedRating] = useState(5);
  const [activeStageDocket, setActiveStageDocket] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
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
    if (!window.confirm(`Are you sure you want to cancel complaint ${ticketNo}?`)) return;
    try {
      await api.post(`/citizen/grievances/${id}/withdraw`);
      setActionSuccess(`Complaint ${ticketNo} was cancelled.`);
      fetchData();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (e) {
      alert('Failed to cancel complaint.');
    }
  };

  const handleWithdrawService = async (id, requestNo) => {
    if (!window.confirm(`Are you sure you want to cancel service application ${requestNo}?`)) return;
    try {
      await api.post(`/citizen/services/${id}/withdraw`);
      setActionSuccess(`Application ${requestNo} was cancelled.`);
      fetchData();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (e) {
      alert('Failed to cancel service request.');
    }
  };

  const handleSubmitRating = async (ticketId) => {
    try {
      await api.post(`/citizen/rate/${ticketId}`, { rating: selectedRating });
      setActionSuccess(`Thank you! Your ${selectedRating}-star rating was recorded.`);
      setRatingTicketId(null);
      fetchData();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (e) {
      alert('Failed to record rating.');
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
      ward: g.ward ? (g.ward.includes(' - ') ? g.ward.split(' - ')[0] : g.ward) : 'Ward 1',
      status: g.status,
      sla: g.mttrHours ? `${g.mttrHours}h MTTR` : '47h SLA',
      isComplaint: true,
      satisfactionRating: g.satisfactionRating,
      createdAt: g.createdAt
    })),
    ...serviceRequests.map(s => ({
      id: s.id,
      docId: s.requestNumber,
      type: 'Service',
      title: s.serviceType,
      details: s.serviceType,
      ward: s.ward ? (s.ward.includes(' - ') ? s.ward.split(' - ')[0] : s.ward) : 'Ward 1',
      status: s.status,
      sla: s.turnaroundDays ? `${s.turnaroundDays}d SLA` : '2.4d SLA',
      isComplaint: false,
      satisfactionRating: null,
      createdAt: s.submissionDate
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
    if (filterType === 'ACTIVE') return item.status !== 'RESOLVED' && item.status !== 'WITHDRAWN';
    if (filterType === 'RESOLVED') return item.status === 'RESOLVED';
    if (filterType === 'COMPLAINTS') return item.isComplaint;
    if (filterType === 'SERVICES') return !item.isComplaint;
    return true;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Track My Dockets & Applications</h1>
          <p className="page-description">
            Real-time status tracking for all your submitted municipal complaints and service applications.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/citizen-portal" className="btn btn-outline">
            ← Return to Dashboard
          </Link>
        </div>
      </div>

      {actionSuccess && (
        <div className="alert-box alert-success" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#10B981', marginBottom: '20px' }}>
          <CheckCircle2 size={20} />
          <span>{actionSuccess}</span>
        </div>
      )}

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#F8FAFC' }}>
              Docket Ledger ({filteredItems.length} Total)
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#94A3B8', marginTop: '2px' }}>
              Track turnaround progression, cancel pending requests, or submit resolution star ratings.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', width: '100%', maxWidth: '720px' }}>
            <div style={{ display: 'flex', gap: '4px', background: '#0A0F1D', padding: '4px', borderRadius: '8px', border: '1px solid #1E2C4A', flexWrap: 'wrap', flex: '1 1 auto' }}>
              <button
                onClick={() => setFilterType('ALL')}
                style={{
                  background: filterType === 'ALL' ? '#10B981' : 'transparent',
                  color: filterType === 'ALL' ? '#0A0F1D' : '#94A3B8',
                  fontWeight: filterType === 'ALL' ? '700' : '500',
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
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
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
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
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
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
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
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
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Services ({serviceRequests.length})
              </button>
            </div>

            <div style={{ flex: '1 1 180px', minWidth: '150px' }}>
              <input
                type="text"
                className="form-input"
                style={{ padding: '6px 12px', fontSize: '0.82rem', width: '100%' }}
                placeholder="Search docket ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="table-custom" style={{ width: '100%', minWidth: '700px' }}>
            <thead>
              <tr>
                <th style={{ width: '110px', whiteSpace: 'nowrap', padding: '10px 8px' }}>Docket ID</th>
                <th style={{ width: '70px', whiteSpace: 'nowrap', padding: '10px 8px' }}>Type</th>
                <th style={{ width: '170px', whiteSpace: 'nowrap', padding: '10px 8px' }}>Details</th>
                <th style={{ width: '75px', whiteSpace: 'nowrap', padding: '10px 8px' }}>Ward</th>
                <th style={{ width: '85px', whiteSpace: 'nowrap', padding: '10px 8px' }}>Status</th>
                <th style={{ width: '75px', whiteSpace: 'nowrap', padding: '10px 8px' }}>SLA</th>
                <th style={{ width: '130px', whiteSpace: 'nowrap', textAlign: 'right', padding: '10px 8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '28px', color: '#94A3B8' }}>
                    No dockets found matching the filter.
                  </td>
                </tr>
              ) : (
                filteredItems.map((item, idx) => {
                  const isResolved = item.status === 'RESOLVED';
                  const isWithdrawn = item.status === 'WITHDRAWN';

                  return (
                    <tr key={`${item.docId}-${idx}`}>
                      <td style={{ fontFamily: 'var(--font-mono)', color: '#38BDF8', fontWeight: '700', whiteSpace: 'nowrap', fontSize: '0.8rem', padding: '8px 8px' }}>
                        {item.docId}
                      </td>
                      <td style={{ whiteSpace: 'nowrap', padding: '8px 8px' }}>
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: '700',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: item.isComplaint ? 'rgba(239, 68, 68, 0.12)' : 'rgba(6, 182, 212, 0.12)',
                          color: item.isComplaint ? '#EF4444' : '#06B6D4',
                          border: `1px solid ${item.isComplaint ? 'rgba(239, 68, 68, 0.3)' : 'rgba(6, 182, 212, 0.3)'}`
                        }}>
                          {item.type}
                        </span>
                      </td>
                      <td style={{ padding: '8px 8px' }}>
                        <div style={{ fontWeight: '600', color: '#F8FAFC', whiteSpace: 'nowrap', maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.82rem' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#94A3B8', maxWidth: '170px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.details}
                        </div>
                      </td>
                      <td style={{ color: '#94A3B8', whiteSpace: 'nowrap', fontSize: '0.78rem', padding: '8px 8px' }}>{item.ward}</td>
                      <td style={{ whiteSpace: 'nowrap', padding: '8px 8px' }}>
                        <span className={`badge-trend ${isResolved ? 'success' : isWithdrawn ? 'danger' : 'primary'}`} style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                          {item.status}
                        </span>
                      </td>
                      <td style={{ color: '#94A3B8', fontSize: '0.75rem', whiteSpace: 'nowrap', padding: '8px 8px' }}>
                        {item.sla}
                      </td>
                      <td style={{ textAlign: 'right', whiteSpace: 'nowrap', padding: '8px 8px' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                          {isResolved ? (
                            item.isComplaint ? (
                              item.satisfactionRating ? (
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#F59E0B', fontSize: '0.75rem', fontWeight: '700', background: 'rgba(245, 158, 11, 0.12)', padding: '2px 6px', borderRadius: '4px' }}>
                                  <Star size={11} fill="#F59E0B" />
                                  <span>{item.satisfactionRating}/5 Rated</span>
                                </span>
                              ) : (
                                <button
                                  onClick={() => setRatingTicketId(item.id)}
                                  className="btn btn-outline"
                                  style={{ padding: '3px 8px', fontSize: '0.72rem', color: '#F59E0B', borderColor: 'rgba(245, 158, 11, 0.4)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                                >
                                  <Star size={11} fill="#F59E0B" />
                                  <span>Rate</span>
                                </button>
                              )
                            ) : (
                              <span style={{ color: '#10B981', fontSize: '0.72rem', fontWeight: '700', background: 'rgba(16, 185, 129, 0.12)', padding: '2px 6px', borderRadius: '4px' }}>
                                Approved
                              </span>
                            )
                          ) : isWithdrawn ? (
                            <span style={{ color: '#EF4444', fontSize: '0.72rem', fontWeight: '700', background: 'rgba(239, 68, 68, 0.12)', padding: '2px 6px', borderRadius: '4px' }}>
                              Withdrawn
                            </span>
                          ) : (
                            <>
                              <button
                                onClick={() => setActiveStageDocket(item)}
                                className="btn btn-outline"
                                style={{ padding: '3px 8px', fontSize: '0.72rem', color: '#06B6D4', borderColor: 'rgba(6,182,212,0.4)' }}
                                title="View stage progression timeline"
                              >
                                Track
                              </button>
                              <button
                                onClick={() => item.isComplaint ? handleWithdrawGrievance(item.id, item.docId) : handleWithdrawService(item.id, item.docId)}
                                className="btn btn-outline"
                                style={{ padding: '3px 8px', fontSize: '0.72rem', color: '#EF4444', borderColor: 'rgba(239, 68, 68, 0.4)' }}
                                title="Cancel this request"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {activeStageDocket && (
        <div className="modal-backdrop">
          <div className="modal-box" style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#F8FAFC' }}>
                  Docket Timeline: {activeStageDocket.docId}
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>{activeStageDocket.title} • {activeStageDocket.ward}</div>
              </div>
              <button onClick={() => setActiveStageDocket(null)} className="input-icon-btn">
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', margin: '20px 0' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#10B981', color: '#0A0F1D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.8rem' }}>✓</div>
                <div>
                  <div style={{ fontWeight: '700', color: '#F8FAFC', fontSize: '0.9rem' }}>1. Submission & Docket Registration</div>
                  <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Digital ticket created and logged in the municipal ledger.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#10B981', color: '#0A0F1D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.8rem' }}>✓</div>
                <div>
                  <div style={{ fontWeight: '700', color: '#F8FAFC', fontSize: '0.9rem' }}>2. Ward Officer Assignment</div>
                  <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Assigned to Ward On-Duty Engineering / Sanitation Unit.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: activeStageDocket.status === 'RESOLVED' ? '#10B981' : '#3B82F6', color: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.8rem' }}>
                  {activeStageDocket.status === 'RESOLVED' ? '✓' : '3'}
                </div>
                <div>
                  <div style={{ fontWeight: '700', color: '#F8FAFC', fontSize: '0.9rem' }}>3. On-Site Inspection & Work Execution</div>
                  <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                    {activeStageDocket.status === 'RESOLVED' ? 'Completed and verified by field staff.' : 'In progress by ward engineering crew.'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: activeStageDocket.status === 'RESOLVED' ? '#10B981' : '#1E2C4A', color: '#94A3B8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.8rem' }}>
                  {activeStageDocket.status === 'RESOLVED' ? '✓' : '4'}
                </div>
                <div>
                  <div style={{ fontWeight: '700', color: activeStageDocket.status === 'RESOLVED' ? '#10B981' : '#94A3B8', fontSize: '0.9rem' }}>4. Final Redressal & Verification</div>
                  <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                    {activeStageDocket.status === 'RESOLVED' ? 'Issue closed. Citizen feedback requested.' : 'Pending final inspection closure.'}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button onClick={() => setActiveStageDocket(null)} className="btn btn-outline">
                Close Tracker
              </button>
            </div>
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

export default CitizenDocketTracker;
