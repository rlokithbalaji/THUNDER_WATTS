import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { ScrollText, Search, Lock, Filter, ShieldCheck } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { auditLogs } = useSecurity();
  const [search, setSearch] = useState('');
  const [resultFilter, setResultFilter] = useState('All');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.resource.toLowerCase().includes(search.toLowerCase()) ||
      log.ipEnvironment.toLowerCase().includes(search.toLowerCase());

    const matchesResult = resultFilter === 'All' || log.result === resultFilter;

    return matchesSearch && matchesResult;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <ScrollText className="w-6 h-6 text-cyan-400" />
            Immutable Audit Trail
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Tamper-evident chronological journal tracking all security operations, role updates, and assessment runs
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>WORM Storage: <strong className="text-white">Active (Immutable)</strong></span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by user, action, or resource..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          {['All', 'Success', 'Denied', 'Warning'].map((res) => (
            <button
              key={res}
              onClick={() => setResultFilter(res)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                resultFilter === res
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              {res}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table (Section 25) */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 uppercase tracking-wider text-[11px] font-mono">
                <th className="py-3.5 px-4">Timestamp (UTC)</th>
                <th className="py-3.5 px-4">Operator User</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Target Resource</th>
                <th className="py-3.5 px-4">Result</th>
                <th className="py-3.5 px-4 text-right">IP / Environment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
              {filteredLogs.map((log) => {
                const resultStyle = {
                  Success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
                  Denied: 'bg-red-500/10 text-red-400 border-red-500/20',
                  Warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                  Error: 'bg-red-500/10 text-red-400 border-red-500/20',
                }[log.result];

                return (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                      {log.timestamp}
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-white block">{log.user}</span>
                      <span className="text-[10px] text-slate-500 font-sans">{log.role}</span>
                    </td>

                    <td className="py-3 px-4 font-sans text-slate-200">
                      {log.action}
                    </td>

                    <td className="py-3 px-4 text-cyan-300">
                      {log.resource}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${resultStyle}`}>
                        {log.result}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right text-slate-400 text-[11px]">
                      {log.ipEnvironment}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
