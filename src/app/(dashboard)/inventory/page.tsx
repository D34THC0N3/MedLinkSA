'use client';

import { useState } from 'react';
import { PackageCheck, Search, AlertTriangle, Plus, Filter, MoreVertical, Pill, Package, Syringe, Thermometer } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface InventoryItem {
  name: string;
  category: string;
  icon: typeof Pill;
  stock: number;
  minThreshold: number;
  unit: string;
  cost: number;
  supplier: string;
  status: 'in-stock' | 'low' | 'critical' | 'out';
  expires: string;
}

export default function Inventory() {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [items] = useState<InventoryItem[]>([
    { name: 'Amoxicillin 500mg', category: 'Antibiotics', icon: Pill, stock: 2400, minThreshold: 500, unit: 'capsules', cost: 0.12, supplier: 'PharmaCo', status: 'in-stock', expires: '2026-08' },
    { name: 'Paracetamol 1g', category: 'Analgesics', icon: Pill, stock: 580, minThreshold: 400, unit: 'tablets', cost: 0.04, supplier: 'MedSource', status: 'in-stock', expires: '2027-01' },
    { name: 'Insulin Glargine', category: 'Endocrine', icon: Syringe, stock: 120, minThreshold: 200, unit: 'vials', cost: 4.50, supplier: 'BioCare', status: 'low', expires: '2026-06' },
    { name: 'Salbutamol Inhaler', category: 'Respiratory', icon: Package, stock: 85, minThreshold: 150, unit: 'inhalers', cost: 3.20, supplier: 'AirwayMed', status: 'low', expires: '2026-09' },
    { name: 'Morphine 10mg', category: 'Controlled', icon: Syringe, stock: 45, minThreshold: 100, unit: 'ampoules', cost: 2.10, supplier: 'ControlledRx', status: 'critical', expires: '2026-05' },
    { name: 'IV Saline 500ml', category: 'IV Fluids', icon: Package, stock: 3400, minThreshold: 500, unit: 'bags', cost: 0.85, supplier: 'MedSource', status: 'in-stock', expires: '2027-06' },
    { name: 'Atropine 1mg', category: 'Emergency', icon: Syringe, stock: 0, minThreshold: 50, unit: 'ampoules', cost: 1.80, supplier: 'EmergencyRx', status: 'out', expires: '2025-12' },
    { name: 'COVID-19 Vaccine', category: 'Vaccines', icon: Syringe, stock: 420, minThreshold: 200, unit: 'doses', cost: 8.00, supplier: 'BioCare', status: 'in-stock', expires: '2026-04' },
    { name: 'Thermometer Probe', category: 'Equipment', icon: Thermometer, stock: 28, minThreshold: 30, unit: 'units', cost: 12.00, supplier: 'MedEquip', status: 'low', expires: 'N/A' },
    { name: 'Surgical Gloves (Box)', category: 'Supplies', icon: Package, stock: 150, minThreshold: 100, unit: 'boxes', cost: 2.50, supplier: 'MedSource', status: 'in-stock', expires: '2027-12' },
  ]);

  const categories = ['All', ...new Set(items.map(i => i.category))];

  const filtered = items.filter(i =>
    (catFilter === 'All' || i.category === catFilter) &&
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusStyle = (s: string) => {
    switch (s) {
      case 'in-stock': return { bg: 'rgba(52,211,153,0.12)', color: 'var(--stat-teal)' };
      case 'low': return { bg: 'rgba(251,191,36,0.12)', color: '#d97706' };
      case 'critical': return { bg: 'rgba(239,68,68,0.12)', color: '#ef4444' };
      case 'out': return { bg: 'rgba(107,114,128,0.12)', color: '#6b7280' };
      default: return {};
    }
  };

  const criticalCount = items.filter(i => i.status === 'critical' || i.status === 'out').length;
  const lowCount = items.filter(i => i.status === 'low').length;

  return (
    <DashboardLayout>
      <div style={{ padding: '32px', maxWidth: '1440px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--foreground)', margin: '0 0 4px' }}>Inventory</h1>
            <p style={{ fontSize: '14px', color: 'var(--foreground-secondary)', margin: 0 }}>Track pharmaceutical and supply stock levels</p>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', border: 'none', background: 'var(--accent)', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
            <Plus size={16} /> Add Item
          </button>
        </div>

        {criticalCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', marginBottom: '20px' }}>
            <AlertTriangle size={18} style={{ color: '#ef4444', flexShrink: 0 }} />
            <p style={{ margin: 0, fontSize: '13px', color: '#ef4444' }}>
              {criticalCount} item{criticalCount > 1 ? 's' : ''} {criticalCount > 1 ? 'are' : 'is'} critically low or out of stock. {lowCount} more below threshold.
            </p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--foreground-secondary)' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search inventory..."
              style={{ width: '100%', padding: '9px 12px 9px 36px', borderRadius: '10px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--foreground)', fontSize: '13px', outline: 'none' }} />
          </div>
          {categories.map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid var(--card-border)', background: catFilter === c ? 'var(--accent)' : 'var(--card-bg)', color: catFilter === c ? '#fff' : 'var(--foreground)', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {c}
            </button>
          ))}
        </div>

        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                {['Item', 'Category', 'Stock', 'Min Threshold', 'Unit Cost', 'Supplier', 'Status', 'Expires', ''].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 16px', color: 'var(--foreground-secondary)', fontWeight: 500, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, i) => {
                const Icon = item.icon;
                const st = getStatusStyle(item.status);
                return (
                  <tr key={item.name} style={{ borderBottom: i < filtered.length - 1 ? '1px solid var(--card-border)' : 'none' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(59,130,246,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                          <Icon size={16} />
                        </div>
                        <span style={{ color: 'var(--foreground)', fontWeight: 500 }}>{item.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--foreground-secondary)' }}>{item.category}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: item.status === 'critical' || item.status === 'out' ? '#ef4444' : 'var(--foreground)' }}>{item.stock.toLocaleString()}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--foreground-secondary)' }}>{item.minThreshold} {item.unit}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--foreground)' }}>${item.cost.toFixed(2)}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--foreground-secondary)' }}>{item.supplier}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 500, background: st.bg, color: st.color, textTransform: 'capitalize' }}>{item.status.replace('-', ' ')}</span>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--foreground-secondary)', fontSize: '12px' }}>{item.expires}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--foreground-secondary)' }}><MoreVertical size={16} /></button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
