'use client';

import type { ReactNode } from 'react';

interface CardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function Card({ title, subtitle, children, className = '', action }: CardProps) {
  return (
    <div className={`rounded-xl shadow-sm border p-4 ${className}`} style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-base font-bold" style={{ color: 'var(--foreground)' }}>{title}</h3>
          {subtitle && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{subtitle}</p>}
        </div>
        {action || (
          <button className="text-sm p-1 rounded hover:bg-white/5" style={{ color: 'var(--text-muted)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
