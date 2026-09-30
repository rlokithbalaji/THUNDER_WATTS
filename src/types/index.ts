export type UserRole = 'Security Administrator' | 'Security Analyst' | 'Viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  status: 'Active' | 'Suspended' | 'Pending';
  lastActive: string;
}

export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';

export interface Vulnerability {
  id: string;
  title: string;
  severity: SeverityLevel;
  component: string;
  status: 'Open' | 'Investigating' | 'Remediated' | 'Accepted Risk' | 'Retesting';
  detected: string;
  aiConfidence: number; // e.g. 94
  cvss: number; // e.g. 8.6
  cwe: string; // e.g. CWE-285
  description: string;
  impact: string;
  evidence: string;
  stepsToReproduce: string[];
  expectedBehavior: string;
  observedBehavior: string;
  remediation: string;
  pocSafeCode: string;
  retestStatus: 'Pending Retest' | 'Verified Remediated' | 'Retest Failed' | 'Not Started';
  history: Array<{
    timestamp: string;
    actor: string;
    action: string;
    note?: string;
  }>;
}

export interface Application {
  id: string;
  name: string;
  description: string;
  environment: 'Production-like Demo' | 'Test Environment' | 'Staging' | 'Sandbox';
  status: 'Online' | 'Degraded' | 'Offline' | 'Under Assessment';
  securityScore: number;
  lastAssessment: string;
  risk: 'Critical' | 'High' | 'Medium' | 'Low';
  baseUrl: string;
  technology: string;
  owner: string;
  authorized: boolean;
  endpointsCount: number;
  vulnerabilityCount: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
}

export type AssessmentType = 'Web Application' | 'Mobile Application' | 'API' | 'Infrastructure';

export interface Assessment {
  id: string;
  name: string;
  type: AssessmentType;
  targetAppId: string;
  targetAppName: string;
  environment: string;
  tester: string;
  startDate: string;
  endDate: string;
  status: 'In Progress' | 'Completed' | 'Scheduled' | 'Review Required';
  progress: number;
  categories: string[];
  findingsCount: number;
  criticalCount: number;
  authorizedConfirmed: boolean;
}

export interface SecurityAlert {
  id: string;
  title: string;
  type: SeverityLevel;
  message: string;
  timestamp: string;
  source: string;
  status: 'Active' | 'Reviewed' | 'Investigating' | 'Resolved';
  assignedTo?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  resource: string;
  result: 'Success' | 'Denied' | 'Warning' | 'Error';
  ipEnvironment: string;
}

export interface ApiEndpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  authentication: 'Required' | 'Public' | 'MFA Required' | 'API Key';
  authorization: 'Admin' | 'Analyst' | 'User' | 'None' | 'Role-based';
  risk: 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Deprecated' | 'Vulnerable' | 'Audited';
  responseTime: string;
  lastTested: string;
}

export interface LiveEvent {
  id: string;
  timestamp: string;
  type: 'LOGIN_SUCCESS' | 'LOGIN_FAILURE' | 'API_REQUEST' | 'AUTHZ_CHECK' | 'AI_ANOMALY' | 'POLICY_VIOLATION' | 'SCAN_EVENT';
  summary: string;
  severity: 'normal' | 'info' | 'suspicious' | 'critical';
  details: string;
  actor: string;
  ip: string;
}

export interface AIAnalysisResult {
  potentialVulnerability: string;
  severity: SeverityLevel;
  confidence: number;
  affectedComponent: string;
  whyThisMatters: string;
  potentialImpact: string;
  evidence: string;
  recommendedFix: string;
  retestProcedure: string;
}
