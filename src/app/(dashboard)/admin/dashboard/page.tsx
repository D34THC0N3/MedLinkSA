'use client';

import { useState } from 'react';
import {
  Users, UserCheck, Calendar, Pill, Building2, Activity,
  TrendingUp, ArrowUpRight, Shield, Clock, CheckCircle,
  AlertTriangle, X, Circle
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const userGrowthData = [
  { month: 'Jan', patients: 2800, providers: 320 },
  { month: 'Feb', patients: 3200, providers: 350 },
  { month: 'Mar', patients: 4100, providers: 380 },
  { month: 'Apr', patients: 4800, providers: 420 },
  { month: 'May', patients: 5500, providers: 470 },
  { month: 'Jun', patients: 6200, providers: 510 },
  { month: 'Jul', patients: 7000, providers: 560 },
  { month: 'Aug', patients: 7800, providers: 610 },
  { month: 'Sep', patients: 8500, providers: 670 },
  { month: 'Oct', patients: 9400, providers: 730 },
  { month: 'Nov', patients: 10200, providers: 800 },
  { month: 'Dec', patients: 11200, providers: 880 },
];

const appointmentVolumeData = [
  { month: 'Jan', 'In-Person': 420, 'Telehealth': 180 },
  { month: 'Feb', 'In-Person': 450, 'Telehealth': 210 },
  { month: 'Mar', 'In-Person': 500, 'Telehealth': 260 },
  { month: 'Apr', 'In-Person': 540, 'Telehealth': 310 },
  { month: 'May', 'In-Person': 590, 'Telehealth': 370 },
  { month: 'Jun', 'In-Person': 650, 'Telehealth': 420 },
  { month: 'Jul', 'In-Person': 700, 'Telehealth': 480 },
  { month: 'Aug', 'In-Person': 760, 'Telehealth': 530 },
  { month: 'Sep', 'In-Person': 820, 'Telehealth': 590 },
  { month: 'Oct', 'In-Person': 890, 'Telehealth': 650 },
  { month: 'Nov', 'In-Person': 950, 'Telehealth': 720 },
  { month: 'Dec', 'In-Person': 1020, 'Telehealth': 800 },
];

interface VerificationItem {
  id: string;
  name: string;
  credential: string;
  licenseStatus: 'verified' | 'pending' | 'rejected';
  backgroundCheck: 'clear' | 'pending' | 'flag';
}

interface AlertItem {
  id: string;
  message: string;
  time: string;
  severity: 'warning' | 'critical';
  resolved: boolean;
}

interface LogItem {
  id: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning';
}

export default function AdminDashboard() {
  const [verificationList, setVerificationList] = useState<VerificationItem[]>([
    { id: 'v1', name: 'Dr. Sarah Johnson', credential: 'MBBS, University of Cape Town', licenseStatus: 'pending', backgroundCheck: 'clear' },
    { id: 'v2', name: 'Dr. Michael Chen', credential: 'MD, Stellenbosch University', licenseStatus: 'verified', backgroundCheck: 'clear' },
    { id: 'v3', name: 'Dr. Amara Okafor', credential: 'MBBS, University of Ibadan', licenseStatus: 'pending', backgroundCheck: 'pending' },
    { id: 'v4', name: 'Dr. James Mwangi', credential: 'MD, University of Nairobi', licenseStatus: 'rejected', backgroundCheck: 'flag' },
    { id: 'v5', name: 'Lakeside Medical Center', credential: 'Facility License — Level 2', licenseStatus: 'pending', backgroundCheck: 'clear' },
  ]);

  const [alerts, setAlerts] = useState<AlertItem[]>([
    { id: 'a1', message: 'Database query latency exceeding 500ms threshold', time: '2 min ago', severity: 'warning', resolved: false },
    { id: 'a2', message: 'SSL certificate expiring in 7 days for api.serenity.com', time: '15 min ago', severity: 'critical', resolved: false },
    { id: 'a3', message: 'Email delivery queue backlog — 143 messages pending', time: '1 hr ago', severity: 'warning', resolved: false },
    { id: 'a4', message: 'Backup job failed — disk space critical on primary node', time: '3 hr ago', severity: 'critical', resolved: true },
    { id: 'a5', message: 'Appointment API response time spike detected (>1.2s)', time: '5 hr ago', severity: 'warning', resolved: false },
  ]);

  const securityLogs: LogItem[] = [
    { id: 'l1', message: 'User admin@serenity.com authenticated from IP 203.0.113.42', time: '2 min ago', type: 'info' },
    { id: 'l2', message: 'Failed login attempt for user billing@clinic.org (3 attempts)', time: '8 min ago', type: 'warning' },
    { id: 'l3', message: 'Provider credential verification approved — Dr. Sarah Johnson', time: '22 min ago', type: 'success' },
    { id: 'l4', message: 'New facility registration completed — Lakeside Medical Center', time: '1 hr ago', type: 'info' },
    { id: 'l5', message: 'Unusual access pattern detected from IP 198.51.100.7', time: '2 hr ago', type: 'warning' },
  ];

  const handleVerify = (id: string) => {
    setVerificationList(prev => prev.map(item =>
      item.id === id ? { ...item, licenseStatus: 'verified' as const } : item
    ));
  };

  const handleReject = (id: string) => {
    setVerificationList(prev => prev.map(item =>
      item.id === id ? { ...item, licenseStatus: 'rejected' as const } : item
    ));
  };

  const handleResolve = (id: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === id ? { ...alert, resolved: true } : alert
    ));
  };

  const getLicensePillClass = (status: string) => {
    switch (status) {
      case 'verified': return 'pill-badge pill-green';
      case 'pending': return 'pill-badge pill-amber';
      case 'rejected': return 'pill-badge pill-red';
      default: return 'pill-badge';
    }
  };

  const getBgPillClass = (status: string) => {
    switch (status) {
      case 'clear': return 'pill-badge pill-green';
      case 'pending': return 'pill-badge pill-amber';
      case 'flag': return 'pill-badge pill-red';
      default: return 'pill-badge';
    }
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle size={14} style={{ color: 'var(--stat-teal)' }} />;
      case 'warning': return <AlertTriangle size={14} style={{ color: 'var(--stat-amber)' }} />;
      default: return <Circle size={14} style={{ color: 'var(--accent)' }} />;
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full">
        <h1 className="section-title text-xl sm:text-2xl md:text-[28px] font-semibold mb-1" style={{ color: 'var(--foreground)' }}>
          Admin Dashboard
        </h1>
        <p className="text-sm md:text-base mb-5 sm:mb-7" style={{ color: 'var(--foreground-secondary)' }}>
          Platform overview and system management
        </p>

        {/* ── Stat Row (responsive grid) ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-5 sm:mb-7">
          <div
            className="stat-card"
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <Users size={20} style={{ color: 'var(--stat-teal)' }} />
              <ArrowUpRight size={14} style={{ color: 'var(--stat-teal)' }} />
            </div>
            <p
              className="stat-value"
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: 'var(--foreground)',
                margin: '0 0 4px',
              }}
            >
              17,000+
            </p>
            <p
              className="stat-label"
              style={{
                fontSize: '13px',
                color: 'var(--foreground-secondary)',
                margin: 0,
              }}
            >
              Total Active Users
            </p>
          </div>

          <div
            className="stat-card"
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <UserCheck size={20} style={{ color: 'var(--accent)' }} />
              <ArrowUpRight size={14} style={{ color: 'var(--accent)' }} />
            </div>
            <p
              className="stat-value"
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: 'var(--foreground)',
                margin: '0 0 4px',
              }}
            >
              9
            </p>
            <p
              className="stat-label"
              style={{
                fontSize: '13px',
                color: 'var(--foreground-secondary)',
                margin: 0,
              }}
            >
              New Provider Signups
            </p>
          </div>

          <div
            className="stat-card"
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <Calendar size={20} style={{ color: 'var(--stat-teal)' }} />
              <ArrowUpRight size={14} style={{ color: 'var(--stat-teal)' }} />
            </div>
            <p
              className="stat-value"
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: 'var(--foreground)',
                margin: '0 0 4px',
              }}
            >
              1,923k
            </p>
            <p
              className="stat-label"
              style={{
                fontSize: '13px',
                color: 'var(--foreground-secondary)',
                margin: 0,
              }}
            >
              Appointments Booked
            </p>
          </div>

          <div
            className="stat-card"
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <Pill size={20} style={{ color: 'var(--accent)' }} />
              <ArrowUpRight size={14} style={{ color: 'var(--accent)' }} />
            </div>
            <p
              className="stat-value"
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: 'var(--foreground)',
                margin: '0 0 4px',
              }}
            >
              59,400
            </p>
            <p
              className="stat-label"
              style={{
                fontSize: '13px',
                color: 'var(--foreground-secondary)',
                margin: 0,
              }}
            >
              Prescriptions Fulfilled
            </p>
          </div>

          <div
            className="stat-card"
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <Building2 size={20} style={{ color: 'var(--stat-teal)' }} />
              <ArrowUpRight size={14} style={{ color: 'var(--stat-teal)' }} />
            </div>
            <p
              className="stat-value"
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: 'var(--foreground)',
                margin: '0 0 4px',
              }}
            >
              40
            </p>
            <p
              className="stat-label"
              style={{
                fontSize: '13px',
                color: 'var(--foreground-secondary)',
                margin: 0,
              }}
            >
              Active Facilities
            </p>
          </div>

          <div
            className="stat-card"
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--card-border)',
              borderRadius: '12px',
              padding: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <Activity size={20} style={{ color: 'var(--stat-amber)' }} />
              <ArrowUpRight size={14} style={{ color: 'var(--stat-amber)' }} />
            </div>
            <p
              className="stat-value"
              style={{
                fontSize: '28px',
                fontWeight: 700,
                color: 'var(--foreground)',
                margin: '0 0 4px',
              }}
            >
              99.9%
            </p>
            <p
              className="stat-label"
              style={{
                fontSize: '13px',
                color: 'var(--foreground-secondary)',
                margin: 0,
              }}
            >
              System Uptime
            </p>
          </div>
        </div>

        {/* ── Responsive Two Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-4 lg:gap-5">
          {/* ══ LEFT COLUMN (60%) ══ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Platform Analytics */}
            <div
              className="card"
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '14px',
                overflow: 'hidden',
              }}
            >
              <div
                className="card-header"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px 24px 0',
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: '17px',
                      fontWeight: 600,
                      color: 'var(--foreground)',
                      margin: 0,
                    }}
                  >
                    Platform Analytics
                  </h2>
                  <p
                    style={{
                      fontSize: '13px',
                      color: 'var(--foreground-secondary)',
                      margin: '2px 0 0',
                    }}
                  >
                    User growth and appointment volume trends
                  </p>
                </div>
                <button
                  className="btn-ghost"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '13px',
                    color: 'var(--accent)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '6px 12px',
                    borderRadius: '8px',
                  }}
                >
                  <TrendingUp size={14} />
                  View Reports
                </button>
              </div>
              <div className="card-body" style={{ padding: '20px 24px' }}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {/* AreaChart - User Growth */}
                  <div>
                    <p
                      style={{
                        fontSize: '13px',
                        fontWeight: 500,
                        color: 'var(--foreground-secondary)',
                        marginBottom: '12px',
                      }}
                    >
                      User Growth
                    </p>
                    <div style={{ height: '200px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={userGrowthData}>
                          <defs>
                            <linearGradient id="userPatients" x1="0" y1="0" x2="0" y2="1">
                              <stop
                                offset="5%"
                                stopColor="var(--stat-teal)"
                                stopOpacity={0.25}
                              />
                              <stop
                                offset="95%"
                                stopColor="var(--stat-teal)"
                                stopOpacity={0}
                              />
                            </linearGradient>
                            <linearGradient id="userProviders" x1="0" y1="0" x2="0" y2="1">
                              <stop
                                offset="5%"
                                stopColor="var(--accent)"
                                stopOpacity={0.25}
                              />
                              <stop
                                offset="95%"
                                stopColor="var(--accent)"
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--card-border)"
                          />
                          <XAxis
                            dataKey="month"
                            tick={{
                              fontSize: 11,
                              fill: 'var(--foreground-secondary)',
                            }}
                          />
                          <YAxis
                            tick={{
                              fontSize: 11,
                              fill: 'var(--foreground-secondary)',
                            }}
                          />
                          <Tooltip
                            contentStyle={{
                              borderRadius: '8px',
                              border: '1px solid var(--card-border)',
                              background: 'var(--card-bg)',
                              color: 'var(--foreground)',
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="patients"
                            stroke="var(--stat-teal)"
                            fillOpacity={1}
                            fill="url(#userPatients)"
                            strokeWidth={2}
                          />
                          <Area
                            type="monotone"
                            dataKey="providers"
                            stroke="var(--accent)"
                            fillOpacity={1}
                            fill="url(#userProviders)"
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '16px',
                        marginTop: '10px',
                        justifyContent: 'center',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: 'var(--stat-teal)',
                          }}
                        />
                        <span style={{ fontSize: '12px', color: 'var(--foreground-secondary)' }}>
                          Patients
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: 'var(--accent)',
                          }}
                        />
                        <span style={{ fontSize: '12px', color: 'var(--foreground-secondary)' }}>
                          Providers
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* BarChart - Appointment Volume */}
                  <div>
                    <p
                      style={{
                        fontSize: '13px',
                        fontWeight: 500,
                        color: 'var(--foreground-secondary)',
                        marginBottom: '12px',
                      }}
                    >
                      Appointment Volume
                    </p>
                    <div style={{ height: '200px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={appointmentVolumeData}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="var(--card-border)"
                          />
                          <XAxis
                            dataKey="month"
                            tick={{
                              fontSize: 11,
                              fill: 'var(--foreground-secondary)',
                            }}
                          />
                          <YAxis
                            tick={{
                              fontSize: 11,
                              fill: 'var(--foreground-secondary)',
                            }}
                          />
                          <Tooltip
                            contentStyle={{
                              borderRadius: '8px',
                              border: '1px solid var(--card-border)',
                              background: 'var(--card-bg)',
                              color: 'var(--foreground)',
                            }}
                          />
                          <Bar
                            dataKey="In-Person"
                            fill="var(--stat-teal)"
                            radius={[4, 4, 0, 0]}
                          />
                          <Bar
                            dataKey="Telehealth"
                            fill="var(--accent-light)"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '16px',
                        marginTop: '10px',
                        justifyContent: 'center',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: 'var(--stat-teal)',
                          }}
                        />
                        <span style={{ fontSize: '12px', color: 'var(--foreground-secondary)' }}>
                          In-Person
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            background: 'var(--accent-light)',
                          }}
                        />
                        <span style={{ fontSize: '12px', color: 'var(--foreground-secondary)' }}>
                          Telehealth
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Audit Logs */}
            <div
              className="card"
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '14px',
                overflow: 'hidden',
              }}
            >
              <div
                className="card-header"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px 24px 0',
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: '17px',
                      fontWeight: 600,
                      color: 'var(--foreground)',
                      margin: 0,
                    }}
                  >
                    Security Audit Logs
                  </h2>
                  <p
                    style={{
                      fontSize: '13px',
                      color: 'var(--foreground-secondary)',
                      margin: '2px 0 0',
                    }}
                  >
                    Recent authentication and system events
                  </p>
                </div>
                <Shield size={18} style={{ color: 'var(--foreground-secondary)' }} />
              </div>
              <div className="card-body" style={{ padding: '16px 24px 8px' }}>
                {securityLogs.map((log) => {
                  const isLast = log.id === securityLogs[securityLogs.length - 1].id;
                  return (
                    <div
                      key={log.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 0',
                        borderBottom: isLast
                          ? 'none'
                          : '1px solid var(--card-border)',
                      }}
                    >
                      <div
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background:
                            log.type === 'success'
                              ? 'rgba(52, 211, 153, 0.12)'
                              : log.type === 'warning'
                                ? 'rgba(251, 191, 36, 0.12)'
                                : 'rgba(59, 130, 246, 0.1)',
                        }}
                      >
                        {getLogIcon(log.type)}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: '13px',
                            color: 'var(--foreground)',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {log.message}
                        </p>
                      </div>
                      <span
                        style={{
                          fontSize: '12px',
                          color: 'var(--foreground-secondary)',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                        }}
                      >
                        {log.time}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div
                className="card-footer"
                style={{
                  padding: '12px 24px',
                  borderTop: '1px solid var(--card-border)',
                  textAlign: 'center',
                }}
              >
                <button
                  className="btn-ghost"
                  style={{
                    fontSize: '13px',
                    color: 'var(--accent)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}
                >
                  View All Logs →
                </button>
              </div>
            </div>
          </div>

          {/* ══ RIGHT COLUMN (40%) ══ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Verification Queue */}
            <div
              className="card"
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '14px',
                overflow: 'hidden',
              }}
            >
              <div
                className="card-header"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px 20px 0',
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: '17px',
                      fontWeight: 600,
                      color: 'var(--foreground)',
                      margin: 0,
                    }}
                  >
                    Verification Queue
                  </h2>
                  <p
                    style={{
                      fontSize: '13px',
                      color: 'var(--foreground-secondary)',
                      margin: '2px 0 0',
                    }}
                  >
                    Pending provider and facility reviews
                  </p>
                </div>
                <span
                  className="pill-badge pill-amber"
                  style={{
                    fontSize: '11px',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    background: 'rgba(251, 191, 36, 0.15)',
                    color: '#d97706',
                    fontWeight: 500,
                  }}
                >
                  {verificationList.filter((v) => v.licenseStatus === 'pending').length} pending
                </span>
              </div>
              <div className="card-body" style={{ padding: '12px 0 0', overflowX: 'auto' }}>
                <table
                  className="table-apple"
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    fontSize: '13px',
                  }}
                >
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--card-border)' }}>
                      <th
                        style={{
                          textAlign: 'left',
                          padding: '8px 16px',
                          color: 'var(--foreground-secondary)',
                          fontWeight: 500,
                          fontSize: '11px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Name
                      </th>
                      <th
                        style={{
                          textAlign: 'left',
                          padding: '8px 8px',
                          color: 'var(--foreground-secondary)',
                          fontWeight: 500,
                          fontSize: '11px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Credential
                      </th>
                      <th
                        style={{
                          textAlign: 'left',
                          padding: '8px 8px',
                          color: 'var(--foreground-secondary)',
                          fontWeight: 500,
                          fontSize: '11px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        License
                      </th>
                      <th
                        style={{
                          textAlign: 'left',
                          padding: '8px 8px',
                          color: 'var(--foreground-secondary)',
                          fontWeight: 500,
                          fontSize: '11px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Background
                      </th>
                      <th
                        style={{
                          textAlign: 'right',
                          padding: '8px 16px',
                          color: 'var(--foreground-secondary)',
                          fontWeight: 500,
                          fontSize: '11px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {verificationList.map((item) => (
                      <tr
                        key={item.id}
                        style={{ borderBottom: '1px solid var(--card-border)' }}
                      >
                        <td style={{ padding: '12px 16px' }}>
                          <p
                            style={{
                              margin: 0,
                              fontSize: '13px',
                              fontWeight: 500,
                              color: 'var(--foreground)',
                            }}
                          >
                            {item.name}
                          </p>
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <p
                            style={{
                              margin: 0,
                              fontSize: '12px',
                              color: 'var(--foreground-secondary)',
                            }}
                          >
                            {item.credential}
                          </p>
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <span
                            className={getLicensePillClass(item.licenseStatus)}
                            style={{
                              fontSize: '11px',
                              padding: '2px 8px',
                              borderRadius: '10px',
                              fontWeight: 500,
                              display: 'inline-block',
                            }}
                          >
                            {item.licenseStatus}
                          </span>
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <span
                            className={getBgPillClass(item.backgroundCheck)}
                            style={{
                              fontSize: '11px',
                              padding: '2px 8px',
                              borderRadius: '10px',
                              fontWeight: 500,
                              display: 'inline-block',
                            }}
                          >
                            {item.backgroundCheck}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                          {item.licenseStatus === 'pending' ? (
                            <div
                              style={{
                                display: 'flex',
                                gap: '6px',
                                justifyContent: 'flex-end',
                              }}
                            >
                              <button
                                className="btn-primary"
                                onClick={() => handleVerify(item.id)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '6px 12px',
                                  fontSize: '12px',
                                  fontWeight: 500,
                                  border: 'none',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  background: 'var(--accent)',
                                  color: '#fff',
                                }}
                              >
                                <CheckCircle size={12} />
                                Approve
                              </button>
                              <button
                                className="btn-outline"
                                onClick={() => handleReject(item.id)}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  padding: '6px 12px',
                                  fontSize: '12px',
                                  fontWeight: 500,
                                  border: '1px solid var(--card-border)',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  background: 'transparent',
                                  color: 'var(--foreground-secondary)',
                                }}
                              >
                                <X size={12} />
                                Reject
                              </button>
                            </div>
                          ) : (
                            <span
                              style={{
                                fontSize: '12px',
                                fontWeight: 500,
                                color:
                                  item.licenseStatus === 'verified'
                                    ? 'var(--stat-teal)'
                                    : '#dc2626',
                              }}
                            >
                              {item.licenseStatus === 'verified' ? 'Approved' : 'Rejected'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* System Health Alerts */}
            <div
              className="card"
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: '14px',
                overflow: 'hidden',
              }}
            >
              <div
                className="card-header"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '20px 20px 0',
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: '17px',
                      fontWeight: 600,
                      color: 'var(--foreground)',
                      margin: 0,
                    }}
                  >
                    System Health Alerts
                  </h2>
                  <p
                    style={{
                      fontSize: '13px',
                      color: 'var(--foreground-secondary)',
                      margin: '2px 0 0',
                    }}
                  >
                    Active infrastructure notifications
                  </p>
                </div>
                <span
                  className="pill-badge pill-amber"
                  style={{
                    fontSize: '11px',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    background: 'rgba(251, 191, 36, 0.15)',
                    color: '#d97706',
                    fontWeight: 500,
                  }}
                >
                  {alerts.filter((a) => !a.resolved).length} active
                </span>
              </div>
              <div className="card-body" style={{ padding: '8px 0 0' }}>
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 20px',
                      borderBottom: '1px solid var(--card-border)',
                      opacity: alert.resolved ? 0.5 : 1,
                      textDecoration: alert.resolved ? 'line-through' : 'none',
                    }}
                  >
                    <AlertTriangle
                      size={16}
                      style={{
                        color: alert.resolved
                          ? 'var(--foreground-secondary)'
                          : alert.severity === 'critical'
                            ? '#dc2626'
                            : '#d97706',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: '13px',
                          color: alert.resolved
                            ? 'var(--foreground-secondary)'
                            : 'var(--foreground)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {alert.message}
                      </p>
                      <p
                        style={{
                          margin: '2px 0 0',
                          fontSize: '11px',
                          color: 'var(--foreground-secondary)',
                        }}
                      >
                        {alert.time}
                      </p>
                    </div>
                    {!alert.resolved && (
                      <button
                        className="btn-outline"
                        onClick={() => handleResolve(alert.id)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '5px 10px',
                          fontSize: '11px',
                          fontWeight: 500,
                          border: '1px solid var(--card-border)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          background: 'transparent',
                          color: 'var(--accent)',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                        }}
                      >
                        <CheckCircle size={11} />
                        Resolve
                      </button>
                    )}
                    {alert.resolved && (
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 500,
                          color: 'var(--stat-teal)',
                          flexShrink: 0,
                        }}
                      >
                        Resolved
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
