import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/common/StatCard';
import { SafetyBanner } from '../components/common/SafetyBanner';
import { SecurityScoreGauge } from '../components/charts/SecurityScoreGauge';
import { SecurityRadarChart } from '../components/charts/SecurityRadarChart';
import { SecurityTrendChart } from '../components/charts/SecurityTrendChart';
import { VulnTrendChart } from '../components/charts/VulnTrendChart';
import { NewAssessmentModal } from '../components/modals/NewAssessmentModal';
import {
  Layers,
  Search,
  ShieldAlert,
  Flame,
  Activity,
  Network,
  UserX,
  BellRing,
  Plus,
  Bot,
  FileBarChart2,
  Radio,
  ArrowUpRight,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    applications,
    assessments,
    vulnerabilities,
    alerts,
    setActivePage,
    setIsAIChatOpen,
  } = useSecurity();
  const { canPerformAction } = useAuth();
  const [assessmentModalOpen, setAssessmentModalOpen] = useState(false);

  const openVulns = vulnerabilities.filter(v => v.status === 'Open' || v.status === 'Investigating').length;
  const criticalVulns = vulnerabilities.filter(v => (v.status === 'Open' || v.status === 'Investigating') && v.severity === 'Critical').length;
  const activeAlerts = alerts.filter(a => a.status === 'Active').length;

  return (
    <div className="space-y-6">
      {/* Top Safety Banner */}
      <SafetyBanner />

      {/* Page Header & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Security Overview
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time monitoring of authorized applications & simulated telemetry
          </p>
        </div>

        {/* Section 32: Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {canPerformAction('assess') && (
            <button
              onClick={() => setAssessmentModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-900/30 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ New Assessment</span>
            </button>
          )}

          <button
            onClick={() => setActivePage('ai-analyzer')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-cyan-300 border border-slate-700 text-xs font-medium transition-colors"
          >
            <Bot className="w-3.5 h-3.5 text-cyan-400" />
            <span>🤖 AI Analyze</span>
          </button>

          <button
            onClick={() => setActivePage('reports')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
          >
            <FileBarChart2 className="w-3.5 h-3.5 text-blue-400" />
            <span>📊 Generate Report</span>
          </button>

          <button
            onClick={() => setActivePage('vulnerabilities')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>🔍 View Vulns</span>
          </button>

          <button
            onClick={() => setActivePage('live-monitor')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>📡 Live Monitor</span>
          </button>
        </div>
      </div>

      {/* Section 5: Top 8 KPI Cards with animated numbers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <StatCard
          title="Total Apps"
          value={applications.length || 12}
          icon={Layers}
          accentColor="blue"
          onClick={() => setActivePage('applications')}
        />
        <StatCard
          title="Active Scans"
          value={assessments.length || 4}
          icon={Search}
          accentColor="cyan"
          onClick={() => setActivePage('assessments')}
        />
        <StatCard
          title="Open Vulns"
          value={openVulns}
          icon={ShieldAlert}
          accentColor="amber"
          onClick={() => setActivePage('vulnerabilities')}
        />
        <StatCard
          title="Critical Findings"
          value={criticalVulns}
          icon={Flame}
          accentColor="red"
          onClick={() => setActivePage('vulnerabilities')}
        />
        <StatCard
          title="Security Score"
          value={82}
          suffix="%"
          icon={Activity}
          accentColor="emerald"
        />
        <StatCard
          title="API Requests"
          value="24.8K"
          icon={Network}
          accentColor="cyan"
          onClick={() => setActivePage('api-security')}
        />
        <StatCard
          title="Failed Logins"
          value={143}
          icon={UserX}
          accentColor="red"
          onClick={() => setActivePage('authentication')}
        />
        <StatCard
          title="AI Alerts"
          value={activeAlerts}
          icon={BellRing}
          accentColor="amber"
          onClick={() => setActivePage('alerts')}
        />
      </div>

      {/* Row 2: Circular Security Score (Section 6) + Domain Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <SecurityScoreGauge score={82} />
        </div>
        <div className="lg:col-span-5">
          <SecurityRadarChart />
        </div>
      </div>

      {/* Row 3: Security Score Trend (Section 7) + Vulnerabilities Over Time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SecurityTrendChart />
        <VulnTrendChart />
      </div>

      {/* Row 4: Recent Active Scans & High-Risk Applications Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Assessments Card */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              Active Security Assessments
            </h3>
            <button
              onClick={() => setActivePage('assessments')}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {assessments.slice(0, 3).map((asm) => (
              <div
                key={asm.id}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-white truncate">{asm.name}</span>
                  <span className="font-mono text-cyan-400">{asm.progress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mb-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                    style={{ width: `${asm.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Target: {asm.targetAppName}</span>
                  <span className="font-mono">{asm.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority AI Insights Card */}
        <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                AI Threat & Anomaly Insights
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
              SAFE MODE
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/20 text-xs space-y-2.5">
            <p className="text-slate-200 leading-relaxed">
              <strong className="text-cyan-300 font-semibold">Priority Triage:</strong> Unsanitized input parameter in <code className="text-cyan-400 font-mono">Analytics API Gateway</code> (WM-005) presents highest blast radius. Recommend deploying parameterized query interceptors.
            </p>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
              <span>Telemetry status: <strong>Normal baseline</strong></span>
              <span>•</span>
              <span>Egress: <strong>Loopback protected</strong></span>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setIsAIChatOpen(true)}
              className="flex-1 py-2 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-xs font-medium transition-colors flex items-center justify-center gap-2"
            >
              <span>Consult AI Assistant</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActivePage('ai-analyzer')}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
            >
              Raw Analyzer
            </button>
          </div>
        </div>
      </div>

      {/* New Assessment Modal */}
      <NewAssessmentModal
        isOpen={assessmentModalOpen}
        onClose={() => setAssessmentModalOpen(false)}
      />
    </div>
  );
};
