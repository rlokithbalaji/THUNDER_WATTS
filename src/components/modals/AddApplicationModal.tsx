import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useSecurity } from '../../context/SecurityContext';
import { Application } from '../../types';
import { ShieldCheck, Plus } from 'lucide-react';

interface AddApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddApplicationModal: React.FC<AddApplicationModalProps> = ({ isOpen, onClose }) => {
  const { addApplication } = useSecurity();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [environment, setEnvironment] = useState<Application['environment']>('Test Environment');
  const [baseUrl, setBaseUrl] = useState('https://');
  const [technology, setTechnology] = useState('');
  const [owner, setOwner] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorized) {
      setError('You must explicitly confirm authorization before registering this application.');
      return;
    }
    if (!name.trim() || !baseUrl.trim()) {
      setError('Name and Base URL are required fields.');
      return;
    }

    addApplication({
      name,
      description,
      environment,
      status: 'Online',
      securityScore: 85,
      lastAssessment: 'Just now (Initial Scope)',
      risk: 'Medium',
      baseUrl,
      technology: technology || 'Node.js / React / Docker',
      owner: owner || 'SecOps Pod',
      authorized: true,
      endpointsCount: 12,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="+ Register Target Application"
      subtitle="Onboard an authorized web service or microservice for security telemetry"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-mono">
            ⚠ {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Application Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Identity Federation Hub"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Description
          </label>
          <textarea
            rows={2}
            placeholder="Brief purpose of the target system..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Environment
            </label>
            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Production-like Demo">Production-like Demo</option>
              <option value="Test Environment">Test Environment</option>
              <option value="Staging">Staging</option>
              <option value="Sandbox">Sandbox</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Base URL / Host
            </label>
            <input
              type="text"
              required
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Technology Stack
            </label>
            <input
              type="text"
              placeholder="e.g. FastAPI / Redis"
              value={technology}
              onChange={(e) => setTechnology(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              System Owner
            </label>
            <input
              type="text"
              placeholder="e.g. Core Platform Guild"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Mandatory Authorization Confirmation */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/30 mt-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={authorized}
              onChange={(e) => {
                setAuthorized(e.target.checked);
                if (e.target.checked) setError('');
              }}
              className="mt-0.5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 w-4 h-4"
            />
            <span className="text-xs text-slate-200 font-medium leading-relaxed">
              ☑ I confirm that I am authorized to assess this application and that testing is restricted to safe assessment boundaries.
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
            className="px-5 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-all shadow-lg shadow-cyan-900/30 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Application
          </button>
        </div>
      </form>
    </Modal>
  );
};
