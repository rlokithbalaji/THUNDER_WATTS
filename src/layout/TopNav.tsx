import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSecurity } from '../context/SecurityContext';
import { UserRole } from '../types';
import {
  Menu,
  Search,
  Bell,
  Shield,
  UserCheck,
  ChevronDown,
  LogOut,
  Sparkles,
  Radio,
  ExternalLink,
} from 'lucide-react';

interface TopNavProps {
  onMenuClick: () => void;
  collapsed: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({ onMenuClick, collapsed }) => {
  const { currentUser, currentRole, switchRole, logout } = useAuth();
  const { alerts, activePage, setActivePage, setIsAIChatOpen } = useSecurity();

  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const roleMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (roleMenuRef.current && !roleMenuRef.current.contains(e.target as Node)) {
        setRoleMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeAlerts = alerts.filter(a => a.status === 'Active');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActivePage('vulnerabilities');
    }
  };

  return (
    <header
      className={`fixed top-0 right-0 z-30 h-16 bg-[#0a0f1d]/90 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between px-4 lg:px-6 transition-all duration-300 ${
        collapsed ? 'left-0 lg:left-20' : 'left-0 lg:left-64'
      }`}
    >
      {/* Left: Mobile Toggle & Status Headers */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs uppercase tracking-wider text-cyan-400 font-mono">
              Authorized Security Environment
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              SYSTEM ONLINE
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            AI-Powered Security Monitoring & Assessment Platform
          </span>
        </div>
      </div>

      {/* Middle: Search Box */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <form onSubmit={handleSearchSubmit} className="w-full relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search vulnerabilities, applications, CVEs, or CWEs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-700/80 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
          />
        </form>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick Launch AI Assistant */}
        <button
          onClick={() => setIsAIChatOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-700/50 text-cyan-300 text-xs font-medium transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Ask AI</span>
        </button>

        {/* Live Indicator */}
        <button
          onClick={() => setActivePage('live-monitor')}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs transition-colors"
          title="Go to Live Monitor"
        >
          <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="hidden sm:inline font-mono text-[11px]">LIVE</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifMenuRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
            {activeAlerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#0a0f1d]" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Active Security Alerts</span>
                <span className="text-[10px] font-mono text-cyan-400">{activeAlerts.length} Active</span>
              </div>
              <div className="max-h-72 overflow-y-auto custom-scrollbar divide-y divide-slate-800/60">
                {activeAlerts.slice(0, 4).map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => {
                      setActivePage('alerts');
                      setNotifOpen(false);
                    }}
                    className="p-3 hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200 truncate">{alert.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0">{alert.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{alert.message}</p>
                  </div>
                ))}
              </div>
              <div className="px-3 pt-2 border-t border-slate-800 text-center">
                <button
                  onClick={() => {
                    setActivePage('alerts');
                    setNotifOpen(false);
                  }}
                  className="text-xs text-cyan-400 hover:underline"
                >
                  View All Alerts →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Role Switcher Dropdown */}
        <div className="relative" ref={roleMenuRef}>
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800/70 hover:bg-slate-800 border border-slate-700 text-xs transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline font-medium text-slate-200">{currentRole}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 text-[10px] font-mono text-slate-400 uppercase tracking-widest border-b border-slate-800">
                Switch Operational Persona
              </div>
              {(['Security Administrator', 'Security Analyst', 'Viewer'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    switchRole(role);
                    setRoleMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors ${
                    currentRole === role
                      ? 'bg-cyan-950/40 text-cyan-300 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span>{role}</span>
                  {currentRole === role && <span className="text-cyan-400 font-mono text-xs">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full border border-cyan-500/40 object-cover"
            />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-800">
                <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                <p className="text-[11px] text-slate-400 font-mono truncate">{currentUser.email}</p>
              </div>

              <button
                onClick={() => {
                  setActivePage('settings');
                  setUserMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-xs text-slate-300 hover:bg-slate-800 flex items-center gap-2"
              >
                <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                <span>Security Settings</span>
              </button>

              <button
                onClick={logout}
                className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
