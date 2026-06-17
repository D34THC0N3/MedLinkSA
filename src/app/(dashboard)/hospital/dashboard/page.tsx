'use client';

import { useState } from 'react';
import {
  Users, BedDouble, Activity, Clock, ChevronRight, AlertTriangle,
  BarChart3, MapPin, UserCheck, Stethoscope, Pill, ClipboardList,
  TrendingUp, ArrowRight, Circle,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

const statCards = [
  {
    label: 'Total Patients Admitted',
    value: '2,575',
    icon: Users,
    color: 'var(--accent)',
  },
  {
    label: 'Waiting Room Occupancy',
    value: '60%',
    icon: Clock,
    color: 'var(--warning)',
    progress: 60,
    sub: 'Avg wait time 17 min',
  },
  {
    label: 'General Bed Availability',
    value: '480 / 600',
    icon: BedDouble,
    color: 'var(--accent)',
    progress: 80,
    sub: 'Occupied / Available',
  },
  {
    label: 'ICU Bed Availability',
    value: '10 Available',
    icon: Activity,
    color: 'var(--success)',
    sub: 'Above threshold',
  },
];

const departments = [
  { name: 'Emergency', waiting: 12, avgWait: 15, color: 'var(--error)' },
  { name: 'Outpatient', waiting: 8, avgWait: 20, color: 'var(--warning)' },
  { name: 'Radiology', waiting: 5, avgWait: 45, color: 'var(--error)' },
  { name: 'Pediatrics', waiting: 15, avgWait: 25, color: 'var(--warning)' },
  { name: 'Cardiology', waiting: 10, avgWait: 30, color: 'var(--success)' },
];

const waitColor = (min: number) =>
  min <= 15 ? 'var(--success)' : min <= 30 ? 'var(--warning)' : 'var(--error)';

const shifts = [
  { name: 'Day Shift', count: 48, attendance: '96%', type: 'Day' },
  { name: 'Night Shift', count: 32, attendance: '88%', type: 'Night' },
  { name: 'On-Call', count: 12, attendance: '100%', type: 'On-Call' },
];

const shiftColor: Record<string, string> = {
  Day: 'var(--accent)',
  Night: '#6366f1',
  'On-Call': 'var(--warning)',
};

const wards = [
  { id: 'Ward A', label: 'Ward A — General Medicine' },
  { id: 'Ward B', label: 'Ward B — Surgery' },
  { id: 'Ward C', label: 'Ward C — Maternity' },
  { id: 'ICU-1', label: 'ICU — Critical Care 1' },
  { id: 'ICU-2', label: 'ICU — Critical Care 2' },
  { id: 'Pediatrics', label: 'Pediatrics' },
];

const sections = ['S1', 'S2', 'S3', 'S4'];

const bedData: Record<string, number[]> = {
  'Ward A': [45, 62, 78, 55],
  'Ward B': [72, 88, 91, 65],
  'Ward C': [30, 45, 50, 40],
  'ICU-1': [85, 92, 78, 95],
  'ICU-2': [60, 75, 82, 70],
  'Pediatrics': [25, 35, 40, 30],
};

const heatColor = (pct: number) => {
  if (pct >= 85) return 'var(--error)';
  if (pct >= 70) return 'var(--warning)';
  if (pct >= 50) return '#eab308';
  return 'var(--success)';
};

const flowSteps = [
  { label: 'Patient Entry', icon: UserCheck, x: 4, y: 24 },
  { label: 'Triage', icon: ClipboardList, x: 28, y: 24 },
  { label: 'Emergency', icon: Activity, x: 52, y: 10, warn: true },
  { label: 'General Ward', icon: BedDouble, x: 52, y: 38 },
  { label: 'ICU', icon: Activity, x: 76, y: 10, danger: true },
  { label: 'Discharge', icon: TrendingUp, x: 76, y: 38 },
];

const quickLinks = [
  { icon: Stethoscope, label: 'Schedule Appointments' },
  { icon: BarChart3, label: 'View Reports' },
  { icon: UserCheck, label: 'Admit Patient' },
  { icon: Pill, label: 'Pharmacy Orders' },
];

export default function HospitalDashboardPage() {
  const [hoveredBed, setHoveredBed] = useState<string | null>(null);

  return (
    <DashboardLayout>
      <div className="space-y-5">

        {/* Stat Row */}
        <div className="grid grid-cols-4 gap-4">
          {statCards.map((s, i) => (
            <div key={i} className="stat-card" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 12, padding: 20 }}>
              <div className="flex items-center justify-between mb-3">
                <span className="stat-label" style={{ color: 'var(--foreground-secondary)', fontSize: 13, fontWeight: 500 }}>{s.label}</span>
                <s.icon size={20} style={{ color: s.color, opacity: 0.7 }} />
              </div>
              <div className="stat-value" style={{ fontSize: 28, fontWeight: 600, color: 'var(--foreground)', marginBottom: 4 }}>{s.value}</div>
              {s.progress !== undefined && (
                <div className="progress-bar" style={{ height: 4, background: 'var(--card-border)', borderRadius: 2, marginBottom: 6, overflow: 'hidden' }}>
                  <div className="progress-fill animate-progress" style={{ width: `${s.progress}%`, height: '100%', background: s.color, borderRadius: 2 }} />
                </div>
              )}
              {s.sub && (
                <div style={{ fontSize: 12, color: 'var(--foreground-secondary)' }}>{s.sub}</div>
              )}
            </div>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-5 gap-5">

          {/* Left Column — 3 cols */}
          <div className="col-span-3 space-y-5">

            {/* Queue Management */}
            <div className="card" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, overflow: 'hidden' }}>
              <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--card-border)' }}>
                <div>
                  <h2 className="section-title" style={{ fontSize: 16, fontWeight: 600, color: 'var(--foreground)' }}>Queue Management</h2>
                  <p style={{ fontSize: 13, color: 'var(--foreground-secondary)', marginTop: 2 }}>Real-time department waitlist</p>
                </div>
                <button className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  View All <ChevronRight size={14} />
                </button>
              </div>
              <div className="card-body" style={{ padding: '6px 0' }}>
                <table className="table-apple" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--card-border)', fontSize: 12, color: 'var(--foreground-secondary)', textAlign: 'left' }}>
                      <th style={{ padding: '12px 22px', fontWeight: 500 }}>Department</th>
                      <th style={{ padding: '12px 22px', fontWeight: 500 }}>Patients Waiting</th>
                      <th style={{ padding: '12px 22px', fontWeight: 500 }}>Avg Wait Time</th>
                      <th style={{ padding: '12px 22px', fontWeight: 500 }}>Queue Position</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.map((d, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--card-border)', transition: 'background 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent-light)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td style={{ padding: '14px 22px', fontSize: 14, fontWeight: 500, color: 'var(--foreground)' }}>{d.name}</td>
                        <td style={{ padding: '14px 22px' }}>
                          <span className="pill-badge" style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                            background: 'var(--accent-light)', color: 'var(--accent)',
                          }}>
                            <Circle size={10} />{d.waiting}
                          </span>
                        </td>
                        <td style={{ padding: '14px 22px' }}>
                          <span style={{ color: waitColor(d.avgWait), fontWeight: 600, fontSize: 14 }}>{d.avgWait} min</span>
                        </td>
                        <td style={{ padding: '14px 22px' }}>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <span className="pill-green" style={{
                              padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 500,
                              background: 'rgba(52,199,89,0.12)', color: 'var(--success)',
                            }}>Arrived</span>
                            <span className="pill-amber" style={{
                              padding: '2px 8px', borderRadius: 12, fontSize: 11, fontWeight: 500,
                              background: 'rgba(255,149,0,0.12)', color: 'var(--warning)',
                            }}>Waiting</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Staffing Overview */}
            <div className="card" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, overflow: 'hidden' }}>
              <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--card-border)' }}>
                <div>
                  <h2 className="section-title" style={{ fontSize: 16, fontWeight: 600, color: 'var(--foreground)' }}>Staffing Overview</h2>
                  <p style={{ fontSize: 13, color: 'var(--foreground-secondary)', marginTop: 2 }}>Current shift distribution</p>
                </div>
                <button className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  View Schedule <ChevronRight size={14} />
                </button>
              </div>
              <div className="card-body" style={{ padding: '6px 0' }}>
                <table className="table-apple" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--card-border)', fontSize: 12, color: 'var(--foreground-secondary)', textAlign: 'left' }}>
                      <th style={{ padding: '12px 22px', fontWeight: 500 }}>Shift Name</th>
                      <th style={{ padding: '12px 22px', fontWeight: 500 }}>Staff Count</th>
                      <th style={{ padding: '12px 22px', fontWeight: 500 }}>Attendance</th>
                      <th style={{ padding: '12px 22px', fontWeight: 500 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {shifts.map((s, i) => (
                      <tr key={i} style={{
                        borderBottom: '1px solid var(--card-border)',
                        background: s.type === 'Night' ? 'rgba(99,102,241,0.04)' : s.type === 'On-Call' ? 'rgba(255,149,0,0.04)' : 'transparent',
                      }}>
                        <td style={{ padding: '14px 22px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: shiftColor[s.type], display: 'inline-block' }} />
                            <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--foreground)' }}>{s.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 22px', fontSize: 14, color: 'var(--foreground)' }}>{s.count}</td>
                        <td style={{ padding: '14px 22px' }}>
                          <span style={{ fontWeight: 600, fontSize: 14, color: s.attendance === '100%' ? 'var(--success)' : 'var(--warning)' }}>{s.attendance}</span>
                        </td>
                        <td style={{ padding: '14px 22px', textAlign: 'right' }}>
                          <span style={{ fontSize: 12, color: 'var(--foreground-secondary)' }}>{s.type === 'Day' ? '07:00–19:00' : s.type === 'Night' ? '19:00–07:00' : 'As needed'}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="card-footer" style={{ padding: '14px 22px', borderTop: '1px solid var(--card-border)', display: 'flex', gap: 8 }}>
                {quickLinks.map((q, i) => (
                  <button key={i} className="btn-outline" style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    padding: '8px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500,
                    background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--foreground)',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--accent-light)'; e.currentTarget.style.borderColor = 'var(--accent)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--card-border)'; }}
                  >
                    <q.icon size={14} style={{ color: 'var(--accent)' }} /> {q.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column — 2 cols */}
          <div className="col-span-2 space-y-5">

            {/* Bed Management Heatmap */}
            <div className="card" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, overflow: 'hidden' }}>
              <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--card-border)' }}>
                <div>
                  <h2 className="section-title" style={{ fontSize: 16, fontWeight: 600, color: 'var(--foreground)' }}>Bed Management Heatmap</h2>
                  <p style={{ fontSize: 13, color: 'var(--foreground-secondary)', marginTop: 2 }}>Occupancy by ward and section</p>
                </div>
                <button className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <MapPin size={14} /> View Map
                </button>
              </div>
              <div className="card-body" style={{ padding: '18px 22px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: `120px repeat(${sections.length}, 1fr)`, gap: 6, marginBottom: 16 }}>
                  <div />
                  {sections.map(s => (
                    <div key={s} style={{ textAlign: 'center', fontSize: 11, fontWeight: 500, color: 'var(--foreground-secondary)', padding: '4px 0' }}>{s}</div>
                  ))}
                  {wards.map((ward) => (
                    <div key={ward.id} style={{ display: 'contents' }}>
                      <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--foreground)', display: 'flex', alignItems: 'center', padding: '4px 0' }}>{ward.id}</div>
                      {bedData[ward.id].map((pct, j) => {
                        const key = `${ward.id}-${j}`;
                        return (
                          <div
                            key={key}
                            style={{
                              position: 'relative',
                              padding: '10px 4px',
                              borderRadius: 8,
                              textAlign: 'center',
                              fontSize: 13,
                              fontWeight: 600,
                              color: '#fff',
                              background: heatColor(pct),
                              cursor: 'pointer',
                              transition: 'transform 0.15s, opacity 0.15s',
                              transform: hoveredBed === key ? 'scale(1.08)' : 'scale(1)',
                              opacity: hoveredBed && hoveredBed !== key ? 0.5 : 1,
                            }}
                            onMouseEnter={() => setHoveredBed(key)}
                            onMouseLeave={() => setHoveredBed(null)}
                            title={`${ward.label} — Section ${sections[j]}: ${pct}% occupied`}
                          >
                            {pct}%
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
                {/* Legend Gradient Bar */}
                <div style={{ paddingTop: 12, borderTop: '1px solid var(--card-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: 'var(--foreground-secondary)' }}>
                    <span>Low</span>
                    <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'linear-gradient(to right, var(--success), #eab308, var(--warning), var(--error))' }} />
                    <span>High</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2, fontSize: 10, color: 'var(--foreground-secondary)' }}>
                    <span>0%</span>
                    <span>50%</span>
                    <span>85%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Flow */}
            <div className="card" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: 14, overflow: 'hidden' }}>
              <div className="card-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--card-border)' }}>
                <div>
                  <h2 className="section-title" style={{ fontSize: 16, fontWeight: 600, color: 'var(--foreground)' }}>Patient Flow</h2>
                  <p style={{ fontSize: 13, color: 'var(--foreground-secondary)', marginTop: 2 }}>Admission-to-discharge pipeline</p>
                </div>
                <button className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <BarChart3 size={14} /> Details
                </button>
              </div>
              <div className="card-body" style={{ padding: '18px 22px', position: 'relative', height: 180 }}>
                {/* Flow nodes */}
                {flowSteps.map((step, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'absolute',
                      left: `${step.x}%`,
                      top: `${step.y}px`,
                      transform: 'translateX(-50%)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 12,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: step.danger ? 'rgba(255,59,48,0.12)' : step.warn ? 'rgba(255,149,0,0.12)' : 'rgba(0,122,255,0.08)',
                      border: `1.5px solid ${step.danger ? 'var(--error)' : step.warn ? 'var(--warning)' : 'var(--card-border)'}`,
                    }}>
                      <step.icon size={18} style={{ color: step.danger ? 'var(--error)' : step.warn ? 'var(--warning)' : 'var(--accent)' }} />
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--foreground-secondary)', whiteSpace: 'nowrap' }}>{step.label}</span>
                    {(step.danger || step.warn) && (
                      <span style={{
                        fontSize: 9, fontWeight: 600, padding: '1px 6px', borderRadius: 8,
                        background: step.danger ? 'rgba(255,59,48,0.12)' : 'rgba(255,149,0,0.12)',
                        color: step.danger ? 'var(--error)' : 'var(--warning)',
                      }}>
                        {step.danger ? 'Bottleneck' : 'Congested'}
                      </span>
                    )}
                  </div>
                ))}
                {/* Connecting arrows */}
                <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 180, pointerEvents: 'none', zIndex: 0 }} preserveAspectRatio="none">
                  <defs>
                    <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                      <polygon points="0 0, 8 3, 0 6" fill="var(--card-border)" />
                    </marker>
                  </defs>
                  <line x1="10%" y1="44" x2="24%" y2="44" stroke="var(--card-border)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                  <line x1="32%" y1="44" x2="46%" y2="30" stroke="var(--card-border)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                  <line x1="32%" y1="44" x2="46%" y2="58" stroke="var(--card-border)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                  <line x1="56%" y1="30" x2="70%" y2="30" stroke="var(--error)" strokeWidth="2" strokeDasharray="4,3" markerEnd="url(#arrowhead)" />
                  <line x1="56%" y1="30" x2="70%" y2="58" stroke="var(--card-border)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                  <line x1="56%" y1="58" x2="70%" y2="58" stroke="var(--card-border)" strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                </svg>
                {/* Legend */}
                <div style={{ position: 'absolute', bottom: 14, right: 22, display: 'flex', gap: 12, fontSize: 10, color: 'var(--foreground-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 12, height: 3, borderRadius: 1, background: 'var(--error)' }} />
                    Bottleneck
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <div style={{ width: 12, height: 3, borderRadius: 1, background: 'var(--warning)' }} />
                    High Flow
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Banner */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 20px', borderRadius: 12,
          background: 'rgba(255,149,0,0.08)', border: '1px solid rgba(255,149,0,0.2)',
        }}>
          <AlertTriangle size={16} style={{ color: 'var(--warning)', flexShrink: 0 }} />
          <span style={{ fontSize: 13, color: 'var(--foreground)' }}>
            <strong style={{ color: 'var(--warning)' }}>Advisory:</strong> ICU occupancy is at 85% across all sections. Consider activating surge protocol.
          </span>
          <button className="btn-primary" style={{
            marginLeft: 'auto', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
            background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
          }}>Review</button>
        </div>

      </div>
    </DashboardLayout>
  );
}
