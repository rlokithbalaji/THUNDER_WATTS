import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useSecurity } from '../../context/SecurityContext';
import { AssessmentType } from '../../types';
import { ShieldCheck, AlertTriangle, Play } from 'lucide-react';

interface NewAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES_OPTIONS = [
  'Authentication',
  'Session Management',
  'Authorization',
  'Input Validation',
  'API Security',
  'Client-Side Security',
  'Secure Communication',
  'Data Protection',
];

export const NewAssessmentModal: React.FC<NewAssessmentModalProps> = ({ isOpen, onClose }) => {
  const { applications, startAssessment } = useSecurity();

  const [assessmentName, setAssessmentName] = useState('');
  const [assessmentType, setAssessmentType] = useState<AssessmentType>('Web Application');
  const [selectedAppId, setSelectedAppId] = useState(applications[0]?.id || '');
  const [tester, setTester] = useState('Alex Rivera (Security Analyst)');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([
    'Authentication',
    'Authorization',
    'API Security',
    'Input Validation',
  ]);
  const [authorizedConfirmed, setAuthorizedConfirmed] = useState(false);
  const [error, setError] = useState('');

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorizedConfirmed) {
      setError('You must confirm explicit authorization before launching any assessment.');
      return;
    }
    if (!assessmentName.trim()) {
      setError('Please provide an assessment title.');
      return;
    }

    const app = applications.find(a => a.id === selectedAppId) || applications[0];

    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

    startAssessment({
      name: assessmentName,
      type: assessmentType,
      targetAppId: app.id,
      targetAppName: app.name,
      environment: app.environment,
      tester,
      startDate: today,
      endDate: nextWeek,
      status: 'In Progress',
      progress: 5,
      categories: selectedCategories,
      authorizedConfirmed: true,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Launch Authorized Security Assessment"
      subtitle="Configure target scope, testing categories, and verification boundaries"
      maxWidth="2xl"
    >
      <form onSubmit={handleStart} className="space-y-4">
        {/* Safety Disclaimer Banner */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200">
            <strong className="text-white block font-semibold mb-0.5">MANDATORY COMPLIANCE RULE:</strong>
            Testing is strictly restricted to authorized environments and synthetic/demo data. Do not target production systems without signed written authorization.
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-mono">
            ⚠ {error}
          </div>
        )}

        {/* Assessment Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Assessment Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Q4 Web Security Baseline Scan"
            value={assessmentName}
            onChange={(e) => {
              setAssessmentName(e.target.value);
              setError('');
            }}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Assessment Type & Target App */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Assessment Type
            </label>
            <select
              value={assessmentType}
              onChange={(e) => setAssessmentType(e.target.value as AssessmentType)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Web Application">Web Application</option>
              <option value="Mobile Application">Mobile Application</option>
              <option value="API">API</option>
              <option value="Infrastructure">Infrastructure</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Target Application
            </label>
            <select
              value={selectedAppId}
              onChange={(e) => setSelectedAppId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            >
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.name} ({app.environment})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tester */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Lead Security Tester / Assessor
          </label>
          <input
            type="text"
            required
            value={tester}
            onChange={(e) => setTester(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Security Categories Checklist */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Assessment Scope Categories
          </label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES_OPTIONS.map((cat) => {
              const checked = selectedCategories.includes(cat);
              return (
                <label
                  key={cat}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                    checked
                      ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-200'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCategory(cat)}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500"
                  />
                  <span>{cat}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Mandatory Authorization Confirmation */}
        <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={authorizedConfirmed}
              onChange={(e) => {
                setAuthorizedConfirmed(e.target.checked);
                if (e.target.checked) setError('');
              }}
              className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 w-4 h-4"
            />
            <span className="text-xs text-slate-200 font-medium leading-relaxed">
              ☑ <strong className="text-cyan-400">Authorization Confirmation:</strong> I confirm that I am explicitly authorized to assess this application and that testing will adhere to non-destructive safety parameters.
            </span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-slate-400 hover:text-white text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-all shadow-lg shadow-cyan-900/30 flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Start Authorized Assessment
          </button>
        </div>
      </form>
    </Modal>
  );
};
