import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Activity, 
  Droplets, 
  DollarSign, 
  FileText, 
  Building2, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  UploadCloud, 
  ShieldCheck,
  CreditCard,
  Sparkles
} from 'lucide-react';

export const CitizenApplyService = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [selectedService, setSelectedService] = useState('Smart Water Meter Calibration');
  const [formData, setFormData] = useState({
    citizenName: user?.fullName || 'Rahul Sharma',
    email: user?.email || 'citizen@civicpulse.gov',
    phone: '+91 98765 43210',
    ward: user?.ward || 'Ward 1 - Central Zone',
    propertyAddress: 'Flat 402, Green Valley Apartments, MG Road',
    propertyId: 'PROP-2026-8812',
    applicantCategory: 'Residential Resident',
    remarks: 'Requesting installation and smart digital calibration.'
  });

  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [error, setError] = useState('');

  const servicesCatalog = [
    {
      id: 'water',
      title: 'Smart Water Meter Calibration & New Line',
      department: 'Water Management (WTR)',
      deptId: 1,
      slaDays: '2.1 Days',
      fee: '$25.00 (₹2,100)',
      icon: Droplets,
      color: '#06B6D4'
    },
    {
      id: 'license',
      title: 'Commercial Trade License Renewal',
      department: 'Revenue & Treasury (REV)',
      deptId: 5,
      slaDays: '2.4 Days',
      fee: '$65.00 (₹5,400)',
      icon: FileText,
      color: '#10B981'
    },
    {
      id: 'building',
      title: 'Building Plan Scrutiny & Structural NOC',
      department: 'Roads & Infrastructure (RDS)',
      deptId: 4,
      slaDays: '3.0 Days',
      fee: '$120.00 (₹10,000)',
      icon: Building2,
      color: '#8B5CF6'
    },
    {
      id: 'property',
      title: 'Commercial Property Tax Assessment',
      department: 'Revenue & Treasury (REV)',
      deptId: 5,
      slaDays: '1.8 Days',
      fee: '$15.00 (₹1,250)',
      icon: DollarSign,
      color: '#F59E0B'
    },
    {
      id: 'certificate',
      title: 'Birth & Civil Registration Certificate',
      department: 'Public Health (HLT)',
      deptId: 2,
      slaDays: '1.5 Days',
      fee: '$10.00 (₹800)',
      icon: Award,
      color: '#EC4899'
    }
  ];

  const currentServiceObj = servicesCatalog.find(s => s.title === selectedService) || servicesCatalog[0];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileSimulate = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const payload = {
        citizenName: formData.citizenName,
        serviceType: selectedService,
        ward: formData.ward,
        status: 'SUBMITTED',
        department: { id: currentServiceObj.deptId }
      };

      const res = await api.post('/citizen/services', payload);
      setSuccessData(res.data);
    } catch (err) {
      setError('Failed to submit municipal service application. Please retry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Civic Services Application Wizard</h1>
          <p className="page-description">
            Apply online for statutory municipal connections, commercial clearances, certificates, and tax assessments.
          </p>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '6px 14px', borderRadius: '8px', color: '#10B981', fontSize: '0.85rem', fontWeight: '600' }}>
          <ShieldCheck size={16} />
          <span>Statutory SLA Protected</span>
        </div>
      </div>

      {successData ? (
        <div className="card" style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center', padding: '40px 32px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
            <CheckCircle2 size={36} />
          </div>

          <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#F8FAFC', marginBottom: '8px' }}>
            Application Submitted Successfully!
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginBottom: '24px' }}>
            Your municipal service request has been queued in the departmental ledger with official tracking code:
          </p>

          <div style={{ background: '#0A0F1D', border: '1px dashed #10B981', borderRadius: '12px', padding: '20px', display: 'inline-block', marginBottom: '28px', minWidth: '320px' }}>
            <div style={{ fontSize: '0.78rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Statutory Docket Reference
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: '800', fontFamily: 'var(--font-mono)', color: '#38BDF8', marginTop: '4px' }}>
              {successData.requestNumber || 'SR-2026-8819'}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#10B981', marginTop: '6px' }}>
              Target Resolution: {currentServiceObj.slaDays} (94% SLA Track)
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <Link to="/citizen-portal" className="btn btn-emerald" style={{ padding: '12px 24px' }}>
              <span>View in My Docket Tracker</span>
              <ArrowRight size={16} />
            </Link>
            <button
              onClick={() => {
                setSuccessData(null);
                setUploadedFile(null);
              }}
              className="btn btn-outline"
            >
              Apply for Another Service
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#F8FAFC', marginBottom: '14px' }}>
              1. Select Municipal Service Category
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {servicesCatalog.map((s) => {
                const Icon = s.icon;
                const isSelected = selectedService === s.title;
                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedService(s.title)}
                    style={{
                      background: isSelected ? 'rgba(6, 182, 212, 0.1)' : '#131C31',
                      border: `1.5px solid ${isSelected ? s.color : '#1E2C4A'}`,
                      borderRadius: '12px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px'
                    }}
                  >
                    <div style={{ background: `${s.color}20`, color: s.color, padding: '10px', borderRadius: '10px' }}>
                      <Icon size={24} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '700', color: '#F8FAFC', fontSize: '0.95rem' }}>{s.title}</div>
                      <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '2px' }}>{s.department}</div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '6px', fontSize: '0.75rem' }}>
                        <span style={{ color: '#10B981', fontWeight: '600' }}>SLA: {s.slaDays}</span>
                        <span style={{ color: '#94A3B8' }}>Fee: {s.fee}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#F8FAFC', marginBottom: '16px' }}>
              2. Applicant & Property Details
            </h3>

            {error && (
              <div className="alert-box alert-error">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Applicant Full Name</label>
                <input
                  type="text"
                  name="citizenName"
                  className="form-input"
                  value={formData.citizenName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">Mobile Contact</label>
                  <input
                    type="text"
                    name="phone"
                    className="form-input"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
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
                <label className="form-label">Property / Premises Address</label>
                <input
                  type="text"
                  name="propertyAddress"
                  className="form-input"
                  value={formData.propertyAddress}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Supporting Document (Identity / Ownership Proof)</label>
                <label style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  padding: '20px', 
                  border: '1.5px dashed #1E2C4A', 
                  borderRadius: '10px', 
                  background: '#0A0F1D', 
                  cursor: 'pointer' 
                }}>
                  <UploadCloud size={24} style={{ color: '#06B6D4', marginBottom: '6px' }} />
                  <span style={{ fontSize: '0.82rem', color: '#F8FAFC', fontWeight: '600' }}>
                    {uploadedFile || 'Click to attach PDF / JPEG proof'}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8', marginTop: '2px' }}>
                    Max 5MB (Aadhaar, Deed, or Trade NOC)
                  </span>
                  <input type="file" onChange={handleFileSimulate} style={{ display: 'none' }} />
                </label>
              </div>

              <div style={{ background: '#0A0F1D', padding: '14px', borderRadius: '10px', border: '1px solid #1E2C4A', margin: '18px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94A3B8' }}>
                  <span>Statutory Processing Fee:</span>
                  <strong style={{ color: '#10B981' }}>{currentServiceObj.fee}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#94A3B8', marginTop: '4px' }}>
                  <span>Guaranteed Turnaround SLA:</span>
                  <strong style={{ color: '#06B6D4' }}>{currentServiceObj.slaDays}</strong>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-emerald"
                style={{ width: '100%', padding: '12px', fontSize: '0.95rem', fontWeight: '700' }}
              >
                {isSubmitting ? 'Submitting Application...' : 'Submit Service Application & Pay Online'}
              </button>
            </form>
          </div>

        </div>
      )}
    </div>
  );
};

export default CitizenApplyService;
