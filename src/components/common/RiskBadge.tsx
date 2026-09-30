import React from 'react';
import { SeverityLevel } from '../../types';

interface RiskBadgeProps {
  severity: SeverityLevel | string;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ severity, size = 'md' }) => {
  const normalized = severity.toLowerCase();

  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';
  let dotColor = 'bg-slate-400';

  if (normalized === 'critical') {
    colorClasses = 'bg-red-500/10 text-red-400 border-red-500/30';
    dotColor = 'bg-red-500';
  } else if (normalized === 'high') {
    colorClasses = 'bg-orange-500/10 text-orange-400 border-orange-500/30';
    dotColor = 'bg-orange-500';
  } else if (normalized === 'medium') {
    colorClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    dotColor = 'bg-amber-500';
  } else if (normalized === 'low') {
    colorClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    dotColor = 'bg-emerald-500';
  } else if (normalized === 'informational' || normalized === 'info') {
    colorClasses = 'bg-sky-500/10 text-sky-400 border-sky-500/30';
    dotColor = 'bg-sky-400';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  }[size];

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${colorClasses} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`} />
      {severity}
    </span>
  );
};
