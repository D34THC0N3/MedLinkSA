'use client';

import { useState } from 'react';
import { Search, Phone, Mail, Calendar, MoreVertical, Activity, MessageSquare } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  lastVisit: string;
  condition: string;
  status: 'stable' | 'critical' | 'follow-up';
  phone: string;
  email: string;
}

export default function PatientsPage() {
  const [search, setSearch] = useState('');
  const [patients] = useState<Patient[]>([
    { id: 'p1', name: 'Grace Okafor', age: 34, gender: 'F', lastVisit: '2 days ago', condition: 'Hypertension', status: 'stable', phone: '+27 82 123 4567', email: 'grace.o@email.com' },
    { id: 'p2', name: 'Thabo Mokoena', age: 28, gender: 'M', lastVisit: '1 week ago', condition: 'Asthma', status: 'follow-up', phone: '+27 72 234 5678', email: 'thabo.m@email.com' },
    { id: 'p3', name: 'Priya Patel', age: 45, gender: 'F', lastVisit: 'Today', condition: 'Diabetes Type 2', status: 'stable', phone: '+27 62 345 6789', email: 'priya.p@email.com' },
    { id: 'p4', name: 'John Mwangi', age: 52, gender: 'M', lastVisit: '3 days ago', condition: 'Post-surgery recovery', status: 'critical', phone: '+27 82 456 7890', email: 'john.m@email.com' },
    { id: 'p5', name: 'Lindiwe Nkosi', age: 31, gender: 'F', lastVisit: '2 weeks ago', condition: 'Pregnancy — 2nd trimester', status: 'follow-up', phone: '+27 72 567 8901', email: 'lindiwe.n@email.com' },
    { id: 'p6', name: 'David Ochieng', age: 67, gender: 'M', lastVisit: '5 days ago', condition: 'COPD', status: 'stable', phone: '+27 62 678 9012', email: 'david.o@email.com' },
  ]);

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.condition.toLowerCase().includes(search.toLowerCase())
  );

  const statusStyle = (s: string) => {
    switch (s) {
      case 'stable': return { background: 'rgba(52,211,153,0.12)', color: 'var(--stat-teal)' };
      case 'critical': return { background: 'rgba(239,68,68,0.12)', color: '#ef4444' };
      case 'follow-up': return { background: 'rgba(251,191,36,0.12)', color: '#d97706' };
      default: return {};
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-7">
          <div>
            <h1 className="section-title text-xl sm:text-2xl md:text-[28px]" style={{ color: 'var(--foreground)', margin: '0 0 4px' }}>My Patients</h1>
            <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>Manage and view patient records</p>
          </div>
          <div className="relative w-full sm:w-auto">
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--foreground-secondary)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients..."
              className="w-full sm:w-[260px] px-3 py-2 pl-9 rounded-lg text-sm border outline-none"
              style={{ border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--foreground)' }} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">
          {[
            { label: 'Total Patients', value: patients.length.toString(), icon: <Activity size={18} />, color: 'var(--accent)' },
            { label: 'Critical', value: patients.filter(p => p.status === 'critical').length.toString(), icon: <Activity size={18} />, color: '#ef4444' },
            { label: 'Follow-up Required', value: patients.filter(p => p.status === 'follow-up').length.toString(), icon: <Activity size={18} />, color: '#d97706' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, marginBottom: '8px' }}>{s.icon}</div>
              <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--foreground)', margin: '0 0 4px' }}>{s.value}</p>
              <p style={{ fontSize: '13px', color: 'var(--foreground-secondary)', margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                {['Patient', 'Age/Gender', 'Condition', 'Status', 'Last Visit', 'Contact', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--foreground-secondary)', fontWeight: 500, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--card-border)' : 'none' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 500, color: 'var(--foreground)' }}>{p.name}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--foreground-secondary)' }}>{p.age} / {p.gender}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--foreground)' }}>{p.condition}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 500, ...statusStyle(p.status) }}>{p.status}</span>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--foreground-secondary)', fontSize: '12px' }}>{p.lastVisit}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid var(--card-border)', background: 'transparent', cursor: 'pointer', color: 'var(--foreground-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Phone size={12} /></button>
                      <button style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid var(--card-border)', background: 'transparent', cursor: 'pointer', color: 'var(--foreground-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mail size={12} /></button>
                      <button style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid var(--card-border)', background: 'transparent', cursor: 'pointer', color: 'var(--foreground-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MessageSquare size={12} /></button>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground-secondary)' }}><MoreVertical size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
