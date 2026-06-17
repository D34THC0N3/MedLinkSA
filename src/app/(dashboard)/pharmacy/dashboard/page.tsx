'use client';

import { useState } from 'react';
import { Pill, PackageCheck, AlertTriangle, TrendingUp, Clock, Search, CheckCircle, X } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface PrescriptionOrder {
  id: string; patient: string; medication: string; dosage: string; status: 'pending' | 'filled' | 'verified'; time: string;
}

interface InventoryItem {
  id: string; name: string; stock: number; minStock: number; expiry: string; unit: string;
}

const orders: PrescriptionOrder[] = [
  { id: 'rx-001', patient: 'Sarah Johnson', medication: 'Amlodipine', dosage: '5mg', status: 'pending', time: '08:30' },
  { id: 'rx-002', patient: 'John Doe', medication: 'Metformin', dosage: '500mg', status: 'filled', time: '09:15' },
  { id: 'rx-003', patient: 'Mary Williams', medication: 'Atorvastatin', dosage: '10mg', status: 'pending', time: '10:00' },
  { id: 'rx-004', patient: 'Peter Brown', medication: 'Lisinopril', dosage: '20mg', status: 'verified', time: '10:30' },
  { id: 'rx-005', patient: 'Jane Smith', medication: 'Omeprazole', dosage: '40mg', status: 'pending', time: '11:00' },
];

const inventory: InventoryItem[] = [
  { id: 'i1', name: 'Amlodipine 5mg', stock: 240, minStock: 100, expiry: '2027-03-15', unit: 'tabs' },
  { id: 'i2', name: 'Metformin 500mg', stock: 45, minStock: 100, expiry: '2026-12-01', unit: 'tabs' },
  { id: 'i3', name: 'Atorvastatin 10mg', stock: 180, minStock: 80, expiry: '2027-06-20', unit: 'tabs' },
  { id: 'i4', name: 'Lisinopril 20mg', stock: 30, minStock: 60, expiry: '2026-09-10', unit: 'tabs' },
  { id: 'i5', name: 'Omeprazole 40mg', stock: 90, minStock: 50, expiry: '2027-01-25', unit: 'caps' },
];

