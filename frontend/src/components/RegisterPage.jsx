import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import api from '../services/api';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  MapPin, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  Sparkles,
  CreditCard
} from 'lucide-react';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    ward: 'Ward 1 - Central Zone',
    nationalId: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const wards = [
    'Ward 1 - Central Zone',
    'Ward 2 - North Commercial Hub',
    'Ward 3 - East Residential Zone',
    'Ward 4 - South Extension & Tech Hub',
    'Ward 5 - West Industrial Belt',
    'Ward 6 - Riverside Green Zone',
    'Ward 7 - Metro Corridor',
    'Ward 8 - Heritage Old City',
    'Ward 9 - Knowledge & University District',
    'Ward 10 - Airport & Logistics Hub',
    'Ward 11 - Lakefront Zone',
    'Ward 12 - Sub-Urban Colony'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!formData.fullName.trim() || !formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Please fill in all mandatory fields (Name, Username, Email, Password).');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        username: formData.username.trim().toLowerCase(),
        password: formData.password,
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || '+91 9876543210',
        ward: formData.ward,
        nationalId: formData.nationalId.trim() || `IND-MUNI-${Date.now().toString().slice(-6)}`
      };

      const res = await api.post('/auth/register', payload);
      setSuccessMessage('Registration successful! Redirecting to Sign In portal...');
      
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            registeredUsername: payload.username,
            registeredPassword: payload.password,
            notice: 'Citizen account created successfully! Click Sign In to access your portal.' 
          } 
        });
      }, 1200);

    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Registration failed. Please check if username/email already exists.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-canvas">
      <div className="login-card" style={{ maxWidth: '580px', width: '100%', position: 'relative' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.82rem', textDecoration: 'none', transition: 'color 0.2s' }}>
            <ArrowLeft size={16} />
            <span>Return to Portal</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ThemeToggle />
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '3px 10px', borderRadius: '9999px', fontSize: '0.68rem', color: 'var(--accent-emerald)', fontWeight: '700' }}>
              <Sparkles size={12} />
              <span>ONBOARDING</span>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Logo size={48} className="mx-auto mb-2" />
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            New Citizen Registration
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '4px' }}>
            Create your verified municipal account to file grievances, apply for civic certificates, and track applications.
          </p>
        </div>

        {error && (
          <div className="alert-box alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="alert-box alert-success" style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid var(--accent-emerald)', color: 'var(--accent-emerald)' }}>
            <CheckCircle2 size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '14px' }}>
            
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <div className="input-icon-wrapper">
                <input
                  type="text"
                  name="fullName"
                  className="form-input"
                  placeholder="e.g. Aarav Sharma"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Username *</label>
              <input
                type="text"
                name="username"
                className="form-input"
                placeholder="e.g. aarav_sharma"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                className="form-input"
                placeholder="e.g. aarav@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <input
                type="text"
                name="phone"
                className="form-input"
                placeholder="e.g. +91 98765 43210"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Residential Ward *</label>
              <select
                name="ward"
                className="form-input"
                value={formData.ward}
                onChange={handleChange}
              >
                {wards.map((w, idx) => (
                  <option key={idx} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Aadhaar / Voter ID (Optional)</label>
              <input
                type="text"
                name="nationalId"
                className="form-input"
                placeholder="e.g. IND-DL-882190"
                value={formData.nationalId}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <div className="input-icon-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className="form-input"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="input-icon-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password *</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                className="form-input"
                placeholder="Re-enter password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-emerald"
            style={{ width: '100%', padding: '12px', marginTop: '16px', fontSize: '0.95rem', fontWeight: '700' }}
          >
            {isSubmitting ? 'Registering Citizen Profile...' : 'Complete Registration & Sign Up'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '18px', paddingTop: '14px', borderTop: '1px solid var(--border-card)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <span>Already registered as a resident or municipal staff? </span>
          <Link to="/login" style={{ color: 'var(--accent-emerald)', fontWeight: '700', textDecoration: 'none' }}>
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
