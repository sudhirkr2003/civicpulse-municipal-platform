import React from 'react';
import { LogOut, ShieldAlert, X } from 'lucide-react';

export default function LogoutModal({ isOpen, onClose, onConfirm, user }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fb7185' }}>
            <LogOut size={20} />
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: '#ffffff' }}>
              Confirm Session Logout
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: '1.5', marginBottom: '14px' }}>
          Are you sure you want to end your current municipal session for <strong style={{ color: '#ffffff' }}>{user}</strong>?
        </p>

        <div style={{
          background: '#0d131f',
          border: '1px solid #1e293b',
          borderRadius: '6px',
          padding: '12px',
          fontSize: '0.8rem',
          color: '#94a3b8',
          marginBottom: '20px'
        }}>
          All unsaved form drafts will be securely cleared. Your active audit log will record a session termination event.
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button className="btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              background: '#e11d48',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background 0.2s'
            }}
          >
            <LogOut size={15} />
            Logout Now
          </button>
        </div>
      </div>
    </div>
  );
}
