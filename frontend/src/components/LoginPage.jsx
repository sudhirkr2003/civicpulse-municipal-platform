import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  User, 
  ShieldCheck, 
  AlertCircle, 
  Building2, 
  FileText, 
  CheckCircle2, 
  Users, 
  ArrowLeft,
  Info
} from 'lucide-react';

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.registeredUsername) {
      setUsername(location.state.registeredUsername);
      if (location.state.registeredPassword) {
        setPassword(location.state.registeredPassword);
      }
      setNotice(location.state.notice || 'Citizen registered! Click Sign In to access your portal.');
    }
  }, [location.state]);

  const handleRoleRedirect = (role) => {
    switch (role) {
      case 'DEPT_HEAD':
        navigate('/dept-dashboard');
        break;
      case 'FIELD_OFFICER':
        navigate('/field-tasks');
        break;
      case 'CITIZEN':
        navigate('/citizen-portal');
        break;
      default:
        navigate('/dashboard');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter username and password');
      return;
    }

    setIsSubmitting(true);
    const result = await login(username, password);
    setIsSubmitting(false);

    if (result.success) {
      handleRoleRedirect(result.role);
    } else {
      setError(result.error || 'Invalid username or password');
    }
  };

  const handleFillCredentials = (u, p, roleName) => {
    setUsername(u);
    setPassword(p);
    setError('');
    setNotice('');
  };

  return (
    <div className="login-canvas">
      <div className="login-card" style={{ maxWidth: '480px', width: '100%', position: 'relative' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '0.82rem', textDecoration: 'none' }}>
            <ArrowLeft size={16} />
            <span>Return to Portal</span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ThemeToggle />
            <div style={{ display: 'inline-block', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2px 8px', borderRadius: '9999px', fontSize: '0.68rem', color: 'var(--accent-emerald)', fontWeight: '700' }}>
              RBAC LOGIN
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Logo size={52} className="mx-auto mb-2" />
          <h1 style={{ fontSize: '1.6rem', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            CivicPulse Nexus
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '4px' }}>
            Municipal Executive Command & Intelligence Platform
          </p>
        </div>

        {error && (
          <div className="alert-box alert-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {notice && (
          <div className="alert-box alert-info" style={{ background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.35)', color: 'var(--accent-cyan)' }}>
            <Info size={18} />
            <span>{notice}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setNotice('');
              }}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-icon-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setNotice('');
                }}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="input-icon-btn"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-emerald"
            style={{ width: '100%', padding: '11px', marginTop: '6px', fontSize: '0.92rem', fontWeight: '700' }}
          >
            {isSubmitting ? 'Authenticating Role Session...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', margin: '14px 0 10px 0', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>New Resident? </span>
          <Link to="/register" style={{ color: 'var(--accent-emerald)', fontWeight: '700', textDecoration: 'none' }}>
            Register Citizen Account
          </Link>
        </div>

        <div style={{ position: 'relative', margin: '18px 0 12px 0', textAlign: 'center' }}>
          <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '1px', background: 'var(--border-card)' }}></div>
          <span style={{ position: 'relative', background: 'var(--bg-card)', padding: '0 10px', fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Demo Role Auto-Fill (Click to populate)
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
          <button
            type="button"
            onClick={() => handleFillCredentials('admin', 'Admin@123', 'Municipal Admin')}
            disabled={isSubmitting}
            className="btn btn-outline"
            style={{ fontSize: '0.75rem', padding: '8px', justifyContent: 'flex-start' }}
          >
            <ShieldCheck size={14} style={{ color: 'var(--accent-emerald)' }} />
            <span>Admin</span>
          </button>

          <button
            type="button"
            onClick={() => handleFillCredentials('water_head', 'Water@123', 'Water Dept Head')}
            disabled={isSubmitting}
            className="btn btn-outline"
            style={{ fontSize: '0.75rem', padding: '8px', justifyContent: 'flex-start' }}
          >
            <Building2 size={14} style={{ color: 'var(--accent-cyan)' }} />
            <span>Dept Head (Water)</span>
          </button>

          <button
            type="button"
            onClick={() => handleFillCredentials('auditor', 'Audit@123', 'Compliance Auditor')}
            disabled={isSubmitting}
            className="btn btn-outline"
            style={{ fontSize: '0.75rem', padding: '8px', justifyContent: 'flex-start' }}
          >
            <FileText size={14} style={{ color: 'var(--accent-purple)' }} />
            <span>Auditor</span>
          </button>

          <button
            type="button"
            onClick={() => handleFillCredentials('officer_ward4', 'Officer@123', 'Field Officer')}
            disabled={isSubmitting}
            className="btn btn-outline"
            style={{ fontSize: '0.75rem', padding: '8px', justifyContent: 'flex-start' }}
          >
            <CheckCircle2 size={14} style={{ color: 'var(--accent-blue)' }} />
            <span>Field Officer</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => handleFillCredentials('citizen_rahul', 'Citizen@123', 'Citizen (Rahul S.)')}
          disabled={isSubmitting}
          className="btn btn-outline"
          style={{ width: '100%', marginTop: '8px', fontSize: '0.75rem', padding: '8px', justifyContent: 'center' }}
        >
          <Users size={14} style={{ color: 'var(--accent-amber)' }} />
          <span>Citizen (Rahul S. - Resident View)</span>
        </button>

      </div>
    </div>
  );
};

export default LoginPage;
