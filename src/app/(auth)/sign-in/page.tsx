'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { HeartPulse, Eye, EyeOff, Sun, Moon, User, Stethoscope, Building2, Store, Shield, LogIn, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { BackgroundCanvas } from '@/components/BackgroundCanvas';
import { Toaster, toast } from 'sonner';

const roles = [
  { id: 'patient', label: 'Patient', icon: User },
  { id: 'provider', label: 'Doctor', icon: Stethoscope },
  { id: 'facility', label: 'Hospital', icon: Building2 },
  { id: 'pharmacy', label: 'Pharmacy', icon: Store },
  { id: 'admin', label: 'Admin', icon: Shield },
];

const roleRedirects: Record<string, string> = {
  patient: '/patient/dashboard',
  provider: '/doctor/dashboard',
  facility: '/hospital/dashboard',
  pharmacy: '/pharmacy/dashboard',
  admin: '/admin/dashboard',
};

export default function SignInPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState('patient');
  const { signIn } = useAuth();
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  const isLight = theme !== 'dark';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email.trim(), password, selectedRole);
      toast.success('Signed in successfully');
      setTimeout(() => router.push(roleRedirects[selectedRole] || '/patient/dashboard'), 500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid credentials';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (email: string, role: string) => {
    setLoading(true);
    setSelectedRole(role);
    try {
      await signIn(email, '12345678', role);
      toast.success(`Signed in as ${roles.find(r => r.id === role)?.label}`);
      setTimeout(() => router.push(roleRedirects[role] || '/patient/dashboard'), 500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ background: isLight ? '#E5E5E9' : '#151519' }}>
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
          <Link href="/get-started" className="text-sm px-3 py-1.5 rounded-lg transition-colors hover:bg-white/10" style={{ color: isLight ? 'rgba(18,18,18,0.7)' : 'rgba(248,250,252,0.7)' }}>
            Get Started
          </Link>
          <Link href="/explore" className="hidden sm:inline text-sm px-3 py-1.5 rounded-lg transition-colors hover:bg-white/10" style={{ color: isLight ? 'rgba(18,18,18,0.7)' : 'rgba(248,250,252,0.7)' }}>
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

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 relative z-10 py-24">
        <div className="w-full max-w-sm">
          <h1 className="text-xl sm:text-2xl font-bold mb-1 heading-text" style={{ color: isLight ? '#1D1D1F' : '#F8FAFC' }}>Welcome back</h1>
          <p className="text-sm mb-6" style={{ color: isLight ? '#86868B' : '#9CA3AF' }}>Select your role and sign in to continue</p>

          <div className="grid grid-cols-5 gap-1.5 sm:gap-2 mb-6">
            {roles.map((r) => {
              const Icon = r.icon;
              const active = selectedRole === r.id;
              return (
                <button key={r.id} onClick={() => setSelectedRole(r.id)}
                  className="flex flex-col items-center gap-1 py-2 sm:py-2.5 px-1 rounded-xl text-[9px] sm:text-[10px] font-medium transition-all"
                  style={{
                    background: active ? (isLight ? 'rgba(37,99,235,0.1)' : 'rgba(59,130,246,0.15)') : 'transparent',
                    border: `1px solid ${active ? '#2563EB' : isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.08)'}`,
                    color: active ? '#2563EB' : isLight ? '#86868B' : '#9CA3AF',
                  }}>
                  <Icon size={18} />
                  {r.label}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: isLight ? '#3A3A3C' : '#D1D5DB' }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-lg text-sm border outline-none transition-all"
                style={{ color: isLight ? '#1D1D1F' : '#F8FAFC', background: 'var(--input-bg)', borderColor: 'var(--input-border)' }} required />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block" style={{ color: isLight ? '#3A3A3C' : '#D1D5DB' }}>Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-3.5 py-2.5 pr-10 rounded-lg text-sm border outline-none transition-all"
                  style={{ color: isLight ? '#1D1D1F' : '#F8FAFC', background: 'var(--input-bg)', borderColor: 'var(--input-border)' }} required />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: isLight ? '#86868B' : '#6B7280' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : `Sign In as ${roles.find(r => r.id === selectedRole)?.label}`}
            </button>
          </form>

          <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--card-border)' }}>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3 text-center" style={{ color: 'var(--text-muted)' }}>Quick Test Login</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => quickLogin('Patient@gmail.com', 'patient')} disabled={loading}
                className="flex items-center justify-center gap-1.5 text-[11px] px-2 py-2 rounded-lg transition-all"
                style={{ background: isLight ? 'rgba(37,99,235,0.08)' : 'rgba(59,130,246,0.1)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}>
                <User size={12} /> Patient
              </button>
              <button onClick={() => quickLogin('Doctor@gmail.com', 'provider')} disabled={loading}
                className="flex items-center justify-center gap-1.5 text-[11px] px-2 py-2 rounded-lg transition-all"
                style={{ background: isLight ? 'rgba(37,99,235,0.08)' : 'rgba(59,130,246,0.1)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}>
                <Stethoscope size={12} /> Doctor
              </button>
              <button onClick={() => quickLogin('Hospital@gmail.com', 'facility')} disabled={loading}
                className="flex items-center justify-center gap-1.5 text-[11px] px-2 py-2 rounded-lg transition-all"
                style={{ background: isLight ? 'rgba(37,99,235,0.08)' : 'rgba(59,130,246,0.1)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}>
                <Building2 size={12} /> Hospital
              </button>
              <button onClick={() => quickLogin('Pharmacy@gmail.com', 'pharmacy')} disabled={loading}
                className="flex items-center justify-center gap-1.5 text-[11px] px-2 py-2 rounded-lg transition-all"
                style={{ background: isLight ? 'rgba(37,99,235,0.08)' : 'rgba(59,130,246,0.1)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}>
                <Store size={12} /> Pharmacy
              </button>
            </div>
            <p className="text-[10px] text-center mt-2" style={{ color: 'var(--text-disabled)' }}>Password: 12345678</p>
          </div>

          <p className="text-sm text-center mt-6" style={{ color: isLight ? '#86868B' : '#6B7280' }}>
            Don&apos;t have an account?{' '}
            <Link href="/get-started" className="font-medium hover:opacity-80" style={{ color: '#2563EB' }}>
              Get started
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center p-8 lg:p-12 relative z-10" style={{ background: isLight ? 'rgba(220,220,226,0.6)' : 'rgba(15,15,20,0.6)', backdropFilter: 'blur(12px)' }}>
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6" style={{ background: isLight ? 'rgba(37,99,235,0.08)' : 'rgba(37,99,235,0.1)', border: `1px solid ${isLight ? 'rgba(37,99,235,0.15)' : 'rgba(37,99,235,0.2)'}` }}>
            <HeartPulse style={{ color: '#2563EB' }} size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: isLight ? '#1D1D1F' : '#F8FAFC' }}>Your Health, Connected</h2>
          <p className="text-sm leading-relaxed" style={{ color: isLight ? '#86868B' : '#9CA3AF' }}>
            Access your appointments, prescriptions, records, and telemedicine consultations from one secure platform.
          </p>
          <div className="mt-6 space-y-2 text-left">
            {[
              { role: 'Patient', desc: 'Manage appointments, prescriptions, records' },
              { role: 'Doctor', desc: 'View schedules, patients, clinical notes' },
              { role: 'Hospital', desc: 'Manage beds, staffing, departments' },
              { role: 'Pharmacy', desc: 'Process prescriptions, manage inventory' },
              { role: 'Admin', desc: 'System oversight, analytics, verifications' },
            ].map((item) => (
              <div key={item.role} className="flex items-center gap-2 text-sm" style={{ color: isLight ? '#6B7280' : '#9CA3AF' }}>
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#2563EB' }} />
                <span className="font-medium" style={{ color: isLight ? '#1D1D1F' : '#F8FAFC' }}>{item.role}:</span> {item.desc}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
