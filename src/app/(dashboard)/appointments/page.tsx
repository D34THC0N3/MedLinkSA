'use client';

import { useState } from 'react';
import { Calendar, Clock, Video, MapPin, Search, Plus, X, Filter } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/lib/auth-context';

interface Appointment {
  id: string; doctor: string; patient: string; specialty: string; date: string; time: string; type: 'In-Person' | 'Telehealth'; status: 'upcoming' | 'completed' | 'cancelled';
}

const allAppointments: Appointment[] = [
  { id: 'a1', doctor: 'Dr. Sarah Evans', patient: 'Sarah Johnson', specialty: 'Cardiology', date: '2026-06-20', time: '09:00', type: 'In-Person', status: 'upcoming' },
  { id: 'a2', doctor: 'Dr. Michael Chen', patient: 'Sarah Johnson', specialty: 'General Medicine', date: '2026-06-22', time: '14:30', type: 'Telehealth', status: 'upcoming' },
  { id: 'a3', doctor: 'Dr. Priya Singh', patient: 'John Doe', specialty: 'Dermatology', date: '2026-07-01', time: '11:00', type: 'In-Person', status: 'upcoming' },
  { id: 'a4', doctor: 'Dr. Sarah Evans', patient: 'Mary Williams', specialty: 'Cardiology', date: '2026-06-15', time: '10:00', type: 'Telehealth', status: 'completed' },
  { id: 'a5', doctor: 'Dr. Michael Chen', patient: 'Peter Brown', specialty: 'General Medicine', date: '2026-06-14', time: '15:00', type: 'In-Person', status: 'completed' },
  { id: 'a6', doctor: 'Dr. Priya Singh', patient: 'Sarah Johnson', specialty: 'Dermatology', date: '2026-05-28', time: '11:00', type: 'In-Person', status: 'cancelled' },
];

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [showBook, setShowBook] = useState(false);

  const isProvider = user?.role === 'provider';
  const appointments = allAppointments.filter(a => {
    if (filter === 'upcoming' && a.status !== 'upcoming') return false;
    if (filter === 'completed' && a.status !== 'completed') return false;
    const nameMatch = isProvider ? a.patient.toLowerCase().includes(search.toLowerCase()) : a.doctor.toLowerCase().includes(search.toLowerCase());
    return nameMatch;
  });

  return (
    <DashboardLayout title="Appointments">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {(['all', 'upcoming', 'completed'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === f ? 'btn-primary' : 'btn-ghost'}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <div className="relative w-48">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full px-3 py-1.5 pl-9 rounded-lg text-xs border outline-none" style={{ background: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }} />
            </div>
            <button className="btn-primary text-sm" onClick={() => setShowBook(true)}>
              <Plus size={16} /> Book
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {appointments.map(a => (
            <div key={a.id} className="card p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                  {(isProvider ? a.patient : a.doctor).split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{isProvider ? a.patient : a.doctor}</p>
                  <p className="text-xs" style={{ color: 'var(--foreground-secondary)' }}>{a.specialty}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[11px] flex items-center gap-1" style={{ color: 'var(--foreground-tertiary)' }}><Calendar size={11} /> {a.date}</span>
                    <span className="text-[11px] flex items-center gap-1" style={{ color: 'var(--foreground-tertiary)' }}><Clock size={11} /> {a.time}</span>
                    <span className={`text-[11px] flex items-center gap-1 ${a.type === 'Telehealth' ? 'text-[#3B82F6]' : 'text-[#0D9488]'}`}>
                      {a.type === 'Telehealth' ? <Video size={11} /> : <MapPin size={11} />} {a.type}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`pill-badge ${a.status === 'upcoming' ? 'pill-blue' : a.status === 'completed' ? 'pill-green' : 'pill-red'}`}>
                    {a.status}
                  </span>
                  {a.status === 'upcoming' && (
                    <>
                      <button className="btn-outline text-xs px-3 py-1">Reschedule</button>
                      <button className="btn-ghost text-xs" style={{ color: 'var(--error)' }}>Cancel</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowBook(false)}>
          <div className="card w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
            <div className="card-header flex items-center justify-between">
              <h3 className="section-title">Book Appointment</h3>
              <button onClick={() => setShowBook(false)} className="btn-ghost p-1"><X size={18} /></button>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Doctor</label>
                <select className="w-full px-3.5 py-2.5 rounded-lg text-sm border outline-none" style={{ background: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}>
                  <option>Dr. Sarah Evans - Cardiology</option>
                  <option>Dr. Michael Chen - General Medicine</option>
                  <option>Dr. Priya Singh - Dermatology</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Date</label>
                  <input type="date" className="w-full px-3.5 py-2.5 rounded-lg text-sm border outline-none" style={{ background: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Time</label>
                  <input type="time" className="w-full px-3.5 py-2.5 rounded-lg text-sm border outline-none" style={{ background: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Type</label>
                <div className="flex gap-2">
                  {['In-Person', 'Telehealth'].map(t => (
                    <button key={t} className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border transition-all" style={{ borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}>
                      {t === 'Telehealth' ? <Video size={14} className="inline mr-1" /> : <MapPin size={14} className="inline mr-1" />}
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <button className="btn-primary w-full text-sm">Confirm Booking</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
