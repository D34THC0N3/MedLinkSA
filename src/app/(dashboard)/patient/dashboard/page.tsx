'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Pill, FileText, MessageSquare, Video, ChevronRight, Plus, Heart, Bell, AlertTriangle, Activity, X, Download } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface Appointment {
  id: string; doctor: string; specialty: string; date: string; time: string; type: 'In-Person' | 'Telehealth'; status: string;
}

interface Prescription {
  id: string; medication: string; dosage: string; prescribedBy: string; refillDate: string; status: 'Active' | 'Refill Due' | 'Expired';
}

interface Reminder {
  id: string; text: string; date: string; type: 'info' | 'warning';
}

const appointments: Appointment[] = [
  { id: 'a1', doctor: 'Dr. Sarah Johnson', specialty: 'Cardiology', date: '2026-06-20', time: '09:00', type: 'In-Person', status: 'upcoming' },
  { id: 'a2', doctor: 'Dr. Michael Chen', specialty: 'General Medicine', date: '2026-06-22', time: '14:30', type: 'Telehealth', status: 'upcoming' },
  { id: 'a3', doctor: 'Dr. Priya Singh', specialty: 'Dermatology', date: '2026-07-01', time: '11:00', type: 'In-Person', status: 'upcoming' },
];

const prescriptions: Prescription[] = [
  { id: 'p1', medication: 'Amlodipine', dosage: '5mg daily', prescribedBy: 'Dr. Sarah Johnson', refillDate: '2026-07-15', status: 'Active' },
  { id: 'p2', medication: 'Metformin', dosage: '500mg twice daily', prescribedBy: 'Dr. Michael Chen', refillDate: '2026-06-10', status: 'Refill Due' },
  { id: 'p3', medication: 'Atorvastatin', dosage: '10mg daily', prescribedBy: 'Dr. Sarah Johnson', refillDate: '2026-08-01', status: 'Active' },
];

const reminders: Reminder[] = [
  { id: 'r1', text: 'Blood pressure check due', date: '2026-06-25', type: 'warning' },
  { id: 'r2', text: 'Annual flu shot recommended', date: '2026-10-01', type: 'info' },
  { id: 'r3', text: 'Prescription refill due: Metformin', date: '2026-06-10', type: 'warning' },
];

