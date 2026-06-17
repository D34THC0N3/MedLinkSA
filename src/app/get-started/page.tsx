'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { HeartPulse, UserCircle, Stethoscope, Building2, ShieldCheck, Lock, X, Sun, Moon } from 'lucide-react';
import { BackgroundCanvas } from '@/components/BackgroundCanvas';

const roles = [
  {
    id: 'patient',
    icon: UserCircle,
    title: "I'm a Patient",
    desc: 'Book appointments, manage prescriptions, access your health records and connect with doctors.',
    href: '/sign-in',
  },
  {
    id: 'provider',
    icon: Stethoscope,
    title: "I'm a Healthcare Provider",
    desc: 'Manage your schedule, patient records, prescriptions and telemedicine consultations.',
    href: '/sign-in',
    note: 'Requires credential verification (1–2 business days)',
  },
  {
    id: 'facility',
    icon: Building2,
    title: "I'm a Facility",
    desc: 'Register your facility, manage departments, staff, beds, appointments and inventory.',
    href: '/sign-in',
    note: 'Requires facility registration documents',
  },
  {
    id: 'admin',
    icon: ShieldCheck,
    title: "I'm an Admin",
    desc: 'Manage platform users, verify providers, monitor system health and platform analytics.',
    href: '#',
    locked: true,
  },
];

const comparisonData = [
  { feature: 'Book appointments', patient: true, provider: true, facility: true, admin: true },
  { feature: 'View prescriptions', patient: true, provider: true, facility: true, admin: true },
  { feature: 'Manage patient records', patient: false, provider: true, facility: true, admin: true },
  { feature: 'Bed management', patient: false, provider: false, facility: true, admin: true },
  { feature: 'Analytics dashboard', patient: false, provider: false, facility: true, admin: true },
  { feature: 'Verification tools', patient: false, provider: false, facility: true, admin: true },
];

