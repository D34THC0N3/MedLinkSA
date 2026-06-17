'use client';

import { useState } from 'react';
import { Search, Bell, HelpCircle, Sun, Moon, X, Calendar, Pill, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAuth } from '@/lib/auth-context';
import { getInitials } from '@/lib/utils';

interface TopBarProps {
  title: string;
}

interface Notification {
  id: string; message: string; time: string; read: boolean; icon: React.ReactNode;
}

const notifications: Notification[] = [
  { id: 'n1', message: 'Upcoming appointment with Dr. Sarah Evans at 09:00', time: '2 hours', read: false, icon: <Calendar size={14} /> },
  { id: 'n2', message: 'Prescription refill due: Metformin 500mg', time: '1 day', read: false, icon: <Pill size={14} /> },
  { id: 'n3', message: 'New message from Dr. Michael Chen', time: '3 hours', read: false, icon: <MessageSquare size={14} /> },
  { id: 'n4', message: 'Lab results ready for review', time: '1 day', read: true, icon: <AlertTriangle size={14} /> },
  { id: 'n5', message: 'Telehealth call scheduled for June 22', time: '2 days', read: true, icon: <CheckCircle size={14} /> },
];

export function TopBar({ title }: TopBarProps) {
  const { theme, setTheme } = useTheme();
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const unread = notifications.filter(n => !n.read).length;

  return (
    <header
      className="h-16 flex items-center gap-4 px-6 shrink-0"
      style={{
        background: 'var(--topbar-bg)',
        backdropFilter: 'saturate(150%) blur(50px)',
        borderBottom: '1px solid var(--card-border)',
      }}
    >
      <h1 className="text-lg font-bold tracking-tight flex-1" style={{ color: 'var(--text-primary)' }}>{title}</h1>

      <div className="relative flex-1 max-w-[200px] hidden md:block">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Search..."
          className="w-full px-3.5 py-2 rounded-lg text-sm border outline-none transition-all"
          style={{
            paddingLeft: 34,
            background: 'var(--input-bg)',
            borderColor: 'var(--input-border)',
            color: 'var(--text-primary)',
          }}
        />
      </div>

      <div className="relative">
        <button onClick={() => { setShowHelp(!showHelp); setShowNotifications(false); }} className="btn-ghost p-2" style={{ color: 'var(--text-muted)' }}>
          <HelpCircle size={18} />
        </button>
        {showHelp && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowHelp(false)} />
            <div className="absolute right-0 top-full mt-2 w-72 rounded-xl z-50 overflow-hidden" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
              <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--card-border)' }}>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Help & Support</p>
              </div>
              <div className="py-2">
                {['Getting Started Guide', 'FAQs', 'Contact Support', 'Report a Bug', 'Keyboard Shortcuts'].map(item => (
                  <button key={item} onClick={() => setShowHelp(false)} className="w-full text-left px-4 py-2 text-sm transition-colors hover:bg-white/5" style={{ color: 'var(--text-primary)' }}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="relative">
        <button onClick={() => { setShowNotifications(!showNotifications); setShowHelp(false); }} className="btn-ghost p-2 relative" style={{ color: 'var(--text-muted)' }}>
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background: 'var(--error)', color: '#fff' }}>
              {unread}
            </span>
          )}
        </button>
        {showNotifications && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl z-50 overflow-hidden" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
              <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--card-border)' }}>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Notifications</p>
                {unread > 0 && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'var(--accent)', color: '#fff' }}>{unread} new</span>}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-white/5" style={{ background: n.read ? 'transparent' : 'var(--accent-light)' }}>
                    <span style={{ color: n.read ? 'var(--text-muted)' : 'var(--accent)' }}>{n.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs" style={{ color: n.read ? 'var(--text-muted)' : 'var(--text-primary)' }}>{n.message}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-disabled)' }}>{n.time} ago</p>
                    </div>
                    {!n.read && <span className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ background: 'var(--accent)' }} />}
                  </div>
                ))}
              </div>
              <button className="w-full text-center py-2 text-xs font-medium transition-colors hover:bg-white/5" style={{ color: 'var(--accent)', borderTop: '1px solid var(--card-border)' }}>
                Mark all as read
              </button>
            </div>
          </>
        )}
      </div>

      <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="btn-ghost p-2" style={{ color: 'var(--text-muted)' }}>
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="flex items-center gap-2.5 pl-4" style={{ borderLeft: '1px solid var(--card-border)' }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--accent)', color: '#fff' }}>
          {user?.name ? getInitials(user.name) : 'U'}
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user?.name || 'User'}</p>
          <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>{user?.role || 'Guest'}</p>
        </div>
      </div>
    </header>
  );
}
