'use client';

import { useCountUp } from '@/hooks/useCountUp';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { StatCard as StatCardType } from '@/types';

const accentColors: Record<string, string> = {
  teal: 'border-l-teal-500',
  blue: 'border-l-blue-500',
  amber: 'border-l-amber-500',
  green: 'border-l-green-500',
  red: 'border-l-red-500',
  purple: 'border-l-purple-500',
};

export function StatCard({ label, value, delta, progress, subtext }: StatCardType & { accent?: string }) {
  const numericValue = typeof value === 'string' ? parseInt(value.replace(/,|\+/g, '')) || 0 : (value as number);
  const { count } = useCountUp(numericValue);

  return (
    <div className="rounded-xl shadow-sm border p-4 border-l-[3px] border-l-teal-500 transition-all hover:shadow-md" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{label}</p>
      <div className="flex items-end gap-2 mt-1">
        <span className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
          {typeof value === 'string' ? value.replace(/[\d,]+/, count.toLocaleString()) : count.toLocaleString()}
        </span>
        {delta && (
          <span className={`text-xs font-semibold flex items-center gap-0.5 mb-1 ${delta.positive ? 'text-green-500' : 'text-red-500'}`}>
            {delta.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {delta.value}
          </span>
        )}
      </div>
      {progress !== undefined && (
        <div className="mt-2 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div className="h-full rounded-full bg-teal-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      )}
      {subtext && <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>{subtext}</p>}
    </div>
  );
}
