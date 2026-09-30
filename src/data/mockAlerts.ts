import { SecurityAlert } from '../types';

export const INITIAL_ALERTS: SecurityAlert[] = [
  {
    id: 'ALT-101',
    title: 'Potential Sensitive Data Exposure Detected',
    type: 'Critical',
    message: 'Repeated unmasked customer identifier fields observed in 500 error responses from /api/v1/checkout/validate.',
    timestamp: '12 mins ago',
    source: 'AI Response Scanner',
    status: 'Active',
    assignedTo: 'Alex Rivera'
  },
  {
    id: 'ALT-102',
    title: 'Abnormal Authentication Spike from Single Subnet',
    type: 'High',
    message: '143 consecutive failed logins detected against admin accounts originating from 198.51.100.42 within 10 minutes.',
    timestamp: '25 mins ago',
    source: 'Auth Guard Sentinel',
    status: 'Investigating',
    assignedTo: 'Jordan Smith'
  },
  {
    id: 'ALT-103',
    title: 'Authorization Behavior Anomaly in User Endpoint',
    type: 'High',
    message: 'User session analyst_demo attempted to access tenant resource id usr_9981 without ownership verification (BOLA).',
    timestamp: '42 mins ago',
    source: 'Policy Enforcement Agent',
    status: 'Active'
  },
  {
    id: 'ALT-104',
    title: 'Security Header Configuration Incomplete on Ingress',
    type: 'Medium',
    message: 'Strict-Transport-Security (HSTS) and Content-Security-Policy absent on web egress routes.',
    timestamp: '1 hour ago',
    source: 'Ingress Verifier',
    status: 'Reviewed'
  },
  {
    id: 'ALT-105',
    title: 'Public GraphQL Introspection Query Enabled',
    type: 'Low',
    message: 'Introspection queries are permitted on the staging analytics gateway, leaking internal schema topology.',
    timestamp: '2 hours ago',
    source: 'API Discovery Engine',
    status: 'Reviewed'
  },
  {
    id: 'ALT-106',
    title: 'Session Lifetime Exceeds Best-Practice Threshold',
    type: 'Medium',
    message: 'JWT token expiration time configured to 14 days without idle revocation telemetry.',
    timestamp: '3 hours ago',
    source: 'Session Security Audit',
    status: 'Reviewed'
  },
  {
    id: 'ALT-107',
    title: 'Informational: TLS 1.3 Handshake Ratio Reached 94.2%',
    type: 'Informational',
    message: 'Majority of incoming ingress traffic successfully negotiating TLS 1.3 with ChaCha20/AES-GCM ciphers.',
    timestamp: '4 hours ago',
    source: 'TLS Telemetry Monitor',
    status: 'Resolved'
  },
];
