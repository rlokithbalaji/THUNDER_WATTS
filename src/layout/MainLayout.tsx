import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { Footer } from './Footer';
import { AIChatDrawer } from '../components/ai/AIChatDrawer';
import { VulnDetailModal } from '../components/modals/VulnDetailModal';
import { useSecurity } from '../context/SecurityContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { selectedVulnerability, setSelectedVulnerability } = useSecurity();

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <TopNav onMenuClick={() => setMobileOpen(true)} collapsed={collapsed} />

      {/* Sidebar Navigation */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <main
        className={`flex-1 transition-all duration-300 pt-20 px-4 sm:px-6 lg:px-8 pb-12 ${
          collapsed ? 'lg:pl-24' : 'lg:pl-72'
        }`}
      >
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>

      {/* Footer */}
      <div className={collapsed ? 'lg:pl-20' : 'lg:pl-64'}>
        <Footer />
      </div>

      {/* Global Floating AI Assistant Drawer */}
      <AIChatDrawer />

      {/* Global Vulnerability Inspector Modal */}
      <VulnDetailModal
        vulnerability={selectedVulnerability}
        onClose={() => setSelectedVulnerability(null)}
      />
    </div>
  );
};
