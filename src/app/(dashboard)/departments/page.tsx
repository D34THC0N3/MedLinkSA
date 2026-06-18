'use client';

import { useState } from 'react';
import { Building2, Users, Plus, Search, MoreVertical, Activity, Stethoscope, Heart, Brain, Bone } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface Department {
  name: string;
  icon: typeof Building2;
  head: string;
  staff: number;
  beds: number;
  occupancy: number;
  patients: number;
  status: 'active' | 'limited' | 'closed';
}

export default function Departments() {
  const [search, setSearch] = useState('');
  const [depts] = useState<Department[]>([
    { name: 'Cardiology', icon: Heart, head: 'Dr. Sarah Johnson', staff: 24, beds: 40, occupancy: 85, patients: 156, status: 'active' },
    { name: 'Pediatrics', icon: Users, head: 'Dr. Michael Chen', staff: 18, beds: 30, occupancy: 73, patients: 112, status: 'active' },
    { name: 'Orthopedics', icon: Bone, head: 'Dr. James Mwangi', staff: 14, beds: 25, occupancy: 92, patients: 89, status: 'active' },
    { name: 'Neurology', icon: Brain, head: 'Dr. Amara Okafor', staff: 10, beds: 18, occupancy: 61, patients: 67, status: 'active' },
    { name: 'Emergency', icon: Activity, head: 'Dr. David Kim', staff: 32, beds: 50, occupancy: 100, patients: 234, status: 'limited' },
    { name: 'Internal Medicine', icon: Stethoscope, head: 'Dr. Priya Patel', staff: 20, beds: 35, occupancy: 77, patients: 145, status: 'active' },
    { name: 'Radiology', icon: Activity, head: 'Dr. Emily Chen', staff: 8, beds: 0, occupancy: 0, patients: 0, status: 'active' },
  ]);

  const filtered = depts.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));

  const getStatusStyle = (s: string) => {
    switch (s) {
      case 'active': return { bg: 'rgba(52,211,153,0.12)', color: 'var(--stat-teal)' };
      case 'limited': return { bg: 'rgba(251,191,36,0.12)', color: '#d97706' };
      case 'closed': return { bg: 'rgba(239,68,68,0.12)', color: '#ef4444' };
      default: return {};
    }
  };

  const getOccColor = (pct: number) => {
    if (pct >= 90) return '#ef4444';
    if (pct >= 75) return '#d97706';
    return 'var(--stat-teal)';
  };

  return (
    <DashboardLayout>
      <div className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 sm:mb-7">
          <div>
            <h1 className="section-title text-xl sm:text-2xl md:text-[28px]" style={{ color: 'var(--foreground)', margin: '0 0 4px' }}>Departments</h1>
            <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>Manage clinical departments and resource allocation</p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border-none" style={{ background: 'var(--accent)', color: '#fff' }}>
            <Plus size={16} /> Add Department
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
          {[
            { label: 'Departments', value: '7', icon: <Building2 size={18} />, color: 'var(--accent)' },
            { label: 'Total Staff', value: depts.reduce((a, d) => a + d.staff, 0).toString(), icon: <Users size={18} />, color: 'var(--stat-teal)' },
            { label: 'Total Beds', value: depts.reduce((a, d) => a + d.beds, 0).toString(), icon: <Activity size={18} />, color: 'var(--accent)' },
            { label: 'Active Patients', value: depts.reduce((a, d) => a + d.patients, 0).toString(), icon: <Users size={18} />, color: 'var(--stat-teal)' },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, marginBottom: '8px' }}>{s.icon}</div>
              <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--foreground)', margin: '0 0 4px' }}>{s.value}</p>
              <p style={{ fontSize: '13px', color: 'var(--foreground-secondary)', margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--foreground-secondary)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search departments..."
              style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--foreground)', fontSize: '13px', outline: 'none' }} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((dept) => {
            const Icon = dept.icon;
            const st = getStatusStyle(dept.status);
            const occColor = getOccColor(dept.occupancy);
            return (
              <div key={dept.name} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(59,130,246,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--foreground)' }}>{dept.name}</p>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--foreground-secondary)' }}>{dept.head}</p>
                    </div>
                  </div>
                  <span style={{ padding: '3px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 500, background: st.bg, color: st.color }}>{dept.status}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div><p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--foreground)' }}>{dept.staff}</p><p style={{ margin: 0, fontSize: '12px', color: 'var(--foreground-secondary)' }}>Staff</p></div>
                  <div><p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--foreground)' }}>{dept.beds}</p><p style={{ margin: 0, fontSize: '12px', color: 'var(--foreground-secondary)' }}>Beds</p></div>
                  <div><p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: occColor }}>{dept.occupancy}%</p><p style={{ margin: 0, fontSize: '12px', color: 'var(--foreground-secondary)' }}>Occupancy</p></div>
                  <div><p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--foreground)' }}>{dept.patients}</p><p style={{ margin: 0, fontSize: '12px', color: 'var(--foreground-secondary)' }}>Active Patients</p></div>
                </div>
                <div style={{ marginTop: '16px', height: '6px', borderRadius: '3px', background: 'var(--card-border)' }}>
                  <div style={{ width: `${dept.occupancy}%`, height: '100%', borderRadius: '3px', background: occColor }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
