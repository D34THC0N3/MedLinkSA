'use client';

import { useState } from 'react';
import { Lock, Shield, Eye, EyeOff, KeyRound, Check } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function SecuritySettingsPage() {
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [updated, setUpdated] = useState(false);

  const handleUpdate = () => {
    if (!currentPw || !newPw || newPw !== confirmPw) return;
    setUpdated(true);
    setTimeout(() => setUpdated(false), 2000);
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
  };

  return (
    <DashboardLayout title="Security Settings">
      <div className="max-w-2xl space-y-6">
        <div className="card">
          <div className="card-header">
            <h3 className="section-title">Change Password</h3>
          </div>
          <div className="card-body space-y-4">
            {[
              { label: 'Current Password', value: currentPw, setter: setCurrentPw },
              { label: 'New Password', value: newPw, setter: setNewPw },
              { label: 'Confirm New Password', value: confirmPw, setter: setConfirmPw },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>
                  <Lock size={12} className="inline mr-1" />{f.label}
                </label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={f.value}
                    onChange={e => f.setter(e.target.value)}
                    className="w-full px-3.5 py-2.5 pr-10 rounded-lg text-sm border outline-none transition-all"
                    style={{ background: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                  />
                  <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            ))}
            <button onClick={handleUpdate} className="btn-primary text-sm flex items-center gap-2">
              <KeyRound size={16} /> {updated ? 'Password Updated!' : 'Update Password'}
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="section-title">Two-Factor Authentication</h3>
          </div>
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield size={20} style={{ color: twoFactor ? 'var(--success)' : 'var(--text-muted)' }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Two-Factor Auth</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Add an extra layer of security</p>
                </div>
              </div>
              <button
                onClick={() => setTwoFactor(!twoFactor)}
                className="w-10 h-5 rounded-full transition-all relative"
                style={{ background: twoFactor ? 'var(--accent)' : 'var(--card-border)' }}
              >
                <div className="w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform" style={{ left: twoFactor ? '5px' : '2px', transform: twoFactor ? 'translateX(4px)' : 'translateX(0)' }} />
              </button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="section-title">Active Sessions</h3>
          </div>
          <div className="card-body">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Current Session</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Chrome on Windows · Cape Town, ZA</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.12)', color: '#22C55E' }}>Active</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
