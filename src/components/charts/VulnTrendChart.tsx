import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const data = [
  { week: 'W1', critical: 4, high: 9, medium: 14, low: 18 },
  { week: 'W2', critical: 3, high: 8, medium: 12, low: 16 },
  { week: 'W3', critical: 3, high: 7, medium: 10, low: 14 },
  { week: 'W4 (Current)', critical: 2, high: 6, medium: 7, low: 11 },
];

export const VulnTrendChart: React.FC = () => {
  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            Vulnerabilities Over Time
          </h3>
          <p className="text-xs text-slate-400">Severity resolution velocity by sprint</p>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          Total Resolved: <span className="text-emerald-400 font-bold">19</span>
        </div>
      </div>

      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="week" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#1e293b',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#fff',
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '8px', fontSize: '11px' }}
              iconType="circle"
            />
            <Bar dataKey="critical" name="Critical" fill="#ef4444" stackId="a" radius={[0, 0, 0, 0]} />
            <Bar dataKey="high" name="High" fill="#f97316" stackId="a" radius={[0, 0, 0, 0]} />
            <Bar dataKey="medium" name="Medium" fill="#eab308" stackId="a" radius={[0, 0, 0, 0]} />
            <Bar dataKey="low" name="Low" fill="#10b981" stackId="a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
