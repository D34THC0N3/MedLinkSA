'use client';

import { BarChart3, TrendingUp, Users, Activity, DollarSign, Calendar } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const revenueData = [
  { month: 'Jan', revenue: 128000, costs: 82000 },
  { month: 'Feb', revenue: 142000, costs: 88000 },
  { month: 'Mar', revenue: 165000, costs: 95000 },
  { month: 'Apr', revenue: 180000, costs: 101000 },
  { month: 'May', revenue: 195000, costs: 108000 },
  { month: 'Jun', revenue: 220000, costs: 115000 },
];

const engagementData = [
  { name: 'Desktop', value: 45 },
  { name: 'Mobile', value: 38 },
  { name: 'Tablet', value: 12 },
  { name: 'Other', value: 5 },
];

const COLORS = ['var(--stat-teal)', 'var(--accent)', 'var(--accent-light)', 'var(--foreground-secondary)'];

const topProviders = [
  { name: 'Dr. Sarah Johnson', specialty: 'Cardiology', patients: 342, rating: 4.9 },
  { name: 'Dr. Michael Chen', specialty: 'Pediatrics', patients: 298, rating: 4.8 },
  { name: 'Dr. Amara Okafor', specialty: 'Internal Medicine', patients: 275, rating: 4.7 },
  { name: 'Dr. James Mwangi', specialty: 'Orthopedics', patients: 251, rating: 4.6 },
  { name: 'Dr. Emily Chen', specialty: 'Dermatology', patients: 234, rating: 4.9 },
];

export default function AdminAnalytics() {
  return (
    <DashboardLayout>
      <div style={{ padding: '32px', maxWidth: '1440px', margin: '0 auto' }}>
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--foreground)', margin: '0 0 4px' }}>Analytics</h1>
          <p style={{ fontSize: '14px', color: 'var(--foreground-secondary)', margin: 0 }}>Platform-wide metrics and performance data</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { icon: <DollarSign size={20} />, value: '$1.03M', label: 'Total Revenue', color: 'var(--stat-teal)' },
            { icon: <Users size={20} />, value: '11,200+', label: 'Active Users', color: 'var(--accent)' },
            { icon: <Activity size={20} />, value: '94.2%', label: 'Engagement Rate', color: 'var(--stat-teal)' },
            { icon: <Calendar size={20} />, value: '12,450', label: 'Monthly Appointments', color: 'var(--accent)' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>{s.icon}</div>
                <TrendingUp size={14} style={{ color: 'var(--stat-teal)' }} />
              </div>
              <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--foreground)', margin: '0 0 4px' }}>{s.value}</p>
              <p style={{ fontSize: '13px', color: 'var(--foreground-secondary)', margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '24px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--foreground)', margin: '0 0 4px' }}>Revenue Trends</h2>
            <p style={{ fontSize: '13px', color: 'var(--foreground-secondary)', margin: '0 0 20px' }}>Monthly revenue vs operational costs</p>
            <div style={{ height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--foreground-secondary)' }} />
                  <YAxis tick={{ fontSize: 11, fill: 'var(--foreground-secondary)' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--card-border)', background: 'var(--card-bg)', color: 'var(--foreground)' }} />
                  <Bar dataKey="revenue" fill="var(--stat-teal)" radius={[4, 4, 0, 0]} name="Revenue" />
                  <Bar dataKey="costs" fill="var(--accent-light)" radius={[4, 4, 0, 0]} name="Costs" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', padding: '24px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--foreground)', margin: '0 0 4px' }}>Platform Usage</h2>
            <p style={{ fontSize: '13px', color: 'var(--foreground-secondary)', margin: '0 0 20px' }}>By device type</p>
            <div style={{ height: '240px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={engagementData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                    {engagementData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend formatter={(value) => <span style={{ color: 'var(--foreground-secondary)', fontSize: '12px' }}>{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--card-border)' }}>
            <h2 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--foreground)', margin: '0 0 2px' }}>Top Performing Providers</h2>
            <p style={{ fontSize: '13px', color: 'var(--foreground-secondary)', margin: 0 }}>By patient volume and satisfaction rating</p>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                {['Provider', 'Specialty', 'Patients', 'Rating', 'Performance'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '12px 24px', color: 'var(--foreground-secondary)', fontWeight: 500, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {topProviders.map((p, i) => (
                <tr key={p.name} style={{ borderBottom: i < topProviders.length - 1 ? '1px solid var(--card-border)' : 'none' }}>
                  <td style={{ padding: '14px 24px', color: 'var(--foreground)', fontWeight: 500 }}>{p.name}</td>
                  <td style={{ padding: '14px 24px', color: 'var(--foreground-secondary)' }}>{p.specialty}</td>
                  <td style={{ padding: '14px 24px', color: 'var(--foreground)' }}>{p.patients}</td>
                  <td style={{ padding: '14px 24px' }}>
                    <span style={{ color: '#d97706' }}>{'★'.repeat(Math.round(p.rating))}</span>
                    <span style={{ color: 'var(--foreground-secondary)', marginLeft: '6px', fontSize: '12px' }}>{p.rating}</span>
                  </td>
                  <td style={{ padding: '14px 24px' }}>
                    <div style={{ width: '100px', height: '6px', borderRadius: '3px', background: 'var(--card-border)' }}>
                      <div style={{ width: `${(p.patients / 350) * 100}%`, height: '100%', borderRadius: '3px', background: 'var(--accent)' }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
