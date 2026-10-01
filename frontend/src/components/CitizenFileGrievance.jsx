import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  AlertTriangle, 
  MapPin, 
  Camera, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ShieldAlert, 
  Sparkles,
  Droplets,
  Layers
} from 'lucide-react';

export const CitizenFileGrievance = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    citizenName: user?.fullName || 'Rahul Sharma',
    category: 'Water Supply',
    priority: 'HIGH',
    ward: user?.ward || 'Ward 1 - Downtown Metro',
    landmark: 'Opposite Central Park Gate No. 2',
    description: 'Major underground pipe burst causing road flooding and severe low pressure in residential blocks.'
  });

  const [photoPreview, setPhotoPreview] = useState('https://images.unsplash.com/photo-1584467735815-f778f274e296?w=400');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState('');

  const categories = [
    { name: 'Water Supply & Pipelines', deptId: 1, icon: Droplets, color: '#06B6D4' },
    { name: 'Roads, Potholes & Footpaths', deptId: 4, icon: Layers, color: '#F59E0B' },
    { name: 'Sanitation & Solid Waste', deptId: 2, icon: AlertTriangle, color: '#EF4444' },
    { name: 'Street Lighting & Signals', deptId: 4, icon: Sparkles, color: '#8B5CF6' },
    { name: 'Public Health Hazards', deptId: 2, icon: ShieldAlert, color: '#10B981' }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.description.trim()) {
      setError('Please provide issue details.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        citizenName: formData.citizenName,
        category: formData.category,
        priority: formData.priority,
        ward: formData.ward,
        description: `${formData.description} (Landmark: ${formData.landmark})`,
        status: 'SUBMITTED',
        proofPhoto: photoPreview,
        department: { id: 1 }
      };

      const res = await api.post('/citizen/grievances', payload);
      setSuccessData(res.data);
    } catch (err) {
      setError('Failed to lodge grievance ticket. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Public Grievance Redressal Cell</h1>
          <p className="page-description">
            Report civic infrastructure faults, pipeline bursts, sanitation lapses, or hazardous conditions with photo evidence.
          </p>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '6px 14px', borderRadius: '8px', color: '#EF4444', fontSize: '0.85rem', fontWeight: '600' }}>
          <Clock size={16} />
          <span>Guaranteed 47h MTTR SLA</span>
        </div>
      </div>

      {successData ? (
        <div className="card" style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center', padding: '40px 32px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
            <CheckCircle2 size={36} />
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#F8FAFC', marginBottom: '8px' }}>
            Grievance Logged & Assigned to Ward Unit!
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '24px' }}>
            Your complaint has been registered in the city grievance matrix and dispatched to the on-duty Ward Field Officer.
          </p>

          <div style={{ background: '#0A0F1D', border: '1px dashed #06B6D4', borderRadius: '12px', padding: '20px', display: 'inline-block', marginBottom: '28px', minWidth: '320px' }}>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Redressal Tracking Docket
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#06B6D4', marginTop: '4px' }}>
              {successData.ticketNumber || 'GRV-2026-9921'}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#10B981', marginTop: '6px' }}>
              Statutory MTTR Countdown: 47 Hours Active
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link to="/citizen-portal" className="btn btn-emerald" style={{ padding: '12px 24px' }}>
              <span>Track in My Dockets</span>
              <ArrowRight size={16} />
            </Link>
            <button
              onClick={() => {
                setSuccessData(null);
              }}
              className="btn btn-outline"
            >
              Lodge Another Complaint
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          
          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#F8FAFC', marginBottom: '16px' }}>
              1. Grievance Details & Priority
            </h3>

            {error && (
              <div className="alert-box alert-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  name="category"
                  className="form-input"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="Water Supply">Water Supply & Pipeline Leaks</option>
                  <option value="Roads & Potholes">Roads, Potholes & Footpaths</option>
                  <option value="Sanitation & Waste">Sanitation & Solid Waste</option>
                  <option value="Street Lighting">Street Lighting & Electrical</option>
                  <option value="Public Health">Public Health Hazards</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Urgency Priority</label>
                  <select
                    name="priority"
                    className="form-input"
                    value={formData.priority}
                    onChange={handleInputChange}
                  >
                    <option value="CRITICAL">CRITICAL (Hazardous)</option>
                    <option value="HIGH">HIGH (Urgent Redressal)</option>
                    <option value="MEDIUM">MEDIUM (Standard)</option>
                    <option value="LOW">LOW (Maintenance)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Ward Jurisdiction</label>
                  <input
                    type="text"
                    name="ward"
                    className="form-input"
                    value={formData.ward}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Specific Landmark / Location</label>
                <div className="input-icon-wrapper">
                  <input
                    type="text"
                    name="landmark"
                    className="form-input"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    placeholder="e.g. Near Market Gate / Pole #42"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description of Issue</label>
                <textarea
                  name="description"
                  className="form-input"
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Explain the issue clearly..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-emerald"
                style={{ width: '100%', padding: '12px', fontSize: '0.95rem', fontWeight: '700', marginTop: '10px' }}
              >
                {isSubmitting ? 'Dispatching to Field Unit...' : 'Lodge Grievance & Trigger MTTR Clock'}
              </button>
            </form>
          </div>

          <div>
            <div className="card" style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#F8FAFC', marginBottom: '12px' }}>
                2. Photo Evidence & On-Site Verification
              </h3>
              <p style={{ color: '#94A3B8', fontSize: '0.82rem', marginBottom: '14px' }}>
                Attaching clear photos helps field engineers diagnose pipeline, road, and waste issues faster.
              </p>

              <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden', border: '1px solid #1E2C4A', height: '200px', marginBottom: '14px' }}>
                <img
                  src={photoPreview}
                  alt="Proof preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.7)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.72rem', color: '#F8FAFC' }}>
                  Live Attachment
                </div>
              </div>

              <label className="btn btn-outline" style={{ width: '100%', cursor: 'pointer', textAlign: 'center', justifyContent: 'center' }}>
                <Camera size={16} />
                <span>Upload New Evidence Photo</span>
                <input type="file" accept="image/*" onChange={handlePhotoUploadSimulate} style={{ display: 'none' }} />
              </label>
            </div>

            <div className="card" style={{ background: 'rgba(6, 182, 212, 0.08)', border: '1px solid rgba(6, 182, 212, 0.25)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#06B6D4', fontWeight: '700', fontSize: '0.9rem', marginBottom: '6px' }}>
                <Clock size={18} />
                <span>Statutory 47-Hour Redressal Promise</span>
              </div>
              <p style={{ fontSize: '0.82rem', color: '#94A3B8', lineHeight: '1.5' }}>
                Under the Municipal Citizen Charter, all logged grievances automatically start the 47-hour MTTR countdown clock. Ward supervisors are alerted if SLA approaches benchmark limits.
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default CitizenFileGrievance;
