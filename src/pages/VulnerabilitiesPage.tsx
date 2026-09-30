import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { Vulnerability, SeverityLevel } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import {
  ShieldAlert,
  Search,
  Filter,
  Eye,
  SlidersHorizontal,
  Bot,
  ExternalLink,
} from 'lucide-react';

export const VulnerabilitiesPage: React.FC = () => {
  const { vulnerabilities, setSelectedVulnerability } = useSecurity();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const filteredVulns = vulnerabilities.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.component.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.cwe.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity =
      selectedSeverity === 'All'
        ? true
        : selectedSeverity === 'Resolved'
        ? v.status === 'Remediated'
        : v.severity.toLowerCase() === selectedSeverity.toLowerCase();

    const matchesStatus =
      selectedStatus === 'All' ? true : v.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
            Vulnerability Findings Catalog
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Aggregated findings across authorized web, mobile, and API microservices with AI triage confidence
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
          <span>Catalog Total: <strong className="text-white">{vulnerabilities.length}</strong></span>
          <span>•</span>
          <span>Open: <strong className="text-red-400">{vulnerabilities.filter(v => v.status === 'Open').length}</strong></span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID (e.g. WM-001), vulnerability title, or CWE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        {/* Severity Tabs (Section 10) */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
          {['All', 'Critical', 'High', 'Medium', 'Low', 'Informational', 'Resolved'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSelectedSeverity(sev)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedSeverity === sev
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Vulnerabilities Table */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 uppercase tracking-wider text-[11px] font-mono">
                <th className="py-3.5 px-4">ID</th>
                <th className="py-3.5 px-4">Vulnerability</th>
                <th className="py-3.5 px-4">Severity</th>
                <th className="py-3.5 px-4">Component</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Detected</th>
                <th className="py-3.5 px-4 text-center">AI Confidence</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredVulns.map((v) => (
                <tr
                  key={v.id}
                  onClick={() => setSelectedVulnerability(v)}
                  className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-cyan-400 text-xs">
                    {v.id}
                  </td>

                  <td className="py-3.5 px-4 max-w-md">
                    <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {v.title}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {v.cwe} • CVSS {v.cvss}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <RiskBadge severity={v.severity} size="sm" />
                  </td>

                  <td className="py-3.5 px-4 text-slate-300 font-medium">
                    {v.component}
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                        v.status === 'Open'
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : v.status === 'Investigating'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : v.status === 'Remediated'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {v.detected}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="font-mono text-cyan-400 font-semibold bg-cyan-950/60 border border-cyan-800/50 px-2 py-0.5 rounded text-[11px]">
                      {v.aiConfidence}%
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVulnerability(v);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-700 hover:border-cyan-800 text-[11px] transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
