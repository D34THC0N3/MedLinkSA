'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { HeartPulse, UserCircle, Stethoscope, Building2, Store, X, Sun, Moon, User, Shield } from 'lucide-react';
import { BackgroundCanvas } from '@/components/BackgroundCanvas';
import { Toaster, toast } from 'sonner';
import { useAuth } from '@/lib/auth-context';

const roles = [
  {
    id: 'patient',
    icon: UserCircle,
    title: "I'm a Patient",
    desc: 'Book appointments, manage prescriptions, access your health records and connect with doctors.',
    href: '/sign-up',
  },
  {
    id: 'provider',
    icon: Stethoscope,
    title: "I'm a Healthcare Provider",
    desc: 'Manage your schedule, patient records, prescriptions and telemedicine consultations.',
    href: '/sign-up',
    note: 'Requires credential verification (1–2 business days)',
  },
  {
    id: 'facility',
    icon: Building2,
    title: "I'm a Facility",
    desc: 'Register your facility, manage departments, staff, beds, appointments and inventory.',
    href: '/sign-up',
    note: 'Requires facility registration documents',
  },
  {
    id: 'pharmacy',
    icon: Store,
    title: "I'm a Pharmacy",
    desc: 'Process digital prescriptions, manage inventory, verify and fulfill orders.',
    href: '/sign-up',
    note: 'Pharmacy license verification required',
  },
];

export default function GetStartedPage() {
  const { theme, setTheme } = useTheme();
  const { devLogin } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [devLoading, setDevLoading] = useState(false);
  const [showDevModal, setShowDevModal] = useState(false);
  const isLight = theme !== 'dark';

  useEffect(() => { setMounted(true); }, []);

  const handleDevLogin = async () => {
    setDevLoading(true);
    try {
      await devLogin();
      toast.success('Dev mode activated');
      window.location.href = '/admin/dashboard';
    } catch {
      toast.error('Dev login failed');
    } finally {
      setDevLoading(false);
      setShowDevModal(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: isLight ? '#E5E5E9' : '#151519' }}>
      <Toaster position="top-center" />
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
          <Link href="/sign-in" className="text-sm px-3 py-1.5 rounded-lg transition-colors hover:bg-white/10" style={{ color: isLight ? 'rgba(18,18,18,0.7)' : 'rgba(248,250,252,0.7)' }}>
            Sign In
          </Link>
          <Link href="/explore" className="text-sm px-3 py-1.5 rounded-lg transition-colors hover:bg-white/10" style={{ color: isLight ? 'rgba(18,18,18,0.7)' : 'rgba(248,250,252,0.7)' }}>
            Explore
          </Link>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="ml-1 p-2 rounded-lg transition-colors hover:bg-white/10" style={{ color: isLight ? 'rgba(18,18,18,0.6)' : 'rgba(248,250,252,0.6)' }}
          >
            {mounted ? (theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />) : <div style={{ width: 16, height: 16 }} />}
          </button>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 pt-16 pb-24 relative z-10">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ background: isLight ? 'rgba(37,99,235,0.08)' : 'rgba(37,99,235,0.1)', border: `1px solid ${isLight ? 'rgba(37,99,235,0.15)' : 'rgba(37,99,235,0.2)'}`, color: '#2563EB' }}>
            Choose your role to get started
          </div>
          <h1 className="text-4xl font-bold mb-2 heading-text" style={{ color: isLight ? '#1D1D1F' : '#F8FAFC' }}>Welcome to MedLink SA — How will you use the platform?</h1>
          <p style={{ color: isLight ? '#86868B' : '#9CA3AF' }}>Choose your role to set up the right experience for you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Link key={role.id} href={`/sign-up?role=${role.id}`}
                className="relative p-5 rounded-xl cursor-pointer transition-all duration-300 hover:border-[#2563EB] hover:-translate-y-0.5"
                style={{
                  border: `1px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`,
                  background: isLight ? '#FFFFFF' : 'rgba(255,255,255,0.04)',
                  boxShadow: isLight ? '0 1px 3px rgba(0,0,0,0.06)' : '0 1px 3px rgba(0,0,0,0.2)',
                }}>
                <div className="flex items-center justify-center w-11 h-11 rounded-lg mb-3" style={{ background: isLight ? 'rgba(37,99,235,0.1)' : 'rgba(37,99,235,0.12)', border: `1px solid ${isLight ? 'rgba(37,99,235,0.2)' : 'rgba(37,99,235,0.25)'}` }}>
                  <Icon className="text-[#2563EB]" size={22} />
                </div>
                <h3 className="text-lg font-bold mb-1.5" style={{ color: isLight ? '#1D1D1F' : '#F8FAFC' }}>{role.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: isLight ? '#86868B' : '#9CA3AF' }}>{role.desc}</p>
                {role.note && (
                  <p className="text-xs mt-2 font-medium" style={{ color: isLight ? '#6B7280' : '#6B7280' }}>{role.note}</p>
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <Link href="/sign-in" className="text-sm px-4 py-2 rounded-lg transition-colors" style={{ color: isLight ? 'rgba(18,18,18,0.6)' : 'rgba(248,250,252,0.6)', border: `1px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`, background: isLight ? 'rgba(0,0,0,0.02)' : 'transparent' }}>
            Already have an account? Sign in →
          </Link>
          <button onClick={() => setShowModal(true)}
            className="text-sm px-4 py-2 rounded-lg transition-colors" style={{ color: isLight ? 'rgba(18,18,18,0.6)' : 'rgba(248,250,252,0.6)', border: `1px solid ${isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)'}`, background: isLight ? 'rgba(0,0,0,0.02)' : 'transparent' }}>
            Not sure which to choose? Read our guide →
          </button>
          <button onClick={() => setShowDevModal(true)}
            className="text-sm px-4 py-2 rounded-lg transition-colors" style={{ color: '#F59E0B', border: '1px solid #F59E0B', background: isLight ? 'rgba(245,158,11,0.06)' : 'rgba(245,158,11,0.1)' }}>
            <Shield size={14} className="inline mr-1" />Dev Login
          </button>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="rounded-xl p-6 max-w-lg w-full mx-4 border shadow-xl card"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Choose Your Role</h3>
              <button onClick={() => setShowModal(false)} className="p-1" style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
            </div>
            <div className="space-y-3">
              {roles.map(r => (
                <div key={r.id} className="flex items-start gap-3 p-3 rounded-lg" style={{ background: 'var(--accent-light)' }}>
                  <r.icon size={20} className="text-[#2563EB] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-sm block" style={{ color: 'var(--text-primary)' }}>{r.title.replace("I'm a ", '')}</strong>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setShowModal(false)} className="btn-primary mt-4 w-full py-2.5 text-sm">Got it</button>
          </div>
        </div>
      )}

      {showDevModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowDevModal(false)}>
          <div className="rounded-xl p-6 max-w-sm w-full mx-4 border shadow-xl card"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Development Login</h3>
              <button onClick={() => setShowDevModal(false)} className="p-1" style={{ color: 'var(--text-muted)' }}><X size={18} /></button>
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
              Bypass registration and access the platform as an administrator for testing purposes.
            </p>
            <div className="p-3 rounded-lg mb-4" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <p className="text-xs font-medium" style={{ color: '#F59E0B' }}>
                ⚠ This is only available in development environments. Never exposed in production.
              </p>
            </div>
            <button onClick={handleDevLogin} disabled={devLoading} className="btn-primary w-full py-2.5 text-sm"
              style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)', border: 'none', color: '#fff' }}>
              {devLoading ? 'Activating...' : 'Activate Dev Mode'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
