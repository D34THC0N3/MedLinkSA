'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { HeartPulse, LayoutDashboard, Users, ShieldCheck, BarChart3, Activity, Settings, UserCircle, Stethoscope, Building2, Pill, Calendar, FileText, MessageSquare, Video, Compass, UserCheck, ClipboardList, BedDouble, PackageCheck, ChevronDown, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { getInitials } from '@/lib/utils';
import type { UserRole } from '@/types';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  href: string;
  roles: UserRole[];
  badge?: number;
}

const baseNavItems: NavItem[] = [
  { label: 'Dashboard', icon: <LayoutDashboard size={18} />, href: '/dashboard', roles: ['admin', 'provider', 'facility', 'patient', 'pharmacy'] },
  { label: 'Appointments', icon: <Calendar size={18} />, href: '/appointments', roles: ['provider', 'patient'] },
  { label: 'My Patients', icon: <Users size={18} />, href: '/patients', roles: ['provider'] },
  { label: 'My Records', icon: <FileText size={18} />, href: '/records', roles: ['patient'] },
  { label: 'Prescriptions', icon: <Pill size={18} />, href: '/prescriptions', roles: ['patient', 'provider', 'pharmacy'] },
  { label: 'Messages', icon: <MessageSquare size={18} />, href: '/messages', roles: ['patient', 'provider'], badge: 3 },
  { label: 'Health Tracking', icon: <Activity size={18} />, href: '/health', roles: ['patient'] },
  { label: 'Telemedicine', icon: <Video size={18} />, href: '/telemedicine', roles: ['provider', 'patient'] },
  { label: 'Clinical Notes', icon: <ClipboardList size={18} />, href: '/clinical-notes', roles: ['provider'] },
  { label: 'Users', icon: <Users size={18} />, href: '/admin/users', roles: ['admin'] },
  { label: 'Verifications', icon: <ShieldCheck size={18} />, href: '/admin/verifications', roles: ['admin'], badge: 4 },
  { label: 'Analytics', icon: <BarChart3 size={18} />, href: '/admin/analytics', roles: ['admin', 'facility'] },
  { label: 'System Health', icon: <Activity size={18} />, href: '/admin/system-health', roles: ['admin'] },
  { label: 'Departments', icon: <Building2 size={18} />, href: '/departments', roles: ['facility'] },
  { label: 'Staffing', icon: <UserCheck size={18} />, href: '/staffing', roles: ['facility'] },
  { label: 'Bed Management', icon: <BedDouble size={18} />, href: '/beds', roles: ['facility'] },
  { label: 'Inventory', icon: <PackageCheck size={18} />, href: '/inventory', roles: ['pharmacy', 'facility'] },
  { label: 'Explore', icon: <Compass size={18} />, href: '/explore', roles: ['patient', 'provider', 'facility', 'admin', 'pharmacy'] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const role = user?.role || 'patient';

  const navItems = baseNavItems.filter(item => item.roles.includes(role));

  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] flex flex-col z-30" style={{
      background: 'var(--sidebar-bg)',
      backdropFilter: 'saturate(150%) blur(50px)',
      borderRight: '1px solid var(--card-border)',
    }}>
      <Link href="/" className="flex items-center gap-2.5 px-5 h-16 shrink-0" style={{ borderBottom: '1px solid var(--card-border)' }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <HeartPulse size={16} className="text-white" />
        </div>
        <span className="font-bold text-base tracking-tight" style={{ color: 'var(--sidebar-text)' }}>MedLink SA</span>
      </Link>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200"
              style={{
                color: isActive ? 'var(--accent)' : 'var(--sidebar-text)',
                background: isActive ? 'var(--accent-light)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--accent)' : '3px solid transparent',
                paddingLeft: isActive ? '9px' : '12px',
              }}
            >
              <span style={{ color: isActive ? 'var(--accent)' : 'var(--sidebar-text-muted)' }}>
                {item.icon}
              </span>
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center" style={{ background: 'var(--accent)', color: '#fff' }}>
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div style={{ borderTop: '1px solid var(--card-border)', padding: '12px 16px' }}>
        <details className="group">
          <summary className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer list-none transition-all" style={{ color: 'var(--sidebar-text)' }}>
            <Settings size={16} style={{ color: 'var(--sidebar-text-muted)' }} />
            <span className="text-sm flex-1">Settings</span>
            <ChevronDown size={14} className="transition-transform group-open:rotate-180" style={{ color: 'var(--sidebar-text-muted)' }} />
          </summary>
          <div className="mt-1 pl-9 space-y-0.5">
            <Link href="/settings" className="block text-xs py-1.5 transition-colors" style={{ color: 'var(--sidebar-text-muted)' }}>Account</Link>
            <Link href="/settings/notifications" className="block text-xs py-1.5 transition-colors" style={{ color: 'var(--sidebar-text-muted)' }}>Notifications</Link>
            <Link href="/settings/security" className="block text-xs py-1.5 transition-colors" style={{ color: 'var(--sidebar-text-muted)' }}>Security</Link>
          </div>
        </details>
        <div className="flex items-center gap-2.5 px-3 py-2 mt-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--accent)', color: '#fff' }}>
            {user?.name ? getInitials(user.name) : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--sidebar-text)' }}>{user?.name || 'User'}</p>
            <p className="text-[11px]" style={{ color: 'var(--sidebar-text-muted)' }}>{role}</p>
          </div>
        </div>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all w-full mt-1"
          style={{ color: 'var(--sidebar-text-muted)' }}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
      </div>
    </aside>
  );
}
