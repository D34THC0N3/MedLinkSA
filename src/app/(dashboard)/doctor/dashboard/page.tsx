'use client';

import { useState } from 'react';
import {
  Calendar, Clock, User, Pill, FileText, MessageSquare, Video,
  ChevronRight, Sparkles, AlertTriangle, CheckCircle, X,
  Send, Stethoscope, Activity, HeartPulse, ArrowRight,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { getInitials } from '@/lib/utils';

interface Appointment {
  id: string;
  patientName: string;
  type: 'In-Person' | 'Telehealth';
  time: string;
  status: 'Arrived' | 'In Progress' | 'Scheduled';
}

interface ClinicalNote {
  id: string;
  patientName: string;
  date: string;
  status: 'completed' | 'pending';
}

interface HighRiskPatient {
  id: string;
  name: string;
  initials: string;
  reason: string;
  severity: 'red' | 'amber' | 'yellow';
}

interface PrescriptionSection {
  label: string;
  count: number;
  items: { id: string; patient: string; medication: string; time: string }[];
}

interface Message {
  id: string;
  sender: string;
  preview: string;
  time: string;
  unread: boolean;
}

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: 'a1', patientName: 'Sarah Collins', type: 'In-Person', time: '09:00 AM', status: 'Arrived' },
    { id: 'a2', patientName: 'James Miller', type: 'Telehealth', time: '10:30 AM', status: 'In Progress' },
    { id: 'a3', patientName: 'Emma Davis', type: 'In-Person', time: '11:45 AM', status: 'Scheduled' },
    { id: 'a4', patientName: 'Robert Wilson', type: 'Telehealth', time: '02:15 PM', status: 'Scheduled' },
    { id: 'a5', patientName: 'Lisa Johnson', type: 'In-Person', time: '03:30 PM', status: 'Scheduled' },
  ]);

  const [notes] = useState<ClinicalNote[]>([
    { id: 'n1', patientName: 'Sarah Collins', date: 'Oct 15, 2024', status: 'completed' },
    { id: 'n2', patientName: 'James Miller', date: 'Oct 15, 2024', status: 'pending' },
    { id: 'n3', patientName: 'Michael Brown', date: 'Oct 14, 2024', status: 'completed' },
    { id: 'n4', patientName: 'Emma Davis', date: 'Oct 13, 2024', status: 'completed' },
  ]);

  const [highRiskPatients] = useState<HighRiskPatient[]>([
    { id: 'h1', name: 'John Smith', initials: 'JS', reason: 'Immediate follow-up — hypertension crisis risk', severity: 'red' },
    { id: 'h2', name: 'Lisa Johnson', initials: 'LJ', reason: 'Missed 3 doses of Metformin this week', severity: 'amber' },
    { id: 'h3', name: 'Tom Wilson', initials: 'TW', reason: 'Borderline HbA1c — needs lifestyle consult', severity: 'yellow' },
    { id: 'h4', name: 'Mary Clark', initials: 'MC', reason: 'Missed 2 follow-up appointments', severity: 'amber' },
  ]);

  const [prescriptions] = useState<PrescriptionSection[]>([
    {
      label: 'Pending Renewals',
      count: 4,
      items: [
        { id: 'p1', patient: 'Sarah Collins', medication: 'Lisinopril 10mg', time: 'Requested 2h ago' },
        { id: 'p2', patient: 'Robert Wilson', medication: 'Atorvastatin 20mg', time: 'Requested 1d ago' },
      ],
    },
    {
      label: 'Clinic Notes',
      count: 3,
      items: [
        { id: 'c1', patient: 'James Miller', medication: 'Metformin dosage review', time: 'Pending review' },
        { id: 'c2', patient: 'Emma Davis', medication: 'Albuterol inhaler switch', time: 'Pending review' },
      ],
    },
  ]);

  const [messages] = useState<Message[]>([
    { id: 'm1', sender: 'Sarah Collins', preview: 'Can you review my lab results from Friday?', time: '2 min ago', unread: true },
    { id: 'm2', sender: 'James Miller', preview: 'Thank you for the telemedicine session yesterday!', time: '1 hr ago', unread: true },
    { id: 'm3', sender: 'Dr. Martinez', preview: 'Team meeting rescheduled to tomorrow at 2 PM', time: '2 hrs ago', unread: false },
    { id: 'm4', sender: 'Lisa Johnson', preview: 'I have a question about my new prescription', time: '4 hrs ago', unread: false },
  ]);

  const handleStartConsultation = (id: string) => {
    setAppointments(prev =>
      prev.map(a => a.id === id ? { ...a, status: 'In Progress' as const } : a)
    );
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const severityRowStyle = (severity: string): React.CSSProperties => {
    const map: Record<string, React.CSSProperties> = {
      red: { background: 'rgba(255,59,48,0.06)', borderLeft: '3px solid var(--error)' },
      amber: { background: 'rgba(255,159,10,0.06)', borderLeft: '3px solid var(--warning)' },
      yellow: { background: 'rgba(255,204,0,0.05)', borderLeft: '3px solid #FFCC00' },
    };
    return map[severity] || {};
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 className="page-title" style={{ color: 'var(--foreground)' }}>
            Welcome back, Dr. Evans!
          </h1>
          <p style={{ color: 'var(--foreground-secondary)', fontSize: '15px', marginTop: '4px' }}>
            {today}
          </p>
        </div>

        {/* Responsive 3-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_1.75fr_1.25fr] gap-4 lg:gap-5 items-start">

          {/* ——— LEFT COLUMN (40%) ——— */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Today's Schedule */}
            <div className="card">
              <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calendar size={18} style={{ color: 'var(--accent)' }} />
                  <h2 className="section-title" style={{ color: 'var(--foreground)' }}>Today&apos;s Schedule</h2>
                </div>
                <button className="btn-ghost" style={{ fontSize: '12px' }}>
                  View All <ChevronRight size={14} />
                </button>
              </div>
              <div className="card-body" style={{ padding: '0', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '13px',
                  minWidth: '500px',
                }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '10px 16px', color: 'var(--foreground-secondary)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid var(--card-border)' }}>Patient</th>
                      <th style={{ textAlign: 'left', padding: '10px 8px', color: 'var(--foreground-secondary)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid var(--card-border)' }}>Type</th>
                      <th style={{ textAlign: 'left', padding: '10px 8px', color: 'var(--foreground-secondary)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid var(--card-border)' }}>Time</th>
                      <th style={{ textAlign: 'left', padding: '10px 8px', color: 'var(--foreground-secondary)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid var(--card-border)' }}>Status</th>
                      <th style={{ textAlign: 'right', padding: '10px 16px', color: 'var(--foreground-secondary)', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid var(--card-border)' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((appt) => (
                      <tr
                        key={appt.id}
                        style={{ borderBottom: '1px solid var(--card-border)', transition: 'background 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-light)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="avatar-initials">{getInitials(appt.patientName)}</span>
                            <span style={{ fontWeight: 500, color: 'var(--foreground)' }}>{appt.patientName}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <span className={`pill-badge ${appt.type === 'Telehealth' ? 'pill-blue' : 'pill-gray'}`}>
                            {appt.type === 'Telehealth' ? <Video size={12} style={{ marginRight: 4 }} /> : <User size={12} style={{ marginRight: 4 }} />}
                            {appt.type}
                          </span>
                        </td>
                        <td style={{ padding: '12px 8px', color: 'var(--foreground)', fontWeight: 500 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Clock size={13} style={{ color: 'var(--foreground-secondary)' }} />
                            {appt.time}
                          </div>
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          {appt.status === 'Arrived' && (
                            <span className="pill-badge pill-green" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                              <span className="pulse-dot-green" style={{ width: 6, height: 6, borderRadius: '50%', display: 'inline-block' }} />
                              Arrived
                            </span>
                          )}
                          {appt.status === 'In Progress' && (
                            <span className="pill-badge pill-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                              <span className="animate-pulse-ring-amber" style={{ width: 8, height: 8, borderRadius: '50%', display: 'inline-block', background: 'var(--warning)' }} />
                              In Progress
                            </span>
                          )}
                          {appt.status === 'Scheduled' && (
                            <span className="pill-badge pill-gray">Scheduled</span>
                          )}
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          {appt.status === 'Arrived' || appt.status === 'Scheduled' ? (
                            <button
                              className="btn-primary"
                              style={{ padding: '6px 14px', fontSize: '12px' }}
                              onClick={() => handleStartConsultation(appt.id)}
                            >
                              <Stethoscope size={13} />
                              Start Consultation
                            </button>
                          ) : (
                            <button className="btn-outline" style={{ padding: '6px 14px', fontSize: '12px' }}>
                              <Activity size={13} />
                              Join
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card-footer" style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 16px' }}>
                <button className="btn-ghost" style={{ fontSize: '12px', gap: '4px' }}>
                  Go to full schedule <ChevronRight size={13} />
                </button>
              </div>
            </div>

            {/* Recent Clinical Notes */}
            <div className="card">
              <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FileText size={18} style={{ color: 'var(--accent)' }} />
                  <h2 className="section-title" style={{ color: 'var(--foreground)' }}>Recent Clinical Notes</h2>
                </div>
                <button className="btn-ghost" style={{ fontSize: '12px' }}>
                  View All <ChevronRight size={14} />
                </button>
              </div>
              <div className="card-body" style={{ padding: '0' }}>
                {notes.map((note, idx) => (
                  <div
                    key={note.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 20px',
                      borderBottom: idx < notes.length - 1 ? '1px solid var(--card-border)' : 'none',
                      transition: 'background 0.15s',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-light)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: 36,
                        height: 36,
                        borderRadius: '10px',
                        background: 'var(--accent-light)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <FileText size={16} style={{ color: 'var(--accent)' }} />
                      </div>
                      <div>
                        <p style={{ fontWeight: 500, fontSize: '13px', color: 'var(--foreground)' }}>{note.patientName}</p>
                        <p style={{ fontSize: '12px', color: 'var(--foreground-secondary)', marginTop: '2px' }}>{note.date}</p>
                      </div>
                    </div>
                    <span className={`pill-badge ${note.status === 'completed' ? 'pill-green' : 'pill-amber'}`}>
                      {note.status === 'completed' ? <CheckCircle size={11} style={{ marginRight: 4 }} /> : <Clock size={11} style={{ marginRight: 4 }} />}
                      {note.status === 'completed' ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ——— MIDDLE COLUMN (35%) ——— */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* High-Risk Patients */}
            <div className="card">
              <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <HeartPulse size={18} style={{ color: 'var(--error)' }} />
                  <h2 className="section-title" style={{ color: 'var(--foreground)' }}>High-Risk Patients</h2>
                  <span className="pill-badge pill-red" style={{ fontSize: '10px' }}>{highRiskPatients.length}</span>
                </div>
                <button className="btn-ghost" style={{ fontSize: '12px' }}>
                  View All <ChevronRight size={14} />
                </button>
              </div>
              <div className="card-body" style={{ padding: '12px 16px' }}>
                {highRiskPatients.map((patient) => (
                  <div
                    key={patient.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      marginBottom: '8px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      ...severityRowStyle(patient.severity),
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateX(4px)';
                      e.currentTarget.style.boxShadow = 'var(--card-shadow-hover)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'translateX(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="avatar-initials" style={{
                        width: 34,
                        height: 34,
                        fontSize: '11px',
                        background: patient.severity === 'red'
                          ? 'rgba(255,59,48,0.15)'
                          : patient.severity === 'amber'
                            ? 'rgba(255,159,10,0.15)'
                            : 'rgba(255,204,0,0.15)',
                        color: patient.severity === 'red'
                          ? 'var(--error)'
                          : patient.severity === 'amber'
                            ? 'var(--warning)'
                            : '#CC9900',
                      }}>
                        {patient.initials}
                      </span>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: '13px', color: 'var(--foreground)' }}>{patient.name}</p>
                        <p style={{ fontSize: '12px', color: 'var(--foreground-secondary)', marginTop: '1px', lineHeight: 1.3 }}>
                          {patient.reason}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} style={{ color: 'var(--foreground-tertiary)', flexShrink: 0, marginLeft: 8 }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Prescription Requests */}
            <div className="card">
              <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Pill size={18} style={{ color: 'var(--accent)' }} />
                  <h2 className="section-title" style={{ color: 'var(--foreground)' }}>Prescription Requests</h2>
                </div>
                <button className="btn-ghost" style={{ fontSize: '12px' }}>
                  View All <ChevronRight size={14} />
                </button>
              </div>
              <div className="card-body" style={{ padding: '12px 16px' }}>
                {prescriptions.map((section) => (
                  <div key={section.label} style={{ marginBottom: '16px' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                    }}>
                      <p style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: 'var(--foreground-secondary)',
                      }}>
                        {section.label}
                      </p>
                      <span className="pill-badge pill-blue" style={{ fontSize: '10px' }}>
                        {section.count}
                      </span>
                    </div>
                    {section.items.map((item, idx) => (
                      <div
                        key={item.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          marginBottom: idx < section.items.length - 1 ? '6px' : '0',
                          borderRadius: '10px',
                          background: 'var(--accent-light)',
                          border: '1px solid var(--accent-border)',
                          cursor: 'pointer',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--accent-border)'; e.currentTarget.style.transform = 'translateY(0)' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: 32,
                            height: 32,
                            borderRadius: '8px',
                            background: 'var(--card-bg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid var(--card-border)',
                          }}>
                            {section.label === 'Pending Renewals' ? (
                              <Pill size={14} style={{ color: 'var(--accent)' }} />
                            ) : (
                              <FileText size={14} style={{ color: 'var(--accent)' }} />
                            )}
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, fontSize: '13px', color: 'var(--foreground)' }}>{item.medication}</p>
                            <p style={{ fontSize: '12px', color: 'var(--foreground-secondary)', marginTop: '1px' }}>
                              {item.patient} &middot; {item.time}
                            </p>
                          </div>
                        </div>
                        <button className="btn-ghost" style={{ padding: '4px 8px', fontSize: '11px', flexShrink: 0 }}>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ——— RIGHT COLUMN (25%) ——— */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Follow-up Management */}
            <div className="card" style={{ overflow: 'hidden' }}>
              <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calendar size={18} style={{ color: 'var(--accent)' }} />
                  <h2 className="section-title" style={{ color: 'var(--foreground)' }}>Follow-up Mgmt</h2>
                </div>
                <span className="pill-badge pill-blue" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '10px' }}>
                  <Sparkles size={11} /> AI
                </span>
              </div>
              <div className="card-body">
                <div style={{
                  background: 'linear-gradient(135deg, var(--accent-light) 0%, rgba(88,86,214,0.08) 100%)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid var(--accent-border)',
                  marginBottom: '12px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '14px' }}>
                    <Sparkles size={18} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 2 }} />
                    <p style={{ fontSize: '13px', color: 'var(--foreground)', lineHeight: 1.5, fontWeight: 500 }}>
                      AI suggests optimal follow-up schedule for chronic patients based on adherence patterns.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{
                      flex: 1,
                      textAlign: 'center',
                      padding: '10px 8px',
                      borderRadius: '10px',
                      background: 'var(--card-bg)',
                      border: '1px solid var(--card-border)',
                    }}>
                      <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--foreground-secondary)', marginBottom: 4 }}>Morning</p>
                      <p style={{ fontSize: '22px', fontWeight: 700, color: 'var(--accent)', lineHeight: 1.1 }}>74%</p>
                      <p style={{ fontSize: '10px', color: 'var(--foreground-secondary)', marginTop: 2 }}>timing preference</p>
                    </div>
                    <div style={{
                      flex: 1,
                      textAlign: 'center',
                      padding: '10px 8px',
                      borderRadius: '10px',
                      background: 'var(--card-bg)',
                      border: '1px solid var(--card-border)',
                    }}>
                      <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--foreground-secondary)', marginBottom: 4 }}>Timeline</p>
                      <p style={{ fontSize: '22px', fontWeight: 700, color: 'var(--accent)', lineHeight: 1.1 }}>16 mo</p>
                      <p style={{ fontSize: '10px', color: 'var(--foreground-secondary)', marginTop: 2 }}>optimal range</p>
                    </div>
                  </div>
                </div>
                <button className="btn-outline" style={{ width: '100%', justifyContent: 'space-between', fontSize: '12px', padding: '8px 14px' }}>
                  <span>View AI Insights</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* New Messages */}
            <div className="card">
              <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MessageSquare size={18} style={{ color: 'var(--accent)' }} />
                  <h2 className="section-title" style={{ color: 'var(--foreground)' }}>New Messages</h2>
                  <span className="pill-badge pill-blue" style={{ fontSize: '10px' }}>
                    {messages.filter(m => m.unread).length}
                  </span>
                </div>
                <button className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '12px' }}>
                  <Send size={13} /> New
                </button>
              </div>
              <div className="card-body" style={{ padding: '8px 12px' }}>
                {messages.map((msg, idx) => (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '10px',
                      padding: '10px 8px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      background: msg.unread ? 'var(--accent-light)' : 'transparent',
                      marginBottom: idx < messages.length - 1 ? '4px' : '0',
                      border: msg.unread ? '1px solid var(--accent-border)' : '1px solid transparent',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'var(--accent-light)';
                      e.currentTarget.style.borderColor = 'var(--accent-border)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = msg.unread ? 'var(--accent-light)' : 'transparent';
                      e.currentTarget.style.borderColor = msg.unread ? 'var(--accent-border)' : 'transparent';
                    }}
                  >
                    <span className="avatar-initials" style={{ width: 34, height: 34, fontSize: '11px', flexShrink: 0 }}>
                      {getInitials(msg.sender)}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                        <p style={{
                          fontWeight: msg.unread ? 700 : 500,
                          fontSize: '13px',
                          color: 'var(--foreground)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {msg.sender}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                          <span style={{ fontSize: '11px', color: 'var(--foreground-secondary)', whiteSpace: 'nowrap' }}>{msg.time}</span>
                          {msg.unread && (
                            <span style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              background: 'var(--accent)',
                              display: 'inline-block',
                              flexShrink: 0,
                            }} />
                          )}
                        </div>
                      </div>
                      <p style={{
                        fontSize: '12px',
                        color: 'var(--foreground-secondary)',
                        marginTop: '2px',
                        lineHeight: 1.3,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {msg.preview}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="card-footer" style={{ padding: '10px 16px', display: 'flex', justifyContent: 'center' }}>
                <button className="btn-ghost" style={{ fontSize: '12px', gap: 4 }}>
                  View all messages <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
