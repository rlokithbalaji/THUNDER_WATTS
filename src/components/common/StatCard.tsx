import React, { useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  change?: string;
  isPositive?: boolean;
  accentColor?: 'cyan' | 'red' | 'amber' | 'emerald' | 'blue';
  suffix?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  change,
  isPositive = true,
  accentColor = 'cyan',
  suffix = '',
  onClick,
}) => {
  const [displayValue, setDisplayValue] = useState<number | string>(0);

  // Animated number counter if value is a number
  useEffect(() => {
    if (typeof value === 'number') {
      let start = 0;
      const duration = 800;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentVal = Math.floor(progress * value);
        setDisplayValue(currentVal);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayValue(value);
        }
      };

      requestAnimationFrame(animate);
    } else {
      setDisplayValue(value);
    }
  }, [value]);

  const colorStyles = {
    cyan: {
      border: 'hover:border-cyan-500/40',
      iconBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      glow: 'group-hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]',
    },
    red: {
      border: 'hover:border-red-500/40',
      iconBg: 'bg-red-500/10 text-red-400 border-red-500/20',
      glow: 'group-hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]',
    },
    amber: {
      border: 'hover:border-amber-500/40',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      glow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]',
    },
    emerald: {
      border: 'hover:border-emerald-500/40',
      iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      glow: 'group-hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    },
    blue: {
      border: 'hover:border-blue-500/40',
      iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      glow: 'group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]',
    },
  }[accentColor];

  return (
    <div
      onClick={onClick}
      className={`group relative bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-4 transition-all duration-300 ${colorStyles.border} ${colorStyles.glow} ${onClick ? 'cursor-pointer hover:-translate-y-0.5' : ''}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</span>
        <div className={`p-2 rounded-lg border ${colorStyles.iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-2 flex items-baseline gap-1">
        <span className="text-2xl font-bold font-mono tracking-tight text-white">
          {displayValue}
        </span>
        {suffix && <span className="text-sm font-semibold text-slate-400">{suffix}</span>}
      </div>

      {(subtitle || change) && (
        <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
          {subtitle && <span>{subtitle}</span>}
          {change && (
            <span className={`font-mono ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
              {change}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
