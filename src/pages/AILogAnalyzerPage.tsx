import React, { useState } from 'react';
import { analyzeLogsContent, LogAnalysisReport } from '../services/aiService';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  FileText,
  Sparkles,
  Bot,
  AlertTriangle,
  ShieldCheck,
  CheckCircle,
  Clock,
  RotateCcw,
} from 'lucide-react';

const SAMPLE_LOG_RAW = `2026-09-30 08:21:04.102 [WARN] auth_guard: Login failed for user admin (invalid pass) from 198.51.100.42
2026-09-30 08:21:05.811 [WARN] auth_guard: Login failed for user root (invalid pass) from 198.51.100.42
2026-09-30 08:21:07.452 [WARN] auth_guard: Login failed for user sec_lead (invalid pass) from 198.51.100.42
2026-09-30 08:25:12.903 [ERROR] envoy_access: GET /api/v1/users/usr_9981/financial-profile 200 48ms - caller=usr_1042
2026-09-30 08:25:13.114 [ERROR] envoy_access: GET /api/v1/users/usr_9982/financial-profile 200 52ms - caller=usr_1042
2026-09-30 08:25:13.342 [ERROR] envoy_access: GET /api/v1/users/usr_9983/financial-profile 200 49ms - caller=usr_1042
2026-09-30 08:31:00.001 [INFO] ingress: TLS 1.3 session established client_ip=10.240.12.18
2026-09-30 08:32:15.654 [ALERT] policy_engine: Anomaly threshold reached: 143 credential attempts flagged`;

export const AILogAnalyzerPage: React.FC = () => {
  const [logText, setLogText] = useState(SAMPLE_LOG_RAW);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<LogAnalysisReport | null>(null);

  const handleAnalyze = async () => {
    if (!logText.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await analyzeLogsContent(logText);
      setReport(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileText className="w-6 h-6 text-cyan-400" />
            AI Log Analyzer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Timeline correlation and anomaly classification across authentication, authorization, and API logs
          </p>
        </div>

        <button
          onClick={() => {
            setLogText(SAMPLE_LOG_RAW);
            setReport(null);
          }}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reload Sample Log</span>
        </button>
      </div>

      {/* Input Textarea */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Raw Security Telemetry Logs
          </label>
          <span className="text-[11px] font-mono text-slate-500">Supported: Envoy, Nginx, WAF, Auth0, Systemd</span>
        </div>

        <textarea
          rows={6}
          value={logText}
          onChange={(e) => setLogText(e.target.value)}
          placeholder="Paste server logs or event streams here..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500 leading-relaxed"
        />

        <div className="flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={!logText.trim() || isAnalyzing}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-medium text-xs shadow-lg shadow-cyan-900/30 transition-all flex items-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Bot className="w-4 h-4 animate-spin" />
                <span>Correlating Telemetry Patterns...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze Logs with AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Report Section */}
      {report && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Top 3 Metric Cards: Normal, Suspicious, Issues */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/60 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs uppercase font-mono text-slate-400">Normal Events</span>
                <p className="text-2xl font-bold font-mono text-white">{report.normalCount.toLocaleString()}</p>
                <span className="text-[11px] text-emerald-400">Baseline Verified</span>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-amber-500/20 rounded-xl p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs uppercase font-mono text-slate-400">Suspicious Events</span>
                <p className="text-2xl font-bold font-mono text-white">{report.suspiciousCount}</p>
                <span className="text-[11px] text-amber-400">Anomalous Activity Flagged</span>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-red-500/20 rounded-xl p-4 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs uppercase font-mono text-slate-400">Potential Security Issues</span>
                <p className="text-2xl font-bold font-mono text-white">{report.issuesCount}</p>
                <span className="text-[11px] text-red-400">Action Required</span>
              </div>
            </div>
          </div>

          {/* AI Explanation Banner */}
          <div className="bg-slate-900/80 border border-cyan-500/30 rounded-xl p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-2 text-cyan-400 font-semibold uppercase text-xs tracking-wider">
              <Bot className="w-4 h-4" />
              <span>AI Correlation Explanation</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-950/40 p-4 rounded-lg border border-slate-800">
              {report.explanation}
            </p>
          </div>

          {/* Timeline Visualization */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                  Incident Timeline Spike Breakdown
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">Timezone: UTC</span>
            </div>

            <div className="w-full h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={report.timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
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
                    dataKey="count"
                    stroke="#f97316"
                    strokeWidth={2}
                    fill="#f97316"
                    fillOpacity={0.25}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
