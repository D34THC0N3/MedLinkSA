'use client';

import { useState } from 'react';
import { Video, Phone, MessageSquare, Clock, Calendar, CheckCircle, X, Search, User } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/lib/auth-context';

interface TelehealthSession {
  id: string; doctor: string; patient: string; specialty: string; date: string; time: string; status: 'upcoming' | 'live' | 'completed' | 'cancelled';
}

const allSessions: TelehealthSession[] = [
  { id: 't1', doctor: 'Dr. Sarah Evans', patient: 'Sarah Johnson', specialty: 'Cardiology', date: '2026-06-20', time: '09:00', status: 'upcoming' },
  { id: 't2', doctor: 'Dr. Michael Chen', patient: 'Sarah Johnson', specialty: 'General Medicine', date: '2026-06-22', time: '14:30', status: 'upcoming' },
  { id: 't3', doctor: 'Dr. Priya Singh', patient: 'John Doe', specialty: 'Dermatology', date: '2026-06-18', time: '11:00', status: 'live' },
  { id: 't4', doctor: 'Dr. Sarah Evans', patient: 'Mary Williams', specialty: 'Cardiology', date: '2026-06-15', time: '10:00', status: 'completed' },
  { id: 't5', doctor: 'Dr. Michael Chen', patient: 'Peter Brown', specialty: 'General Medicine', date: '2026-06-14', time: '15:00', status: 'completed' },
];

export default function TelemedicinePage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  const isProvider = user?.role === 'provider';
  const sessions = allSessions.filter(s => {
    if (filter === 'upcoming' && s.status !== 'upcoming' && s.status !== 'live') return false;
    if (filter === 'completed' && s.status !== 'completed') return false;
    const nameMatch = isProvider ? s.patient.toLowerCase().includes(search.toLowerCase()) : s.doctor.toLowerCase().includes(search.toLowerCase());
    return nameMatch;
  });

  return (
    <DashboardLayout title="Telemedicine">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {(['all', 'upcoming', 'completed'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === f ? 'btn-primary' : 'btn-ghost'}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="relative w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full px-3 py-1.5 pl-9 rounded-lg text-xs border outline-none" style={{ background: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }} />
          </div>
        </div>

        <div className="grid gap-4">
          {sessions.map(s => (
            <div key={s.id} className="card p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: s.status === 'live' ? 'rgba(34,197,94,0.15)' : 'var(--accent-light)', color: s.status === 'live' ? '#22C55E' : 'var(--accent)' }}>
                  <Video size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{isProvider ? s.patient : s.doctor}</p>
                  <p className="text-xs" style={{ color: 'var(--foreground-secondary)' }}>{s.specialty}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[11px] flex items-center gap-1" style={{ color: 'var(--foreground-tertiary)' }}>
                      <Calendar size={11} /> {s.date}
                    </span>
                    <span className="text-[11px] flex items-center gap-1" style={{ color: 'var(--foreground-tertiary)' }}>
                      <Clock size={11} /> {s.time}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {s.status === 'live' && <span className="pill-badge pill-green animate-pulse">Live</span>}
                  {s.status === 'upcoming' && <span className="pill-badge pill-blue">Upcoming</span>}
                  {s.status === 'completed' && <span className="pill-badge pill-gray">Completed</span>}
                  {s.status === 'cancelled' && <span className="pill-badge pill-red">Cancelled</span>}
                  {(s.status === 'upcoming' || s.status === 'live') && (
                    <button className="btn-primary text-xs px-4 py-1.5">
                      <Video size={14} /> Join
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
