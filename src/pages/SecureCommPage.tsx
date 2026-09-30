import React from 'react';
import { Lock, ShieldCheck, CheckCircle, Key, RefreshCw, Server } from 'lucide-react';

export const SecureCommPage: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Lock className="w-6 h-6 text-cyan-400" />
          Communication Security
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Cryptographic protocol configuration, TLS termination, certificate health, and transport encryption
        </p>
      </div>

      {/* Top 4 Metric Indicators (Section 19) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <span className="text-xs text-slate-400 uppercase font-mono block mb-1">HTTPS Status</span>
          <span className="text-xl font-bold text-emerald-400 font-mono flex items-center gap-1.5">
            <CheckCircle className="w-5 h-5 inline" /> SECURE
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Strict transport mandatory</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <span className="text-xs text-slate-400 uppercase font-mono block mb-1">TLS Protocol</span>
          <span className="text-xl font-bold text-cyan-400 font-mono">
            1.3 Active
          </span>
          <p className="text-[11px] text-slate-400 mt-1">TLS 1.0 & 1.1 Rejected</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <span className="text-xs text-slate-400 uppercase font-mono block mb-1">X.509 Certificate</span>
          <span className="text-xl font-bold text-emerald-400 font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 inline" /> VALID
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Expires in 94 days</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
          <span className="text-xs text-slate-400 uppercase font-mono block mb-1">HSTS Policy</span>
          <span className="text-xl font-bold text-cyan-400 font-mono">
            ENABLED
          </span>
          <p className="text-[11px] text-slate-400 mt-1">Preload & subdomains set</p>
        </div>
      </div>

      {/* Detailed Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Certificate Inspection */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-slate-300 font-semibold uppercase text-xs tracking-wider">
            <Key className="w-4 h-4 text-cyan-400" />
            <span>Active TLS Certificate Specification</span>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500">Common Name:</span>
              <span className="text-slate-200">*.worldmonitor.internal</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500">Issuer Authority:</span>
              <span className="text-slate-200">DigiCert Global Root G2 (Synthetic)</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500">Public Key Algorithm:</span>
              <span className="text-slate-200">ECDSA (NIST P-256 Curve)</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500">Signature Hash:</span>
              <span className="text-slate-200">SHA-384 with ECDSA</span>
            </div>
            <div className="flex justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500">OCSP Stapling:</span>
              <span className="text-emerald-400">Enabled & Responding</span>
            </div>
          </div>
        </div>

        {/* Permitted Cipher Suites */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-slate-300 font-semibold uppercase text-xs tracking-wider">
            <Server className="w-4 h-4 text-cyan-400" />
            <span>Approved AEAD Cipher Suites (PFS)</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            {[
              { name: 'TLS_AES_256_GCM_SHA384', standard: 'TLS 1.3 Recommended', status: 'Optimal' },
              { name: 'TLS_CHACHA20_POLY1305_SHA256', standard: 'TLS 1.3 Recommended', status: 'Optimal' },
              { name: 'TLS_AES_128_GCM_SHA256', standard: 'TLS 1.3 Standard', status: 'Acceptable' },
              { name: 'ECDHE-ECDSA-AES256-GCM-SHA384', standard: 'TLS 1.2 Fallback', status: 'Strict' },
            ].map((cipher) => (
              <div
                key={cipher.name}
                className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <span className="text-cyan-300 font-bold block">{cipher.name}</span>
                  <span className="text-[10px] text-slate-500">{cipher.standard}</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {cipher.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
