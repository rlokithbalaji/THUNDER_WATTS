import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Settings,
  Shield,
  Bot,
  Bell,
  Lock,
  Eye,
  Sliders,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currentUser, currentRole } = useAuth();

  const [aiSettings, setAiSettings] = useState({
    aiAnalysis: true,
    safeAssessmentMode: true,
    automaticRemediation: false,
    externalActions: false,
    requireAuthorization: true,
  });

  const [activeTab, setActiveTab] = useState<'ai' | 'profile' | 'security' | 'notifications' | 'assessments'>('ai');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-cyan-400" />
          Platform Configuration & Safety Governance
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          System policies, AI safety parameters, notification hooks, and operator session configurations
        </p>
      </div>

      {/* Mandatory Safety Controls Banner (Section 28) */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 via-amber-950/20 to-slate-900 border border-amber-500/30 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            AUTHORIZED TESTING ONLY — SAFETY CONTROLS ACTIVE
          </span>
          <p className="text-xs text-slate-300 leading-relaxed">
            World Monitor enforces mandatory safety constraints. AI models are strictly limited to defensive analysis, telemetry parsing, and remediation guidance. Execution of offensive payloads, credential harvesting, or unverified egress scans is prohibited by kernel safety switches.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto">
        {[
          { id: 'ai', label: 'AI Configuration & Safety', icon: Bot },
          { id: 'profile', label: 'Operator Profile', icon: Eye },
          { id: 'security', label: 'Security & Auth', icon: Lock },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'assessments', label: 'Assessment Settings', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* AI Configuration Tab (Section 27 & 28) */}
      {activeTab === 'ai' && (
        <div className="space-y-4">
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 space-y-5">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
                AI Engine & Safe Mode Switches
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure autonomous behavior constraints and analysis guardrails
              </p>
            </div>

            <div className="divide-y divide-slate-800/80 space-y-4 pt-1">
              {/* AI Analysis */}
              <div className="pt-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">AI Security Analysis</span>
                  <span className="text-[11px] text-slate-400">
                    Enable contextual vulnerability diagnostics and natural language remediation suggestions.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setAiSettings(s => ({ ...s, aiAnalysis: !s.aiAnalysis }))}
                  className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                    aiSettings.aiAnalysis ? 'bg-cyan-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      aiSettings.aiAnalysis ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Safe Assessment Mode (Mandatory) */}
              <div className="pt-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white block">Safe Assessment Mode</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                      ENFORCED
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Restricts scans exclusively to synthetic mock data and authorized non-destructive boundaries.
                  </span>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-semibold px-3 py-1 bg-slate-950 rounded-lg border border-slate-800">
                  LOCKED ON
                </span>
              </div>

              {/* Automatic Remediation (OFF by policy) */}
              <div className="pt-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">Automatic Remediation</span>
                  <span className="text-[11px] text-slate-400">
                    Prohibits autonomous codebase modification without human analyst peer-review.
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400 font-semibold px-3 py-1 bg-slate-950 rounded-lg border border-slate-800">
                  OFF
                </span>
              </div>

              {/* External Actions (OFF by policy) */}
              <div className="pt-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">External Network Actions</span>
                  <span className="text-[11px] text-slate-400">
                    Blocks unsolicited outbound requests to external non-consenting IP addresses or public hosts.
                  </span>
                </div>
                <span className="text-xs font-mono text-slate-400 font-semibold px-3 py-1 bg-slate-950 rounded-lg border border-slate-800">
                  OFF
                </span>
              </div>

              {/* Require Authorization (Mandatory) */}
              <div className="pt-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-white block">Require Written Authorization</span>
                  <span className="text-[11px] text-slate-400">
                    Demands explicit confirmation checkbox verification before any assessment job initializes.
                  </span>
                </div>
                <span className="text-xs font-mono text-cyan-400 font-semibold px-3 py-1 bg-slate-950 rounded-lg border border-slate-800">
                  ON (STRICT)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Operator Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
            Current Operator Profile
          </h3>
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-14 h-14 rounded-2xl border-2 border-cyan-500/40 object-cover"
            />
            <div>
              <h4 className="text-base font-bold text-white">{currentUser.name}</h4>
              <p className="text-xs text-slate-400 font-mono">{currentUser.email}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                Persona: {currentRole}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 space-y-4 text-xs">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
            Authentication & Credential Policies
          </h3>
          <div className="space-y-2 font-mono text-slate-300">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex justify-between">
              <span>Password Algorithm:</span>
              <span className="text-emerald-400">Argon2id (m=65536, t=3, p=4)</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex justify-between">
              <span>MFA Challenge Scheme:</span>
              <span className="text-cyan-400">TOTP (RFC 6238) / WebAuthn</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 flex justify-between">
              <span>Session Inactivity Threshold:</span>
              <span className="text-amber-400">15 Minutes (Sliding)</span>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 space-y-4 text-xs">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
            Alert Dispatch Channels
          </h3>
          <p className="text-slate-400">
            Configure simulated webhook endpoints for Slack, PagerDuty, or SIEM syslog feeds.
          </p>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-cyan-300">
            SIEM Ingest URL: https://siem.worldmonitor.internal/events/collector
          </div>
        </div>
      )}

      {/* Assessment Settings Tab */}
      {activeTab === 'assessments' && (
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 space-y-4 text-xs">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
            Assessment Concurrency & Rate Throttling
          </h3>
          <p className="text-slate-400">
            To prevent accidental denial of service against testing backends, concurrent assessment workers are limited to 4 streams with a 250ms inter-request delay.
          </p>
          <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 text-emerald-300 font-mono">
            Max Concurrent Scans: 4 • Rate: 20 req/sec • Safe Fuzzing: Enforced
          </div>
        </div>
      )}
    </div>
  );
};
