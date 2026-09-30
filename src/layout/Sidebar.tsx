import React from 'react';
import { useSecurity } from '../context/SecurityContext';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Layers,
  Search,
  ShieldAlert,
  Bot,
  Radio,
  Network,
  KeyRound,
  UsersRound,
  FileBarChart2,
  Bell,
  ScrollText,
  UserCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (o: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const { activePage, setActivePage, vulnerabilities, alerts } = useSecurity();
  const { currentRole } = useAuth();

  const openVulnCount = vulnerabilities.filter(v => v.status === 'Open' || v.status === 'Investigating').length;
  const activeAlertCount = alerts.filter(a => a.status === 'Active').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'applications', label: 'Applications', icon: Layers, badge: '12' },
    { id: 'assessments', label: 'Assessments', icon: Search, badge: '4' },
    { id: 'vulnerabilities', label: 'Vulnerabilities', icon: ShieldAlert, badge: openVulnCount.toString(), badgeColor: 'bg-red-500/20 text-red-400' },
    { id: 'ai-analyzer', label: 'AI Security', icon: Bot, isSpecial: true },
    { id: 'live-monitor', label: 'Live Monitor', icon: Radio, isLive: true },
    { id: 'api-security', label: 'API Security', icon: Network, badge: '128' },
    { id: 'authentication', label: 'Authentication', icon: KeyRound },
    { id: 'authorization', label: 'Authorization', icon: UsersRound },
    { id: 'reports', label: 'Reports', icon: FileBarChart2 },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: activeAlertCount.toString(), badgeColor: 'bg-amber-500/20 text-amber-400' },
    { id: 'audit-logs', label: 'Audit Logs', icon: ScrollText },
    { id: 'users', label: 'Users', icon: UserCheck, adminOnly: true },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: string) => {
    setActivePage(id);
    if (mobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[#0a0f1d] border-r border-slate-800/80 flex flex-col transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80 bg-[#090d19]">
          <div
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 cursor-pointer overflow-hidden"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-900/40 border border-cyan-400/40 shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-sm tracking-wider text-white flex items-center gap-1.5 font-mono">
                  WORLD <span className="text-cyan-400">MONITOR</span>
                </span>
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono">
                  AI SECPLATFORM
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar py-3 px-3 space-y-1">
          {navItems.map((item) => {
            if (item.adminOnly && currentRole !== 'Security Administrator') {
              return null;
            }

            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <div
                  className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                {!collapsed && (
                  <span className="flex-1 text-left truncate tracking-wide">
                    {item.label}
                  </span>
                )}

                {!collapsed && item.isLive && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                )}

                {!collapsed && item.badge && (
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded-md ${
                      item.badgeColor || 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Environment Status */}
        {!collapsed && (
          <div className="p-3 m-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest font-mono">
                SOC Node Online
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Safe Assessment Mode Active
            </p>
          </div>
        )}
      </aside>
    </>
  );
};
