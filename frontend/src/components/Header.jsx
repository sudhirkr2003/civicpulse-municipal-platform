import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import api from '../services/api';
import { LogOut, ShieldCheck, Building2, FileText, CheckCircle2, Users, AlertCircle, Menu, X, ChevronDown, User, Bell, ChevronLeft, ChevronRight } from 'lucide-react';

export const Header = ({ mobileSidebarOpen, onToggleSidebar, isCollapsed, onToggleCollapse }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const profileMenuRef = useRef(null);
  const notificationMenuRef = useRef(null);

  useEffect(() => {
    fetchUserNotifications();
  }, [user]);

  const fetchUserNotifications = async () => {
    if (!user) return;
    try {
      if (user.role === 'CITIZEN') {
        const res = await api.get('/citizen/portal');
        const grievances = res.data?.grievances || [];
        const services = res.data?.serviceRequests || [];
        const items = [];

        grievances.forEach(g => {
          if (g.status === 'RESOLVED') {
            items.push({
              id: 'grv-' + g.id,
              title: 'Complaint Resolved',
              message: `Ticket #${g.ticketNumber} (${g.category}) has been verified and resolved.`,
              time: 'Recent',
              unread: true
            });
          } else if (g.status === 'IN_PROGRESS') {
            items.push({
              id: 'grv-' + g.id,
              title: 'Complaint In-Progress',
              message: `Ticket #${g.ticketNumber} is being serviced by ward crew.`,
              time: 'Active',
              unread: true
            });
          } else if (g.status === 'SUBMITTED') {
            items.push({
              id: 'grv-' + g.id,
              title: 'Complaint Logged',
              message: `Ticket #${g.ticketNumber} dispatched to Ward Officer.`,
              time: 'Just now',
              unread: true
            });
          }
        });

        services.forEach(s => {
          items.push({
            id: 'srv-' + s.id,
            title: s.status === 'RESOLVED' ? 'Service Completed' : 'Service In-Progress',
            message: `Application #${s.requestNumber} (${s.serviceType}) is ${s.status.toLowerCase()}.`,
            time: 'Active',
            unread: true
          });
        });

        const wardName = user.ward ? (user.ward.includes(' - ') ? user.ward.split(' - ')[0] : user.ward) : 'Ward 1';
        items.push({
          id: 'ward-alert',
          title: `${wardName} Utility Notice`,
          message: 'Morning water supply active from 06:00 AM - 09:30 AM.',
          time: 'Advisory',
          unread: false
        });

        if (items.length === 1) {
          items.unshift({
            id: 'welcome-resident',
            title: 'Resident Portal Active',
            message: `Welcome ${user.fullName || 'Resident'}! Verified citizen account for ${wardName} is active.`,
            time: 'System',
            unread: true
          });
        }

        setNotifications(items);
      } else {
        setNotifications([
          {
            id: 'staff-ready',
            title: 'Executive Session Active',
            message: `Logged in as ${user.fullName} (${user.role}). Telemetry sync is live.`,
            time: 'Now',
            unread: true
          }
        ]);
      }
    } catch (e) {
      const wardName = user?.ward ? (user.ward.includes(' - ') ? user.ward.split(' - ')[0] : user.ward) : 'Ward 1';
      setNotifications([
        {
          id: 'ward-advisory',
          title: `${wardName} Utility Notice`,
          message: 'Scheduled water supply active from 06:00 AM - 09:30 AM.',
          time: 'Today',
          unread: false
        }
      ]);
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleToggleNotifications = () => {
    if (!showNotifications) {
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
      setShowNotifications(true);
      setShowProfileMenu(false);
    } else {
      setShowNotifications(false);
    }
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const toggleItemRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowProfileMenu(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogout = async () => {
    setShowConfirm(false);
    setShowProfileMenu(false);
    setShowNotifications(false);
    await logout();
    navigate('/login');
  };

  const getRoleBadge = () => {
    const role = user?.role;
    switch (role) {
      case 'DEPT_HEAD':
        return {
          icon: <Building2 size={15} style={{ color: '#06B6D4' }} />,
          label: user?.fullName || 'Water Dept Head',
          roleTitle: 'Department Head'
        };
      case 'COMPLIANCE_AUDITOR':
        return {
          icon: <FileText size={15} style={{ color: '#8B5CF6' }} />,
          label: user?.fullName || 'Compliance Auditor',
          roleTitle: 'Auditor'
        };
      case 'FIELD_OFFICER':
        return {
          icon: <CheckCircle2 size={15} style={{ color: '#3B82F6' }} />,
          label: user?.fullName || 'Field Officer (Ward 4)',
          roleTitle: 'Field Officer'
        };
      case 'CITIZEN':
        return {
          icon: <Users size={15} style={{ color: '#F59E0B' }} />,
          label: user?.fullName || 'Citizen (Rahul S.)',
          roleTitle: 'Resident Citizen'
        };
      default:
        return {
          icon: <ShieldCheck size={15} style={{ color: '#10B981' }} />,
          label: 'Municipal Admin',
          roleTitle: 'Administrator'
        };
    }
  };

  const badge = getRoleBadge();
  const userInitial = user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U';

  return (
    <>
      <header className="top-navbar">
        <div className="brand-section">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="mobile-sidebar-toggle-btn"
              title={mobileSidebarOpen ? "Close Menu" : "Open Menu"}
              aria-label="Toggle Navigation Menu"
            >
              {mobileSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Logo size={36} />
            <div>
              <span className="brand-title">CivicPulse Nexus</span>
              <span className="brand-subtitle">Milestone 4: Governance Analytics</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ThemeToggle />

          <div className="notification-container" ref={notificationMenuRef}>
            <button
              onClick={handleToggleNotifications}
              className="notification-bell-btn"
              title="Notifications & Updates"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="notification-badge-count">{unreadCount}</span>
              )}
            </button>

            {showNotifications && (
              <div className="notification-dropdown-box">
                <div className="notification-header">
                  <div className="notification-title">
                    <Bell size={14} style={{ color: 'var(--accent-cyan)' }} />
                    <span>Notifications</span>
                  </div>
                  {notifications.length > 0 && (
                    <button onClick={markAllAsRead} className="notification-mark-read">
                      Clear
                    </button>
                  )}
                </div>

                <div className="notification-list">
                  {notifications.map(item => (
                    <div
                      key={item.id}
                      onClick={() => toggleItemRead(item.id)}
                      className={`notification-item ${item.unread ? 'unread' : ''}`}
                    >
                      <div className="notification-item-head">
                        <span className="notification-item-title">{item.title}</span>
                        <span className="notification-item-time">{item.time}</span>
                      </div>
                      <div className="notification-item-msg">{item.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="profile-menu-container" ref={profileMenuRef}>
            <button
              onClick={() => {
                setShowProfileMenu(prev => !prev);
                setShowNotifications(false);
              }}
              className="profile-circle-btn"
              title={`${user?.fullName || 'User'} (${badge.roleTitle})`}
              aria-label="User Account Menu"
            >
              <div className="profile-avatar-circle">
                {userInitial}
              </div>
              <span className="profile-name-preview">{user?.fullName?.split(' ')[0] || 'Account'}</span>
              <ChevronDown size={14} className={`profile-chevron ${showProfileMenu ? 'open' : ''}`} />
            </button>

            {showProfileMenu && (
              <div className="profile-dropdown-box">
                <div className="profile-dropdown-header">
                  <div className="profile-avatar-large">
                    {userInitial}
                  </div>
                  <div>
                    <div className="profile-dropdown-name">{user?.fullName || 'User'}</div>
                    <div className="profile-dropdown-role">
                      {badge.icon}
                      <span>{badge.roleTitle}</span>
                    </div>
                    {user?.ward && (
                      <div className="profile-dropdown-ward">{user.ward}</div>
                    )}
                  </div>
                </div>

                <div className="profile-dropdown-divider" />

                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowConfirm(true);
                  }}
                  className="profile-dropdown-logout-btn"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {showConfirm && (
        <div className="modal-backdrop">
          <div className="modal-box" style={{ maxWidth: '420px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '10px', borderRadius: '50%', color: 'var(--accent-crimson)' }}>
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-primary)' }}>Confirm Logout</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Are you sure you want to end your executive session?</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => setShowConfirm(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="btn"
                style={{ background: '#EF4444', color: '#FFFFFF' }}
              >
                Logout Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
