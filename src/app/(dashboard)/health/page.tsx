'use client';

import { useState } from 'react';
import { Heart, Activity, TrendingUp, TrendingDown, Scale, Droplet, Plus, X } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface Vitals {
  label: string; value: string; unit: string; trend: 'up' | 'down' | 'stable'; status: 'normal' | 'warning' | 'critical'; icon: React.ReactNode;
}

const vitals: Vitals[] = [
  { label: 'Heart Rate', value: '72', unit: 'bpm', trend: 'stable', status: 'normal', icon: <Heart size={20} /> },
  { label: 'Blood Pressure', value: '118/78', unit: 'mmHg', trend: 'down', status: 'normal', icon: <Activity size={20} /> },
  { label: 'Blood Sugar', value: '5.4', unit: 'mmol/L', trend: 'up', status: 'warning', icon: <Droplet size={20} /> },
  { label: 'Weight', value: '72.5', unit: 'kg', trend: 'down', status: 'normal', icon: <Scale size={20} /> },
];

interface Reading {
  date: string; heartRate: number; systolic: number; diastolic: number; bloodSugar: number;
}

const readings: Reading[] = [
  { date: 'Jun 10', heartRate: 74, systolic: 120, diastolic: 80, bloodSugar: 5.2 },
  { date: 'Jun 11', heartRate: 71, systolic: 118, diastolic: 78, bloodSugar: 5.3 },
  { date: 'Jun 12', heartRate: 73, systolic: 119, diastolic: 79, bloodSugar: 5.1 },
  { date: 'Jun 13', heartRate: 70, systolic: 117, diastolic: 77, bloodSugar: 5.4 },
  { date: 'Jun 14', heartRate: 72, systolic: 118, diastolic: 78, bloodSugar: 5.3 },
  { date: 'Jun 15', heartRate: 75, systolic: 121, diastolic: 81, bloodSugar: 5.5 },
  { date: 'Jun 16', heartRate: 72, systolic: 118, diastolic: 78, bloodSugar: 5.4 },
];

export default function HealthTrackingPage() {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <DashboardLayout title="Health Tracking">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>Last 7 days · All metrics within normal range</p>
          <button className="btn-primary text-sm" onClick={() => setShowAdd(true)}><Plus size={16} /> Log Reading</button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {vitals.map(v => (
            <div key={v.label} className="stat-card">
              <div className="flex items-start justify-between mb-3">
                <span className="stat-label">{v.label}</span>
                <span style={{ color: v.status === 'normal' ? 'var(--stat-green)' : v.status === 'warning' ? 'var(--warning)' : 'var(--error)' }}>
                  {v.icon}
                </span>
              </div>
              <div className="flex items-end gap-1.5">
                <p className="stat-value">{v.value}</p>
                <p className="text-xs mb-1" style={{ color: 'var(--foreground-tertiary)' }}>{v.unit}</p>
              </div>
              <div className="flex items-center gap-1 mt-1">
                {v.trend === 'up' && <TrendingUp size={12} style={{ color: v.status === 'warning' ? 'var(--warning)' : 'var(--stat-green)' }} />}
                {v.trend === 'down' && <TrendingDown size={12} style={{ color: 'var(--stat-green)' }} />}
                {v.trend === 'stable' && <Activity size={12} style={{ color: 'var(--stat-blue)' }} />}
                <span className="text-[11px]" style={{ color: v.status === 'normal' ? 'var(--stat-green)' : 'var(--warning)' }}>
                  {v.status === 'normal' ? 'Normal' : v.status === 'warning' ? 'Elevated' : 'Critical'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="section-title">Heart Rate Trend</h3>
          </div>
          <div className="card-body">
            <div className="flex items-end gap-2 h-32" style={{ borderBottom: '1px solid var(--card-border)' }}>
              {readings.map(r => {
                const h = ((r.heartRate - 60) / 40) * 100;
                return (
                  <div key={r.date} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full rounded-t-md transition-all" style={{ height: `${h}%`, background: 'var(--accent)', opacity: 0.7, minHeight: 4 }} />
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{r.date}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="card">
            <div className="card-header">
              <h3 className="section-title">Blood Pressure</h3>
            </div>
            <div className="card-body space-y-2">
              {readings.slice(-5).map(r => (
                <div key={r.date} className="flex items-center justify-between text-sm py-1">
                  <span style={{ color: 'var(--foreground-secondary)' }}>{r.date}</span>
                  <span className="font-medium">{r.systolic}/{r.diastolic}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-header">
              <h3 className="section-title">Blood Sugar</h3>
            </div>
            <div className="card-body space-y-2">
              {readings.slice(-5).map(r => (
                <div key={r.date} className="flex items-center justify-between text-sm py-1">
                  <span style={{ color: 'var(--foreground-secondary)' }}>{r.date}</span>
                  <span className="font-medium">{r.bloodSugar} <span className="text-xs" style={{ color: 'var(--foreground-tertiary)' }}>mmol/L</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowAdd(false)}>
          <div className="card w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <div className="card-header flex items-center justify-between">
              <h3 className="section-title">Log Health Reading</h3>
              <button onClick={() => setShowAdd(false)} className="btn-ghost p-1"><X size={18} /></button>
            </div>
            <div className="card-body space-y-3">
              {['Heart Rate (bpm)', 'Systolic BP', 'Diastolic BP', 'Blood Sugar (mmol/L)', 'Weight (kg)'].map(field => (
                <div key={field}>
                  <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>{field}</label>
                  <input type="number" className="w-full px-3 py-2 rounded-lg text-sm border outline-none" style={{ background: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }} />
                </div>
              ))}
              <button className="btn-primary w-full text-sm">Save Reading</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
