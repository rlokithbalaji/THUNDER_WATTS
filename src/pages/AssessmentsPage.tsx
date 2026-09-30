import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { useAuth } from '../context/AuthContext';
import { NewAssessmentModal } from '../components/modals/NewAssessmentModal';
import {
  Search,
  Plus,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const AssessmentsPage: React.FC = () => {
  const { assessments, setActivePage } = useSecurity();
  const { canPerformAction } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Search className="w-6 h-6 text-cyan-400" />
            Security Assessments
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Controlled, authorized vulnerability scans, configuration audits, and penetration tests
          </p>
        </div>

        {canPerformAction('assess') && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-900/30 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Security Assessment</span>
          </button>
        )}
      </div>

      {/* Safety Notice */}
      <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
        <span className="text-xs text-cyan-200">
          <strong>Notice:</strong> Testing is restricted to authorized environments and synthetic/demo data. All test activities are logged in the immutable audit trail.
        </span>
      </div>

      {/* Active Assessments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {assessments.map((asm) => (
          <div
            key={asm.id}
            className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 font-semibold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60">
                    {asm.id}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1.5">{asm.name}</h3>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                  {asm.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 my-3 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Target App</span>
                  <span className="text-slate-200 font-medium">{asm.targetAppName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Scope Type</span>
                  <span className="text-cyan-300 font-medium">{asm.type}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Tester</span>
                  <span className="text-slate-300 truncate block">{asm.tester}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-mono">Window</span>
                  <span className="text-slate-300 font-mono text-[11px]">{asm.startDate} → {asm.endDate}</span>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-4">
                <span className="text-[10px] font-mono text-slate-500 uppercase block mb-1.5">
                  Assessed Categories
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {asm.categories.map((c) => (
                    <span
                      key={c}
                      className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300 border border-slate-700"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              {/* Progress Bar */}
              <div className="space-y-1 mb-4">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Scan Progress</span>
                  <span className="text-cyan-400 font-bold">{asm.progress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-700"
                    style={{ width: `${asm.progress}%` }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <div className="text-xs text-slate-400">
                  Findings: <span className="font-mono text-white font-bold">{asm.findingsCount}</span>
                  {asm.criticalCount > 0 && (
                    <span className="text-red-400 ml-2 font-mono">({asm.criticalCount} Critical)</span>
                  )}
                </div>

                <button
                  onClick={() => setActivePage('vulnerabilities')}
                  className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <span>Review Findings</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <NewAssessmentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};
