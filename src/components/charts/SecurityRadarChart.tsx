import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const data = [
  { subject: 'Authentication', current: 88, target: 95, fullMark: 100 },
  { subject: 'Authorization', current: 76, target: 90, fullMark: 100 },
  { subject: 'API Security', current: 81, target: 95, fullMark: 100 },
  { subject: 'Input Validation', current: 84, target: 90, fullMark: 100 },
  { subject: 'Data Protection', current: 79, target: 95, fullMark: 100 },
  { subject: 'Comm. Security', current: 91, target: 98, fullMark: 100 },
];

export const SecurityRadarChart: React.FC = () => {
  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            Domain Posture Radar
          </h3>
          <p className="text-xs text-slate-400">Current posture vs. hardened baseline</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="text-slate-300">Current</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
            <span className="text-slate-400">Target</span>
          </div>
        </div>
      </div>

      <div className="w-full h-64 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="#1e293b" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
            <Radar
              name="Target Baseline"
              dataKey="target"
              stroke="#475569"
              fill="#334155"
              fillOpacity={0.2}
              strokeDasharray="3 3"
            />
            <Radar
              name="Current Posture"
              dataKey="current"
              stroke="#06b6d4"
              fill="#06b6d4"
              fillOpacity={0.45}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#1e293b',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#fff',
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
