import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  DollarSign, 
  Droplets, 
  Award, 
  Printer, 
  X,
  Building2,
  Sparkles
} from 'lucide-react';

export const CitizenReceipts = () => {
  const { user } = useAuth();
  const [activeReceipt, setActiveReceipt] = useState(null);

  const receiptsList = [
    {
      id: 'REC-2026-001',
      title: 'Annual Property Tax Clearance Receipt',
      category: 'Property Tax',
      amount: '$1,250.00 (₹1,04,200)',
      paymentDate: '2026-09-15',
      paymentMode: 'Net Banking (SBI Digital Gov Gateway)',
      txnRef: 'TXN-REV-9981247',
      status: 'VERIFIED & PAID',
      ward: user?.ward || 'Ward 1 - Central Zone',
      issuedBy: 'Revenue & Treasury Department'
    },
    {
      id: 'REC-2026-002',
      title: 'Smart Water Meter Installation Certificate',
      category: 'Water Works',
      amount: '$25.00 (₹2,100)',
      paymentDate: '2026-08-20',
      paymentMode: 'UPI Instant Settlement',
      txnRef: 'TXN-WTR-3341829',
      status: 'VERIFIED & PAID',
      ward: user?.ward || 'Ward 1 - Central Zone',
      issuedBy: 'Water Management Department'
    },
    {
      id: 'REC-2026-003',
      title: 'Commercial Establishment Trade Clearance NOC',
      category: 'Trade License',
      amount: '$65.00 (₹5,400)',
      paymentDate: '2026-07-11',
      paymentMode: 'Debit Card Gateway',
      txnRef: 'TXN-TRD-1192837',
      status: 'VERIFIED & PAID',
      ward: user?.ward || 'Ward 1 - Central Zone',
      issuedBy: 'Urban Licensing Division'
    }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Citizen Tax Receipts & Certificates</h1>
          <p className="page-description">
            Download verified municipal receipts, tax clearance certificates, and official digital acknowledgement slips.
          </p>
        </div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '6px 14px', borderRadius: '8px', color: '#10B981', fontSize: '0.85rem', fontWeight: '600' }}>
          <ShieldCheck size={16} />
          <span>QR-Verified Digital Seals</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {receiptsList.map((rec) => (
          <div key={rec.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', background: 'rgba(6, 182, 212, 0.12)', color: '#06B6D4', padding: '3px 8px', borderRadius: '4px', fontWeight: '700' }}>
                  {rec.id}
                </span>
                <span className="badge-trend success" style={{ fontSize: '0.72rem' }}>
                  <CheckCircle2 size={12} />
                  <span>{rec.status}</span>
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#F8FAFC', marginBottom: '6px' }}>
                {rec.title}
              </h3>
              <div style={{ fontSize: '0.82rem', color: '#94A3B8', marginBottom: '14px' }}>
                {rec.issuedBy}
              </div>

              <div style={{ background: '#0A0F1D', padding: '12px', borderRadius: '8px', border: '1px solid #1E2C4A', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: '#94A3B8', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Amount Paid:</span>
                  <strong style={{ color: '#10B981' }}>{rec.amount}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Payment Date:</span>
                  <span style={{ color: '#F8FAFC' }}>{rec.paymentDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Txn Ref:</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#38BDF8', fontSize: '0.75rem' }}>{rec.txnRef}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveReceipt(rec)}
              className="btn btn-outline"
              style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem' }}
            >
              <FileText size={14} />
              <span>View & Download Certificate</span>
            </button>
          </div>
        ))}
      </div>

      {activeReceipt && (
        <div className="modal-backdrop">
          <div className="modal-box" style={{ maxWidth: '580px', background: '#0F1E36', border: '2px solid #10B981' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1E2C4A', paddingBottom: '14px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={24} style={{ color: '#10B981' }} />
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#F8FAFC' }}>
                    Official Municipal Receipt
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>CivicPulse Nexus • Digital Governance Authority</div>
                </div>
              </div>
              <button
                onClick={() => setActiveReceipt(null)}
                className="input-icon-btn"
                style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '50%', padding: '6px' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ background: '#0A0F1D', border: '1px solid #1E2C4A', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
              
              <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#F8FAFC' }}>{activeReceipt.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: '700', marginTop: '2px' }}>{activeReceipt.status}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.82rem', color: '#94A3B8', borderTop: '1px solid #1E2C4A', paddingTop: '12px' }}>
                <div><strong>Receipt No:</strong> {activeReceipt.id}</div>
                <div><strong>Txn Reference:</strong> {activeReceipt.txnRef}</div>
                <div><strong>Taxpayer Name:</strong> {user?.fullName || 'Rahul S.'}</div>
                <div><strong>Ward Jurisdiction:</strong> {activeReceipt.ward}</div>
                <div><strong>Payment Date:</strong> {activeReceipt.paymentDate}</div>
                <div><strong>Payment Mode:</strong> {activeReceipt.paymentMode}</div>
                <div style={{ gridColumn: 'span 2', background: 'rgba(16, 185, 129, 0.1)', padding: '8px 12px', borderRadius: '6px', color: '#10B981', display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                  <span>Total Settlement Amount:</span>
                  <strong style={{ fontSize: '0.95rem' }}>{activeReceipt.amount}</strong>
                </div>
              </div>

              <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '0.72rem', color: '#64748B' }}>
                This is a computer-generated, digitally signed statutory document. No physical signature required.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button onClick={() => setActiveReceipt(null)} className="btn btn-outline">
                Close
              </button>
              <button onClick={handlePrint} className="btn btn-emerald">
                <Printer size={16} />
                <span>Print / Save PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default CitizenReceipts;
