import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SecurityProvider, useSecurity } from './context/SecurityContext';
import { MainLayout } from './layout/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { AssessmentsPage } from './pages/AssessmentsPage';
import { VulnerabilitiesPage } from './pages/VulnerabilitiesPage';
import { AIVulnAnalyzerPage } from './pages/AIVulnAnalyzerPage';
import { AILogAnalyzerPage } from './pages/AILogAnalyzerPage';
import { APISecurityPage } from './pages/APISecurityPage';
import { AuthenticationPage } from './pages/AuthenticationPage';
import { AuthorizationPage } from './pages/AuthorizationPage';
import { ClientSideSecurityPage } from './pages/ClientSideSecurityPage';
import { SecureCommPage } from './pages/SecureCommPage';
import { DataProtectionPage } from './pages/DataProtectionPage';
import { LiveMonitorPage } from './pages/LiveMonitorPage';
import { AlertsPage } from './pages/AlertsPage';
import { ReportGeneratorPage } from './pages/ReportGeneratorPage';
import { CompliancePage } from './pages/CompliancePage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { UserManagementPage } from './pages/UserManagementPage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { activePage } = useSecurity();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'applications':
        return <ApplicationsPage />;
      case 'assessments':
        return <AssessmentsPage />;
      case 'vulnerabilities':
        return <VulnerabilitiesPage />;
      case 'ai-analyzer':
        return <AIVulnAnalyzerPage />;
      case 'ai-logs':
        return <AILogAnalyzerPage />;
      case 'api-security':
        return <APISecurityPage />;
      case 'authentication':
        return <AuthenticationPage />;
      case 'authorization':
        return <AuthorizationPage />;
      case 'client-side':
        return <ClientSideSecurityPage />;
      case 'secure-comm':
        return <SecureCommPage />;
      case 'data-protection':
        return <DataProtectionPage />;
      case 'live-monitor':
        return <LiveMonitorPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'reports':
        return <ReportGeneratorPage />;
      case 'compliance':
        return <CompliancePage />;
      case 'audit-logs':
        return <AuditLogsPage />;
      case 'users':
        return <UserManagementPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return <MainLayout>{renderActivePage()}</MainLayout>;
};

export function App() {
  return (
    <AuthProvider>
      <SecurityProvider>
        <AppContent />
      </SecurityProvider>
    </AuthProvider>
  );
}

export default App;
