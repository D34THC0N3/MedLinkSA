'use client';

import { useState } from 'react';
import { Pill, Search, AlertTriangle, RefreshCw, Download, Plus, X } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface Prescription {
  id: string; medication: string; dosage: string; prescribedBy: string; date: string; refillDate: string; status: 'Active' | 'Refill Due' | 'Expired'; pharmacy?: string;
}

const prescriptions: Prescription[] = [
  { id: 'p1', medication: 'Amlodipine', dosage: '5mg daily', prescribedBy: 'Dr. Sarah Evans', date: '2026-03-15', refillDate: '2026-07-15', status: 'Active', pharmacy: 'CureMed Pharmacy' },
  { id: 'p2', medication: 'Metformin', dosage: '500mg twice daily', prescribedBy: 'Dr. Michael Chen', date: '2026-01-10', refillDate: '2026-06-10', status: 'Refill Due', pharmacy: 'CureMed Pharmacy' },
  { id: 'p3', medication: 'Atorvastatin', dosage: '10mg daily', prescribedBy: 'Dr. Sarah Evans', date: '2026-02-01', refillDate: '2026-08-01', status: 'Active', pharmacy: 'HealthFirst Pharmacy' },
  { id: 'p4', medication: 'Lisinopril', dosage: '20mg daily', prescribedBy: 'Dr. Michael Chen', date: '2025-11-20', refillDate: '2026-05-20', status: 'Expired', pharmacy: 'CureMed Pharmacy' },
];

export default function PrescriptionsPage() {
  const [search, setSearch] = useState('');

  const filtered = prescriptions.filter(p =>
    p.medication.toLowerCase().includes(search.toLowerCase()) ||
    p.prescribedBy.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout title="Prescriptions">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="relative w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search prescriptions..." className="w-full px-3 py-2 pl-9 rounded-lg text-xs border outline-none" style={{ background: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }} />
          </div>
          <button className="btn-primary text-sm"><Plus size={16} /> Request Refill</button>
        </div>

        <div className="card">
          <div className="card-body space-y-3">
            {filtered.map(p => (
              <div key={p.id} className="flex items-center justify-between p-4 rounded-xl" style={{ background: p.status === 'Refill Due' ? 'rgba(245,158,11,0.06)' : 'transparent', borderBottom: '1px solid var(--card-border)' }}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: p.status === 'Refill Due' ? 'rgba(245,158,11,0.12)' : p.status === 'Active' ? 'rgba(34,197,94,0.12)' : 'rgba(112,119,129,0.12)' }}>
                    {p.status === 'Refill Due' ? <AlertTriangle size={18} style={{ color: '#F59E0B' }} /> : <Pill size={18} style={{ color: p.status === 'Active' ? '#22C55E' : '#707781' }} />}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{p.medication}</p>
                    <p className="text-xs" style={{ color: 'var(--foreground-secondary)' }}>{p.dosage}</p>
                    <p className="text-[11px]" style={{ color: 'var(--foreground-tertiary)' }}>Prescribed by {p.prescribedBy} · {p.pharmacy}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`pill-badge ${p.status === 'Active' ? 'pill-green' : p.status === 'Refill Due' ? 'pill-amber' : 'pill-gray'}`}>{p.status}</span>
                  <p className="text-[11px] mt-1" style={{ color: 'var(--foreground-tertiary)' }}>Refill: {p.refillDate}</p>
                  <div className="flex gap-1 mt-1 justify-end">
                    <button className="btn-ghost p-1"><Download size={12} /></button>
                    {p.status !== 'Expired' && <button className="btn-ghost p-1"><RefreshCw size={12} /></button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
