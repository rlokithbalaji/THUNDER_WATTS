import React from 'react';
import { ShieldCheck, CheckCircle2, BookOpen, AlertCircle, ExternalLink } from 'lucide-react';

export const CompliancePage: React.FC = () => {
  const complianceChecklist = [
    { title: 'Authorized Testing Framework', description: 'Testing strictly restricted to non-production environments with signed verification.', status: 'Compliant' },
    { title: 'Data Privacy & PII Safeguards', description: 'Zero live customer data used; synthetic mock test records and automatic redaction.', status: 'Compliant' },
    { title: 'Audit Logging & Immutability', description: 'Continuous chronological tracking of every user, assessment, and finding event.', status: 'Compliant' },
    { title: 'Role-Based Access Control (RBAC)', description: 'Granular segregation of duties among Administrator, Analyst, and Viewer roles.', status: 'Compliant' },
    { title: 'Evidence Tracking & Traceability', description: 'Sanitized request/response evidence payloads linked to CWE & CVSS classifications.', status: 'Compliant' },
    { title: 'Secure Communication Standards', description: 'Mandatory TLS 1.3 encryption with strict HSTS preload and modern cipher suites.', status: 'Compliant' },
  ];

  const frameworks = [
    { name: 'OWASP ASVS v4.0', level: 'Level 2 Standard', mapping: 'Covers verification requirements for authentication, session management, and access control.' },
    { name: 'OWASP Top 10:2021', level: 'Full Alignment', mapping: 'Direct mapping against A01 (Broken Access Control) through A10 (SSRF).' },
    { name: 'MITRE CWE Top 25', level: 'Active Tracking', mapping: 'Taxonomy correlation for CWE-89, CWE-79, CWE-285, CWE-613, and CWE-918.' },
    { name: 'CVSS v3.1 Scoring', level: 'Base Vector Metrics', mapping: 'Standardized quantitative scoring of vulnerability severity and attack complexity.' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-cyan-400" />
          Compliance & Governance Framework
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Informational alignment with industry cybersecurity standards and responsible authorized testing charters
        </p>
      </div>

      {/* Legal & Educational Disclaimer (Section 24) */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-white">Informational Framework Mapping:</strong> The checklists and standards below represent internal benchmarking against recognized security guidelines. This platform does not claim formal third-party ISO 27001, SOC 2, or PCI-DSS certification.
        </div>
      </div>

      {/* Governance Checklist (Section 24) */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
            Platform Security Governance Status
          </h3>
          <span className="text-xs font-mono text-emerald-400 font-semibold">6 / 6 Compliant</span>
        </div>

        <div className="divide-y divide-slate-800/60 text-xs">
          {complianceChecklist.map((item) => (
            <div key={item.title} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30 transition-colors">
              <div className="space-y-0.5">
                <span className="font-semibold text-white block">{item.title}</span>
                <span className="text-slate-400 text-[11px]">{item.description}</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 flex items-center gap-1.5 self-start sm:self-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" />
                ✓ Verified
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reference Standards (Section 24) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {frameworks.map((fw) => (
          <div key={fw.name} className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">{fw.name}</h4>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                {fw.level}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{fw.mapping}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
