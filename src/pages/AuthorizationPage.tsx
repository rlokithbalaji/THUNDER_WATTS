import React, { useState } from 'react';
import { UsersRound, Play, CheckCircle2, XCircle, ShieldCheck, AlertCircle } from 'lucide-react';

const TEST_USERS = [
  { id: 'usr-1', name: 'Demo Analyst (Alex Rivera)', role: 'Security Analyst' },
  { id: 'usr-2', name: 'Viewer Account (Morgan Vance)', role: 'Viewer' },
  { id: 'usr-3', name: 'Lead Administrator (Sarah Connor)', role: 'Security Administrator' },
  { id: 'usr-4', name: 'Unauthenticated Guest Persona', role: 'Anonymous' },
];

const RESOURCES = [
  { id: 'res-1', name: 'Admin User Management (/api/admin/users)', minRole: 'Security Administrator' },
  { id: 'res-2', name: 'Launch Security Assessment (/api/assessments)', minRole: 'Security Analyst' },
  { id: 'res-3', name: 'View Security Dashboard (/api/dashboard)', minRole: 'Viewer' },
  { id: 'res-4', name: 'Export Raw Audit Trail (/api/audit/export)', minRole: 'Security Administrator' },
  { id: 'res-5', name: 'Mutate Vulnerability Status (/api/findings/triage)', minRole: 'Security Analyst' },
  { id: 'res-6', name: 'System Security Configuration (/api/settings)', minRole: 'Security Administrator' },
];

export const AuthorizationPage: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState(TEST_USERS[0].id);
  const [selectedResource, setSelectedResource] = useState(RESOURCES[0].id);
  const [expectedPermission, setExpectedPermission] = useState<'ALLOW' | 'DENY'>('DENY');
  const [testResult, setTestResult] = useState<{
    testedUser: string;
    role: string;
    resource: string;
    expected: 'ALLOW' | 'DENY';
    observed: 'ALLOW' | 'DENY';
    pass: boolean;
    reason: string;
  } | null>(null);

  const runAuthorizationCheck = () => {
    const user = TEST_USERS.find(u => u.id === selectedUser)!;
    const resource = RESOURCES.find(r => r.id === selectedResource)!;

    // RBAC evaluation matrix
    let observed: 'ALLOW' | 'DENY' = 'DENY';

    if (user.role === 'Security Administrator') {
      observed = 'ALLOW';
    } else if (user.role === 'Security Analyst') {
      if (
        resource.minRole === 'Security Analyst' ||
        resource.minRole === 'Viewer'
      ) {
        observed = 'ALLOW';
      } else {
        observed = 'DENY';
      }
    } else if (user.role === 'Viewer') {
      if (resource.minRole === 'Viewer') {
        observed = 'ALLOW';
      } else {
        observed = 'DENY';
      }
    } else {
      observed = 'DENY';
    }

    const pass = observed === expectedPermission;
    const reason =
      observed === 'ALLOW'
        ? `Permission granted: Role "${user.role}" satisfies access policy threshold "${resource.minRole}".`
        : `Access prohibited: Role "${user.role}" lacks privileges for protected resource requiring "${resource.minRole}".`;

    setTestResult({
      testedUser: user.name,
      role: user.role,
      resource: resource.name,
      expected: expectedPermission,
      observed,
      pass,
      reason,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <UsersRound className="w-6 h-6 text-cyan-400" />
          Access Control & Authorization Tester
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Interactive Policy Decision Point (PDP) test harness for role-based and attribute-based permissions
        </p>
      </div>

      {/* Safety Notice */}
      <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-800/40 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
        <span className="text-xs text-cyan-200">
          <strong>Simulator Notice:</strong> Test requests execute inside the simulated policy sandbox. No production accounts or data are altered.
        </span>
      </div>

      {/* Interactive Simulator Box (Section 17) */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-6">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
          Configure Authorization Probe
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              1. Test User Persona
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {TEST_USERS.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              2. Assigned Role
            </label>
            <input
              type="text"
              readOnly
              value={TEST_USERS.find(u => u.id === selectedUser)?.role || ''}
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-cyan-400 font-mono focus:outline-none cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              3. Target Resource
            </label>
            <select
              value={selectedResource}
              onChange={(e) => setSelectedResource(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {RESOURCES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              4. Expected Permission
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setExpectedPermission('ALLOW')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  expectedPermission === 'ALLOW'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                ALLOW
              </button>
              <button
                type="button"
                onClick={() => setExpectedPermission('DENY')}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  expectedPermission === 'DENY'
                    ? 'bg-red-500/20 text-red-300 border-red-500/40 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                    : 'bg-slate-950 text-slate-400 border-slate-800'
                }`}
              >
                DENY
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={runAuthorizationCheck}
            className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-lg shadow-cyan-900/30 transition-all flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Execute Authorization Check</span>
          </button>
        </div>
      </div>

      {/* Test Result Display (Section 17) */}
      {testResult && (
        <div
          className={`p-6 rounded-2xl border transition-all animate-in fade-in duration-200 ${
            testResult.pass
              ? 'bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.15)]'
              : 'bg-red-950/20 border-red-500/40 shadow-[0_0_25px_rgba(239,68,68,0.15)]'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              {testResult.pass ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              ) : (
                <XCircle className="w-8 h-8 text-red-400" />
              )}
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Authorization Check Result
                </span>
                <h3
                  className={`text-2xl font-bold font-mono ${
                    testResult.pass ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {testResult.pass ? 'PASS' : 'FAIL'}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-slate-500">Expected: </span>
                <span className="font-bold text-white">{testResult.expected}</span>
              </div>
              <div className="bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                <span className="text-slate-500">Observed: </span>
                <span className="font-bold text-cyan-300">{testResult.observed}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">User Persona</span>
              <span className="text-white font-medium">{testResult.testedUser}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Resource</span>
              <span className="text-slate-300 font-mono">{testResult.resource}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Policy Explanation</span>
              <span className="text-slate-300">{testResult.reason}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
