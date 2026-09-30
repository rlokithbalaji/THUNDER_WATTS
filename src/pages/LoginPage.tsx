import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight, ShieldAlert, Sparkles, Terminal } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, loginWithDemo } = useAuth();
  const [email, setEmail] = useState('admin@worldmonitor.demo');
  const [password, setPassword] = useState('Demo@123');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide valid login credentials.');
      return;
    }
    const success = login(email, password);
    if (!success) {
      setError('Invalid credentials. Use the Demo credentials provided below.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background Cyber Grid & Ambient Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        {/* Brand Icon & Heading */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-to-tr from-cyan-600 to-blue-600 border border-cyan-400/40 shadow-xl shadow-cyan-900/40 mb-3">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-wider text-white font-mono">
            WORLD <span className="text-cyan-400">MONITOR</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            AI-Powered Security Monitoring & Assessment Platform
          </p>
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-semibold bg-cyan-950/60 text-cyan-300 border border-cyan-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            AUTHORIZED SECURITY ENVIRONMENT
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-mono">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Operator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@worldmonitor.demo"
                className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Security Password
              </label>
              <button
                type="button"
                onClick={() => alert('Demo Password is Demo@123')}
                className="text-[11px] text-cyan-400 hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-all font-mono"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 bg-slate-950"
              />
              <span>Remember this session</span>
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs tracking-wider uppercase transition-all duration-200 shadow-lg shadow-cyan-900/30 flex items-center justify-center gap-2 group"
          >
            <span>Authenticate Session</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-mono">
            <span className="bg-slate-900 px-3 text-slate-500">or instant access</span>
          </div>
        </div>

        {/* 1-Click Demo Environment Button */}
        <button
          onClick={loginWithDemo}
          className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-medium text-xs transition-colors flex items-center justify-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Continue with Demo Environment</span>
        </button>

        {/* Demo Credentials Box */}
        <div className="mt-6 p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1">
            <Terminal className="w-3 h-3" />
            <span>Pre-configured Demo Credentials</span>
          </div>
          <div className="flex justify-between">
            <span>Email:</span>
            <span className="text-slate-200">admin@worldmonitor.demo</span>
          </div>
          <div className="flex justify-between">
            <span>Password:</span>
            <span className="text-slate-200">Demo@123</span>
          </div>
        </div>
      </div>

      {/* Login Footer */}
      <div className="mt-8 text-center text-xs text-slate-600">
        World Monitor © 2026 • Controlled Security Testing Platform
      </div>
    </div>
  );
};