export default function PatientDashboard() {
  const [showTelehealthModal, setShowTelehealthModal] = useState(false);
  const [showRefillModal, setShowRefillModal] = useState(false);
  const [healthScore, setHealthScore] = useState(78);

  useEffect(() => {
    const timer = setTimeout(() => setHealthScore(78), 500);
    return () => clearTimeout(timer);
  }, []);

  const circleLen = 2 * Math.PI * 54;
  const scoreOffset = circleLen - (healthScore / 100) * circleLen;

  return (
    <DashboardLayout title="Good morning, Sarah!">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>{new Date().toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <button className="btn-primary" onClick={() => setShowTelehealthModal(true)}>
            <Video size={16} /> Join Telehealth Call
          </button>
        </div>

        <div className="grid-4-cols">
          <div className="stat-card">
            <div className="flex items-start justify-between mb-1">
              <span className="stat-label">Upcoming</span>
              <Calendar size={18} style={{ color: 'var(--stat-blue)' }} />
            </div>
            <p className="stat-value">{appointments.length}</p>
            <p className="text-xs" style={{ color: 'var(--foreground-secondary)' }}>Next: Jun 20, 09:00</p>
          </div>
          <div className="stat-card">
            <div className="flex items-start justify-between mb-1">
              <span className="stat-label">Prescriptions</span>
              <Pill size={18} style={{ color: 'var(--stat-amber)' }} />
            </div>
            <p className="stat-value">{prescriptions.filter(p => p.status === 'Active' || p.status === 'Refill Due').length}</p>
            {prescriptions.filter(p => p.status === 'Refill Due').length > 0 && (
              <p className="text-xs" style={{ color: 'var(--warning)' }}>{prescriptions.filter(p => p.status === 'Refill Due').length} refill due</p>
            )}
          </div>
          <div className="stat-card">
            <div className="flex items-start justify-between mb-1">
              <span className="stat-label">Health Score</span>
              <Heart size={18} style={{ color: 'var(--stat-green)' }} />
            </div>
            <div className="flex items-center gap-3">
              <svg width="56" height="56" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="var(--card-border)" strokeWidth="8" />
                <circle cx="60" cy="60" r="54" fill="none" stroke="#34C759" strokeWidth="8" strokeDasharray={circleLen} strokeDashoffset={scoreOffset} strokeLinecap="round" transform="rotate(-90 60 60)" style={{ transition: 'stroke-dashoffset 1.5s ease-out' }} />
                <text x="60" y="60" textAnchor="middle" dominantBaseline="central" fontSize="28" fontWeight="700" fill="var(--foreground)">{healthScore}</text>
              </svg>
              <div>
                <p className="font-semibold text-sm" style={{ color: '#34C759' }}>Good</p>
                <p className="text-xs" style={{ color: 'var(--foreground-secondary)' }}>On track</p>
              </div>
            </div>
          </div>
          <div className="stat-card">
            <div className="flex items-start justify-between mb-1">
              <span className="stat-label">Messages</span>
              <MessageSquare size={18} style={{ color: 'var(--stat-teal)' }} />
            </div>
            <p className="stat-value">3</p>
            <p className="text-xs" style={{ color: 'var(--foreground-secondary)' }}>2 unread</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="card">
              <div className="card-header flex items-center justify-between">
                <div><h3 className="section-title">Upcoming Appointments</h3><p className="text-xs" style={{ color: 'var(--foreground-secondary)' }}>Next 3 appointments</p></div>
              </div>
              <div className="card-body space-y-3">
                {appointments.map((a, i) => (
                  <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl transition-all" style={{ background: i === 0 ? 'var(--accent-light)' : 'transparent' }}>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                      {a.doctor.split(' ').slice(1).map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{a.doctor}</p>
                      <p className="text-xs" style={{ color: 'var(--foreground-secondary)' }}>{a.specialty}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{a.date} {a.time}</p>
                      <span className={`pill-badge ${a.type === 'Telehealth' ? 'pill-blue' : 'pill-teal'}`}>{a.type}</span>
                    </div>
                    <div className="flex gap-1">
                      <button className="btn-ghost text-xs px-2 py-1">Reschedule</button>
                      <button className="btn-ghost text-xs px-2 py-1" style={{ color: 'var(--error)' }}>Cancel</button>
                    </div>
                  </div>
                ))}
                <button className="btn-primary w-full mt-2">
                  <Plus size={16} /> Book New Appointment
                </button>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="section-title">My Health Records</h3>
                <p className="text-xs" style={{ color: 'var(--foreground-secondary)' }}>Lab Results, Imaging, Visit Notes, Vaccinations</p>
              </div>
              <div className="card-body space-y-2">
                {['Lab Results - Blood Work', 'Chest X-Ray - June 2026', 'Cardiology Visit Notes', 'Vaccination History'].map((item) => (
                  <div key={item} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-3">
                      <FileText size={16} style={{ color: 'var(--accent)' }} />
                      <span className="text-sm">{item}</span>
                    </div>
                    <button className="btn-ghost text-xs">
                      <Download size={14} /> View
                    </button>
                  </div>
                ))}
                <button className="btn-outline w-full mt-2">Request Records →</button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="card-header">
                <h3 className="section-title">My Prescriptions</h3>
              </div>
              <div className="card-body space-y-3">
                {prescriptions.map((p) => (
                  <div key={p.id} className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'var(--card-border)' }}>
                    <div>
                      <p className="font-medium text-sm">{p.medication}</p>
                      <p className="text-xs" style={{ color: 'var(--foreground-secondary)' }}>{p.dosage}</p>
                      <p className="text-xs" style={{ color: 'var(--foreground-tertiary)' }}>{p.prescribedBy}</p>
                    </div>
                    <div className="text-right">
                      <span className={`pill-badge ${p.status === 'Active' ? 'pill-green' : p.status === 'Refill Due' ? 'pill-amber' : 'pill-red'}`}>{p.status}</span>
                      {p.status === 'Refill Due' && <button className="btn-primary text-xs mt-1 w-full" onClick={() => setShowRefillModal(true)}>Refill</button>}
                    </div>
                  </div>
                ))}
                <button className="btn-ghost w-full text-sm">View All →</button>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="section-title">My Doctor</h3>
              </div>
              <div className="card-body text-center">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
                  SE
                </div>
                <p className="font-semibold">Dr. Sarah Evans</p>
                <p className="text-xs mb-3" style={{ color: 'var(--foreground-secondary)' }}>Cardiologist · Cape Town Medical</p>
                <div className="flex gap-2">
                  <button className="btn-primary flex-1 text-xs">Message</button>
                  <button className="btn-outline flex-1 text-xs">Book</button>
                  <button className="btn-ghost flex-1 text-xs">Profile</button>
                </div>
                <button className="btn-ghost text-xs mt-2 w-full">Change Doctor →</button>
              </div>
            </div>

            <div className="card">
              <div className="card-header flex items-center justify-between">
                <h3 className="section-title">Health Reminders</h3>
                <Bell size={16} style={{ color: 'var(--foreground-tertiary)' }} />
              </div>
              <div className="card-body space-y-2">
                {reminders.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: r.type === 'warning' ? 'rgba(255,159,10,0.08)' : 'rgba(0,122,255,0.06)' }}>
                    {r.type === 'warning' ? <AlertTriangle size={14} style={{ color: 'var(--warning)' }} /> : <Activity size={14} style={{ color: 'var(--info)' }} />}
                    <div className="flex-1">
                      <p className="text-xs font-medium">{r.text}</p>
                      <p className="text-[11px]" style={{ color: 'var(--foreground-tertiary)' }}>{r.date}</p>
                    </div>
                    <button className="btn-ghost p-1"><X size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showTelehealthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowTelehealthModal(false)}>
          <div className="card w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="card-header flex items-center justify-between">
              <h3 className="section-title">Telehealth Consultation</h3>
              <button onClick={() => setShowTelehealthModal(false)} className="btn-ghost p-1"><X size={18} /></button>
            </div>
            <div className="card-body space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl" style={{ background: 'var(--accent-light)' }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'var(--accent)', color: '#fff' }}>SE</div>
                <div>
                  <p className="font-semibold">Dr. Sarah Evans</p>
                  <p className="text-xs" style={{ color: 'var(--foreground-secondary)' }}>Cardiology · Jun 20, 09:00</p>
                </div>
                <span className="pill-badge pill-green ml-auto animate-pulse-ring-green">Live</span>
              </div>
              <div className="flex gap-2">
                <button className="btn-primary flex-1"><Video size={16} /> Join Call</button>
                <button className="btn-outline flex-1"><MessageSquare size={16} /> Chat</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRefillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowRefillModal(false)}>
          <div className="card w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="card-header flex items-center justify-between">
              <h3 className="section-title">Refill Prescription</h3>
              <button onClick={() => setShowRefillModal(false)} className="btn-ghost p-1"><X size={18} /></button>
            </div>
            <div className="card-body space-y-4">
              <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>Metformin 500mg will be refilled at your preferred pharmacy.</p>
              <div className="p-3 rounded-xl" style={{ background: 'var(--accent-light)' }}>
                <p className="font-medium text-sm">CureMed Pharmacy</p>
                <p className="text-xs" style={{ color: 'var(--foreground-secondary)' }}>123 Main Street · 2.4 km away</p>
                <p className="text-xs" style={{ color: '#34C759' }}>In Stock · R72.50</p>
              </div>
              <button className="btn-primary w-full">Confirm Refill</button>
              <button className="btn-ghost w-full text-sm">Choose different pharmacy</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
