import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { useAuth } from '../context/AuthContext';
import { SecurityAlert } from '../types';
import { RiskBadge } from '../components/common/RiskBadge';
import { Bell, CheckCircle, Clock, ShieldAlert, User, Search, Filter } from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { alerts, updateAlertStatus } = useSecurity();
  const { canPerformAction } = useAuth();
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredAlerts = alerts.filter((a) => {
    const matchSev = filterSeverity === 'All' || a.type === filterSeverity;
    const matchStatus = filterStatus === 'All' || a.status === filterStatus;
    return matchSev && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-400" />
            Security Alerts Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time security incident detection, automated rule violations, and analyst triage workflow
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
          <span>Active: <strong className="text-amber-400">{alerts.filter(a => a.status === 'Active').length}</strong></span>
          <span>•</span>
          <span>Investigating: <strong className="text-cyan-400">{alerts.filter(a => a.status === 'Investigating').length}</strong></span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <Filter className="w-3.5 h-3.5 text-slate-500 mr-1" />
          {['All', 'Critical', 'High', 'Medium', 'Low', 'Informational'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                filterSeverity === sev
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white border border-transparent'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          {['All', 'Active', 'Investigating', 'Reviewed', 'Resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                filterStatus === st
                  ? 'bg-slate-800 text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts Cards List (Section 22) */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <RiskBadge severity={alert.type} size="sm" />
                <span className="text-xs font-mono text-cyan-400 font-bold">{alert.id}</span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-400 font-mono">{alert.timestamp}</span>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-500">Source: {alert.source}</span>
              </div>

              <h3 className="text-sm font-bold text-white tracking-wide">{alert.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">{alert.message}</p>

              {alert.assignedTo && (
                <div className="flex items-center gap-1 text-[11px] text-cyan-300 font-mono pt-1">
                  <User className="w-3 h-3 text-cyan-400" />
                  <span>Assigned to: {alert.assignedTo}</span>
                </div>
              )}
            </div>

            {/* Actions: Mark as Reviewed, Assign, Investigate, Resolve */}
            {canPerformAction('remediate') && (
              <div className="flex flex-wrap items-center gap-2 shrink-0 self-end md:self-center">
                {alert.status === 'Active' && (
                  <>
                    <button
                      onClick={() => updateAlertStatus(alert.id, 'Reviewed')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
                    >
                      Mark Reviewed
                    </button>
                    <button
                      onClick={() => updateAlertStatus(alert.id, 'Investigating')}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-medium transition-colors"
                    >
                      Investigate
                    </button>
                  </>
                )}

                {alert.status === 'Investigating' && (
                  <button
                    onClick={() => updateAlertStatus(alert.id, 'Resolved')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-colors flex items-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Resolve Alert</span>
                  </button>
                )}

                {alert.status === 'Reviewed' && (
                  <button
                    onClick={() => updateAlertStatus(alert.id, 'Resolved')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-300 text-xs font-medium border border-slate-700 transition-colors"
                  >
                    Resolve
                  </button>
                )}

                {alert.status === 'Resolved' && (
                  <span className="px-3 py-1 rounded-full text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40">
                    ✓ Resolved
                  </span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
