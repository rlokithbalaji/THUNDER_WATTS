import { ApiEndpoint } from '../types';

export const API_SUMMARY = {
  totalEndpoints: 128,
  authenticated: 103,
  public: 25,
  potentialIssues: 7,
};

export const INITIAL_API_ENDPOINTS: ApiEndpoint[] = [
  { id: 'ep-01', path: '/api/v1/users', method: 'GET', authentication: 'Required', authorization: 'Role-based', risk: 'Low', status: 'Active', responseTime: '42ms', lastTested: 'Today, 03:00' },
  { id: 'ep-02', path: '/api/v1/users/{id}/financial-profile', method: 'GET', authentication: 'Required', authorization: 'User', risk: 'High', status: 'Vulnerable', responseTime: '115ms', lastTested: 'Today, 03:15' },
  { id: 'ep-03', path: '/api/v1/reports', method: 'GET', authentication: 'Required', authorization: 'Analyst', risk: 'Medium', status: 'Active', responseTime: '88ms', lastTested: 'Today, 02:45' },
  { id: 'ep-04', path: '/api/v1/admin/users', method: 'GET', authentication: 'Required', authorization: 'Admin', risk: 'High', status: 'Active', responseTime: '64ms', lastTested: 'Today, 01:20' },
  { id: 'ep-05', path: '/api/v1/auth/login', method: 'POST', authentication: 'Public', authorization: 'None', risk: 'Medium', status: 'Active', responseTime: '95ms', lastTested: 'Today, 04:00' },
  { id: 'ep-06', path: '/api/v1/auth/forgot-password', method: 'POST', authentication: 'Public', authorization: 'None', risk: 'Medium', status: 'Vulnerable', responseTime: '75ms', lastTested: 'Yesterday' },
  { id: 'ep-07', path: '/api/v1/auth/mfa/verify', method: 'POST', authentication: 'Required', authorization: 'User', risk: 'High', status: 'Vulnerable', responseTime: '55ms', lastTested: 'Yesterday' },
  { id: 'ep-08', path: '/api/v1/checkout/validate', method: 'POST', authentication: 'Required', authorization: 'User', risk: 'High', status: 'Vulnerable', responseTime: '180ms', lastTested: 'Yesterday' },
  { id: 'ep-09', path: '/api/v1/analytics/query', method: 'GET', authentication: 'Required', authorization: 'Analyst', risk: 'High', status: 'Vulnerable', responseTime: '240ms', lastTested: 'Today, 02:40' },
  { id: 'ep-10', path: '/api/v1/webhooks/test-delivery', method: 'POST', authentication: 'Required', authorization: 'Admin', risk: 'High', status: 'Vulnerable', responseTime: '310ms', lastTested: '2 days ago' },
  { id: 'ep-11', path: '/api/v1/storage/export', method: 'GET', authentication: 'Required', authorization: 'Role-based', risk: 'High', status: 'Vulnerable', responseTime: '145ms', lastTested: 'Yesterday' },
  { id: 'ep-12', path: '/api/v1/health', method: 'GET', authentication: 'Public', authorization: 'None', risk: 'Low', status: 'Active', responseTime: '12ms', lastTested: '5 mins ago' },
  { id: 'ep-13', path: '/api/v1/public/docs', method: 'GET', authentication: 'Public', authorization: 'None', risk: 'Low', status: 'Active', responseTime: '22ms', lastTested: '1 hour ago' },
  { id: 'ep-14', path: '/graphql', method: 'POST', authentication: 'Required', authorization: 'Role-based', risk: 'Medium', status: 'Vulnerable', responseTime: '98ms', lastTested: '3 days ago' },
  { id: 'ep-15', path: '/metrics', method: 'GET', authentication: 'Public', authorization: 'None', risk: 'Low', status: 'Vulnerable', responseTime: '34ms', lastTested: '4 days ago' },
  { id: 'ep-16', path: '/api/v1/audit/logs', method: 'GET', authentication: 'Required', authorization: 'Admin', risk: 'Medium', status: 'Audited', responseTime: '110ms', lastTested: 'Today, 00:30' },
  { id: 'ep-17', path: '/api/v1/admin/policy/reload', method: 'POST', authentication: 'Required', authorization: 'Admin', risk: 'High', status: 'Audited', responseTime: '65ms', lastTested: 'Yesterday' },
  { id: 'ep-18', path: '/api/v1/users/avatar', method: 'POST', authentication: 'Required', authorization: 'User', risk: 'High', status: 'Vulnerable', responseTime: '210ms', lastTested: 'Yesterday' },
];
