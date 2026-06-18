'use client';

import { useState } from 'react';
import { UserCheck, Search, Calendar, Clock, Award, MoreVertical, Phone, Mail } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface StaffMember {
  name: string;
  role: string;
  department: string;
  shift: 'Morning' | 'Evening' | 'Night' | 'Off';
  status: 'on-duty' | 'break' | 'off-duty' | 'leave';
  hoursThisWeek: number;
  rating: number;
  phone: string;
}

export default function Staffing() {
  const [search, setSearch] = useState('');
  const [staff] = useState<StaffMember[]>([
    { name: 'Nurse Jane Dlamini', role: 'Registered Nurse', department: 'Cardiology', shift: 'Morning', status: 'on-duty', hoursThisWeek: 32, rating: 4.8, phone: '+27 82 111 2233' },
    { name: 'Nurse Peter Smith', role: 'Senior Nurse', department: 'ER', shift: 'Evening', status: 'on-duty', hoursThisWeek: 36, rating: 4.9, phone: '+27 72 222 3344' },
    { name: 'Dr. James Mwangi', role: 'Attending Physician', department: 'Orthopedics', shift: 'Morning', status: 'break', hoursThisWeek: 28, rating: 4.7, phone: '+27 62 333 4455' },
    { name: 'Tech Maria Santos', role: 'Lab Technician', department: 'Radiology', shift: 'Night', status: 'on-duty', hoursThisWeek: 40, rating: 4.5, phone: '+27 82 444 5566' },
    { name: 'Admin Grace Mokoena', role: 'Ward Clerk', department: 'Pediatrics', shift: 'Morning', status: 'off-duty', hoursThisWeek: 24, rating: 4.6, phone: '+27 72 555 6677' },
    { name: 'Nurse David Kim', role: 'Registered Nurse', department: 'ICU', shift: 'Evening', status: 'leave', hoursThisWeek: 0, rating: 4.9, phone: '+27 62 666 7788' },
    { name: 'Dr. Sarah Johnson', role: 'Consultant', department: 'Cardiology', shift: 'Morning', status: 'on-duty', hoursThisWeek: 30, rating: 4.9, phone: '+27 82 777 8899' },
    { name: 'Tech Sipho Ndlovu', role: 'Radiology Tech', department: 'Radiology', shift: 'Night', status: 'on-duty', hoursThisWeek: 38, rating: 4.4, phone: '+27 72 888 9900' },
  ]);

  const filtered = staff.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.role.toLowerCase().includes(search.toLowerCase()) ||
    s.department.toLowerCase().includes(search.toLowerCase())
  );

  const statusStyle = (s: string) => {
    switch (s) {
      case 'on-duty': return { bg: 'rgba(52,211,153,0.12)', color: 'var(--stat-teal)', label: 'On Duty' };
      case 'break': return { bg: 'rgba(251,191,36,0.12)', color: '#d97706', label: 'Break' };
      case 'off-duty': return { bg: 'rgba(107,114,128,0.12)', color: '#6b7280', label: 'Off Duty' };
      case 'leave': return { bg: 'rgba(239,68,68,0.12)', color: '#ef4444', label: 'On Leave' };
      default: return {};
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full">
        <div className="mb-5 sm:mb-7">
          <h1 className="section-title text-xl sm:text-2xl md:text-[28px]" style={{ color: 'var(--foreground)', margin: '0 0 4px' }}>Staffing</h1>
          <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>Manage staff schedules, shifts, and availability</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
          {[
            { label: 'Total Staff', value: staff.length.toString(), color: 'var(--accent)' },
            { label: 'On Duty', value: staff.filter(s => s.status === 'on-duty').length.toString(), color: 'var(--stat-teal)' },
            { label: 'On Leave', value: staff.filter(s => s.status === 'leave').length.toString(), color: '#ef4444' },
            { label: 'Avg Hours (Week)', value: Math.round(staff.reduce((a, s) => a + s.hoursThisWeek, 0) / staff.length) + 'h', color: 'var(--accent)' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '20px' }}>
              <p style={{ fontSize: '24px', fontWeight: 700, color: s.color, margin: '0 0 4px' }}>{s.value}</p>
              <p style={{ fontSize: '13px', color: 'var(--foreground-secondary)', margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--foreground-secondary)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search staff..."
              style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--foreground)', fontSize: '13px', outline: 'none' }} />
          </div>
        </div>

        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                {['Name', 'Role', 'Department', 'Shift', 'Status', 'Hours/Week', 'Rating', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--foreground-secondary)', fontWeight: 500, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => {
                const st = statusStyle(s.status);
                return (
                  <tr key={s.name} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--card-border)' : 'none' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 500, color: 'var(--foreground)' }}>{s.name}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--foreground-secondary)' }}>{s.role}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--accent)' }}>{s.department}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: 'var(--foreground)' }}>
                        <Clock size={12} style={{ color: 'var(--foreground-secondary)' }} />{s.shift}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '2px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 500, background: st.bg, color: st.color }}>{st.label}</span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--foreground)' }}>{s.hoursThisWeek}h</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ color: '#d97706' }}>{'★'.repeat(Math.round(s.rating))}</span>
                      <span style={{ marginLeft: '4px', fontSize: '12px', color: 'var(--foreground-secondary)' }}>{s.rating}</span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground-secondary)' }}><MoreVertical size={16} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