export default function GetStartedPage() {
  const { theme, setTheme } = useTheme();
  const [showModal, setShowModal] = useState(false);
  const isLight = theme !== 'dark';

  return (
    <div className="min-h-screen" style={{ background: isLight ? '#E5E5E9' : '#151519' }}>
      <BackgroundCanvas />
      <div className="vignette fixed inset-0 z-[1] pointer-events-none" />
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-8 h-14 nav-glass">
        <Link href="/" className="flex items-center gap-2">
          <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg, #2563EB, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <HeartPulse size={14} className="text-white" />
          </div>
          <span className="font-bold text-sm whitespace-nowrap" style={{ color: isLight ? '#121212' : '#F8FAFC' }}>MedLink SA</span>
        </Link>
        <div className="flex items-center gap-2">
          <a href="/sign-in" className="text-sm px-3 py-1.5 rounded-lg transition-colors hover:bg-white/10" style={{ color: isLight ? 'rgba(18,18,18,0.7)' : 'rgba(248,250,252,0.7)' }}>
            Sign In
          </a>
          <a href="/explore" className="text-sm px-3 py-1.5 rounded-lg transition-colors hover:bg-white/10" style={{ color: isLight ? 'rgba(18,18,18,0.7)' : 'rgba(248,250,252,0.7)' }}>
            Explore
          </a>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="ml-1 p-2 rounded-lg transition-colors hover:bg-white/10" style={{ color: isLight ? 'rgba(18,18,18,0.6)' : 'rgba(248,250,252,0.6)' }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-16 pb-24 relative z-10">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ background: isLight ? 'rgba(37,99,235,0.08)' : 'rgba(37,99,235,0.1)', border: `1px solid ${isLight ? 'rgba(37,99,235,0.15)' : 'rgba(37,99,235,0.2)'}`, color: '#2563EB' }}>
            Step 1 of 3 — Role → <span className="opacity-50" style={{ color: isLight ? '#121212' : '#F8FAFC' }}>Details</span> → <span className="opacity-50" style={{ color: isLight ? '#121212' : '#F8FAFC' }}>Verification</span>
          </div>
          <h1 className="text-4xl font-bold mb-2" style={{ color: isLight ? '#1D1D1F' : '#F8FAFC' }}>Welcome to MedLink SA — How will you use the platform?</h1>
          <p style={{ color: isLight ? '#86868B' : '#9CA3AF' }}>Choose your role to set up the right experience for you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                onClick={() => {
                  if (!role.locked) window.location.href = role.href;
                }}
                className={`relative p-5 rounded-xl cursor-pointer transition-all duration-300 hover:border-[#2563EB] hover:-translate-y-0.5 ${role.locked ? 'opacity-60' : ''}`}
                style={{
                  border: `1px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`,
                  background: isLight ? '#FFFFFF' : 'rgba(255,255,255,0.04)',
                  boxShadow: isLight ? '0 1px 3px rgba(0,0,0,0.06)' : '0 1px 3px rgba(0,0,0,0.2)',
                }}
                onMouseEnter={(e) => {
                  if (!role.locked) {
                    e.currentTarget.style.background = isLight ? 'rgba(37,99,235,0.08)' : 'rgba(59,130,246,0.18)';
                    e.currentTarget.style.boxShadow = isLight ? '0 8px 28px rgba(37,99,235,0.15)' : '0 8px 28px rgba(59,130,246,0.2)';
                    const els = e.currentTarget.querySelectorAll('p, h3, strong, span');
                    els.forEach(el => {
                      (el as HTMLElement).style.color = isLight ? '#1D1D1F' : '#FFFFFF';
                    });
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isLight ? '#FFFFFF' : 'rgba(255,255,255,0.04)';
                  e.currentTarget.style.boxShadow = isLight ? '0 1px 3px rgba(0,0,0,0.06)' : '0 1px 3px rgba(0,0,0,0.2)';
                  const els = e.currentTarget.querySelectorAll('p, h3, strong, span');
                  els.forEach(el => {
                    (el as HTMLElement).style.color = '';
                  });
                }}
              >
                <div className="flex items-center justify-center w-11 h-11 rounded-lg mb-3" style={{ background: isLight ? 'rgba(37,99,235,0.1)' : 'rgba(37,99,235,0.12)', border: `1px solid ${isLight ? 'rgba(37,99,235,0.2)' : 'rgba(37,99,235,0.25)'}` }}>
                  <Icon className="text-[#2563EB]" size={22} />
                </div>
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-lg font-bold" style={{ color: isLight ? '#1D1D1F' : '#F8FAFC' }}>{role.title}</h3>
                  {role.locked && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full border" style={{ background: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)', borderColor: isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)', color: '#2563EB' }} title="Admin accounts require an invitation code">
                      <Lock size={10} /> Invite-only
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: isLight ? '#86868B' : '#9CA3AF' }}>{role.desc}</p>
                {role.note && (
                  <p className="text-xs mt-2 font-medium" style={{ color: isLight ? '#6B7280' : '#6B7280' }}>{role.note}</p>
                )}
                {role.locked && (
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(15,28,46,0.9)', border: `1px solid ${isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.14)'}` }}>
                    <Lock size={14} style={{ color: '#2563EB' }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <Link href="/sign-in" className="text-sm px-4 py-2 rounded-lg transition-colors" style={{ color: isLight ? 'rgba(18,18,18,0.6)' : 'rgba(248,250,252,0.6)', border: `1px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`, background: isLight ? 'rgba(0,0,0,0.02)' : 'transparent' }}>
            Already have an account? Sign in →
          </Link>
          <button
            onClick={() => setShowModal(true)}
            className="text-sm px-4 py-2 rounded-lg transition-colors" style={{ color: isLight ? 'rgba(18,18,18,0.6)' : 'rgba(248,250,252,0.6)', border: `1px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`, background: isLight ? 'rgba(0,0,0,0.02)' : 'transparent' }}
          >
            Not sure which to choose? Read our guide →
          </button>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div
            className="rounded-xl p-6 max-w-lg w-full mx-4 border shadow-xl"
            style={{ background: isLight ? '#FFFFFF' : '#1A2332', borderColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: isLight ? '#1D1D1F' : '#F8FAFC' }}>Role Comparison</h3>
              <button onClick={() => setShowModal(false)} className="p-1" style={{ color: isLight ? '#86868B' : '#9CA3AF' }}>
                <X size={18} />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)' }}>
                    <th className="text-left py-2 pr-4 font-medium" style={{ color: isLight ? '#86868B' : '#9CA3AF' }}>Feature</th>
                    <th className="py-2 px-2 font-medium" style={{ color: '#2563EB' }}>Patient</th>
                    <th className="py-2 px-2 font-medium" style={{ color: '#3B82F6' }}>Provider</th>
                    <th className="py-2 px-2 font-medium" style={{ color: '#8B5CF6' }}>Facility</th>
                    <th className="py-2 px-2 font-medium" style={{ color: '#F59E0B' }}>Admin</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row) => (
                    <tr key={row.feature} className="border-b" style={{ borderColor: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' }}>
                      <td className="py-2.5 pr-4" style={{ color: isLight ? '#1D1D1F' : '#F8FAFC' }}>{row.feature}</td>
                      <td className="py-2.5 px-2 text-center">{row.patient ? <span className="text-green-400">✓</span> : <span className="opacity-40" style={{ color: isLight ? '#121212' : '#F8FAFC' }}>—</span>}</td>
                      <td className="py-2.5 px-2 text-center">{row.provider ? <span className="text-green-400">✓</span> : <span className="opacity-40" style={{ color: isLight ? '#121212' : '#F8FAFC' }}>—</span>}</td>
                      <td className="py-2.5 px-2 text-center">{row.facility ? <span className="text-green-400">✓</span> : <span className="opacity-40" style={{ color: isLight ? '#121212' : '#F8FAFC' }}>—</span>}</td>
                      <td className="py-2.5 px-2 text-center">{row.admin ? <span className="text-green-400">✓</span> : <span className="opacity-40" style={{ color: isLight ? '#121212' : '#F8FAFC' }}>—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs mt-4" style={{ color: isLight ? '#86868B' : '#6B7280' }}>Admin accounts are invite-only. An invitation code is required at registration.</p>
            <button onClick={() => setShowModal(false)} className="btn-primary mt-4 w-full py-2.5 text-sm">
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