export default function PharmacyDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<PrescriptionOrder | null>(null);

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const lowStock = inventory.filter(i => i.stock <= i.minStock).length;
  const todayFilled = orders.filter(o => o.status === 'filled' || o.status === 'verified').length;

  const filteredOrders = orders.filter(o =>
    o.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.medication.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout title="Pharmacy Operations: CureMed — Cape Town Branch">
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          <div className="stat-card">
            <div className="flex items-start justify-between mb-1">
              <span className="stat-label">Pending</span>
              <Clock size={18} style={{ color: 'var(--stat-amber)' }} />
            </div>
            <p className="stat-value">{pendingCount}</p>
            <p className="text-xs" style={{ color: 'var(--foreground-secondary)' }}>Awaiting fulfillment</p>
          </div>
          <div className="stat-card">
            <div className="flex items-start justify-between mb-1">
              <span className="stat-label">Filled Today</span>
              <CheckCircle size={18} style={{ color: 'var(--stat-green)' }} />
            </div>
            <p className="stat-value">{todayFilled}</p>
            <p className="text-xs" style={{ color: 'var(--foreground-secondary)' }}>Processed orders</p>
          </div>
          <div className="stat-card">
            <div className="flex items-start justify-between mb-1">
              <span className="stat-label">Low Stock</span>
              <AlertTriangle size={18} style={{ color: 'var(--stat-red)' }} />
            </div>
            <p className="stat-value">{lowStock}</p>
            <p className="text-xs" style={{ color: 'var(--foreground-secondary)' }}>Items need reorder</p>
          </div>
          <div className="stat-card">
            <div className="flex items-start justify-between mb-1">
              <span className="stat-label">Inventory</span>
              <PackageCheck size={18} style={{ color: 'var(--stat-blue)' }} />
            </div>
            <p className="stat-value">{inventory.length}</p>
            <p className="text-xs" style={{ color: 'var(--foreground-secondary)' }}>Total line items</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="section-title">Prescription Orders</h3>
                  <p className="text-xs" style={{ color: 'var(--foreground-secondary)' }}>Today&apos;s queue</p>
                </div>
                <div className="relative w-48">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-1.5 pl-9 rounded-lg text-xs border outline-none"
                    style={{ background: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>
            </div>
            <div className="card-body space-y-2 max-h-[400px] overflow-y-auto">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all hover:bg-white/5"
                  style={{ background: order.status === 'pending' ? 'var(--accent-light)' : 'transparent' }}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{order.medication}</p>
                    <p className="text-xs" style={{ color: 'var(--foreground-secondary)' }}>{order.patient} · {order.dosage}</p>
                    <p className="text-[11px]" style={{ color: 'var(--foreground-tertiary)' }}>#{order.id} · {order.time}</p>
                  </div>
                  <span className={`pill-badge ${order.status === 'pending' ? 'pill-amber' : order.status === 'filled' ? 'pill-blue' : 'pill-green'}`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="section-title">Inventory Alerts</h3>
              <p className="text-xs" style={{ color: 'var(--foreground-secondary)' }}>Items below minimum stock</p>
            </div>
            <div className="card-body space-y-3 max-h-[400px] overflow-y-auto">
              {inventory.filter(i => i.stock <= i.minStock).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.06)' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs" style={{ color: 'var(--foreground-secondary)' }}>Stock: {item.stock} {item.unit} · Min: {item.minStock}</p>
                    <p className="text-[11px]" style={{ color: 'var(--error)' }}>Expires: {item.expiry}</p>
                  </div>
                  <button className="btn-primary text-xs px-3 py-1">Reorder</button>
                </div>
              ))}
              {inventory.filter(i => i.stock > i.minStock).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs" style={{ color: 'var(--foreground-secondary)' }}>{item.stock} {item.unit} in stock</p>
                  </div>
                  <span className="text-xs" style={{ color: 'var(--success)' }}>In Stock</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
          <div className="card w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="card-header flex items-center justify-between">
              <h3 className="section-title">Prescription #{selectedOrder.id}</h3>
              <button onClick={() => setSelectedOrder(null)} className="btn-ghost p-1"><X size={18} /></button>
            </div>
            <div className="card-body space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl" style={{ background: 'var(--accent-light)' }}>
                  <p className="text-xs" style={{ color: 'var(--foreground-secondary)' }}>Patient</p>
                  <p className="font-medium text-sm">{selectedOrder.patient}</p>
                </div>
                <div className="p-3 rounded-xl" style={{ background: 'var(--accent-light)' }}>
                  <p className="text-xs" style={{ color: 'var(--foreground-secondary)' }}>Medication</p>
                  <p className="font-medium text-sm">{selectedOrder.medication}</p>
                </div>
                <div className="p-3 rounded-xl" style={{ background: 'var(--accent-light)' }}>
                  <p className="text-xs" style={{ color: 'var(--foreground-secondary)' }}>Dosage</p>
                  <p className="font-medium text-sm">{selectedOrder.dosage}</p>
                </div>
                <div className="p-3 rounded-xl" style={{ background: 'var(--accent-light)' }}>
                  <p className="text-xs" style={{ color: 'var(--foreground-secondary)' }}>Status</p>
                  <span className={`pill-badge ${selectedOrder.status === 'pending' ? 'pill-amber' : selectedOrder.status === 'filled' ? 'pill-blue' : 'pill-green'}`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                {selectedOrder.status === 'pending' && (
                  <button className="btn-primary flex-1 text-sm">Mark as Filled</button>
                )}
                {selectedOrder.status === 'filled' && (
                  <button className="btn-primary flex-1 text-sm" style={{ background: 'var(--success)', borderColor: 'transparent' }}>Verify & Complete</button>
                )}
                <button className="btn-outline flex-1 text-sm">Print Label</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
