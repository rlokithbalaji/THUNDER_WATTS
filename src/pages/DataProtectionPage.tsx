import React from 'react';
import { StatCard } from '../components/common/StatCard';
import { Database, ShieldCheck, Lock, AlertTriangle, HardDrive, CheckCircle } from 'lucide-react';

export const DataProtectionPage: React.FC = () => {
  const categories = [
    { name: 'Personal Data (PII)', encryption: 'AES-256 GCM', status: 'Encrypted', score: '92%', alert: '3 Alerts (WM-004)' },
    { name: 'Authentication Credentials', encryption: 'Argon2id + Salt', status: 'Hardened', score: '98%', alert: 'None' },
    { name: 'Application Relational Data', encryption: 'AWS KMS Envelope', status: 'Encrypted', score: '96%', alert: 'None' },
    { name: 'System & Audit Logs', encryption: 'Encrypted at Rest', status: 'Protected', score: '99%', alert: 'None' },
    { name: 'Disaster Recovery Backups', encryption: 'Immutable WORM Vault', status: 'Encrypted', score: '100%', alert: 'None' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Database className="w-6 h-6 text-cyan-400" />
          Data Protection & Privacy Guard
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Cryptographic storage posture, PII redaction filters, key rotation status, and at-rest envelope protection
        </p>
      </div>

      {/* Metrics Row (Section 20) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Encrypted Data"
          value={94}
          suffix="%"
          icon={Lock}
          accentColor="emerald"
        />
        <StatCard
          title="Sensitive Fields Protected"
          value={98}
          suffix="%"
          icon={ShieldCheck}
          accentColor="cyan"
        />
        <StatCard
          title="PII Exposure Alerts"
          value={3}
          icon={AlertTriangle}
          accentColor="red"
        />
        <StatCard
          title="Unprotected Storage"
          value={0}
          icon={HardDrive}
          accentColor="emerald"
        />
      </div>

      {/* Data Protection Categories (Section 20) */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            Storage & Data Classification Inventory
          </h3>
          <span className="text-xs font-mono text-cyan-400">5 Categories Audited</span>
        </div>

        <div className="divide-y divide-slate-800/60 text-xs">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors"
            >
              <div>
                <span className="font-semibold text-white text-sm block">{cat.name}</span>
                <span className="font-mono text-slate-400 text-[11px]">
                  Encryption Scheme: {cat.encryption}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px]">COVERAGE</span>
                  <span className="text-emerald-400 font-bold">{cat.score}</span>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${
                    cat.alert === 'None'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}
                >
                  {cat.alert === 'None' ? '✓ Protected' : cat.alert}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
