'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

const roleRedirects: Record<string, string> = {
  patient: '/patient/dashboard',
  provider: '/doctor/dashboard',
  facility: '/hospital/dashboard',
  pharmacy: '/pharmacy/dashboard',
  admin: '/admin/dashboard',
};

export default function DashboardRedirect() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/sign-in');
      return;
    }
    router.push(roleRedirects[user.role] || '/patient/dashboard');
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="text-center">
        <div className="w-10 h-10 rounded-full mx-auto mb-4" style={{ background: 'var(--accent-light)' }} />
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
