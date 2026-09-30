import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Application,
  Vulnerability,
  Assessment,
  SecurityAlert,
  AuditLog,
  LiveEvent,
  ApiEndpoint,
} from '../types';
import { INITIAL_APPLICATIONS } from '../data/mockApplications';
import { INITIAL_VULNERABILITIES } from '../data/mockVulnerabilities';
import { INITIAL_ALERTS } from '../data/mockAlerts';
import { INITIAL_AUDIT_LOGS } from '../data/mockAuditLogs';
import { INITIAL_API_ENDPOINTS, API_SUMMARY } from '../data/mockEndpoints';
import { SEED_LIVE_EVENTS, generateRandomEvent } from '../data/mockLiveEvents';

interface SecurityContextType {
  applications: Application[];
  vulnerabilities: Vulnerability[];
  assessments: Assessment[];
  alerts: SecurityAlert[];
  auditLogs: AuditLog[];
  liveEvents: LiveEvent[];
  endpoints: ApiEndpoint[];
  apiSummary: typeof API_SUMMARY;
  isLivePaused: boolean;
  isAIChatOpen: boolean;
  activePage: string;
  selectedVulnerability: Vulnerability | null;
  addApplication: (app: Omit<Application, 'id' | 'vulnerabilityCount'>) => void;
  startAssessment: (newAssessment: Omit<Assessment, 'id' | 'findingsCount' | 'criticalCount'>) => void;
  updateVulnerabilityStatus: (id: string, status: Vulnerability['status'], note?: string) => void;
  updateAlertStatus: (id: string, status: SecurityAlert['status']) => void;
  logAuditEvent: (action: string, resource: string, result: 'Success' | 'Denied' | 'Warning' | 'Error') => void;
  toggleLivePause: () => void;
  clearLiveEvents: () => void;
  setIsAIChatOpen: (open: boolean) => void;
  setActivePage: (page: string) => void;
  setSelectedVulnerability: (vuln: Vulnerability | null) => void;
}

