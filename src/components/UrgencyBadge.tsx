import React from 'react';
import { AlertTriangle, AlertCircle, Clock, CheckCircle } from 'lucide-react';

interface UrgencyBadgeProps {
  urgency: 'Critical' | 'High' | 'Moderate' | 'Low';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ urgency, className = '', size = 'md' }) => {
  const configs = {
    Critical: {
      bg: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-800',
      icon: AlertTriangle,
      dot: 'bg-rose-500 animate-ping'
    },
    High: {
      bg: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-300 dark:border-red-800',
      icon: AlertCircle,
      dot: 'bg-red-500'
    },
    Moderate: {
      bg: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-800',
      icon: Clock,
      dot: 'bg-amber-500'
    },
    Low: {
      bg: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800',
      icon: CheckCircle,
      dot: 'bg-emerald-500'
    }
  };

  const current = configs[urgency] || configs.Low;
  const Icon = current.icon;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${current.bg} ${sizeClasses[size]} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      {urgency}
    </span>
  );
};
