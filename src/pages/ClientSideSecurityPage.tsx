import React from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, XCircle, Cookie, FileCode, HardDrive } from 'lucide-react';

export const ClientSideSecurityPage: React.FC = () => {
  const securityHeaders = [
    { name: 'Strict-Transport-Security (HSTS)', status: 'Active', value: 'max-age=31536000; includeSubDomains', compliant: true },
    { name: 'Content-Security-Policy (CSP)', status: 'Needs Review', value: "default-src 'self' (Missing frame-ancestors)", compliant: false, warning: true },
    { name: 'X-Content-Type-Options', status: 'Active', value: 'nosniff', compliant: true },
    { name: 'X-Frame-Options', status: 'Active', value: 'SAMEORIGIN', compliant: true },
    { name: 'Referrer-Policy', status: 'Active', value: 'strict-origin-when-cross-origin', compliant: true },
    { name: 'Permissions-Policy', status: 'Active', value: 'camera=(), microphone=(), geolocation=()', compliant: true },
  ];

  const cookieAudits = [
    { name: 'wm_sess_id (Session Token)', httpOnly: true, secure: true, sameSite: 'Strict', status: 'Hardened' },
    { name: 'wm_csrf_token (Anti-CSRF)', httpOnly: false, secure: true, sameSite: 'Lax', status: 'Valid (Double Submit)' },
    { name: 'wm_theme_pref (Preferences)', httpOnly: false, secure: true, sameSite: 'Lax', status: 'Informational' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-cyan-400" />
          Client-Side Security Posture
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Inspection of browser storage, DOM sinks, security headers, cookie flags, and bundle sourcemaps
        </p>
      </div>

      {/* Top Status Cards (Section 18) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>HTTPS</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-base font-bold text-white font-mono">✓ Enabled</span>
          <p className="text-[10px] text-emerald-400 mt-1">TLS 1.3 Strict</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Secure Cookies</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-base font-bold text-white font-mono">✓ Enabled</span>
          <p className="text-[10px] text-emerald-400 mt-1">Encrypted Ingress</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>HttpOnly</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-base font-bold text-white font-mono">✓ Enabled</span>
          <p className="text-[10px] text-emerald-400 mt-1">Protected from XSS</p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>SameSite</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-base font-bold text-white font-mono">✓ Enabled</span>
          <p className="text-[10px] text-emerald-400 mt-1">Strict / Lax Mode</p>
        </div>

        <div className="bg-slate-900/60 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Content Security Policy</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-base font-bold text-amber-400 font-mono">⚠ Needs Review</span>
          <p className="text-[10px] text-amber-300 mt-1">Missing Directives</p>
        </div>
      </div>

      {/* Security Headers Table */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            HTTP Security Response Headers Audit
          </h3>
          <span className="text-xs font-mono text-cyan-400">Target: World Monitor Web</span>
        </div>

        <div className="divide-y divide-slate-800/60 text-xs">
          {securityHeaders.map((header) => (
            <div key={header.name} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-800/30 transition-colors">
              <div>
                <span className="font-semibold text-white block">{header.name}</span>
                <span className="font-mono text-slate-400 text-[11px]">{header.value}</span>
              </div>
              <div>
                <span
                  className={`px-2.5 py-1 rounded-full font-mono text-[10px] font-semibold border ${
                    header.compliant
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}
                >
                  {header.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cookie & Browser Storage Audit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4 text-slate-300 font-semibold uppercase text-xs tracking-wider">
            <Cookie className="w-4 h-4 text-cyan-400" />
            <span>Cookie Security Matrix</span>
          </div>

          <div className="space-y-3">
            {cookieAudits.map((c) => (
              <div key={c.name} className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold text-white">{c.name}</span>
                  <span className="text-emerald-400 text-[11px] font-mono">{c.status}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                  <span>HttpOnly: <strong className="text-white">{c.httpOnly ? 'Yes' : 'No'}</strong></span>
                  <span>•</span>
                  <span>Secure: <strong className="text-white">{c.secure ? 'Yes' : 'No'}</strong></span>
                  <span>•</span>
                  <span>SameSite: <strong className="text-cyan-300">{c.sameSite}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 text-slate-300 font-semibold uppercase text-xs tracking-wider">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span>JavaScript & Source Map Diagnostics</span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span>Production Source Maps Exposure:</span>
                <span className="text-emerald-400 font-mono font-semibold">Disabled (Pass)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span>DOM Sink Unsafe innerHTML Usages:</span>
                <span className="text-amber-400 font-mono font-semibold">1 Detected (WM-010)</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                <span>Subresource Integrity (SRI) Hash Check:</span>
                <span className="text-amber-400 font-mono font-semibold">1 Missing (WM-021)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-[11px] text-cyan-300">
            💡 <strong>Hardening Guide:</strong> Strip <code className="text-white font-mono">.map</code> files before deployment to reduce attack surface reconnaissance.
          </div>
        </div>
      </div>
    </div>
  );
};
