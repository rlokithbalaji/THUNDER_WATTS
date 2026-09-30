import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 py-6 border-t border-slate-800/80 bg-slate-950/60 text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-300">World Monitor © 2026</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">Authorized Security Assessment Platform</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/50 border border-cyan-800/50 text-cyan-300 font-mono text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            AI Safe Assessment Mode Enabled
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline font-mono text-[11px] text-slate-500">v2.4-enterprise</span>
        </div>
      </div>
    </footer>
  );
};
