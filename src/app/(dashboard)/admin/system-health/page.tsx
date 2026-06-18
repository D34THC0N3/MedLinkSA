'use client';

import { useState, forwardRef, type ComponentPropsWithoutRef } from 'react';
import { Activity, Server, Database, Wifi, Cpu, CheckCircle, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';

interface Service {
  name: string;
  icon: typeof Server;
  status: 'healthy' | 'degraded' | 'down';
  uptime: string;
  latency: string;
  lastIncident: string;
}

interface Alert {
  id: string;
  message: string;
  time: string;
  severity: 'critical' | 'warning' | 'info';
  resolved: boolean;
}

export default function SystemHealth() {
  const Shield = forwardRef<SVGSVGElement, ComponentPropsWithoutRef<typeof Server>>((props, ref) => <Server ref={ref} {...props} />);
  Shield.displayName = 'Shield';

  const [services] = useState<Service[]>([
    { name: 'API Gateway', icon: Server, status: 'healthy', uptime: '99.99%', latency: '42ms', lastIncident: '14 days ago' },
    { name: 'Database Cluster', icon: Database, status: 'healthy', uptime: '99.97%', latency: '8ms', lastIncident: '3 days ago' },
    { name: 'Authentication', icon: Shield, status: 'healthy', uptime: '99.99%', latency: '65ms', lastIncident: '30 days ago' },
    { name: 'Storage Service', icon: Database, status: 'healthy', uptime: '99.95%', latency: '120ms', lastIncident: '7 days ago' },
    { name: 'Message Queue', icon: Activity, status: 'degraded', uptime: '98.2%', latency: '340ms', lastIncident: '2 hours ago' },
    { name: 'WebSocket', icon: Wifi, status: 'healthy', uptime: '99.98%', latency: '15ms', lastIncident: '5 days ago' },
    { name: 'Search Index', icon: Cpu, status: 'healthy', uptime: '99.89%', latency: '95ms', lastIncident: '1 day ago' },
    { name: 'Email Service', icon: Server, status: 'down', uptime: '95.3%', latency: 'N/A', lastIncident: 'Now' },
  ]);

  const [alerts] = useState<Alert[]>([
    { id: 'a1', message: 'Email queue backlog — 1,247 messages pending delivery', time: '2 min ago', severity: 'critical', resolved: false },
    { id: 'a2', message: 'CPU utilization on primary node exceeding 85%', time: '15 min ago', severity: 'warning', resolved: false },
    { id: 'a3', message: 'Message queue latency spike detected (>300ms)', time: '1 hr ago', severity: 'warning', resolved: false },
    { id: 'a4', message: 'SSL certificate renewal completed for api.serenity.com', time: '3 hr ago', severity: 'info', resolved: true },
    { id: 'a5', message: 'Database connection pool exhausted — auto-scaled', time: '6 hr ago', severity: 'critical', resolved: true },
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle size={18} style={{ color: 'var(--stat-teal)' }} />;
      case 'degraded': return <AlertTriangle size={18} style={{ color: '#d97706' }} />;
      case 'down': return <XCircle size={18} style={{ color: '#ef4444' }} />;
      default: return null;
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'healthy': return 'rgba(52,211,153,0.12)';
      case 'degraded': return 'rgba(251,191,36,0.12)';
      case 'down': return 'rgba(239,68,68,0.12)';
      default: return 'transparent';
    }
  };

  return (
    <DashboardLayout>
      <div style={{ padding: '32px', maxWidth: '1440px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 600, color: 'var(--foreground)', margin: '0 0 4px' }}>System Health</h1>
            <p style={{ fontSize: '14px', color: 'var(--foreground-secondary)', margin: 0 }}>Infrastructure monitoring and service status</p>
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', borderRadius: '10px', border: 'none', background: 'var(--accent)', color: '#fff', fontSize: '13px', fontWeight: 500, cursor: 'pointer' }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total Services', value: '8', icon: <Server size={18} />, color: 'var(--accent)' },
            { label: 'Healthy', value: '6', icon: <CheckCircle size={18} />, color: 'var(--stat-teal)' },
            { label: 'Degraded', value: '1', icon: <AlertTriangle size={18} />, color: '#d97706' },
            { label: 'Down', value: '1', icon: <XCircle size={18} />, color: '#ef4444' },
          ].map((s, i) => (
            <div key={i} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, marginBottom: '12px' }}>{s.icon}</div>
              <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--foreground)', margin: '0 0 4px' }}>{s.value}</p>
              <p style={{ fontSize: '13px', color: 'var(--foreground-secondary)', margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '20px' }}>
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--card-border)' }}>
              <h2 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--foreground)', margin: '0 0 2px' }}>Service Status</h2>
              <p style={{ fontSize: '13px', color: 'var(--foreground-secondary)', margin: 0 }}>Real-time health checks for all platform services</p>
            </div>
            <div style={{ padding: '8px 0' }}>
              {services.map((svc, i) => {
                const Icon = svc.icon;
                return (
                  <div key={svc.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderBottom: i < services.length - 1 ? '1px solid var(--card-border)' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'rgba(59,130,246,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: 'var(--foreground)' }}>{svc.name}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--foreground-secondary)' }}>{svc.uptime} uptime · {svc.latency} latency</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--foreground-secondary)' }}>{svc.lastIncident}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, background: getStatusBg(svc.status), color: svc.status === 'healthy' ? 'var(--stat-teal)' : svc.status === 'degraded' ? '#d97706' : '#ef4444' }}>
                        {getStatusIcon(svc.status)} {svc.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '14px', overflow: 'hidden' }}>
            <div style={{ padding: '20px 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--foreground)', margin: '0 0 2px' }}>Active Alerts</h2>
                <p style={{ fontSize: '13px', color: 'var(--foreground-secondary)', margin: 0 }}>{alerts.filter(a => !a.resolved).length} unresolved</p>
              </div>
              <span style={{ padding: '3px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 500, background: 'rgba(251,191,36,0.15)', color: '#d97706' }}>{alerts.filter(a => a.severity === 'critical' && !a.resolved).length} critical</span>
            </div>
            <div style={{ padding: '8px 0 0' }}>
              {alerts.map((alert) => (
                <div key={alert.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 20px', borderBottom: '1px solid var(--card-border)', opacity: alert.resolved ? 0.5 : 1 }}>
                  {alert.severity === 'critical' ? <XCircle size={14} style={{ color: alert.resolved ? 'var(--foreground-secondary)' : '#ef4444', flexShrink: 0 }} /> :
                   alert.severity === 'warning' ? <AlertTriangle size={14} style={{ color: alert.resolved ? 'var(--foreground-secondary)' : '#d97706', flexShrink: 0 }} /> :
                   <Activity size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '13px', color: alert.resolved ? 'var(--foreground-secondary)' : 'var(--foreground)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{alert.message}</p>
                    <p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--foreground-secondary)' }}>{alert.time}</p>
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
