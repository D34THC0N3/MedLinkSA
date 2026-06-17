'use client';

import { useState } from 'react';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/lib/auth-context';

export default function SettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('+27 82 123 4567');
  const [location, setLocation] = useState('Cape Town, South Africa');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardLayout title="Account Settings">
      <div className="max-w-2xl space-y-6">
        <div className="card">
          <div className="card-header">
            <h3 className="section-title">Profile Information</h3>
          </div>
          <div className="card-body space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold" style={{ background: 'var(--accent)', color: '#fff' }}>
                {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Role: {user?.role}</p>
              </div>
            </div>

            {[
              { icon: User, label: 'Full Name', value: name, setter: setName },
              { icon: Mail, label: 'Email', value: email, setter: setEmail, type: 'email' },
              { icon: Phone, label: 'Phone', value: phone, setter: setPhone },
              { icon: MapPin, label: 'Location', value: location, setter: setLocation },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>
                  <f.icon size={12} className="inline mr-1" />{f.label}
                </label>
                <input
                  type={f.type || 'text'}
                  value={f.value}
                  onChange={e => f.setter(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg text-sm border outline-none transition-all"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                />
              </div>
            ))}

            <button onClick={handleSave} className="btn-primary text-sm flex items-center gap-2">
              <Save size={16} /> {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
