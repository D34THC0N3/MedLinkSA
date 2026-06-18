'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import { HeartPulse, Eye, EyeOff, Sun, Moon, User, Stethoscope, Building2, Store, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { BackgroundCanvas } from '@/components/BackgroundCanvas';
import { Toaster, toast } from 'sonner';

const roles = [
  { id: 'patient', label: 'Patient', icon: User, desc: 'Book appointments, manage prescriptions' },
  { id: 'provider', label: 'Doctor', icon: Stethoscope, desc: 'Manage patients, schedules, records' },
  { id: 'facility', label: 'Hospital', icon: Building2, desc: 'Manage departments, beds, staff' },
  { id: 'pharmacy', label: 'Pharmacy', icon: Store, desc: 'Process prescriptions, manage inventory' },
];

const roleRedirects: Record<string, string> = {
  patient: '/patient/dashboard',
  provider: '/doctor/dashboard',
  facility: '/hospital/dashboard',
  pharmacy: '/pharmacy/dashboard',
};

function SignUpForm() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const [selectedRole, setSelectedRole] = useState('patient');
  const { signUp } = useAuth();

  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam && ['patient', 'provider', 'facility', 'pharmacy'].includes(roleParam)) {
      setSelectedRole(roleParam);
    }
  }, [searchParams]);

  const isLight = theme !== 'dark';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) { toast.error('Please enter your full name'); return; }
    if (!email.includes('@')) { toast.error('Please enter a valid email address'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await signUp(name.trim(), email.trim(), password, selectedRole);
      toast.success('Account created successfully!');
      setTimeout(() => router.push(roleRedirects[selectedRole] || '/patient/dashboard'), 500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-6 relative z-10 py-24">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1 heading-text" style={{ color: isLight ? '#1D1D1F' : '#F8FAFC' }}>Create your account</h1>
        <p className="text-sm mb-6" style={{ color: isLight ? '#86868B' : '#9CA3AF' }}>Join South Africa&apos;s digital health ecosystem</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {roles.map((r) => {
            const Icon = r.icon;
            const active = selectedRole === r.id;
            return (
              <button key={r.id} onClick={() => setSelectedRole(r.id)}
                className="flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl text-[10px] font-medium transition-all"
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
            <label className="text-sm font-medium mb-1.5 block" style={{ color: isLight ? '#3A3A3C' : '#D1D5DB' }}>Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Sarah Johnson"
              className="w-full px-3.5 py-2.5 rounded-lg text-sm border outline-none transition-all glass-card"
              style={{ color: isLight ? '#1D1D1F' : '#F8FAFC' }} required />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block" style={{ color: isLight ? '#3A3A3C' : '#D1D5DB' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 rounded-lg text-sm border outline-none transition-all glass-card"
              style={{ color: isLight ? '#1D1D1F' : '#F8FAFC' }} required />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block" style={{ color: isLight ? '#3A3A3C' : '#D1D5DB' }}>Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Min. 6 characters" className="w-full px-3.5 py-2.5 pr-10 rounded-lg text-sm border outline-none transition-all glass-card"
                style={{ color: isLight ? '#1D1D1F' : '#F8FAFC' }} required minLength={6} />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: isLight ? '#86868B' : '#6B7280' }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account...</> : 'Create Account'}
          </button>
        </form>

        <p className="text-sm text-center mt-6" style={{ color: isLight ? '#86868B' : '#6B7280' }}>
          Already have an account?{' '}
          <Link href="/sign-in" className="font-medium hover:opacity-80" style={{ color: '#2563EB' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isLight = theme !== 'dark';

  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="min-h-screen flex" style={{ background: isLight ? '#E5E5E9' : '#151519' }}>
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
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="ml-1 p-2 rounded-lg transition-colors hover:bg-white/10" style={{ color: isLight ? 'rgba(18,18,18,0.6)' : 'rgba(248,250,252,0.6)' }}>
            {mounted ? (theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />) : <div style={{ width: 16, height: 16 }} />}
          </button>
        </div>
      </nav>
      <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent)' }} /></div>}>
        <SignUpForm />
      </Suspense>
    </div>
  );
}
