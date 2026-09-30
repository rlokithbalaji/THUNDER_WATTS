import React, { useState } from 'react';
import { AIAnalysisResult } from '../../types';
import { RiskBadge } from '../common/RiskBadge';
import {
  ShieldAlert,
  HelpCircle,
  AlertTriangle,
  FileCode,
  CheckCircle2,
  Copy,
  Check,
  Zap,
} from 'lucide-react';

interface AIAnalysisCardProps {
  result: AIAnalysisResult;
}

export const AIAnalysisCard: React.FC<AIAnalysisCardProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyFix = () => {
    navigator.clipboard.writeText(result.recommendedFix);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-6 shadow-2xl space-y-6">
      {/* Title & Severity Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 tracking-wider">
              AI Vulnerability Diagnostics Result
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
              Confidence {result.confidence}%
            </span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-wide">
            {result.potentialVulnerability}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Target Component: <span className="text-cyan-300 font-mono">{result.affectedComponent}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <RiskBadge severity={result.severity} size="lg" />
        </div>
      </div>

      {/* Grid: Why This Matters & Potential Impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-semibold uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>Why This Matters</span>
          </div>
          <p className="text-slate-300 leading-relaxed">{result.whyThisMatters}</p>
        </div>

        <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-semibold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Potential Impact</span>
          </div>
          <p className="text-slate-300 leading-relaxed">{result.potentialImpact}</p>
        </div>
      </div>

      {/* Evidence */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2 text-slate-400 font-semibold uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4 text-cyan-400" />
          <span>Extracted Evidence</span>
        </div>
        <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
          {result.evidence}
        </pre>
      </div>

      {/* Recommended Fix */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold uppercase tracking-wider">
            <FileCode className="w-4 h-4" />
            <span>Recommended Fix</span>
          </div>
          <button
            onClick={handleCopyFix}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Remediation'}</span>
          </button>
        </div>
        <pre className="p-4 rounded-xl bg-slate-950 border border-emerald-900/40 font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
          {result.recommendedFix}
        </pre>
      </div>

      {/* Retest Procedure */}
      <div className="bg-cyan-950/20 border border-cyan-800/40 rounded-xl p-4 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-cyan-300 font-semibold uppercase tracking-wider">
          <CheckCircle2 className="w-4 h-4" />
          <span>Safe Retest Procedure</span>
        </div>
        <p className="text-slate-300 leading-relaxed">{result.retestProcedure}</p>
      </div>
    </div>
  );
};
