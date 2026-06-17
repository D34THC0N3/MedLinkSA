import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-ZA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatTime(date: Date | string): string {
  return new Date(date).toLocaleTimeString('en-ZA', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    patient: 'bg-teal-500',
    provider: 'bg-blue-500',
    facility: 'bg-purple-500',
    admin: 'bg-amber-500',
    pharmacy: 'bg-green-500',
  };
  return colors[role] || 'bg-gray-500';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'bg-green-500',
    approved: 'bg-green-500',
    pending: 'bg-amber-500',
    rejected: 'bg-red-500',
    arrived: 'bg-green-500',
    'in progress': 'bg-amber-500',
    scheduled: 'bg-gray-400',
    completed: 'bg-green-500',
  };
  return colors[status.toLowerCase()] || 'bg-gray-400';
}
