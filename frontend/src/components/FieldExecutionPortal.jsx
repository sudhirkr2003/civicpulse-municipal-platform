import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ListTodo, CheckCircle2, Clock, MapPin, AlertTriangle, ArrowRight, Camera, Check, X } from 'lucide-react';

export const FieldExecutionPortal = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [notes, setNotes] = useState('');
  const [proofPhoto, setProofPhoto] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/field/tasks');
      setData(res.data);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (taskId, nextStatus) => {
    try {
      setSubmitting(true);
      await api.patch(`/field/tasks/${taskId}/status`, {
        status: nextStatus,
        notes: notes || 'Field operation completed according to municipal SOP',
        proofPhoto: proofPhoto || 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=400'
      });
      setSelectedTask(null);
      setNotes('');
      setProofPhoto('');
      fetchTasks();
    } catch (err) {
      alert('Failed to update task status');
    } finally {
      setSubmitting(false);
    }
  };

  const tasks = data?.tasks || [];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Field Officer Task Execution Queue</h1>
          <p className="page-description">
            Ward 4 jurisdiction task stream: Ticket progression, proof uploads, and MTTR redressal sync.
          </p>
        </div>
        <div style={{ background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '6px 14px', borderRadius: '8px', color: '#3B82F6', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MapPin size={16} />
          <span>Assigned: {data?.ward || 'Ward 4 - Tech Corridor'}</span>
        </div>
      </div>

      <div className="citizen-collage-grid">
        <div className="card citizen-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '4px' }}>
            <div className="summary-label">Work Queue</div>
            <div className="kpi-icon-pill" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6' }}>
              <ListTodo size={16} />
            </div>
          </div>
          <div className="summary-value" style={{ color: '#38BDF8' }}>{data?.totalAssigned || 6}</div>
          <div className="kpi-subtext">
            <span className="badge-trend primary" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
              <span>Ward 4 Stream</span>
            </span>
          </div>
        </div>

        <div className="card citizen-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '4px' }}>
            <div className="summary-label">Pending Action</div>
            <div className="kpi-icon-pill" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444' }}>
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="summary-value" style={{ color: '#EF4444' }}>{data?.pendingTasks || 2}</div>
          <div className="kpi-subtext">
            <span className="badge-trend danger" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
              <span>SLA Clock Active</span>
            </span>
          </div>
        </div>

        <div className="card citizen-kpi-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', gap: '4px' }}>
            <div className="summary-label">Closed Verified</div>
            <div className="kpi-icon-pill" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981' }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="summary-value" style={{ color: '#10B981' }}>{data?.resolvedTasks || 4}</div>
          <div className="kpi-subtext">
            <span className="badge-trend success" style={{ fontSize: '0.65rem', padding: '1px 5px' }}>
              <span>100% Redressal</span>
            </span>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '16px', color: '#F8FAFC' }}>
          Assigned Field Task Work Orders
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="table-custom">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Category</th>
                <th>Description</th>
                <th>Priority</th>
                <th>Current Status</th>
                <th>Action Transition</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => {
                const isResolved = task.status === 'RESOLVED';
                return (
                  <tr key={task.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', color: '#38BDF8', fontWeight: '600' }}>
                      {task.ticketNumber}
                    </td>
                    <td style={{ fontWeight: '600' }}>{task.category}</td>
                    <td style={{ color: '#94A3B8', maxWidth: '280px' }}>{task.description}</td>
                    <td>
                      <span className={`badge-trend ${task.priority === 'CRITICAL' || task.priority === 'HIGH' ? 'danger' : 'primary'}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td>
                      <span className={`badge-trend ${isResolved ? 'success' : task.status === 'IN_PROGRESS' ? 'primary' : 'danger'}`}>
                        {task.status}
                      </span>
                    </td>
                    <td>
                      {!isResolved ? (
                        <div style={{ display: 'flex', gap: '5px' }}>
                          {task.status === 'SUBMITTED' && (
                            <button
                              onClick={() => handleUpdateStatus(task.id, 'IN_PROGRESS')}
                              disabled={submitting}
                              className="btn btn-primary"
                              style={{ padding: '3px 8px', fontSize: '0.70rem' }}
                            >
                              <span>Start Task</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedTask(task);
                              setNotes(task.resolutionNotes || '');
                              setProofPhoto(task.proofPhoto || '');
                            }}
                            className="btn btn-emerald"
                            style={{ padding: '3px 8px', fontSize: '0.70rem' }}
                          >
                            <Check size={11} />
                            <span>Resolve with Proof</span>
                          </button>
                        </div>
                      ) : (
                        <span style={{ color: '#10B981', fontSize: '0.72rem', fontWeight: '600' }}>
                          Closed ({task.mttrHours}h MTTR)
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTask && (
        <div className="modal-backdrop">
          <div className="modal-box" style={{ maxWidth: '520px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: '#F8FAFC' }}>
                Complete Task #{selectedTask.ticketNumber}
              </h3>
              <button onClick={() => setSelectedTask(null)} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '16px', background: '#0A0F1D', padding: '12px', borderRadius: '8px', border: '1px solid #1E2C4A' }}>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>ISSUE SUMMARY</div>
              <div style={{ color: '#F8FAFC', fontWeight: '600', marginTop: '2px' }}>{selectedTask.description}</div>
            </div>

            <div className="form-group">
              <label className="form-label">Field Resolution Notes</label>
              <textarea
                className="form-input"
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe actions taken (e.g., valve replaced, asphalt compacted)..."
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Proof Photo / Documentation URL</label>
              <input
                type="text"
                className="form-input"
                value={proofPhoto}
                onChange={(e) => setProofPhoto(e.target.value)}
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button onClick={() => setSelectedTask(null)} className="btn btn-outline">
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedTask.id, 'RESOLVED')}
                disabled={submitting}
                className="btn btn-emerald"
              >
                {submitting ? 'Submitting...' : 'Submit Resolution'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FieldExecutionPortal;
