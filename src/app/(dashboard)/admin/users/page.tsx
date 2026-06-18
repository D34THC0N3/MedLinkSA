'use client';

import { useState } from 'react';
import { Search, Filter, MoreVertical, Shield, UserCheck, UserX, Mail, Calendar } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface AppUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'suspended' | 'pending';
  joined: string;
  lastActive: string;
}

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [users] = useState<AppUser[]>([
    { id: 'u1', name: 'Dr. Sarah Johnson', email: 'sarah.j@serenity.com', role: 'Provider', status: 'active', joined: 'Jan 2025', lastActive: '2 min ago' },
    { id: 'u2', name: 'Lakeside Medical Center', email: 'admin@lakeside.org', role: 'Facility', status: 'active', joined: 'Mar 2025', lastActive: '15 min ago' },
    { id: 'u3', name: 'John Mwangi', email: 'john.m@patient.com', role: 'Patient', status: 'active', joined: 'Feb 2025', lastActive: '1 hr ago' },
    { id: 'u4', name: 'PharmaCare Ltd', email: 'ops@pharmacare.co', role: 'Pharmacy', status: 'suspended', joined: 'Dec 2024', lastActive: '2 days ago' },
    { id: 'u5', name: 'Dr. Michael Chen', email: 'm.chen@serenity.com', role: 'Provider', status: 'active', joined: 'Apr 2025', lastActive: '5 min ago' },
    { id: 'u6', name: 'City General Hospital', email: 'info@citygeneral.com', role: 'Facility', status: 'pending', joined: 'Jun 2025', lastActive: 'Never' },
    { id: 'u7', name: 'Grace Okafor', email: 'grace.o@patient.com', role: 'Patient', status: 'active', joined: 'May 2025', lastActive: '30 min ago' },
    { id: 'u8', name: 'MedSource Pharmacy', email: 'orders@medsource.com', role: 'Pharmacy', status: 'active', joined: 'Jan 2025', lastActive: '1 day ago' },
  ]);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return { background: 'rgba(52, 211, 153, 0.12)', color: 'var(--stat-teal)' };
      case 'suspended': return { background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444' };
      case 'pending': return { background: 'rgba(251, 191, 36, 0.12)', color: '#d97706' };
      default: return {};
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Provider': return <UserCheck size={14} />;
      case 'Facility': return <Shield size={14} />;
      case 'Pharmacy': return <Mail size={14} />;
      default: return <UserCheck size={14} />;
    }
  };

  return (
    <DashboardLayout>
      <div style={{ padding: '32px', maxWidth: '1440px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--foreground)', margin: '0 0 4px' }}>Users</h1>
            <p style={{ fontSize: '14px', color: 'var(--foreground-secondary)', margin: 0 }}>Manage platform users and accounts</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--foreground-secondary)' }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search users..."
                style={{ padding: '9px 12px 9px 36px', borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--foreground)', fontSize: '13px', width: '240px', outline: 'none' }}
              />
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--foreground)', fontSize: '13px', cursor: 'pointer' }}>
              <Filter size={14} /> Filter
            </button>
          </div>
        </div>

        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                {['User', 'Email', 'Role', 'Status', 'Joined', 'Last Active', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--foreground-secondary)', fontWeight: 500, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--card-border)' : 'none' }}>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontSize: '12px', fontWeight: 600 }}>
                        {u.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span style={{ color: 'var(--foreground)', fontWeight: 500 }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--foreground-secondary)' }}>{u.email}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '8px', fontSize: '12px', background: 'rgba(59,130,246,0.08)', color: 'var(--accent)' }}>
                      {getRoleIcon(u.role)} {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 500, ...getStatusStyle(u.status) }}>
                      {u.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--foreground-secondary)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={12} />{u.joined}</span>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--foreground-secondary)', fontSize: '12px' }}>{u.lastActive}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground-secondary)', padding: '4px' }}>
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: 'var(--foreground-secondary)' }}>{filtered.length} users</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[1, 2, 3].map(p => (
              <button key={p} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1px solid var(--card-border)', background: p === 1 ? 'var(--accent)' : 'var(--card-bg)', color: p === 1 ? '#fff' : 'var(--foreground)', fontSize: '13px', cursor: 'pointer' }}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
