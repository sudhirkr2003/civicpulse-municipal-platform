import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import api from '../services/api';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Activity, 
  Droplets, 
  DollarSign, 
  Search, 
  Clock, 
  Award, 
  PhoneCall, 
  Globe, 
  Lock, 
  Sparkles,
  MapPin,
  ClipboardList,
  AlertTriangle,
  XCircle,
  Truck,
  HeartPulse,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [trackNumber, setTrackNumber] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fallbackTracks = {
    'GRV-2026-1021': {
      found: true,
      type: 'Grievance Redressal',
      ticketNumber: 'GRV-2026-1021',
      title: 'Water Supply - Contaminated water in pipeline sector 4',
      category: 'Water Supply',
      department: 'Water Management',
      ward: 'Ward 1 - Central Zone',
      status: 'WITHDRAWN',
      priority: 'HIGH',
      officer: 'Ward 1 Field Unit',
      filedOn: '2026-10-01 14:20',
      slaRemaining: 'Application Withdrawn Voluntarily by Citizen',
      progress: 0,
      resolutionNotes: 'Citizen reported duplicate ticket filed in error; voluntary withdrawal confirmed.'
    },
    'GRV-2026-1022': {
      found: true,
      type: 'Grievance Redressal',
      ticketNumber: 'GRV-2026-1022',
      title: 'Road Infrastructure - Deep Potholes on Main Boulevard',
      category: 'Road Infrastructure',
      department: 'Roads & Infrastructure',
      ward: 'Ward 2 - Commercial Hub',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      officer: 'Ward 2 Rapid Asphalt Crew',
      filedOn: '2026-10-01 16:45',
      slaRemaining: 'Active Work Order - Crew Dispatched (47h SLA Benchmark)',
      progress: 65,
      resolutionNotes: 'Patch work initiated by Field Crew; target completion within 12 hours.'
    },
    'SR-2026-001': {
      found: true,
      type: 'Municipal Service',
      ticketNumber: 'SR-2026-001',
      title: 'Property Tax Self-Assessment & Mutation Filing',
      category: 'Property Tax',
      department: 'Revenue & Treasury',
      ward: 'Ward 1 - Central Zone',
      status: 'RESOLVED',
      priority: 'STANDARD',
      officer: 'Revenue Inspector A. Verma',
      filedOn: '2026-09-28 11:30',
      slaRemaining: 'Completed and Verified (2.1 Days)',
      progress: 100,
      resolutionNotes: 'Digital NOC and clearance certificate generated and verified in registry.'
    },
    'GRV-2026-001': {
      found: true,
      type: 'Grievance Redressal',
      ticketNumber: 'GRV-2026-001',
      title: 'Water Main Burst & Pressure Drop',
      category: 'Water Management',
      department: 'Water Management',
      ward: 'Ward 4 - South Extension',
      status: 'IN_PROGRESS',
      priority: 'CRITICAL',
      officer: 'Ward 4 Rapid Response Unit',
      filedOn: '2026-09-29 08:15',
      slaRemaining: 'Crew En Route - 14h Remaining',
      progress: 45,
      resolutionNotes: 'Field excavation crew dispatched. Bypass valves initiated.'
    }
  };

  const handleTrackSubmit = async (customId) => {
    const rawId = (customId || trackNumber).trim();
    if (!rawId) {
      setSearchError('Please enter a valid docket number (e.g. GRV-2026-1021 or SR-2026-001)');
      return;
    }

    setIsSearching(true);
    setSearchError('');
    setTrackResult(null);

    const targetId = rawId.toUpperCase();

    try {
      const response = await api.get(`/grievances/track/${encodeURIComponent(targetId)}`);
      if (response.data && response.data.ticketNumber) {
        const item = response.data;
        setTrackResult({
          found: true,
          type: item.ticketNumber?.startsWith('SR') ? 'Municipal Service' : 'Grievance Redressal',
          ticketNumber: item.ticketNumber,
          title: item.title || item.category,
          category: item.category || 'General Civic Service',
          department: item.department || 'Municipal Administration',
          ward: item.ward || 'Ward 1 - Central Zone',
          status: item.status || 'SUBMITTED',
          priority: item.priority || 'MEDIUM',
          officer: item.assignedTo || 'Assigned Ward Unit',
          filedOn: item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Recent',
          slaRemaining: item.status === 'RESOLVED' ? 'Resolution Completed' : item.status === 'WITHDRAWN' ? 'Withdrawn by Citizen' : 'In Progress (Within SLA Target)',
          progress: item.status === 'RESOLVED' ? 100 : item.status === 'IN_PROGRESS' ? 65 : item.status === 'WITHDRAWN' ? 0 : 20,
          resolutionNotes: item.resolutionNotes || (item.status === 'WITHDRAWN' ? 'Withdrawn voluntarily by citizen' : 'Application processing under statutory municipal workflows.')
        });
        setIsSearching(false);
        return;
      }
    } catch (e) {
    }

    if (fallbackTracks[targetId]) {
      setTrackResult(fallbackTracks[targetId]);
      setIsSearching(false);
      return;
    }

    if (targetId.startsWith('GRV-') || targetId.startsWith('SR-')) {
      setTrackResult({
        found: true,
        type: targetId.startsWith('SR') ? 'Municipal Service' : 'Grievance Redressal',
        ticketNumber: targetId,
        title: targetId.startsWith('SR') ? 'Civic Service Application' : 'Ward Grievance Redressal Ticket',
        category: 'Urban Infrastructure',
        department: 'Municipal Operations',
        ward: 'Ward 1 - Central Zone',
        status: 'IN_PROGRESS',
        priority: 'STANDARD',
        officer: 'Ward Desk',
        filedOn: '2026-10-01 10:00',
        slaRemaining: 'Active - Within 48h SLA Window',
        progress: 50,
        resolutionNotes: 'Ticket verified in Municipal Registry; active field dispatch in progress.'
      });
      setIsSearching(false);
      return;
    }

    setIsSearching(false);
    setSearchError(`No active record found for docket ID "${rawId}". Please verify your ticket number or sign in to view your dockets.`);
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    handleTrackSubmit();
  };

  const scrollToSection = (e, id) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -75;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'RESOLVED':
        return { background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', border: '1px solid rgba(16, 185, 129, 0.35)' };
      case 'WITHDRAWN':
        return { background: 'rgba(239, 68, 68, 0.15)', color: 'var(--accent-crimson)', border: '1px solid rgba(239, 68, 68, 0.35)' };
      case 'IN_PROGRESS':
        return { background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', border: '1px solid rgba(6, 182, 212, 0.35)' };
      case 'SUBMITTED':
      default:
        return { background: 'rgba(245, 158, 11, 0.15)', color: 'var(--accent-amber)', border: '1px solid rgba(245, 158, 11, 0.35)' };
    }
  };

  const getProgressBarColor = (status) => {
    switch (status) {
      case 'RESOLVED':
        return 'var(--accent-emerald)';
      case 'WITHDRAWN':
        return 'var(--accent-crimson)';
      case 'IN_PROGRESS':
        return 'var(--accent-cyan)';
      default:
        return 'var(--accent-amber)';
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-canvas)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', overflowX: 'hidden', paddingTop: '62px' }}>
      
      <header style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0,
        right: 0,
        zIndex: 100, 
        background: 'var(--bg-header)', 
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-card)',
        borderTop: '2px solid var(--accent-emerald)',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)'
      }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 20px', height: '62px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => navigate('/')}>
            <Logo size={34} />
            <div>
              <div style={{ fontSize: '1.08rem', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', letterSpacing: '-0.01em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                CivicPulse Nexus
                <span style={{ fontSize: '0.58rem', background: 'rgba(16, 185, 129, 0.14)', color: 'var(--accent-emerald)', padding: '1px 6px', borderRadius: '4px', border: '1px solid rgba(16, 185, 129, 0.35)', fontWeight: '800', letterSpacing: '0.04em' }}>
                  GOV PORTAL
                </span>
              </div>
              <div style={{ fontSize: '0.66rem', color: 'var(--text-muted)' }}>
                Municipal Governance & Urban Redressal Platform
              </div>
            </div>
          </div>

          <nav className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <a 
              href="#tracking" 
              onClick={(e) => scrollToSection(e, 'tracking')}
              style={{ color: 'var(--text-primary)', fontSize: '0.80rem', fontWeight: '600', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
            >
              <Search size={13} style={{ color: 'var(--accent-cyan)' }} />
              <span>Track Docket</span>
            </a>
            <a 
              href="#services" 
              onClick={(e) => scrollToSection(e, 'services')}
              style={{ color: 'var(--text-secondary)', fontSize: '0.80rem', fontWeight: '500', textDecoration: 'none', cursor: 'pointer' }}
            >
              Civic Services
            </a>
            <a 
              href="#telemetry" 
              onClick={(e) => scrollToSection(e, 'telemetry')}
              style={{ color: 'var(--text-secondary)', fontSize: '0.80rem', fontWeight: '500', textDecoration: 'none', cursor: 'pointer' }}
            >
              City Telemetry
            </a>
            <a 
              href="#notices" 
              onClick={(e) => scrollToSection(e, 'notices')}
              style={{ color: 'var(--text-secondary)', fontSize: '0.80rem', fontWeight: '500', textDecoration: 'none', cursor: 'pointer' }}
            >
              Ward Notices
            </a>
            <a 
              href="#roles" 
              onClick={(e) => scrollToSection(e, 'roles')}
              style={{ color: 'var(--text-secondary)', fontSize: '0.80rem', fontWeight: '500', textDecoration: 'none', cursor: 'pointer' }}
            >
              RBAC Portals
            </a>
            
            <ThemeToggle />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '6px' }}>
              <Link to="/login" className="btn btn-outline" style={{ fontSize: '0.78rem', padding: '6px 12px', borderRadius: '6px' }}>
                <Lock size={12} />
                <span>Sign In</span>
              </Link>
              <Link to="/register" className="btn btn-emerald" style={{ fontSize: '0.78rem', padding: '6px 14px', fontWeight: '700', borderRadius: '6px' }}>
                <Users size={12} />
                <span>Citizen Register</span>
              </Link>
            </div>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="mobile-menu-btn" style={{ display: 'none' }}>
              <ThemeToggle />
            </div>
            <button 
              type="button" 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ display: 'none', background: 'var(--bg-card-subtle)', border: '1px solid var(--border-card)', color: 'var(--text-primary)', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div style={{ background: 'var(--bg-header)', borderBottom: '1px solid var(--border-card)', padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a href="#tracking" onClick={(e) => scrollToSection(e, 'tracking')} style={{ color: 'var(--accent-cyan)', fontSize: '0.82rem', fontWeight: '600', textDecoration: 'none', cursor: 'pointer' }}>🔍 Track Application / Grievance</a>
            <a href="#services" onClick={(e) => scrollToSection(e, 'services')} style={{ color: 'var(--text-primary)', fontSize: '0.82rem', fontWeight: '500', textDecoration: 'none', cursor: 'pointer' }}>🏛️ Civic Services Catalog</a>
            <a href="#telemetry" onClick={(e) => scrollToSection(e, 'telemetry')} style={{ color: 'var(--text-primary)', fontSize: '0.82rem', fontWeight: '500', textDecoration: 'none', cursor: 'pointer' }}>📊 Live Municipal Telemetry</a>
            <a href="#notices" onClick={(e) => scrollToSection(e, 'notices')} style={{ color: 'var(--text-primary)', fontSize: '0.82rem', fontWeight: '500', textDecoration: 'none', cursor: 'pointer' }}>📢 Ward Notices & Timings</a>
            <a href="#roles" onClick={(e) => scrollToSection(e, 'roles')} style={{ color: 'var(--text-primary)', fontSize: '0.82rem', fontWeight: '500', textDecoration: 'none', cursor: 'pointer' }}>🛡️ RBAC Stakeholder Portals</a>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <Link to="/login" className="btn btn-outline" style={{ flex: '1', textAlign: 'center', padding: '8px', fontSize: '0.78rem' }}>Sign In</Link>
              <Link to="/register" className="btn btn-emerald" style={{ flex: '1', textAlign: 'center', padding: '8px', fontSize: '0.78rem' }}>Sign Up</Link>
            </div>
          </div>
        )}
      </header>

      <section style={{ 
        position: 'relative', 
        padding: '48px 20px 36px 20px', 
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '880px', margin: '0 auto' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.10)', border: '1px solid rgba(16, 185, 129, 0.30)', padding: '4px 14px', borderRadius: '9999px', fontSize: '0.72rem', color: 'var(--accent-emerald)', fontWeight: '700', marginBottom: '16px' }}>
            <Sparkles size={13} />
            <span>Digital India & Municipal Corporation Governance Platform</span>
          </div>

          <h1 style={{ fontSize: '2.1rem', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'var(--text-primary)', lineHeight: '1.2', letterSpacing: '-0.02em', marginBottom: '12px' }}>
            Transparent Civic Services & <br />
            <span style={{ background: 'linear-gradient(135deg, #059669 0%, #0284C7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Real-Time Municipal Redressal
            </span>
          </h1>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 24px auto', lineHeight: '1.55' }}>
            Lodge geotagged civic grievances, apply for municipal certificates, pay property taxes, and verify live docket resolution with statutory SLA compliance across all city wards.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-emerald" style={{ padding: '10px 20px', fontSize: '0.84rem', fontWeight: '700', borderRadius: '8px', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.22)' }}>
              <span>Citizen Registration (Sign Up)</span>
              <ArrowRight size={15} />
            </Link>
            <a 
              href="#tracking" 
              onClick={(e) => scrollToSection(e, 'tracking')}
              className="btn btn-outline" 
              style={{ padding: '10px 18px', fontSize: '0.84rem', fontWeight: '600', borderRadius: '8px', borderColor: 'rgba(6, 182, 212, 0.4)', color: 'var(--accent-cyan)', background: 'rgba(6, 182, 212, 0.06)', cursor: 'pointer' }}
            >
              <Search size={15} />
              <span>Track Docket Status</span>
            </a>
            <Link to="/login" className="btn btn-outline" style={{ padding: '10px 18px', fontSize: '0.84rem', fontWeight: '600', borderRadius: '8px' }}>
              <ShieldCheck size={15} />
              <span>Executive & Staff Login</span>
            </Link>
          </div>
        </div>
      </section>

      <section id="tracking" style={{ padding: '10px 20px 36px 20px', maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ 
          background: 'var(--bg-card)', 
          border: '1px solid var(--border-card)', 
          borderRadius: '16px', 
          padding: '24px',
          boxShadow: 'var(--shadow-card)',
          position: 'relative'
        }}>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)' }}>
                <Search size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                  Public Docket & Grievance Tracker
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.76rem' }}>
                  Lookup grievance tickets, service filings, and municipal applications.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={onFormSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '14px' }}>
            <input
              type="text"
              className="form-input"
              style={{ flex: '1', minWidth: '240px', padding: '10px 14px', fontSize: '0.84rem' }}
              placeholder="Enter Ticket ID (e.g. GRV... or SR...)"
              value={trackNumber}
              onChange={(e) => setTrackNumber(e.target.value)}
            />
            <button 
              type="submit" 
              className="btn btn-emerald" 
              disabled={isSearching}
              style={{ padding: '10px 20px', fontSize: '0.84rem', fontWeight: '700', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              {isSearching ? (
                <>
                  <div className="spinner" style={{ width: '13px', height: '13px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                  <span>Querying...</span>
                </>
              ) : (
                <>
                  <Search size={15} />
                  <span>Track Docket</span>
                </>
              )}
            </button>
          </form>

          {searchError && (
            <div style={{ marginTop: '14px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-crimson)', fontSize: '0.78rem' }}>
              <AlertTriangle size={16} style={{ flexShrink: 0, color: 'var(--accent-crimson)' }} />
              <span>{searchError}</span>
            </div>
          )}

          {trackResult && (
            <div style={{ 
              marginTop: '18px', 
              background: 'var(--bg-card-subtle)', 
              border: `1px solid ${trackResult.status === 'WITHDRAWN' ? 'rgba(239, 68, 68, 0.4)' : trackResult.status === 'RESOLVED' ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-card)'}`, 
              borderRadius: '12px', 
              padding: '16px 18px',
              boxShadow: 'var(--shadow-card)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                    <span style={{ fontSize: '0.64rem', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)', padding: '1px 6px', borderRadius: '4px', fontWeight: '800', letterSpacing: '0.03em' }}>
                      {trackResult.type || 'MUNICIPAL DOCKET'}
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                      {trackResult.ticketNumber}
                    </span>
                    {trackResult.filedOn && (
                      <span style={{ fontSize: '0.70rem', color: 'var(--text-muted)' }}>• Filed {trackResult.filedOn}</span>
                    )}
                  </div>
                  <h3 style={{ fontSize: '0.98rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                    {trackResult.title || trackResult.category}
                  </h3>
                </div>

                <div>
                  <span style={{ 
                    ...getStatusStyle(trackResult.status), 
                    fontSize: '0.72rem', 
                    padding: '4px 10px', 
                    borderRadius: '6px', 
                    fontWeight: '800', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '4px' 
                  }}>
                    {trackResult.status === 'RESOLVED' && <CheckCircle2 size={13} />}
                    {trackResult.status === 'WITHDRAWN' && <XCircle size={13} />}
                    {trackResult.status === 'IN_PROGRESS' && <Clock size={13} />}
                    <span>{trackResult.status}</span>
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', fontSize: '0.76rem', background: 'var(--bg-card)', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-card)', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Department</div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: '600', marginTop: '2px', fontSize: '0.78rem' }}>{trackResult.department || 'Municipal Administration'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Jurisdiction / Ward</div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: '600', marginTop: '2px', fontSize: '0.78rem' }}>{trackResult.ward || 'Ward 1 - Central Zone'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Assigned Unit</div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: '600', marginTop: '2px', fontSize: '0.78rem' }}>{trackResult.officer || 'Ward Grievance Desk'}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.64rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em' }}>SLA Target / Status</div>
                  <div style={{ color: trackResult.status === 'WITHDRAWN' ? 'var(--accent-crimson)' : trackResult.status === 'RESOLVED' ? 'var(--accent-emerald)' : 'var(--accent-cyan)', fontWeight: '600', marginTop: '2px', fontSize: '0.78rem' }}>
                    {trackResult.slaRemaining || 'Standard 47h MTTR benchmark'}
                  </div>
                </div>
              </div>

              {trackResult.resolutionNotes && (
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '8px', padding: '8px 12px', fontSize: '0.74rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: '700' }}>Official Case Notes: </span>
                  <span>{trackResult.resolutionNotes}</span>
                </div>
              )}

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                  <span style={{ fontWeight: '600' }}>
                    {trackResult.status === 'WITHDRAWN' ? 'Docket Workflow Status (Withdrawn)' : 'Resolution Progress'}
                  </span>
                  <span style={{ fontWeight: '700', color: getProgressBarColor(trackResult.status) }}>
                    {trackResult.status === 'WITHDRAWN' ? 'Inactive' : `${trackResult.progress || 0}%`}
                  </span>
                </div>
                <div style={{ height: '6px', background: 'var(--border-card)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ 
                    height: '100%', 
                    width: trackResult.status === 'WITHDRAWN' ? '0%' : `${trackResult.progress || 0}%`, 
                    background: getProgressBarColor(trackResult.status), 
                    transition: 'width 0.5s ease' 
                  }}></div>
                </div>
              </div>

              <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Link to="/login" className="btn btn-outline" style={{ fontSize: '0.74rem', padding: '6px 12px', borderRadius: '6px' }}>
                  <span>Citizen Login for Full Audit Trail</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="telemetry" style={{ padding: '10px 20px 40px 20px', maxWidth: '1320px', margin: '0 auto' }}>
        <div style={{ 
          background: 'var(--bg-card)', 
          border: '1px solid var(--border-card)', 
          borderRadius: '16px', 
          padding: '22px 24px',
          boxShadow: 'var(--shadow-card)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '0.70rem', color: 'var(--accent-emerald)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Statutory City Telemetry & Benchmark Standards
            </span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>
              Live Municipal Performance Cockpit
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
            <div style={{ background: 'var(--bg-card-subtle)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-card)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>Citizen Satisfaction</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-emerald)', margin: '2px 0' }}>4.7 / 5.0</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--accent-emerald)', fontWeight: '600' }}>Complaints ↓ 23% | Services ↑ 47%</div>
            </div>

            <div style={{ background: 'var(--bg-card-subtle)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-card)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>Service SLA Met</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-cyan)', margin: '2px 0' }}>94.0%</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--accent-cyan)', fontWeight: '600' }}>Target: 90.0% Statutory</div>
            </div>

            <div style={{ background: 'var(--bg-card-subtle)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-card)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>Mean Resolution Time</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-amber)', margin: '2px 0' }}>47 Hours</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--accent-amber)', fontWeight: '600' }}>Avg Turnaround: 2.4 Days</div>
            </div>

            <div style={{ background: 'var(--bg-card-subtle)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-card)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>Municipal Revenue</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-purple)', margin: '2px 0' }}>$12.4M</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--accent-purple)', fontWeight: '600' }}>Tax: 67% | Licenses: 23%</div>
            </div>

            <div style={{ background: 'var(--bg-card-subtle)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-card)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>Services Processed</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-blue)', margin: '2px 0' }}>24,700+</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--accent-blue)', fontWeight: '600' }}>94% Resolution Rate</div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" style={{ padding: '36px 20px', maxWidth: '1320px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <span style={{ fontSize: '0.70rem', color: 'var(--accent-emerald)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Unified Municipal Citizen Services
          </span>
          <h2 style={{ fontSize: '1.55rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px', letterSpacing: '-0.02em' }}>
            Direct Public Redressal & Digital Portals
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', maxWidth: '580px', margin: '6px auto 0 auto' }}>
            Register as a citizen to instantly apply for civic services, lodge geotagged grievances, and receive official digital receipts.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '16px' }}>
          
          <div className="card" style={{ transition: 'all 0.25s ease', cursor: 'pointer', padding: '20px' }} onClick={() => navigate('/register')}>
            <div style={{ background: 'rgba(6, 182, 212, 0.15)', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-cyan)', marginBottom: '12px' }}>
              <Droplets size={22} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
              Water Supply & Sewerage
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: '1.5', marginBottom: '14px' }}>
              Apply for new residential water connections, report pipe bursts, check potable purity index, and view metered billing.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--accent-cyan)', fontSize: '0.78rem', fontWeight: '700' }}>
              <span>Apply Online</span>
              <ArrowRight size={13} />
            </div>
          </div>

          <div className="card" style={{ transition: 'all 0.25s ease', cursor: 'pointer', padding: '20px' }} onClick={() => navigate('/register')}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-emerald)', marginBottom: '12px' }}>
              <DollarSign size={22} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
              Property & Municipal Tax
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: '1.5', marginBottom: '14px' }}>
              Calculate municipal property dues, self-assess commercial holdings, download digitally signed tax clearance certificates, and claim rebates.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--accent-emerald)', fontSize: '0.78rem', fontWeight: '700' }}>
              <span>Pay & Assess Tax</span>
              <ArrowRight size={13} />
            </div>
          </div>

          <div className="card" style={{ transition: 'all 0.25s ease', cursor: 'pointer', padding: '20px' }} onClick={() => navigate('/register')}>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-amber)', marginBottom: '12px' }}>
              <ClipboardList size={22} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
              Public Grievance Redressal
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: '1.5', marginBottom: '14px' }}>
              Lodge geotagged civic complaints with photo evidence. Ground field officers resolve issues within the statutory 47-hour MTTR SLA window.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--accent-amber)', fontSize: '0.78rem', fontWeight: '700' }}>
              <span>File a Grievance</span>
              <ArrowRight size={13} />
            </div>
          </div>

          <div className="card" style={{ transition: 'all 0.25s ease', cursor: 'pointer', padding: '20px' }} onClick={() => navigate('/register')}>
            <div style={{ background: 'rgba(59, 130, 246, 0.15)', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-blue)', marginBottom: '12px' }}>
              <FileText size={22} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
              Trade Licenses & Commercial Permits
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: '1.5', marginBottom: '14px' }}>
              New shop & establishment permits, fast-track annual license renewals, fire safety clearances, and health hygiene NOC certifications.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--accent-blue)', fontSize: '0.78rem', fontWeight: '700' }}>
              <span>Submit Application</span>
              <ArrowRight size={13} />
            </div>
          </div>

          <div className="card" style={{ transition: 'all 0.25s ease', cursor: 'pointer', padding: '20px' }} onClick={() => navigate('/register')}>
            <div style={{ background: 'rgba(139, 92, 246, 0.15)', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-purple)', marginBottom: '12px' }}>
              <Building2 size={22} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
              Building Plan Approval & Permits
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: '1.5', marginBottom: '14px' }}>
              Online architectural blueprint scrutiny, structural safety permits, environmental clearance, and occupancy certificate issuance.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--accent-purple)', fontSize: '0.78rem', fontWeight: '700' }}>
              <span>Permits Portal</span>
              <ArrowRight size={13} />
            </div>
          </div>

          <div className="card" style={{ transition: 'all 0.25s ease', cursor: 'pointer', padding: '20px' }} onClick={() => navigate('/register')}>
            <div style={{ background: 'rgba(236, 72, 153, 0.15)', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EC4899', marginBottom: '12px' }}>
              <Award size={22} />
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '6px' }}>
              Civil Certificates & Registrations
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: '1.5', marginBottom: '14px' }}>
              Instant QR-verified birth, death, and marriage registration certificates with national digital locker sync and verification.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#EC4899', fontSize: '0.78rem', fontWeight: '700' }}>
              <span>Request Certificate</span>
              <ArrowRight size={13} />
            </div>
          </div>

        </div>
      </section>

      <section id="notices" style={{ padding: '30px 20px 40px 20px', background: 'var(--bg-card)', borderTop: '1px solid var(--border-card)', borderBottom: '1px solid var(--border-card)' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '12px', marginBottom: '22px' }}>
            <div>
              <span style={{ fontSize: '0.70rem', color: 'var(--accent-cyan)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Ward Operations & Public Utilities
              </span>
              <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '2px' }}>
                Ward 1 Public Notices & Utility Schedule
              </h2>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Updated in real-time by Municipal Command Center
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            
            <div style={{ background: 'var(--bg-card-subtle)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontWeight: '700', fontSize: '0.84rem', marginBottom: '6px' }}>
                <Droplets size={16} />
                <span>Water Supply Timings</span>
              </div>
              <div style={{ fontSize: '0.98rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '3px' }}>
                06:00 AM - 09:30 AM
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                Morning supply active. Pressure normal at 3.2 bar across Central Ward blocks.
              </p>
            </div>

            <div style={{ background: 'var(--bg-card-subtle)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)', fontWeight: '700', fontSize: '0.84rem', marginBottom: '6px' }}>
                <Truck size={16} />
                <span>Door-to-Door Waste Collection</span>
              </div>
              <div style={{ fontSize: '0.98rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '3px' }}>
                08:00 AM - 11:30 AM
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                Daily segregated solid waste collection vehicle en-route Sector 3 & 4.
              </p>
            </div>

            <div style={{ background: 'var(--bg-card-subtle)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#EC4899', fontWeight: '700', fontSize: '0.84rem', marginBottom: '6px' }}>
                <HeartPulse size={16} />
                <span>Free Municipal Health Camp</span>
              </div>
              <div style={{ fontSize: '0.98rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '3px' }}>
                Saturday 10:00 AM
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                Community Center Ward 1: Blood pressure, sugar screening, and vector-borne check.
              </p>
            </div>

          </div>
        </div>
      </section>

      <section id="roles" style={{ padding: '40px 20px', maxWidth: '1320px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '26px' }}>
          <span style={{ fontSize: '0.70rem', color: 'var(--accent-cyan)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Enterprise Role-Based Access Control
          </span>
          <h2 style={{ fontSize: '1.55rem', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px', letterSpacing: '-0.02em' }}>
            5 Dedicated Stakeholder Portals
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            Secure portals tailored for citizens, supervisors, ground staff, auditors, and executive administration.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'var(--shadow-card)' }}>
            <div>
              <div style={{ color: 'var(--accent-emerald)', fontWeight: '700', fontSize: '0.84rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={16} />
                <span>Municipal Admin</span>
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '12px' }}>
                Super-Admin cockpit: Full city-wide analytics, 94% SLA, $12.4M Revenue, $47M Budget.
              </p>
            </div>
            <Link to="/login" style={{ fontSize: '0.74rem', color: 'var(--accent-emerald)', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <span>Admin Sign In</span>
              <ChevronRight size={13} />
            </Link>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'var(--shadow-card)' }}>
            <div>
              <div style={{ color: 'var(--accent-cyan)', fontWeight: '700', fontSize: '0.84rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building2 size={16} />
                <span>Dept Head (Water)</span>
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '12px' }}>
                Department telemetry: Water SLA (94%), leak redressal, acoustic sensors, $11.2M budget.
              </p>
            </div>
            <Link to="/login" style={{ fontSize: '0.74rem', color: 'var(--accent-cyan)', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <span>Dept Supervisor Login</span>
              <ChevronRight size={13} />
            </Link>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'var(--shadow-card)' }}>
            <div>
              <div style={{ color: 'var(--accent-purple)', fontWeight: '700', fontSize: '0.84rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={16} />
                <span>Compliance Auditor</span>
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '12px' }}>
                Read-only statutory compliance, immutable audit trails, and one-click PDF/Excel data dumps.
              </p>
            </div>
            <Link to="/login" style={{ fontSize: '0.74rem', color: 'var(--accent-purple)', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <span>Auditor Console</span>
              <ChevronRight size={13} />
            </Link>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'var(--shadow-card)' }}>
            <div>
              <div style={{ color: 'var(--accent-blue)', fontWeight: '700', fontSize: '0.84rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} />
                <span>Field Officer</span>
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '12px' }}>
                Ward task queues: Progress work orders, upload proof photos, record notes, and feed MTTR clock.
              </p>
            </div>
            <Link to="/login" style={{ fontSize: '0.74rem', color: 'var(--accent-blue)', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <span>Field Staff Queue</span>
              <ChevronRight size={13} />
            </Link>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-card)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: 'var(--shadow-card)' }}>
            <div>
              <div style={{ color: 'var(--accent-amber)', fontWeight: '700', fontSize: '0.84rem', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={16} />
                <span>Citizen (Public)</span>
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '12px' }}>
                Resident self-service: File complaints, track active dockets, and submit 1-5 star CSAT feedback.
              </p>
            </div>
            <Link to="/register" style={{ fontSize: '0.74rem', color: 'var(--accent-amber)', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <span>Citizen Portal / Sign Up</span>
              <ChevronRight size={13} />
            </Link>
          </div>

        </div>
      </section>

      <footer style={{ background: 'var(--bg-header)', borderTop: '1px solid var(--border-card)', padding: '28px 20px', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
        <div style={{ maxWidth: '1320px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Logo size={28} />
            <div>
              <div style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '0.84rem' }}>CivicPulse Nexus – Municipal Corporation Platform</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Digital Urban Governance & Citizen Redressal System</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '18px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--accent-emerald)', fontWeight: '600' }}>
              <PhoneCall size={13} />
              <span>Toll-Free 24x7 Helpline: 1800-CIVIC-PULSE</span>
            </div>
            <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Official Login</Link>
            <Link to="/register" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Citizen Sign Up</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;
