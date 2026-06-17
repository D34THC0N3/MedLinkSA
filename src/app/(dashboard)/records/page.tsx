'use client';

import { useState } from 'react';
import { FileText, Download, Search, Filter, Eye, Calendar, Activity, Heart, FlaskConical, Shield } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface MedicalRecord {
  id: string; title: string; type: string; date: string; provider: string; category: string;
}

const recordsData: MedicalRecord[] = [
  { id: 'r1', title: 'Complete Blood Count', type: 'Lab Result', date: '2026-06-10', provider: 'Cape Town Medical Centre', category: 'Lab Results' },
  { id: 'r2', title: 'Chest X-Ray', type: 'Imaging', date: '2026-06-05', provider: 'Cape Town Medical Centre', category: 'Imaging' },
  { id: 'r3', title: 'Cardiology Consultation Notes', type: 'Visit Note', date: '2026-06-01', provider: 'Dr. Sarah Evans', category: 'Visit Notes' },
  { id: 'r4', title: 'Flu Vaccination', type: 'Vaccination', date: '2026-05-15', provider: 'Dr. Michael Chen', category: 'Vaccinations' },
  { id: 'r5', title: 'Lipid Panel', type: 'Lab Result', date: '2026-05-10', provider: 'Cape Town Medical Centre', category: 'Lab Results' },
  { id: 'r6', title: 'ECG Report', type: 'Imaging', date: '2026-04-28', provider: 'Dr. Sarah Evans', category: 'Imaging' },
];

const categoryIcons: Record<string, React.ReactNode> = {
  'Lab Results': <FlaskConical size={16} />,
  'Imaging': <Activity size={16} />,
  'Visit Notes': <FileText size={16} />,
  'Vaccinations': <Shield size={16} />,
};

export default function RecordsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('All');

  const categories = ['All', ...new Set(recordsData.map(r => r.category))];
  const filtered = recordsData.filter(r => {
    if (category !== 'All' && r.category !== category) return false;
    return r.title.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <DashboardLayout title="Medical Records">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {categories.map(c => (
              <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${category === c ? 'btn-primary' : 'btn-ghost'}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="relative w-48">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search records..." className="w-full px-3 py-1.5 pl-9 rounded-lg text-xs border outline-none" style={{ background: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }} />
          </div>
        </div>

        <div className="grid gap-3">
          {filtered.map(r => (
            <div key={r.id} className="card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-light)' }}>
                {categoryIcons[r.category] || <FileText size={16} style={{ color: 'var(--accent)' }} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{r.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[11px]" style={{ color: 'var(--foreground-secondary)' }}>{r.type}</span>
                  <span className="text-[11px] flex items-center gap-1" style={{ color: 'var(--foreground-tertiary)' }}><Calendar size={11} /> {r.date}</span>
                  <span className="text-[11px]" style={{ color: 'var(--foreground-tertiary)' }}>{r.provider}</span>
                </div>
              </div>
              <button className="btn-outline text-xs px-3 py-1.5"><Eye size={14} /> View</button>
              <button className="btn-ghost p-2"><Download size={16} /></button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
