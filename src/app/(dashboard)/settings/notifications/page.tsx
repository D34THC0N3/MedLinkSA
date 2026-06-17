'use client';

import { useState } from 'react';
import { Bell, Mail, MessageSquare, Calendar, Pill, Check } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface ToggleSetting {
  label: string; desc: string; icon: React.ReactNode; enabled: boolean;
}

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState<ToggleSetting[]>([
    { label: 'Appointment Reminders', desc: 'Get notified about upcoming appointments', icon: <Calendar size={16} />, enabled: true },
    { label: 'Prescription Refills', desc: 'Alerts when prescriptions need renewal', icon: <Pill size={16} />, enabled: true },
    { label: 'Messages', desc: 'New message notifications', icon: <MessageSquare size={16} />, enabled: true },
    { label: 'Email Updates', desc: 'Weekly health tips and platform updates', icon: <Mail size={16} />, enabled: false },
    { label: 'Lab Results', desc: 'When new lab results are available', icon: <Bell size={16} />, enabled: true },
  ]);

  const toggle = (i: number) => {
    setSettings(settings.map((s, idx) => idx === i ? { ...s, enabled: !s.enabled } : s));
  };

  return (
    <DashboardLayout title="Notification Settings">
      <div className="max-w-2xl space-y-6">
        <div className="card">
          <div className="card-header">
            <h3 className="section-title">Manage Notifications</h3>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Control what alerts you receive</p>
          </div>
          <div className="card-body space-y-3">
            {settings.map((s, i) => (
              <div key={s.label} className="flex items-center justify-between py-3 px-3 rounded-xl transition-colors hover:bg-white/5">
                <div className="flex items-center gap-3">
                  <span style={{ color: s.enabled ? 'var(--accent)' : 'var(--text-muted)' }}>{s.icon}</span>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{s.label}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggle(i)}
                  className="w-10 h-5 rounded-full transition-all relative"
                  style={{ background: s.enabled ? 'var(--accent)' : 'var(--card-border)' }}
                >
                  <div className="w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform" style={{ left: s.enabled ? '5px' : '2px', transform: s.enabled ? 'translateX(4px)' : 'translateX(0)' }} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
