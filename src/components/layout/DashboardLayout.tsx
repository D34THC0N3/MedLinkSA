'use client';

import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { BackgroundCanvas } from '@/components/BackgroundCanvas';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
}

const pageTitles: Record<string, string> = {
  '/admin/dashboard': 'Platform Command Center: MedLink SA Ecosystem',
  '/doctor/dashboard': 'Welcome back, Dr. Evans!',
  '/hospital/dashboard': 'Facility Command Center: Cape Town Medical Centre',
  '/patient/dashboard': 'Good morning, Sarah!',
  '/pharmacy/dashboard': 'Pharmacy Operations: CureMed — Cape Town Branch',
};

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const pathname = usePathname();
  const resolvedTitle = title || pageTitles[pathname] || 'Dashboard';

  return (
    <div className="flex h-screen overflow-hidden">
      <BackgroundCanvas />
      <div className="vignette fixed inset-0 z-[1] pointer-events-none" />
      <Sidebar />
      <div className="flex-1 flex flex-col relative z-10 min-w-0">
        <TopBar title={resolvedTitle} />
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6" style={{ background: 'transparent' }}>
          <div className="w-full mx-auto" style={{ maxWidth: '1440px' }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
