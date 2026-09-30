import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import {
  FileBarChart2,
  Sparkles,
  Printer,
  Download,
  FileSpreadsheet,
  CheckCircle,
  Bot,
  ShieldCheck,
} from 'lucide-react';

export const ReportGeneratorPage: React.FC = () => {
  const { applications, vulnerabilities } = useSecurity();

  const [sections, setSections] = useState({
    executiveSummary: true,
    technicalFindings: true,
    riskAssessment: true,
    evidence: true,
    remediation: true,
    retestResults: true,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(true);

  const toggleSection = (key: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setReportGenerated(true);
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = 'ID,Title,Severity,Component,Status,CVSS,CWE\n';
    const rows = vulnerabilities
      .map(v => `"${v.id}","${v.title.replace(/"/g, '""')}","${v.severity}","${v.component}","${v.status}","${v.cvss}","${v.cwe}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `World_Monitor_Vulnerabilities_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileBarChart2 className="w-6 h-6 text-cyan-400" />
            AI Security Report Generator
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated synthesis of executive briefings, technical threat analyses, and audit documentation
          </p>
        </div>

        {reportGenerated && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-400" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-900/30 transition-all"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        )}
      </div>

      {/* Options Panel (Section 23) */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 space-y-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Configure Report Sections
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { id: 'executiveSummary', label: 'Executive Summary' },
            { id: 'technicalFindings', label: 'Technical Findings' },
            { id: 'riskAssessment', label: 'Risk Assessment' },
            { id: 'evidence', label: 'Evidence Logs' },
            { id: 'remediation', label: 'Remediation' },
            { id: 'retestResults', label: 'Retest Results' },
          ].map((item) => (
            <label
              key={item.id}
              className={`p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-center gap-2.5 ${
                sections[item.id as keyof typeof sections]
                  ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-200'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400'
              }`}
            >
              <input
                type="checkbox"
                checked={sections[item.id as keyof typeof sections]}
                onChange={() => toggleSection(item.id as keyof typeof sections)}
                className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="truncate">{item.label}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-medium text-xs shadow-lg shadow-cyan-900/30 transition-all flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Bot className="w-4 h-4 animate-spin" />
                <span>Synthesizing Report Sections...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Report</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Rendered 11-Section Document Preview (Section 23) */}
      {reportGenerated && (
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-8 sm:p-12 shadow-2xl space-y-10 text-slate-200 font-sans leading-relaxed print:bg-white print:text-black print:border-none print:shadow-none">
          {/* Document Header */}
          <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2 font-mono text-cyan-400 text-xs uppercase font-bold tracking-widest">
                <ShieldCheck className="w-4 h-4" />
                <span>WORLD MONITOR ASSURANCE REPORT</span>
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Enterprise Authorized Security Assessment Report
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Generated: {new Date().toLocaleDateString('en-US', { dateStyle: 'long' })} • Lead Assessor: Alex Rivera • Classification: Authorized Confidential
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold font-mono text-cyan-400">82%</span>
              <span className="text-xs block text-slate-400 font-mono">OVERALL POSTURE SCORE</span>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          {sections.executiveSummary && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-cyan-400 uppercase tracking-wider font-mono">
                1. Executive Summary
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                During the September 2026 assessment cycle, World Monitor Security evaluated 12 critical application services within authorized test and staging boundaries. The evaluation identified 18 open vulnerabilities, including 2 critical-severity findings that require immediate mitigation prior to production sign-off. The composite security posture scored at <strong>82 / 100 (Grade B+)</strong>. Transport security and authentication frameworks demonstrated robust defense, while API authorization checks (BOLA) and telemetry query escaping represent primary remediable vectors.
              </p>
            </div>
          )}

          {/* Section 2: Scope */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-cyan-400 uppercase tracking-wider font-mono">
              2. Assessment Scope
            </h3>
            <p className="text-xs text-slate-300">
              Testing was strictly restricted to authorized non-production environments with synthetic datasets. Out-of-scope production customer databases and denial-of-service stress testing were excluded in compliance with the platform safety charter.
            </p>
          </div>

          {/* Section 3: Methodology */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-cyan-400 uppercase tracking-wider font-mono">
              3. Methodology
            </h3>
            <p className="text-xs text-slate-300">
              The assessment followed the <strong>OWASP ASVS v4.0</strong> verification methodology, encompassing automated black-box dynamic fuzzing (DAST), authenticated API parameter boundary analysis, client-side header audits, and AI-assisted anomaly correlation.
            </p>
          </div>

          {/* Section 4: Applications Tested */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-cyan-400 uppercase tracking-wider font-mono">
              4. Applications Tested
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
              {applications.slice(0, 6).map(app => (
                <div key={app.id} className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  <span className="font-bold text-white block">{app.name}</span>
                  <span className="text-[10px] text-slate-400">{app.environment} • Score: {app.securityScore}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Findings Summary */}
          {sections.technicalFindings && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-cyan-400 uppercase tracking-wider font-mono">
                5. Key Findings Summary
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-800 font-mono">
                  <thead className="bg-slate-950 text-slate-400">
                    <tr>
                      <th className="p-2.5 border-b border-slate-800">ID</th>
                      <th className="p-2.5 border-b border-slate-800">Title</th>
                      <th className="p-2.5 border-b border-slate-800">Severity</th>
                      <th className="p-2.5 border-b border-slate-800">Component</th>
                      <th className="p-2.5 border-b border-slate-800">CVSS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    {vulnerabilities.slice(0, 6).map(v => (
                      <tr key={v.id}>
                        <td className="p-2.5 font-bold text-cyan-400">{v.id}</td>
                        <td className="p-2.5 text-white">{v.title}</td>
                        <td className="p-2.5 font-semibold text-amber-400">{v.severity}</td>
                        <td className="p-2.5">{v.component}</td>
                        <td className="p-2.5">{v.cvss}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section 6: Risk Assessment */}
          {sections.riskAssessment && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-cyan-400 uppercase tracking-wider font-mono">
                6. Risk Assessment Matrix
              </h3>
              <p className="text-xs text-slate-300">
                Identified risks were graded using Common Vulnerability Scoring System (CVSS v3.1). Critical findings WM-005 and WM-006 present exploitation probability in unauthenticated ingress pathways, warranting top sprint prioritization.
              </p>
            </div>
          )}

          {/* Section 7: Evidence */}
          {sections.evidence && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-cyan-400 uppercase tracking-wider font-mono">
                7. Technical Evidence Logs
              </h3>
              <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto">
{`GET /api/v1/users/usr_9981/financial-profile HTTP/1.1
Host: api-stage.worldmonitor.internal
Authorization: Bearer <test_token>
Status: 200 OK (Unchecked Object Access Confirmed)`}
              </pre>
            </div>
          )}

          {/* Section 8: Business Impact */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-cyan-400 uppercase tracking-wider font-mono">
              8. Business & Operational Impact
            </h3>
            <p className="text-xs text-slate-300">
              Left unaddressed, cross-tenant parameter disclosure could lead to regulatory privacy penalties under GDPR / CCPA standards. Early identification in the test cycle ensures zero business downtime.
            </p>
          </div>

          {/* Section 9: Recommendations */}
          {sections.remediation && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-cyan-400 uppercase tracking-wider font-mono">
                9. Strategic Remediation Roadmap
              </h3>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300">
                <li>Deploy prepared statement parameter bindings across telemetry gateway queries (WM-005).</li>
                <li>Implement RFC-1918 loopback egress IP filtering in the webhook delivery engine (WM-006).</li>
                <li>Enforce server-side tenancy verification middleware on user profile endpoints (WM-001).</li>
                <li>Add Strict-Transport-Security (HSTS) and Content-Security-Policy (CSP) to ingress reverse proxies (WM-002).</li>
              </ul>
            </div>
          )}

          {/* Section 10: Retesting */}
          {sections.retestResults && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-cyan-400 uppercase tracking-wider font-mono">
                10. Verification & Retesting Schedule
              </h3>
              <p className="text-xs text-slate-300">
                Automated continuous regression testing will poll fixed commits every 24 hours. Remediation status for WM-008 and WM-009 has been confirmed verified.
              </p>
            </div>
          )}

          {/* Section 11: Conclusion */}
          <div className="space-y-3 border-t border-slate-800 pt-6">
            <h3 className="text-base font-bold text-cyan-400 uppercase tracking-wider font-mono">
              11. Conclusion & Authorization Sign-off
            </h3>
            <p className="text-xs text-slate-400">
              The evaluated test systems demonstrate strong baseline foundations. Implementing the recommended priority remediation items will raise the platform security posture score above the 90% target threshold.
            </p>
            <div className="pt-4 flex items-center justify-between text-xs font-mono text-slate-500">
              <span>Sign-off: Lead Cybersecurity Analyst</span>
              <span>Controlled Authorized Document</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
