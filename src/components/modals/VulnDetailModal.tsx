import React, { useState } from 'react';
import { Vulnerability } from '../../types';
import { Modal } from '../common/Modal';
import { RiskBadge } from '../common/RiskBadge';
import { useSecurity } from '../../context/SecurityContext';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldAlert,
  Terminal,
  FileText,
  Wrench,
  History,
  CheckCircle,
  Copy,
  Check,
  AlertTriangle,
} from 'lucide-react';

interface VulnDetailModalProps {
  vulnerability: Vulnerability | null;
  onClose: () => void;
}

export const VulnDetailModal: React.FC<VulnDetailModalProps> = ({ vulnerability, onClose }) => {
  const { updateVulnerabilityStatus } = useSecurity();
  const { canPerformAction } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'evidence' | 'poc' | 'remediation' | 'history'>('overview');
  const [copied, setCopied] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<Vulnerability['status']>('Open');
  const [statusNote, setStatusNote] = useState<string>('');

  if (!vulnerability) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(vulnerability.pocSafeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusUpdate = () => {
    updateVulnerabilityStatus(vulnerability.id, newStatus, statusNote);
    setStatusNote('');
  };

  return (
    <Modal
      isOpen={!!vulnerability}
      onClose={onClose}
      title={`${vulnerability.id} — ${vulnerability.title}`}
      subtitle={`Component: ${vulnerability.component} • Detected: ${vulnerability.detected}`}
      maxWidth="4xl"
    >
      {/* Top Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 mb-5">
        <div className="flex items-center gap-3">
          <RiskBadge severity={vulnerability.severity} />
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              CVSS {vulnerability.cvss}
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
              {vulnerability.cwe}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400">AI Confidence:</span>
            <span className="font-mono font-bold text-cyan-400">{vulnerability.aiConfidence}%</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium border bg-slate-800/80 border-slate-700 text-slate-300">
            Status: {vulnerability.status}
          </span>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="flex border-b border-slate-800 mb-6 gap-1 overflow-x-auto">
        {[
          { key: 'overview', label: 'Overview', icon: FileText },
          { key: 'evidence', label: 'Evidence', icon: Terminal },
          { key: 'poc', label: 'PoC (Safe Verification)', icon: ShieldAlert },
          { key: 'remediation', label: 'Remediation', icon: Wrench },
          { key: 'history', label: 'Audit History', icon: History },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === key
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-5 text-sm">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Description</h4>
            <p className="text-slate-200 leading-relaxed bg-slate-950/30 p-3.5 rounded-lg border border-slate-800/60">
              {vulnerability.description}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Potential Impact</h4>
            <p className="text-slate-300 leading-relaxed bg-slate-950/30 p-3.5 rounded-lg border border-slate-800/60">
              {vulnerability.impact}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1.5">Expected Behavior</h4>
              <p className="text-slate-300 text-xs bg-emerald-950/20 border border-emerald-900/40 p-3 rounded-lg">
                {vulnerability.expectedBehavior}
              </p>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-red-400 mb-1.5">Observed Behavior</h4>
              <p className="text-slate-300 text-xs bg-red-950/20 border border-red-900/40 p-3 rounded-lg">
                {vulnerability.observedBehavior}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Steps to Reproduce</h4>
            <ol className="list-decimal list-inside space-y-1.5 bg-slate-950/30 p-3.5 rounded-lg border border-slate-800/60 text-xs text-slate-300 font-mono">
              {vulnerability.stepsToReproduce.map((step, idx) => (
                <li key={idx} className="leading-relaxed">{step}</li>
              ))}
            </ol>
          </div>
        </div>
      )}

      {/* Tab Content: Evidence */}
      {activeTab === 'evidence' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-cyan-950/30 border border-cyan-800/40 text-cyan-300 text-xs">
            <Terminal className="w-4 h-4 shrink-0" />
            <span>Captured Telemetry & Response Headers from Authorized Test Target</span>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Raw Probe Output</h4>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
              {vulnerability.evidence}
            </pre>
          </div>
        </div>
      )}

      {/* Tab Content: PoC */}
      {activeTab === 'poc' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200">
              <strong className="font-semibold text-white">Controlled Verification Notice:</strong> This proof-of-concept snippet is non-destructive, safe, and restricted to explicitly authorized synthetic testing targets.
            </p>
          </div>

          <div className="relative">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800/80 rounded-t-xl border border-b-0 border-slate-700">
              <span className="text-xs font-mono text-slate-300">Authorized Test Script (TypeScript/JavaScript)</span>
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-4 rounded-b-xl bg-slate-950 border border-slate-700 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
              {vulnerability.pocSafeCode}
            </pre>
          </div>
        </div>
      )}

      {/* Tab Content: Remediation */}
      {activeTab === 'remediation' && (
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Recommended Code / Architecture Fix</h4>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono">
              {vulnerability.remediation}
            </div>
          </div>

          {canPerformAction('remediate') && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Update Finding Triage Status</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Open">Open</option>
                  <option value="Investigating">Investigating</option>
                  <option value="Remediated">Remediated</option>
                  <option value="Accepted Risk">Accepted Risk</option>
                  <option value="Retesting">Retesting</option>
                </select>

                <input
                  type="text"
                  placeholder="Optional resolution note..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 sm:col-span-2 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleStatusUpdate}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-colors shadow-lg shadow-cyan-900/30 flex items-center gap-1.5"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Save Status
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: History */}
      {activeTab === 'history' && (
        <div className="space-y-3">
          <div className="relative pl-6 border-l-2 border-slate-800 space-y-4">
            {vulnerability.history.map((hist, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[31px] top-1 w-3 h-3 rounded-full bg-cyan-500 ring-4 ring-slate-900" />
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-200">{hist.actor}</span>
                  <span className="text-slate-500 font-mono">{hist.timestamp}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{hist.action}</p>
                {hist.note && (
                  <p className="text-xs text-cyan-300 italic mt-0.5 bg-slate-950/40 p-2 rounded border border-slate-800">
                    "{hist.note}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
};
