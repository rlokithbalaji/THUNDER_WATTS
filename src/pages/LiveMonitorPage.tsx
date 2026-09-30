import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { Radio, Pause, Play, Trash2, Filter, Activity, ShieldCheck, Terminal } from 'lucide-react';

export const LiveMonitorPage: React.FC = () => {
  const { liveEvents, isLivePaused, toggleLivePause, clearLiveEvents } = useSecurity();
  const [filterType, setFilterType] = useState<string>('All');

  const filteredEvents = liveEvents.filter((evt) => {
    if (filterType === 'All') return true;
    return evt.severity === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Radio className="w-6 h-6 text-emerald-400 animate-pulse" />
            Live Security Monitor
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Simulated WebSocket event stream capturing runtime authentication, authorization checks, API calls, and AI anomalies
          </p>
        </div>

        {/* Live Controls (Section 21) */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={toggleLivePause}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              isLivePaused
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
            }`}
          >
            {isLivePaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{isLivePaused ? 'Resume Stream' : 'Pause Stream'}</span>
          </button>

          <button
            onClick={clearLiveEvents}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-red-400 border border-slate-700 text-xs transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Events</span>
          </button>
        </div>
      </div>

      {/* Stream Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isLivePaused ? 'bg-amber-400' : 'bg-emerald-400 animate-ping'
              }`}
            />
            <span className="text-white font-semibold">
              {isLivePaused ? 'FEED PAUSED' : 'STREAMING TELEMETRY (2.8s ticker)'}
            </span>
          </div>
          <span className="text-slate-500">|</span>
          <span className="text-xs font-mono text-cyan-400">{liveEvents.length} Captured Events</span>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="w-3 h-3 text-slate-400" />
          {['All', 'normal', 'info', 'suspicious', 'critical'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterType(sev)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono capitalize transition-colors ${
                filterType === sev
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Events Terminal Stream */}
      <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 font-mono text-xs shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-[11px] text-slate-500">
          <span>TIMESTAMP</span>
          <span>EVENT CLASSIFICATION / DETAILS</span>
          <span>ORIGIN & TARGET IP</span>
        </div>

        <div className="mt-3 space-y-2 max-h-[560px] overflow-y-auto custom-scrollbar">
          {filteredEvents.map((evt) => {
            const severityStyle = {
              normal: 'border-l-emerald-500 text-slate-200',
              info: 'border-l-blue-500 text-slate-200',
              suspicious: 'border-l-amber-500 text-amber-200 bg-amber-950/10',
              critical: 'border-l-red-500 text-red-200 bg-red-950/20',
            }[evt.severity];

            return (
              <div
                key={evt.id}
                className={`p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 border-l-4 ${severityStyle} hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 font-bold shrink-0">{evt.timestamp}</span>
                  <div>
                    <span className="font-semibold block">{evt.summary}</span>
                    <span className="text-[11px] text-slate-400 font-sans block mt-0.5">
                      {evt.details}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right text-[11px] text-slate-400 shrink-0">
                  <span className="text-cyan-400">{evt.actor}</span>
                  <span className="text-slate-500">({evt.ip})</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
