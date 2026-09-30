import { LiveEvent } from '../types';

export const SEED_LIVE_EVENTS: LiveEvent[] = [
  {
    id: 'evt-101',
    timestamp: '08:31:04',
    type: 'LOGIN_SUCCESS',
    summary: 'Successful login',
    severity: 'normal',
    details: 'User demo_analyst authenticated via password + simulated MFA challenge',
    actor: 'demo_analyst@worldmonitor.demo',
    ip: '10.240.12.18'
  },
  {
    id: 'evt-102',
    timestamp: '08:31:09',
    type: 'API_REQUEST',
    summary: 'API request /api/reports',
    severity: 'info',
    details: 'HTTP GET /api/v1/reports?period=30d [200 OK - 88ms]',
    actor: 'demo_analyst',
    ip: '10.240.12.18'
  },
  {
    id: 'evt-103',
    timestamp: '08:31:14',
    type: 'AUTHZ_CHECK',
    summary: 'Authorization check PASS',
    severity: 'normal',
    details: 'RBAC Policy Engine verified Analyst scope for reports.read',
    actor: 'system_pdp',
    ip: '10.240.10.1'
  },
  {
    id: 'evt-104',
    timestamp: '08:31:22',
    type: 'AI_ANOMALY',
    summary: 'AI anomaly detected (Medium)',
    severity: 'suspicious',
    details: 'Unexpected query parameter variation in /api/analytics/query filter probe',
    actor: 'ai_anomaly_detector',
    ip: '10.240.12.99'
  },
  {
    id: 'evt-105',
    timestamp: '08:31:35',
    type: 'LOGIN_FAILURE',
    summary: 'Authentication failed (143 attempts)',
    severity: 'critical',
    details: 'Credential spray pattern targeting admin usernames from unauthorized CIDR',
    actor: 'unknown_scanner',
    ip: '198.51.100.42'
  },
  {
    id: 'evt-106',
    timestamp: '08:31:42',
    type: 'POLICY_VIOLATION',
    summary: 'BOLA Access Violation Intercepted',
    severity: 'suspicious',
    details: 'Session attempted to access tenant record usr_9981 with non-matching tenant_id',
    actor: 'analyst_demo',
    ip: '10.240.12.18'
  },
  {
    id: 'evt-107',
    timestamp: '08:31:50',
    type: 'SCAN_EVENT',
    summary: 'Authorized DAST assessment progress: 68%',
    severity: 'info',
    details: 'Crawling API endpoints in Analytics API Gateway test environment',
    actor: 'dast_agent_01',
    ip: '10.240.14.5'
  }
];

export function generateRandomEvent(): LiveEvent {
  const types: Array<LiveEvent['type']> = [
    'LOGIN_SUCCESS',
    'LOGIN_FAILURE',
    'API_REQUEST',
    'AUTHZ_CHECK',
    'AI_ANOMALY',
    'POLICY_VIOLATION',
    'SCAN_EVENT'
  ];

  const type = types[Math.floor(Math.random() * types.length)];
  const now = new Date();
  const timestamp = now.toTimeString().split(' ')[0];
  const id = 'evt-' + Math.random().toString(36).substring(2, 9);

  switch (type) {
    case 'LOGIN_SUCCESS':
      return {
        id,
        timestamp,
        type,
        summary: 'Successful login',
        severity: 'normal',
        details: 'User authenticated via authorized credential session',
        actor: ['analyst_demo', 'admin_sec', 'viewer_lead'][Math.floor(Math.random() * 3)],
        ip: `10.240.12.${Math.floor(Math.random() * 50) + 1}`
      };
    case 'LOGIN_FAILURE':
      return {
        id,
        timestamp,
        type,
        summary: 'Authentication failed: Invalid credentials',
        severity: 'critical',
        details: 'Failed password verification threshold reached',
        actor: 'unauthorized_probe',
        ip: `198.51.100.${Math.floor(Math.random() * 254) + 1}`
      };
    case 'API_REQUEST':
      return {
        id,
        timestamp,
        type,
        summary: 'API request /api/v1/telemetry',
        severity: 'info',
        details: 'HTTP GET /api/v1/telemetry/stream [200 OK]',
        actor: 'service_worker',
        ip: '10.240.10.8'
      };
    case 'AUTHZ_CHECK':
      return {
        id,
        timestamp,
        type,
        summary: 'Authorization check PASS',
        severity: 'normal',
        details: 'Policy check validated for role Security Analyst',
        actor: 'rbac_guard',
        ip: '10.240.10.1'
      };
    case 'AI_ANOMALY':
      return {
        id,
        timestamp,
        type,
        summary: 'AI anomaly detected: Rate deviation',
        severity: 'suspicious',
        details: 'Elevated request frequency observed on unthrottled endpoint',
        actor: 'ai_sentry',
        ip: '10.240.12.44'
      };
    case 'POLICY_VIOLATION':
      return {
        id,
        timestamp,
        type,
        summary: 'Security policy violation: Missing TLS SNI',
        severity: 'suspicious',
        details: 'Connection attempt made with outdated protocol negotiate',
        actor: 'external_client',
        ip: '203.0.113.19'
      };
    case 'SCAN_EVENT':
    default:
      return {
        id,
        timestamp,
        type: 'SCAN_EVENT',
        summary: 'Authorized scan probe evaluated',
        severity: 'info',
        details: 'Synthetic assertion completed: No new critical vulnerabilities detected',
        actor: 'scanner_daemon',
        ip: '10.240.14.2'
      };
  }
}
