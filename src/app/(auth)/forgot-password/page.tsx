'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { HeartPulse, CheckCircle, Sun, Moon } from 'lucide-react';
import { BackgroundCanvas } from '@/components/BackgroundCanvas';

export default function ForgotPasswordPage() {
  const { theme, setTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const isLight = theme !== 'dark';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: isLight ? '#E5E5E9' : '#151519' }}>
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
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="ml-1 p-2 rounded-lg transition-colors hover:bg-white/10" style={{ color: isLight ? 'rgba(18,18,18,0.6)' : 'rgba(248,250,252,0.6)' }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </nav>
      <div className="w-full max-w-sm relative z-10">

        {sent ? (
          <div className="text-center">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Check your email</h1>
            <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
              We&apos;ve sent password reset instructions to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
            </p>
            <Link href="/sign-in" className="text-sm text-[#2563EB] hover:underline">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <>
            <Link href="/sign-in" className="inline-flex items-center gap-1 text-sm mb-6 transition-colors" style={{ color: 'var(--text-muted)' }}>
              &larr; Back to Sign In
            </Link>
            <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Reset password</h1>
            <p className="text-sm mb-8" style={{ color: 'var(--text-muted)' }}>Enter your email and we&apos;ll send you reset instructions</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 rounded-lg text-sm border outline-none transition-all"
                  style={{ background: 'var(--input-bg)', borderColor: 'var(--input-border)', color: 'var(--text-primary)' }}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg font-semibold text-sm text-white transition-colors"
                style={{ background: 'var(--accent)' }}
              >
                Send Reset Instructions
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
