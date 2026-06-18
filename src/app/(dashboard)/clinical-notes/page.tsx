'use client';

import { useState } from 'react';
import { ClipboardList, Plus, Search, FileText, Clock, MoreVertical, Eye, Edit3, Trash2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface Note {
  id: string;
  patient: string;
  type: string;
  summary: string;
  date: string;
  status: 'draft' | 'final' | 'amended';
}

const noteTypes = ['All', 'Consultation', 'Follow-up', 'Discharge', 'Referral', 'Lab Review'];

export default function ClinicalNotes() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [notes] = useState<Note[]>([
    { id: 'n1', patient: 'Grace Okafor', type: 'Consultation', summary: 'Patient presents with elevated BP 145/92. Continue current medication.', date: '2025-06-16', status: 'final' },
    { id: 'n2', patient: 'Thabo Mokoena', type: 'Follow-up', summary: 'Asthma well-controlled. Peak flow 85% of personal best. Reduce inhaler frequency.', date: '2025-06-15', status: 'final' },
    { id: 'n3', patient: 'Priya Patel', type: 'Lab Review', summary: 'HbA1c 7.2% — improved from 8.1%. Continue metformin. Dietary compliance good.', date: '2025-06-14', status: 'final' },
    { id: 'n4', patient: 'John Mwangi', type: 'Discharge', summary: 'Post-op day 3. Wound healing well. Pain controlled with paracetamol. Discharge planned.', date: '2025-06-14', status: 'draft' },
    { id: 'n5', patient: 'Lindiwe Nkosi', type: 'Consultation', summary: 'Routine prenatal visit. Fetal heart rate 140bpm. Blood pressure normal. Next visit in 4 weeks.', date: '2025-06-12', status: 'final' },
    { id: 'n6', patient: 'David Ochieng', type: 'Follow-up', summary: 'COPD exacerbation resolved. SpO2 96% on room air. Continue maintenance therapy.', date: '2025-06-10', status: 'amended' },
  ]);

  const filtered = notes.filter(n =>
    (typeFilter === 'All' || n.type === typeFilter) &&
    (n.patient.toLowerCase().includes(search.toLowerCase()) || n.summary.toLowerCase().includes(search.toLowerCase()))
  );

  const statusStyle = (s: string) => {
    switch (s) {
      case 'final': return { background: 'rgba(52,211,153,0.12)', color: 'var(--stat-teal)' };
      case 'draft': return { background: 'rgba(251,191,36,0.12)', color: '#d97706' };
      case 'amended': return { background: 'rgba(59,130,246,0.1)', color: 'var(--accent)' };
      default: return {};
    }
  };

  return (
    <DashboardLayout>
      <div style={{ padding: '32px', maxWidth: '1440px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--foreground)', margin: '0 0 4px' }}>Clinical Notes</h1>
            <p style={{ fontSize: '14px', color: 'var(--foreground-secondary)', margin: 0 }}>Write and manage patient clinical documentation</p>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '10px', border: 'none', background: 'var(--accent)', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
            <Plus size={16} /> New Note
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--foreground-secondary)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search notes..."
              style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--foreground)', fontSize: '13px', outline: 'none' }} />
          </div>
          {noteTypes.map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid var(--card-border)', background: typeFilter === t ? 'var(--accent)' : 'var(--card-bg)', color: typeFilter === t ? '#fff' : 'var(--foreground)', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {t}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gap: '12px' }}>
          {filtered.map((note) => (
            <div key={note.id} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59,130,246,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', flexShrink: 0 }}>
                <FileText size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--foreground)' }}>{note.patient}</span>
                  <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '11px', background: 'rgba(59,130,246,0.08)', color: 'var(--accent)' }}>{note.type}</span>
                  <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 500, ...statusStyle(note.status) }}>{note.status}</span>
                </div>
                <p style={{ margin: '0 0 8px', fontSize: '13px', color: 'var(--foreground-secondary)', lineHeight: 1.5 }}>{note.summary}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: 'var(--foreground-secondary)' }}><Clock size={12} />{note.date}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <button style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--card-border)', background: 'transparent', cursor: 'pointer', color: 'var(--foreground-secondary)' }}><Eye size={14} /></button>
                <button style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--card-border)', background: 'transparent', cursor: 'pointer', color: 'var(--foreground-secondary)' }}><Edit3 size={14} /></button>
                <button style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--card-border)', background: 'transparent', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
