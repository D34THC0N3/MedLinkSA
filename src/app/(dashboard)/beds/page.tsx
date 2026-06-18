'use client';

import { useState } from 'react';
import { BedDouble, Search, Users, Activity, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface Ward {
  name: string;
  total: number;
  occupied: number;
  available: number;
  maintenance: number;
  status: 'available' | 'limited' | 'full';
}

interface BedItem {
  id: string;
  ward: string;
  bed: string;
  patient: string | null;
  status: 'occupied' | 'available' | 'maintenance';
  lastCleaned: string;
}

export default function Beds() {
  const [filter, setFilter] = useState<'all' | 'available' | 'occupied' | 'maintenance'>('all');
  const [wards] = useState<Ward[]>([
    { name: 'Cardiology', total: 40, occupied: 34, available: 4, maintenance: 2, status: 'limited' },
    { name: 'Pediatrics', total: 30, occupied: 22, available: 7, maintenance: 1, status: 'available' },
    { name: 'Orthopedics', total: 25, occupied: 23, available: 1, maintenance: 1, status: 'limited' },
    { name: 'ICU', total: 18, occupied: 18, available: 0, maintenance: 0, status: 'full' },
    { name: 'General Ward', total: 50, occupied: 38, available: 10, maintenance: 2, status: 'available' },
    { name: 'Maternity', total: 22, occupied: 19, available: 2, maintenance: 1, status: 'limited' },
  ]);

  const [beds] = useState<BedItem[]>([
    { id: 'b1', ward: 'Cardiology', bed: 'C-101', patient: 'John Mwangi', status: 'occupied', lastCleaned: 'Today' },
    { id: 'b2', ward: 'Cardiology', bed: 'C-102', patient: null, status: 'available', lastCleaned: 'Today' },
    { id: 'b3', ward: 'Cardiology', bed: 'C-103', patient: 'Priya Patel', status: 'occupied', lastCleaned: 'Yesterday' },
    { id: 'b4', ward: 'Cardiology', bed: 'C-104', patient: null, status: 'maintenance', lastCleaned: '2 days ago' },
    { id: 'b5', ward: 'ICU', bed: 'ICU-01', patient: 'Thabo Mokoena', status: 'occupied', lastCleaned: 'Today' },
    { id: 'b6', ward: 'ICU', bed: 'ICU-02', patient: 'Grace Okafor', status: 'occupied', lastCleaned: 'Today' },
    { id: 'b7', ward: 'Pediatrics', bed: 'P-201', patient: null, status: 'available', lastCleaned: 'Today' },
    { id: 'b8', ward: 'Pediatrics', bed: 'P-202', patient: null, status: 'available', lastCleaned: 'Yesterday' },
    { id: 'b9', ward: 'Orthopedics', bed: 'O-301', patient: 'Lindiwe Nkosi', status: 'occupied', lastCleaned: 'Today' },
  ]);

  const filteredBeds = filter === 'all' ? beds : beds.filter(b => b.status === filter);

  const statusIcon = (s: string) => {
    switch (s) {
      case 'occupied': return <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', flexShrink: 0 }} />;
      case 'available': return <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--stat-teal)', flexShrink: 0 }} />;
      case 'maintenance': return <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#d97706', flexShrink: 0 }} />;
      default: return null;
    }
  };

  const totalCapacity = wards.reduce((a, w) => a + w.total, 0);
  const totalOccupied = wards.reduce((a, w) => a + w.occupied, 0);
  const totalAvailable = totalCapacity - totalOccupied - wards.reduce((a, w) => a + w.maintenance, 0);

  return (
    <DashboardLayout>
      <div className="w-full">
        <div className="mb-5 sm:mb-7">
          <h1 className="section-title text-xl sm:text-2xl md:text-[28px]" style={{ color: 'var(--foreground)', margin: '0 0 4px' }}>Bed Management</h1>
          <p className="text-sm" style={{ color: 'var(--foreground-secondary)' }}>Track bed occupancy and availability across all wards</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-5 sm:mb-6">
          {[
            { label: 'Total Capacity', value: totalCapacity.toString(), icon: <BedDouble size={18} />, color: 'var(--accent)' },
            { label: 'Occupied', value: totalOccupied.toString(), icon: <Users size={18} />, color: '#ef4444' },
            { label: 'Available', value: totalAvailable.toString(), icon: <CheckCircle size={18} />, color: 'var(--stat-teal)' },
            { label: 'Occupancy Rate', value: Math.round((totalOccupied / totalCapacity) * 100) + '%', icon: <Activity size={18} />, color: '#d97706' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, marginBottom: '8px' }}>{s.icon}</div>
              <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--foreground)', margin: '0 0 4px' }}>{s.value}</p>
              <p style={{ fontSize: '13px', color: 'var(--foreground-secondary)', margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4 lg:gap-5">
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '20px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)', margin: '0 0 16px' }}>Ward Overview</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {wards.map(w => {
                const pct = Math.round((w.occupied / w.total) * 100);
                const barColor = pct >= 90 ? '#ef4444' : pct >= 75 ? '#d97706' : 'var(--stat-teal)';
                return (
                  <div key={w.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--foreground)' }}>{w.name}</span>
                      <span style={{ fontSize: '12px', color: 'var(--foreground-secondary)' }}>{w.occupied}/{w.total}</span>
                    </div>
                    <div style={{ height: '6px', borderRadius: '3px', background: 'var(--card-border)' }}>
                      <div style={{ width: `${pct}%`, height: '100%', borderRadius: '3px', background: barColor }} />
                    </div>
                    <div style={{ display: 'flex', gap: '12px', marginTop: '4px', fontSize: '11px', color: 'var(--foreground-secondary)' }}>
                      <span>{w.available} free</span>
                      {w.maintenance > 0 && <span>{w.maintenance} maintenance</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', overflow: 'hidden' }}>
            <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--foreground)', margin: 0 }}>Bed List</h2>
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['all', 'available', 'occupied', 'maintenance'] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)} style={{ padding: '5px 12px', borderRadius: '6px', border: '1px solid var(--card-border)', background: filter === f ? 'var(--accent)' : 'transparent', color: filter === f ? '#fff' : 'var(--foreground-secondary)', fontSize: '11px', cursor: 'pointer', textTransform: 'capitalize' }}>{f}</button>
                ))}
              </div>
            </div>
            <div style={{ padding: '8px 0 0' }}>
              {filteredBeds.map((b, i) => (
                <div key={b.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: i < filteredBeds.length - 1 ? '1px solid var(--card-border)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {statusIcon(b.status)}
                    <div>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: 'var(--foreground)' }}>{b.bed}</p>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--foreground-secondary)' }}>{b.ward}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '13px', color: b.patient ? 'var(--foreground)' : 'var(--foreground-secondary)' }}>{b.patient || '—'}</p>
                    <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--foreground-secondary)' }}>Cleaned: {b.lastCleaned}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
