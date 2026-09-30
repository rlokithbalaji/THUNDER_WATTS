import React from 'react';
import { StatCard } from '../components/common/StatCard';
import {
  KeyRound,
  UserCheck,
  UserX,
  Lock,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const loginActivityData = [
  { hour: '00:00', successful: 85, failed: 4 },
  { hour: '04:00', successful: 42, failed: 2 },
  { hour: '08:00', successful: 380, failed: 89 },
  { hour: '12:00', successful: 450, failed: 18 },
  { hour: '16:00', successful: 320, failed: 22 },
  { hour: '20:00', successful: 190, failed: 8 },
];

export const AuthenticationPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <KeyRound className="w-6 h-6 text-cyan-400" />
          Authentication Health
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Identity federation telemetry, MFA posture, brute force detection, and credential hygiene
        </p>
      </div>

      {/* Metrics Row (Section 16) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <StatCard
          title="Failed Attempts"
          value={143}
          icon={UserX}
          accentColor="red"
          change="+12% anomaly"
          isPositive={false}
        />
        <StatCard
          title="Successful Logins"
          value="2,841"
          icon={UserCheck}
          accentColor="emerald"
        />
        <StatCard
          title="Locked Accounts"
          value={12}
          icon={Lock}
          accentColor="amber"
          subtitle="Auto-recovering in 15m"
        />
        <StatCard
          title="MFA Enabled"
          value={78}
          suffix="%"
          icon={ShieldCheck}
          accentColor="cyan"
          change="+4% this month"
          isPositive={true}
        />
        <StatCard
          title="Session Anomalies"
          value={5}
          icon={AlertTriangle}
          accentColor="red"
        />
      </div>

      {/* Charts: Login Activity & Failed Login Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 24-Hour Login Activity */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                24-Hour Login Activity Volume
              </h3>
              <p className="text-xs text-slate-400">Successful vs. Failed attempts</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Success
              </span>
              <span className="flex items-center gap-1 text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-400" /> Failed
              </span>
            </div>
          </div>

          <div className="w-full h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={loginActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} tickLine={false} />
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
                <Area
                  type="monotone"
                  dataKey="successful"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="#10b981"
                  fillOpacity={0.2}
                />
                <Area
                  type="monotone"
                  dataKey="failed"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fill="#ef4444"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Failed Login Trend Analysis */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                Failed Login Anomalies by Cause
              </h3>
              <p className="text-xs text-slate-400">Automated classification breakdown</p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-red-950 text-red-400 border border-red-800">
              143 Total
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { label: 'Brute Force / Password Guessing (CIDR 198.51.100.x)', count: 96, pct: '67%', color: 'bg-red-500' },
              { label: 'Expired JWT / Inactive Session Replay', count: 28, pct: '20%', color: 'bg-amber-500' },
              { label: 'MFA Code Timeout / Misconfiguration', count: 14, pct: '10%', color: 'bg-cyan-500' },
              { label: 'Account Locked Threshold Exceeded', count: 5, pct: '3%', color: 'bg-blue-500' },
            ].map((item) => (
              <div key={item.label} className="text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-300 truncate">{item.label}</span>
                  <span className="font-mono text-slate-400 shrink-0 ml-2">{item.count} ({item.pct})</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: item.pct }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actionable Recommendations (Section 16) */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4 text-cyan-400 font-semibold uppercase text-xs tracking-wider">
          <Lightbulb className="w-4 h-4" />
          <span>Security Engineering Recommendations</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <span className="font-semibold text-emerald-400">1. Enforce MFA for Privileged Accounts</span>
            <p className="text-slate-400 leading-relaxed">
              22% of active users (including 3 service administrators) have not enrolled FIDO2/WebAuthn or TOTP tokens. Enforce conditional access policy.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <span className="font-semibold text-amber-400">2. Reduce Session Lifetime Window</span>
            <p className="text-slate-400 leading-relaxed">
              Current JWT lifetime is 14 days without sliding idle revocation. Mitigate WM-003 by dropping access token expiration to 15 minutes.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <span className="font-semibold text-cyan-400">3. Apply IP Rate Limiting to Auth Ingress</span>
            <p className="text-slate-400 leading-relaxed">
              Configure Token Bucket rate limiting on <code className="text-cyan-300 font-mono">/api/v1/auth/login</code> at Envoy ingress (max 5 attempts/minute/IP).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