const INITIAL_ASSESSMENTS: Assessment[] = [
  {
    id: 'ASM-2026-001',
    name: 'Q3 Web Security Baseline Assessment',
    type: 'Web Application',
    targetAppId: 'app-01',
    targetAppName: 'World Monitor Web',
    environment: 'Production-like Demo',
    tester: 'Alex Rivera (Lead Analyst)',
    startDate: '2026-09-28',
    endDate: '2026-10-02',
    status: 'In Progress',
    progress: 72,
    categories: ['Authentication', 'Session Management', 'Authorization', 'Client-Side Security'],
    findingsCount: 9,
    criticalCount: 1,
    authorizedConfirmed: true,
  },
  {
    id: 'ASM-2026-002',
    name: 'Mobile Telemetry Runtime Integrity Audit',
    type: 'Mobile Application',
    targetAppId: 'app-02',
    targetAppName: 'Mobile Monitor Client',
    environment: 'Test Environment',
    tester: 'Mobile Security Pod',
    startDate: '2026-09-29',
    endDate: '2026-10-04',
    status: 'In Progress',
    progress: 45,
    categories: ['Client-Side Security', 'Secure Communication', 'Data Protection'],
    findingsCount: 7,
    criticalCount: 0,
    authorizedConfirmed: true,
  },
  {
    id: 'ASM-2026-003',
    name: 'GraphQL & REST Gateway Fuzzing & Authorization Probe',
    type: 'API',
    targetAppId: 'app-03',
    targetAppName: 'Analytics API Gateway',
    environment: 'Staging',
    tester: 'DevSecOps Automation',
    startDate: '2026-09-27',
    endDate: '2026-09-30',
    status: 'In Progress',
    progress: 88,
    categories: ['API Security', 'Authorization', 'Input Validation'],
    findingsCount: 12,
    criticalCount: 1,
    authorizedConfirmed: true,
  },
  {
    id: 'ASM-2026-004',
    name: 'OAuth2 / OIDC Token Verification & Session Stress Test',
    type: 'Web Application',
    targetAppId: 'app-04',
    targetAppName: 'Customer Auth Portal',
    environment: 'Production-like Demo',
    tester: 'IAM Red Team',
    startDate: '2026-09-29',
    endDate: '2026-10-01',
    status: 'In Progress',
    progress: 60,
    categories: ['Authentication', 'Session Management', 'Data Protection'],
    findingsCount: 5,
    criticalCount: 0,
    authorizedConfirmed: true,
  },
];

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('wm_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>(() => {
    const saved = localStorage.getItem('wm_vulnerabilities');
    return saved ? JSON.parse(saved) : INITIAL_VULNERABILITIES;
  });

  const [assessments, setAssessments] = useState<Assessment[]>(() => {
    const saved = localStorage.getItem('wm_assessments');
    return saved ? JSON.parse(saved) : INITIAL_ASSESSMENTS;
  });

  const [alerts, setAlerts] = useState<SecurityAlert[]>(() => {
    const saved = localStorage.getItem('wm_alerts');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('wm_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>(SEED_LIVE_EVENTS);
  const [endpoints] = useState<ApiEndpoint[]>(INITIAL_API_ENDPOINTS);
  const [apiSummary] = useState(API_SUMMARY);
  const [isLivePaused, setIsLivePaused] = useState<boolean>(false);
  const [isAIChatOpen, setIsAIChatOpen] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [selectedVulnerability, setSelectedVulnerability] = useState<Vulnerability | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('wm_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('wm_vulnerabilities', JSON.stringify(vulnerabilities));
  }, [vulnerabilities]);

  useEffect(() => {
    localStorage.setItem('wm_assessments', JSON.stringify(assessments));
  }, [assessments]);

  useEffect(() => {
    localStorage.setItem('wm_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('wm_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Live event ticker generator
  useEffect(() => {
    if (isLivePaused) return;

    const interval = setInterval(() => {
      const newEvent = generateRandomEvent();
      setLiveEvents(prev => [newEvent, ...prev.slice(0, 99)]);
    }, 2800);

    return () => clearInterval(interval);
  }, [isLivePaused]);

  const logAuditEvent = useCallback((action: string, resource: string, result: 'Success' | 'Denied' | 'Warning' | 'Error') => {
    const newLog: AuditLog = {
      id: 'AUD-' + String(auditLogs.length + 1).padStart(3, '0'),
      timestamp: 'Today, ' + new Date().toISOString().substring(11, 19) + ' UTC',
      user: 'Current Session User',
      role: 'Active Operator',
      action,
      resource,
      result,
      ipEnvironment: '10.240.12.18 / Demo Console'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, [auditLogs.length]);

  const addApplication = (appData: Omit<Application, 'id' | 'vulnerabilityCount'>) => {
    const newApp: Application = {
      ...appData,
      id: 'app-' + (applications.length + 1).toString().padStart(2, '0'),
      vulnerabilityCount: { critical: 0, high: 0, medium: 0, low: 0 }
    };
    setApplications(prev => [newApp, ...prev]);
    logAuditEvent('Registered New Target Application', newApp.name, 'Success');
  };

  const startAssessment = (assessmentData: Omit<Assessment, 'id' | 'findingsCount' | 'criticalCount'>) => {
    const newAsm: Assessment = {
      ...assessmentData,
      id: `ASM-2026-${(assessments.length + 1).toString().padStart(3, '0')}`,
      findingsCount: 0,
      criticalCount: 0,
    };
    setAssessments(prev => [newAsm, ...prev]);
    logAuditEvent('Started Authorized Assessment', `${newAsm.name} (${newAsm.targetAppName})`, 'Success');
  };

  const updateVulnerabilityStatus = (id: string, status: Vulnerability['status'], note?: string) => {
    setVulnerabilities(prev =>
      prev.map(v => {
        if (v.id === id) {
          const updatedHistory = [
            ...v.history,
            {
              timestamp: 'Today, ' + new Date().toISOString().substring(11, 16) + ' UTC',
              actor: 'Security Analyst',
              action: `Status changed to ${status}`,
              note: note || undefined
            }
          ];
          return { ...v, status, history: updatedHistory };
        }
        return v;
      })
    );
    logAuditEvent(`Updated Finding Status to ${status}`, id, 'Success');
  };

  const updateAlertStatus = (id: string, status: SecurityAlert['status']) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    logAuditEvent(`Updated Alert Status to ${status}`, id, 'Success');
  };

  const toggleLivePause = () => setIsLivePaused(p => !p);
  const clearLiveEvents = () => setLiveEvents([]);

  return (
    <SecurityContext.Provider
      value={{
        applications,
        vulnerabilities,
        assessments,
        alerts,
        auditLogs,
        liveEvents,
        endpoints,
        apiSummary,
        isLivePaused,
        isAIChatOpen,
        activePage,
        selectedVulnerability,
        addApplication,
        startAssessment,
        updateVulnerabilityStatus,
        updateAlertStatus,
        logAuditEvent,
        toggleLivePause,
        clearLiveEvents,
        setIsAIChatOpen,
        setActivePage,
        setSelectedVulnerability,
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const ctx = useContext(SecurityContext);
  if (!ctx) throw new Error('useSecurity must be used within a SecurityProvider');
  return ctx;
};
