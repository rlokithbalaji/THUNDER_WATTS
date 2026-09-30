import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { useAuth } from '../context/AuthContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { AddApplicationModal } from '../components/modals/AddApplicationModal';
import {
  Layers,
  Plus,
  Search,
  ExternalLink,
  ShieldCheck,
  Filter,
  CheckCircle,
  AlertCircle,
  Globe,
} from 'lucide-react';

export const ApplicationsPage: React.FC = () => {
  const { applications, setActivePage } = useSecurity();
  const { canPerformAction } = useAuth();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [filterEnv, setFilterEnv] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApps = applications.filter((app) => {
    const matchesEnv = filterEnv === 'All' || app.environment === filterEnv;
    const matchesQuery =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.technology.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.owner.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEnv && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-cyan-400" />
            Target Applications
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Authorized web services, mobile clients, and backend microservices under continuous monitoring
          </p>
        </div>

        {canPerformAction('admin') && (
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-900/30 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Application</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search applications or tech stack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          {['All', 'Production-like Demo', 'Test Environment', 'Staging', 'Sandbox'].map((env) => (
            <button
              key={env}
              onClick={() => setFilterEnv(env)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                filterEnv === env
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
              }`}
            >
              {env}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table / Cards */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400 uppercase tracking-wider text-[11px] font-mono">
                <th className="py-3.5 px-4">Application Name</th>
                <th className="py-3.5 px-4">Environment</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-center">Security Score</th>
                <th className="py-3.5 px-4">Last Assessment</th>
                <th className="py-3.5 px-4">Risk Profile</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredApps.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-slate-800/40 transition-colors group cursor-default"
                >
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                      <span>{app.name}</span>
                      {app.authorized && (
                        <span title="Explicitly authorized" className="text-cyan-400">
                          <ShieldCheck className="w-3.5 h-3.5 inline" />
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-xs">
                      {app.description}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {app.baseUrl}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-slate-800/80 border border-slate-700 text-slate-300">
                      {app.environment}
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {app.status}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-1.5">
                      <span
                        className={`text-sm font-bold font-mono ${
                          app.securityScore >= 80
                            ? 'text-emerald-400'
                            : app.securityScore >= 70
                            ? 'text-amber-400'
                            : 'text-red-400'
                        }`}
                      >
                        {app.securityScore}%
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                    {app.lastAssessment}
                  </td>

                  <td className="py-3.5 px-4">
                    <RiskBadge severity={app.risk} size="sm" />
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setActivePage('assessments')}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-700 hover:border-cyan-800 text-[11px] transition-colors"
                    >
                      Audit Scope
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Application Modal */}
      <AddApplicationModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
    </div>
  );
};
