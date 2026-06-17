'use client';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'pill';
}

const statusStyles: Record<string, string> = {
  active: 'bg-green-500/15 text-green-500 border-green-500/30',
  approved: 'bg-green-500/15 text-green-500 border-green-500/30',
  arrived: 'bg-green-500/15 text-green-500 border-green-500/30',
  completed: 'bg-green-500/15 text-green-500 border-green-500/30',
  filled: 'bg-green-500/15 text-green-500 border-green-500/30',
  ready: 'bg-green-500/15 text-green-500 border-green-500/30',
  clear: 'bg-green-500/15 text-green-500 border-green-500/30',
  done: 'bg-green-500/15 text-green-500 border-green-500/30',
  delivered: 'bg-green-500/15 text-green-500 border-green-500/30',
  pending: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
  verifying: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
  scheduled: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  rejected: 'bg-red-500/15 text-red-500 border-red-500/30',
  expired: 'bg-red-500/15 text-red-500 border-red-500/30',
  delayed: 'bg-red-500/15 text-red-500 border-red-500/30',
  'in progress': 'bg-amber-500/15 text-amber-500 border-amber-500/30',
  'in transit': 'bg-blue-500/15 text-blue-500 border-blue-500/30',
  dispensed: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  received: 'bg-blue-500/15 text-blue-500 border-blue-500/30',
  filling: 'bg-teal-500/15 text-teal-500 border-teal-500/30',
  open: 'bg-green-500/15 text-green-500 border-green-500/30',
  closed: 'bg-gray-500/15 text-gray-500 border-gray-500/30',
};

export function StatusBadge({ status, variant = 'pill' }: StatusBadgeProps) {
  const key = status.toLowerCase();
  const style = statusStyles[key] || 'bg-gray-500/15 text-gray-400 border-gray-500/30';
  const isPulsing = key === 'in progress' || key === 'filling' || key === 'verifying';

  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${style}`}>
      {isPulsing && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse-dot" />}
      {status}
    </span>
  );
}
