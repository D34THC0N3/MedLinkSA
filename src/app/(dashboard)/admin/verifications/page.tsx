'use client';

import { useState } from 'react';
import { ShieldCheck, CheckCircle, X, Search, Clock, AlertTriangle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface Verification {
  id: string;
  name: string;
  type: 'Provider' | 'Facility' | 'Pharmacy';
  credential: string;
  licenseStatus: 'verified' | 'pending' | 'rejected';
  backgroundCheck: 'clear' | 'pending' | 'flag';
  submitted: string;
}

export default function AdminVerifications() {
  const [list, setList] = useState<Verification[]>([
    { id: 'v1', name: 'Dr. Sarah Johnson', type: 'Provider', credential: 'MBBS, University of Cape Town', licenseStatus: 'pending', backgroundCheck: 'clear', submitted: '2 days ago' },
    { id: 'v2', name: 'Lakeside Medical Center', type: 'Facility', credential: 'Facility License — Level 2', licenseStatus: 'pending', backgroundCheck: 'clear', submitted: '5 days ago' },
    { id: 'v3', name: 'Dr. Amara Okafor', type: 'Provider', credential: 'MBBS, University of Ibadan', licenseStatus: 'pending', backgroundCheck: 'pending', submitted: '1 week ago' },
    { id: 'v4', name: 'Dr. James Mwangi', type: 'Provider', credential: 'MD, University of Nairobi', licenseStatus: 'rejected', backgroundCheck: 'flag', submitted: '2 weeks ago' },
    { id: 'v5', name: 'CityMed Pharmacy', type: 'Pharmacy', credential: 'Pharmacy License — Schedule 3', licenseStatus: 'pending', backgroundCheck: 'clear', submitted: '3 days ago' },
    { id: 'v6', name: 'Dr. Emily Chen', type: 'Provider', credential: 'MD, Stellenbosch University', licenseStatus: 'verified', backgroundCheck: 'clear', submitted: '1 month ago' },
    { id: 'v7', name: 'Riverside Community Health', type: 'Facility', credential: 'Clinic Registration — Type B', licenseStatus: 'pending', backgroundCheck: 'pending', submitted: '4 days ago' },
  ]);

  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('pending');

  const handleVerify = (id: string) => {
    setList(prev => prev.map(i => i.id === id ? { ...i, licenseStatus: 'verified' as const } : i));
  };

  const handleReject = (id: string) => {
    setList(prev => prev.map(i => i.id === id ? { ...i, licenseStatus: 'rejected' as const } : i));
  };

  const filtered = filter === 'all' ? list : list.filter(i => i.licenseStatus === filter);

  const statusBadge = (s: string) => {
    switch (s) {
      case 'verified': return { bg: 'rgba(52,211,153,0.12)', color: 'var(--stat-teal)', label: 'Verified' };
      case 'clear': return { bg: 'rgba(52,211,153,0.12)', color: 'var(--stat-teal)', label: 'Clear' };
      case 'pending': return { bg: 'rgba(251,191,36,0.12)', color: '#d97706', label: 'Pending' };
      case 'rejected':
      case 'flag': return { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', label: s === 'rejected' ? 'Rejected' : 'Flagged' };
      default: return { bg: 'transparent', color: 'var(--foreground-secondary)', label: s };
    }
  };

  const tabs = [
    { key: 'pending', label: 'Pending', count: list.filter(i => i.licenseStatus === 'pending').length },
    { key: 'verified', label: 'Verified', count: list.filter(i => i.licenseStatus === 'verified').length },
    { key: 'rejected', label: 'Rejected', count: list.filter(i => i.licenseStatus === 'rejected').length },
    { key: 'all', label: 'All', count: list.length },
  ];

  return (
    <DashboardLayout>
      <div style={{ padding: '32px', maxWidth: '1440px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--foreground)', margin: '0 0 4px' }}>Verifications</h1>
            <p style={{ fontSize: '14px', color: 'var(--foreground-secondary)', margin: 0 }}>Review and approve provider, facility, and pharmacy credentials</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setFilter(t.key as typeof filter)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--card-border)', background: filter === t.key ? 'var(--accent)' : 'var(--card-bg)', color: filter === t.key ? '#fff' : 'var(--foreground)', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
              {t.label}
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '18px', height: '18px', borderRadius: '9px', padding: '0 5px', fontSize: '11px', fontWeight: 600, background: filter === t.key ? 'rgba(255,255,255,0.2)' : 'rgba(59,130,246,0.1)', color: filter === t.key ? '#fff' : 'var(--accent)' }}>{t.count}</span>
            </button>
          ))}
        </div>

        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                {['Name', 'Type', 'Credential', 'License', 'Background', 'Submitted', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--foreground-secondary)', fontWeight: 500, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => {
                const lic = statusBadge(item.licenseStatus);
                const bg = statusBadge(item.backgroundCheck);
                return (
                  <tr key={item.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--card-border)' : 'none' }}>
                    <td style={{ padding: '14px 16px', color: 'var(--foreground)', fontWeight: 500 }}>{item.name}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '8px', fontSize: '12px', background: 'rgba(59,130,246,0.08)', color: 'var(--accent)' }}>{item.type}</span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--foreground-secondary)' }}>{item.credential}</td>
                    <td style={{ padding: '14px 16px' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 500, background: lic.bg, color: lic.color }}>{lic.label}</span></td>
                    <td style={{ padding: '14px 16px' }}><span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 500, background: bg.bg, color: bg.color }}>{bg.label}</span></td>
                    <td style={{ padding: '14px 16px', color: 'var(--foreground-secondary)', fontSize: '12px' }}>{item.submitted}</td>
                    <td style={{ padding: '14px 16px' }}>
                      {item.licenseStatus === 'pending' ? (
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => handleVerify(item.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px', fontSize: '12px', fontWeight: 500, border: 'none', borderRadius: '8px', cursor: 'pointer', background: 'var(--accent)', color: '#fff' }}>
                            <CheckCircle size={12} /> Approve
                          </button>
                          <button onClick={() => handleReject(item.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 12px', fontSize: '12px', fontWeight: 500, border: '1px solid var(--card-border)', borderRadius: '8px', cursor: 'pointer', background: 'transparent', color: 'var(--foreground-secondary)' }}>
                            <X size={12} /> Reject
                          </button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', fontWeight: 500, color: item.licenseStatus === 'verified' ? 'var(--stat-teal)' : '#ef4444' }}>
                          {item.licenseStatus === 'verified' ? 'Approved' : 'Rejected'}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--foreground-secondary)' }}>
              <ShieldCheck size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p>No {filter} verifications</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
