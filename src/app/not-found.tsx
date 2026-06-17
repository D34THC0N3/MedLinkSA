'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HeartPulse } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('medlink_user') : null;
    if (stored) {
      try {
        const user = JSON.parse(stored);
        const role = user?.role || 'patient';
        const dashMap: Record<string, string> = {
          patient: '/patient/dashboard',
          provider: '/doctor/dashboard',
          facility: '/hospital/dashboard',
          admin: '/admin/dashboard',
          pharmacy: '/pharmacy/dashboard',
        };
        router.replace(dashMap[role] || '/patient/dashboard');
        return;
      } catch {}
    }
    router.replace('/get-started');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="text-center px-6">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--accent)' }}>
          <HeartPulse size={28} className="text-white" />
        </div>
        <h1 className="text-6xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>404</h1>
        <p className="text-lg" style={{ color: 'var(--text-muted)' }}>Redirecting...</p>
      </div>
    </div>
  );
}
