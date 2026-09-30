import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface SecurityScoreGaugeProps {
  score?: number;
}

export const SecurityScoreGauge: React.FC<SecurityScoreGaugeProps> = ({ score = 82 }) => {
  // SVG circular arc calculations
  const radius = 68;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const breakdown = [
    { label: 'Authentication', value: 88, color: 'text-cyan-400', bar: 'bg-cyan-500' },
    { label: 'Authorization', value: 76, color: 'text-amber-400', bar: 'bg-amber-500' },
    { label: 'API Security', value: 81, color: 'text-cyan-400', bar: 'bg-cyan-500' },
    { label: 'Input Validation', value: 84, color: 'text-emerald-400', bar: 'bg-emerald-500' },
    { label: 'Data Protection', value: 79, color: 'text-amber-400', bar: 'bg-amber-500' },
    { label: 'Communication Security', value: 91, color: 'text-emerald-400', bar: 'bg-emerald-500' },
  ];

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            Security Posture Score
          </h3>
          <p className="text-xs text-slate-400">Comprehensive multi-domain assessment</p>
        </div>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          Good Security Posture
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center my-auto">
        {/* Circular Gauge */}
        <div className="md:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg height="176" width="176" className="rotate-[-90deg] drop-shadow-[0_0_12px_rgba(6,182,212,0.3)]">
              {/* Background circle */}
              <circle
                stroke="rgba(30, 41, 59, 0.8)"
                fill="transparent"
                strokeWidth={stroke}
                r={normalizedRadius}
                cx="88"
                cy="88"
              />
              {/* Progress circle */}
              <circle
                stroke="url(#cyanGradient)"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx="88"
                cy="88"
              />
              <defs>
                <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>

            {/* Score inside circle */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-extrabold font-mono text-white tracking-tight">{score}</span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-0.5">/ 100</span>
              <span className="text-[11px] text-emerald-400 font-medium mt-1">GRADE: B+</span>
            </div>
          </div>
        </div>

        {/* Domain Breakdown Bars */}
        <div className="md:col-span-7 space-y-2.5">
          {breakdown.map((item) => (
            <div key={item.label} className="text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-300 font-medium">{item.label}</span>
                <span className={`font-mono font-semibold ${item.color}`}>{item.value}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${item.bar}`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
