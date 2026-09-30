import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatCard } from '../components/common/StatCard';
import { Network, Lock, Globe, AlertTriangle, Search, Bot, ArrowRight } from 'lucide-react';

export const APISecurityPage: React.FC = () => {
  const { endpoints, apiSummary, setActivePage } = useSecurity();
  const [search, setSearch] = useState('');
  const [filterMethod, setFilterMethod] = useState('All');

  const filteredEndpoints = endpoints.filter((ep) => {
    const matchesSearch = ep.path.toLowerCase().includes(search.toLowerCase());
    const matchesMethod = filterMethod === 'All' || ep.method === filterMethod;
    return matchesSearch && matchesMethod;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Network className="w-6 h-6 text-cyan-400" />
            API Security Inventory & Posture
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Continuous endpoint inventory, authentication enforcement, and authorization boundary mapping
          </p>
        </div>

        <button
          onClick={() => setActivePage('ai-analyzer')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-xs font-medium transition-colors self-start sm:self-auto"
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Analyze Endpoint Request with AI</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Top Stat Cards (Section 15) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Endpoints"
          value={apiSummary.totalEndpoints}
          icon={Network}
          accentColor="blue"
        />
        <StatCard
          title="Authenticated"
          value={apiSummary.authenticated}
          icon={Lock}
          accentColor="emerald"
        />
        <StatCard
          title="Public Endpoints"
          value={apiSummary.public}
          icon={Globe}
          accentColor="amber"
        />
        <StatCard
          title="Potential Issues"
          value={apiSummary.potentialIssues}
          icon={AlertTriangle}
          accentColor="red"
        />
      </div>

      {/* Endpoint Table */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl overflow-hidden shadow-xl">
        {/* Controls */}
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search API endpoints (e.g. /users)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            {['All', 'GET', 'POST', 'PUT', 'DELETE'].map((m) => (
              <button
                key={m}
                onClick={() => setFilterMethod(m)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors ${
                  filterMethod === m
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 uppercase tracking-wider text-[11px] font-mono">
                <th className="py-3.5 px-4">Method</th>
                <th className="py-3.5 px-4">Endpoint Path</th>
                <th className="py-3.5 px-4">Authentication</th>
                <th className="py-3.5 px-4">Authorization</th>
                <th className="py-3.5 px-4">Risk</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
              {filteredEndpoints.map((ep) => {
                const methodColors: Record<string, string> = {
                  GET: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
                  POST: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
                  PUT: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
                  DELETE: 'bg-red-500/10 text-red-400 border-red-500/30',
                };

                return (
                  <tr key={ep.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          methodColors[ep.method] || 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {ep.method}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-slate-200">
                      {ep.path}
                    </td>

                    <td className="py-3.5 px-4 text-xs font-sans">
                      <span
                        className={`inline-flex items-center gap-1.5 ${
                          ep.authentication === 'Required'
                            ? 'text-emerald-400'
                            : 'text-amber-400'
                        }`}
                      >
                        <Lock className="w-3 h-3" />
                        {ep.authentication}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 font-sans text-xs">
                      {ep.authorization}
                    </td>

                    <td className="py-3.5 px-4 font-sans">
                      <RiskBadge severity={ep.risk} size="sm" />
                    </td>

                    <td className="py-3.5 px-4 font-sans">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                          ep.status === 'Vulnerable'
                            ? 'bg-red-500/10 text-red-400 border-red-500/20'
                            : ep.status === 'Audited'
                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {ep.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right text-slate-400">
                      {ep.responseTime}
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
