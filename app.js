// WORLD MONITOR — Core Standalone Application Script
// Operates completely offline, without server dependencies, and handles file:/// direct execution

(function() {
  'use strict';

  // --- 1. DATASETS ---
  const APPLICATIONS = [
    { id: 'app-01', name: 'World Monitor Web', env: 'Production-like Demo', status: 'Online', score: 82, lastAssessment: 'Today, 04:15 UTC', risk: 'Medium', url: 'https://demo-app.worldmonitor.internal', tech: 'React 18 / TypeScript / BFF', owner: 'SecOps Team Alpha', endpoints: 28 },
    { id: 'app-02', name: 'Mobile Monitor Client', env: 'Test Environment', status: 'Online', score: 91, lastAssessment: 'Yesterday, 19:20 UTC', risk: 'Low', url: 'https://mobile-test.worldmonitor.internal', tech: 'React Native / SQLite', owner: 'Mobile Engineering', endpoints: 14 },
    { id: 'app-03', name: 'Analytics API Gateway', env: 'Staging', status: 'Online', score: 74, lastAssessment: 'Today, 06:40 UTC', risk: 'High', url: 'https://api-stage.worldmonitor.internal', tech: 'Go / GraphQL / Redis', owner: 'Data Platform Pod', endpoints: 42 },
    { id: 'app-04', name: 'Customer Auth Portal', env: 'Production-like Demo', status: 'Online', score: 88, lastAssessment: '2 days ago', risk: 'Low', url: 'https://auth.worldmonitor.internal', tech: 'Node.js / Keycloak', owner: 'IAM Security Guild', endpoints: 18 },
    { id: 'app-05', name: 'Payment Gateway Microservice', env: 'Sandbox', status: 'Online', score: 95, lastAssessment: '3 days ago', risk: 'Low', url: 'https://pay-mock.worldmonitor.internal', tech: 'Java Spring Boot / PostgreSQL', owner: 'FinSec Squad', endpoints: 12 },
    { id: 'app-06', name: 'Cloud Storage Broker', env: 'Test Environment', status: 'Degraded', score: 68, lastAssessment: 'Yesterday, 14:10 UTC', risk: 'High', url: 'https://vault-storage.worldmonitor.internal', tech: 'Python FastAPI / S3 Proxy', owner: 'Cloud Infrastructure', endpoints: 16 },
    { id: 'app-07', name: 'IoT Sensor Telemetry Hub', env: 'Sandbox', status: 'Online', score: 79, lastAssessment: '4 days ago', risk: 'Medium', url: 'mqtts://edge-hub.worldmonitor.internal:8883', tech: 'Rust / EMQX Broker', owner: 'IoT Embedded Team', endpoints: 8 },
    { id: 'app-08', name: 'Developer Sandbox Portal', env: 'Staging', status: 'Online', score: 71, lastAssessment: '5 days ago', risk: 'High', url: 'https://developer.worldmonitor.internal', tech: 'Next.js / Swagger UI', owner: 'DevRel Team', endpoints: 31 },
    { id: 'app-09', name: 'Partner Webhook Dispatcher', env: 'Test Environment', status: 'Online', score: 84, lastAssessment: '1 day ago', risk: 'Medium', url: 'https://webhooks.worldmonitor.internal', tech: 'Node.js / BullMQ', owner: 'Integration Pod', endpoints: 9 },
    { id: 'app-10', name: 'Internal Admin Control Panel', env: 'Production-like Demo', status: 'Online', score: 89, lastAssessment: 'Today, 02:00 UTC', risk: 'Low', url: 'https://ops-admin.worldmonitor.internal', tech: 'Vue 3 / Golang', owner: 'Core Infra', endpoints: 22 },
    { id: 'app-11', name: 'Notification Dispatch Engine', env: 'Test Environment', status: 'Online', score: 86, lastAssessment: '6 days ago', risk: 'Low', url: 'https://notify-svc.worldmonitor.internal', tech: 'Go / Apache Kafka', owner: 'Comms Squad', endpoints: 11 },
    { id: 'app-12', name: 'Global Identity Broker', env: 'Staging', status: 'Online', score: 83, lastAssessment: '3 days ago', risk: 'Medium', url: 'https://identity-broker.worldmonitor.internal', tech: 'Java / OpenSAML', owner: 'IAM Guild', endpoints: 15 },
  ];

  const VULNERABILITIES = [
    { id: 'WM-001', title: 'Broken Object Level Authorization (BOLA / IDOR) in User Records', severity: 'High', component: 'API Authorization', status: 'Open', detected: 'Today, 03:15 UTC', aiConfidence: 94, cvss: 8.4, cwe: 'CWE-285', desc: 'Endpoint /api/v1/users/{id}/financial-profile fails to validate if the caller owns the targeted resource ID.', impact: 'Unauthorized access to customer financial records belonging to other tenants.', evidence: 'HTTP GET /api/v1/users/usr_9981/financial-profile with unprivileged token returns HTTP 200 OK.', expected: 'HTTP 403 Forbidden with error AccessDenied.', observed: 'HTTP 200 OK with unredacted profile body.', remediation: 'Enforce tenant ownership validator middleware on user entity queries.', poc: '// Safe test query\nfetch("/api/v1/users/usr_9981/financial-profile", { headers: { "Authorization": "Bearer <test_token>" } });' },
    { id: 'WM-002', title: 'Missing Content-Security-Policy and HSTS Enforce Headers', severity: 'Medium', component: 'Web Server', status: 'Open', detected: 'Today, 04:10 UTC', aiConfidence: 97, cvss: 5.3, cwe: 'CWE-693', desc: 'Reverse proxy web server responses omit CSP and Strict-Transport-Security headers on landing routes.', impact: 'Increases susceptibility to cross-site scripting (XSS) and SSL-stripping attack vectors.', evidence: 'Response headers lack Content-Security-Policy and Strict-Transport-Security directives.', expected: 'HSTS max-age=31536000 and restrictive CSP.', observed: 'Only Server, Date, and Content-Type returned.', remediation: 'Configure Nginx/Envoy to inject Strict-Transport-Security and restrictive CSP headers.', poc: '// Header check\nfetch("/", { method: "HEAD" }).then(r => console.log(r.headers.get("content-security-policy")));' },
    { id: 'WM-003', title: 'Excessive Session Idle Inactivity Timeout Window', severity: 'Medium', component: 'Authentication', status: 'Open', detected: 'Yesterday, 18:22 UTC', aiConfidence: 89, cvss: 5.7, cwe: 'CWE-613', desc: 'User sessions remain valid for 14 days without requiring re-authentication or token refresh.', impact: 'Intercepted tokens retain active privileges indefinitely.', evidence: 'JWT exp claim configured to 1,209,600 seconds.', expected: 'Access tokens expire within 15 minutes.', observed: 'Token lifespan is 14 days.', remediation: 'Drop token lifetime to 15 minutes and implement sliding idle session revocation on Redis.', poc: '// Check token expiry\nconst payload = JSON.parse(atob(token.split(".")[1])); console.log("Lifetime:", payload.exp - payload.iat);' },
    { id: 'WM-004', title: 'Sensitive Customer PII Leakage in Detailed API Error Responses', severity: 'High', component: 'API Response', status: 'Investigating', detected: 'Yesterday, 21:05 UTC', aiConfidence: 91, cvss: 7.5, cwe: 'CWE-209', desc: 'Malformed payload submissions trigger raw database stack traces exposing internal DB connection URIs.', impact: 'Exposure of database topology and credentials.', evidence: 'HTTP 500 error includes postgresql://svc_app:***@db-cluster.internal:5432/core_db.', expected: 'Generic error with correlation ID.', observed: 'Full JVM exception stack printed to caller.', remediation: 'Implement global exception handler that sanitizes production error payloads.', poc: '// Test malformed payload\nfetch("/api/checkout/validate", { method: "POST", body: "{ invalid }" });' },
    { id: 'WM-005', title: 'Unsanitized Dynamic Query Injection in Telemetry Metric Filter', severity: 'Critical', component: 'Analytics API Gateway', status: 'Open', detected: 'Today, 02:40 UTC', aiConfidence: 96, cvss: 9.1, cwe: 'CWE-89', desc: 'Telemetry search filter parameter tagFilter is concatenated into SQL queries without parameterized binding.', impact: 'Potential exfiltration or alteration of indexed audit records.', evidence: 'Boundary syntax tagFilter=\' OR \'1\'=\'1 expands record count from 3 to 12,400.', expected: 'Parameter bound as literal string.', observed: 'Dynamic execution modifies query semantics.', remediation: 'Refactor query builder to use prepared statements with strictly typed bind parameters.', poc: '// Boundary probe\nfetch("/api/analytics/query?tagFilter=demo\' OR \'1\'=\'1");' },
    { id: 'WM-006', title: 'Server-Side Request Forgery (SSRF) in Outbound Webhook Verification', severity: 'Critical', component: 'Partner Webhook Dispatcher', status: 'Investigating', detected: '2 days ago', aiConfidence: 92, cvss: 9.3, cwe: 'CWE-918', desc: 'Endpoint /api/webhooks/test-delivery accepts user destination URLs without RFC-1918 private IP validation.', impact: 'Probing internal microservices and cloud metadata services (169.254.169.254).', evidence: 'Dispatch to http://127.0.0.1:8080/health returned internal actuator payload.', expected: 'Immediate rejection for reserved subnets.', observed: 'Request dispatched to internal loopback.', remediation: 'Implement an egress DNS-resolving validator to block private RFC-1918 and loopback subnets.', poc: '// Safe internal probe validation\nconst isPrivate = ip => /^(10\\.|172\\.(1[6-9]|2\\d|3[01])\\.|192\\.168\\.|127\\.|169\\.254)/.test(ip);' },
    { id: 'WM-007', title: 'Missing Rate Limiting on Password Reset Request Endpoint', severity: 'Medium', component: 'Customer Auth Portal', status: 'Open', detected: '3 days ago', aiConfidence: 95, cvss: 5.3, cwe: 'CWE-307', desc: 'Endpoint /api/v1/auth/forgot-password allows unlimited successive requests without backoff.', impact: 'Email spamming, SMS toll fraud, and user enumeration.', evidence: '50 rapid POST requests all returned HTTP 200 OK without HTTP 429.', expected: 'Rate limit enforced after 3 requests.', observed: 'No rate limiting triggered.', remediation: 'Deploy Redis token bucket rate limiter (3 requests per 15 minutes per IP).', poc: '// Test rate limit headers\nfor(let i=0; i<5; i++) fetch("/api/v1/auth/forgot-password");' },
    { id: 'WM-008', title: 'Permissive Cross-Origin Resource Sharing (CORS) with Wildcard Credentials', severity: 'Medium', component: 'Analytics API Gateway', status: 'Remediated', detected: '4 days ago', aiConfidence: 98, cvss: 6.5, cwe: 'CWE-346', desc: 'API returned Access-Control-Allow-Origin: * while reflecting credentials.', impact: 'Cross-origin read of authenticated data.', evidence: 'Arbitrary external origin accepted with credentials.', expected: 'Whitelist verified organizational domains only.', observed: 'Wildcard permitted.', remediation: 'Enforce strict origin whitelist matching *.worldmonitor.internal.', poc: '// Origin inspection probe\nfetch("/api/analytics", { headers: { "Origin": "https://untrusted.test" } });' },
    { id: 'WM-009', title: 'Hardcoded Mock Cryptographic Secret in Client Bundle Artifact', severity: 'High', component: 'World Monitor Web', status: 'Remediated', detected: '5 days ago', aiConfidence: 99, cvss: 7.4, cwe: 'CWE-798', desc: 'Test JWT signing key found in client source map file authHelper.ts.map.', impact: 'Potential forgery of test tokens.', evidence: 'Found literal string JWT_DEBUG_SIGNING_KEY in bundle chunk.', expected: 'Zero signing keys in client bundles.', observed: 'Debug constant committed to client asset.', remediation: 'Relocate token verification exclusively to backend microservices.', poc: '// Regex search in bundle\nconst secretRegex = /JWT_.*KEY\\s*=\\s*["\'][^"\']+["\']/i;' },
    { id: 'WM-010', title: 'Cross-Site Scripting (Reflected XSS) in Audit Search Query Bar', severity: 'Medium', component: 'Internal Admin Control Panel', status: 'Open', detected: 'Yesterday, 11:30 UTC', aiConfidence: 93, cvss: 6.1, cwe: 'CWE-79', desc: 'Search parameter q reflected into HTML without contextual output escaping.', impact: 'Execution of JavaScript in operator browser session.', evidence: 'Injecting safe probe <b id=test> reflected without entity escaping.', expected: 'Rendered as text with HTML entities.', observed: 'Injected into DOM innerHTML.', remediation: 'Use textContent or JSX automatic escaping.', poc: '// Safe DOM probe\nconst safeCheck = "<b id=\'probe\'>test</b>";' },
    { id: 'WM-011', title: 'Missing HttpOnly and SameSite Attribute on Auth Session Cookies', severity: 'Medium', component: 'Customer Auth Portal', status: 'Open', detected: '2 days ago', aiConfidence: 96, cvss: 5.4, cwe: 'CWE-1004', desc: 'wm_sess_id cookie dispatched without HttpOnly and SameSite attributes.', impact: 'Exposes session cookie to JavaScript exfiltration.', evidence: 'Set-Cookie lacks HttpOnly and SameSite flags.', expected: 'Set-Cookie: ...; HttpOnly; SameSite=Strict; Secure', observed: 'Accessible via document.cookie.', remediation: 'Configure cookie options with httpOnly: true and sameSite: "strict".', poc: 'console.log("Cookie readable:", document.cookie.includes("wm_sess_id"));' },
    { id: 'WM-012', title: 'GraphQL Introspection Query Enabled in Staging Environment', severity: 'Low', component: 'Analytics API Gateway', status: 'Open', detected: '3 days ago', aiConfidence: 99, cvss: 4.3, cwe: 'CWE-200', desc: 'GraphQL endpoint exposes __schema introspection query to unauthenticated callers.', impact: 'Allows discovery of hidden fields and mutations.', evidence: 'Introspection returned complete graph schema.', expected: 'Disabled in non-dev environments.', observed: 'Full schema returned.', remediation: 'Disable Apollo Server introspection in non-development configs.', poc: 'fetch("/graphql", { body: JSON.stringify({ query: "{ __schema { types { name } } }" }) });' },
    { id: 'WM-013', title: 'Insecure Direct Object Reference (IDOR) in Document Export', severity: 'High', component: 'Cloud Storage Broker', status: 'Investigating', detected: 'Yesterday, 15:45 UTC', aiConfidence: 92, cvss: 8.1, cwe: 'CWE-639', desc: 'Endpoint /api/storage/export?docId=doc_1024 serves encrypted vault keys without department verification.', impact: 'Unauthorized access to encrypted document vaults.', evidence: 'User in Department B accessed Department A document manifest.', expected: 'HTTP 403 Forbidden.', observed: 'HTTP 200 OK with document stream.', remediation: 'Enforce ACL lookup verification prior to pre-signed URL generation.', poc: '// IDOR test probe\nfetch("/api/storage/export?docId=doc_1024");' },
    { id: 'WM-014', title: 'Verbose Server Software Version Banners Exposed in HTTP Headers', severity: 'Informational', component: 'Web Server', status: 'Open', detected: '5 days ago', aiConfidence: 98, cvss: 2.5, cwe: 'CWE-200', desc: 'Server returns detailed headers Server: nginx/1.24.0 and X-Powered-By: Express/4.18.2.', impact: 'Assists reconnaissance and version-specific exploit matching.', evidence: 'Server header exposes precise nginx version.', expected: 'Generic or suppressed server header.', observed: 'nginx/1.24.0 disclosed.', remediation: 'Add server_tokens off; and disable x-powered-by.', poc: 'fetch("/").then(r => console.log(r.headers.get("server")));' },
    { id: 'WM-015', title: 'TLS 1.0 and 1.1 Deprecated Cipher Suites Accepted on Edge Ingress', severity: 'Medium', component: 'Secure Communication', status: 'Remediated', detected: '6 days ago', aiConfidence: 97, cvss: 5.9, cwe: 'CWE-326', desc: 'Ingress load balancer permitted legacy TLS 1.0 handshake negotiations.', impact: 'Vulnerable to cryptographic downgrade attacks.', evidence: 'Negotiated TLSv1.0 connection successfully.', expected: 'TLS 1.2+ minimum strictly required.', observed: 'Connection accepted.', remediation: 'Enforce TLS 1.2+ minimum with AEAD cipher suites.', poc: '// TLS protocol evaluation\nconsole.log("Verifying edge TLS 1.2+ minimum...");' },
    { id: 'WM-016', title: 'Lack of CSRF Protection on State-Changing API Endpoints', severity: 'Medium', component: 'Customer Auth Portal', status: 'Open', detected: '4 days ago', aiConfidence: 91, cvss: 6.5, cwe: 'CWE-352', desc: 'POST endpoint /api/v1/user/update-email relies on ambient cookies without CSRF validation.', impact: 'Cross-site request forgery email alteration.', evidence: 'Request succeeded without custom header or CSRF token.', expected: 'HTTP 403 Forbidden on missing token.', observed: 'HTTP 200 OK.', remediation: 'Implement Double-Submit Cookie CSRF pattern or custom request headers.', poc: '// CSRF validation probe\nconsole.log("Checking CSRF token enforcement...");' },
    { id: 'WM-017', title: 'Unrestricted File Type Upload in Avatar Profile Subsystem', severity: 'High', component: 'World Monitor Web', status: 'Investigating', detected: 'Yesterday, 09:12 UTC', aiConfidence: 94, cvss: 7.8, cwe: 'CWE-434', desc: 'Endpoint /api/users/avatar validates client MIME header instead of magic bytes.', impact: 'Uploading SVG files with embedded script tags.', evidence: 'SVG with script tags accepted and stored.', expected: 'Only JPG, PNG, WebP permitted; magic byte inspection.', observed: 'Unsanitized SVG stored.', remediation: 'Inspect magic bytes and re-encode images through Sharp on upload.', poc: '// Magic byte verification\nconsole.log("Testing upload magic byte filters...");' },
    { id: 'WM-018', title: 'Cleartext HTTP Fallback Permitted on Legacy Port 80', severity: 'Low', component: 'Secure Communication', status: 'Open', detected: '1 week ago', aiConfidence: 99, cvss: 3.7, cwe: 'CWE-319', desc: 'Port 80 serves content directly rather than issuing an immediate HTTP 301 Permanent Redirect to HTTPS.', impact: 'Eavesdropping on cleartext public networks.', evidence: 'GET http://demo-app:80 returns 200 OK without redirect.', expected: 'Immediate HTTP 301 to https://.', observed: '200 OK over HTTP.', remediation: 'Configure virtual host to redirect all HTTP traffic to HTTPS.', poc: 'fetch("http://demo-app.worldmonitor.internal/", { redirect: "manual" });' },
  ];

  const AUDIT_LOGS = [
    { id: 'AUD-001', time: '08:31:04 UTC', user: 'admin@worldmonitor.demo', role: 'Security Administrator', action: 'Initiated Authorized Scan', resource: 'World Monitor Web', result: 'Success', ip: '10.240.12.5 / Staging' },
    { id: 'AUD-002', time: '08:31:22 UTC', user: 'admin@worldmonitor.demo', role: 'Security Administrator', action: 'Enforced AI Safe Assessment Mode', resource: 'Global Policy Engine', result: 'Success', ip: '10.240.12.5 / Console' },
    { id: 'AUD-003', time: '08:32:15 UTC', user: 'analyst@worldmonitor.demo', role: 'Security Analyst', action: 'Viewed Vulnerability Record', resource: 'WM-001 (BOLA)', result: 'Success', ip: '10.240.12.18 / Demo' },
    { id: 'AUD-004', time: '08:33:00 UTC', user: 'analyst@worldmonitor.demo', role: 'Security Analyst', action: 'Executed AI Vulnerability Diagnosis', resource: 'API Endpoint /users/profile', result: 'Success', ip: '10.240.12.18 / Sandbox' },
    { id: 'AUD-005', time: '08:34:11 UTC', user: 'admin@worldmonitor.demo', role: 'Security Administrator', action: 'Updated RBAC Permission Policy', resource: 'Viewer Role Definition', result: 'Success', ip: '10.240.12.5 / Console' },
    { id: 'AUD-006', time: '08:35:40 UTC', user: 'viewer@worldmonitor.demo', role: 'Viewer', action: 'Attempted Assessment Launch', resource: 'Analytics Gateway', result: 'Denied', ip: '192.168.1.105 / Public' },
  ];

  // State
  let currentRole = 'Security Administrator';
  let activePage = 'dashboard';
  let isLivePaused = false;
  let liveEvents = [
    { time: '08:31:04', type: 'LOGIN_SUCCESS', text: 'Successful login (Test User)', sev: 'low', actor: 'demo_analyst', ip: '10.240.12.18' },
    { time: '08:31:09', type: 'API_REQUEST', text: 'API request /api/reports [200 OK]', sev: 'info', actor: 'demo_analyst', ip: '10.240.12.18' },
    { time: '08:31:14', type: 'AUTHZ_CHECK', text: 'Authorization check PASS', sev: 'low', actor: 'system_pdp', ip: '10.240.10.1' },
    { time: '08:31:22', type: 'AI_ANOMALY', text: 'AI anomaly detected (Medium)', sev: 'medium', actor: 'ai_sentry', ip: '10.240.12.99' },
    { time: '08:31:35', type: 'LOGIN_FAILURE', text: 'Authentication failed (143 attempts)', sev: 'critical', actor: 'unknown_scanner', ip: '198.51.100.42' },
  ];

  // Helper: Format badge
  function renderBadge(sev) {
    const s = sev.toLowerCase();
    return `<span class="badge badge-${s}"><span style="width:5px;height:5px;border-radius:50%;background:currentColor;display:inline-block"></span>${sev}</span>`;
  }

  // Helper: Safe HTML
  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // --- RENDER VIEWS ---

  function renderDashboard() {
    return `
      <!-- Safety Banner -->
      <div style="background:linear-gradient(90deg, #091224, #0b1a36); border:1px solid rgba(6,182,212,0.3); border-radius:12px; padding:16px; margin-bottom:20px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="width:36px; height:36px; border-radius:8px; background:rgba(6,182,212,0.15); display:flex; align-items:center; justify-content:center; color:#06b6d4; font-size:18px;">🛡️</div>
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:700; color:#06b6d4; letter-spacing:1px;">AUTHORIZED TESTING ONLY</span>
              <span style="background:rgba(16,185,129,0.15); color:#10b981; border:1px solid rgba(16,185,129,0.3); border-radius:10px; font-size:9px; padding:2px 8px; font-weight:700;">● SYSTEM ONLINE</span>
            </div>
            <p style="font-size:12px; color:#94a3b8; margin-top:2px;">All security testing features operate only on explicitly authorized test targets with synthetic demo data.</p>
          </div>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-primary" onclick="window.WM.openNewAssessmentModal()">+ New Assessment</button>
          <button class="btn btn-secondary" onclick="window.WM.navigate('ai-analyzer')">🤖 AI Analyze</button>
          <button class="btn btn-secondary" onclick="window.WM.navigate('reports')">📊 Generate Report</button>
        </div>
      </div>

      <!-- Section 5: Top 8 KPI Cards with Animated Numbers -->
      <div class="grid-kpis">
        <div class="kpi-card" onclick="window.WM.navigate('applications')"><div class="kpi-label">Total Applications</div><div class="kpi-val">12</div></div>
        <div class="kpi-card" onclick="window.WM.navigate('assessments')"><div class="kpi-label">Active Assessments</div><div class="kpi-val" style="color:#06b6d4;">4</div></div>
        <div class="kpi-card" onclick="window.WM.navigate('vulnerabilities')"><div class="kpi-label">Open Vulnerabilities</div><div class="kpi-val" style="color:#f59e0b;">18</div></div>
        <div class="kpi-card" onclick="window.WM.navigate('vulnerabilities')"><div class="kpi-label">Critical Findings</div><div class="kpi-val" style="color:#ef4444;">2</div></div>
        <div class="kpi-card"><div class="kpi-label">Security Score</div><div class="kpi-val" style="color:#10b981;">82%</div></div>
        <div class="kpi-card" onclick="window.WM.navigate('api-security')"><div class="kpi-label">API Requests</div><div class="kpi-val">24.8K</div></div>
        <div class="kpi-card" onclick="window.WM.navigate('authentication')"><div class="kpi-label">Failed Logins</div><div class="kpi-val" style="color:#ef4444;">143</div></div>
        <div class="kpi-card" onclick="window.WM.navigate('alerts')"><div class="kpi-label">AI Alerts</div><div class="kpi-val" style="color:#06b6d4;">7</div></div>
      </div>

      <!-- Section 6: Circular Security Score (82/100) + Radar Posture Breakdown -->
      <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:20px; margin-bottom:20px;">
        <div class="cyber-card">
          <div class="cyber-card-header">
            <div>
              <div class="card-title">Security Posture Score</div>
              <div style="font-size:11px; color:#64748b;">Multi-domain weighted evaluation</div>
            </div>
            <span style="background:rgba(16,185,129,0.15); color:#10b981; border:1px solid rgba(16,185,129,0.3); border-radius:6px; font-size:11px; padding:3px 8px; font-weight:600;">Good Security Posture</span>
          </div>

          <div style="display:flex; align-items:center; gap:24px; flex-wrap:wrap;">
            <!-- Circular Gauge -->
            <div style="position:relative; width:140px; height:140px; display:flex; align-items:center; justify-content:center;">
              <svg width="140" height="140" style="transform:rotate(-90deg);">
                <circle cx="70" cy="70" r="54" stroke="#1e293b" stroke-width="12" fill="none" />
                <circle cx="70" cy="70" r="54" stroke="#06b6d4" stroke-width="12" fill="none" stroke-dasharray="339.29" stroke-dashoffset="61.07" stroke-linecap="round" />
              </svg>
              <div style="position:absolute; text-align:center;">
                <div style="font-size:32px; font-weight:800; font-family:'JetBrains Mono',monospace; color:#fff;">82</div>
                <div style="font-size:10px; color:#64748b; font-weight:700;">/ 100 (B+)</div>
              </div>
            </div>

            <!-- Breakdown Bars -->
            <div style="flex:1; min-width:180px; display:flex; flex-direction:column; gap:8px; font-size:11px;">
              <div><div style="display:flex; justify-content:space-between;"><span>Authentication</span><span style="font-family:'JetBrains Mono',monospace; color:#06b6d4;">88%</span></div><div style="height:4px; background:#1e293b; border-radius:2px; margin-top:2px;"><div style="width:88%; height:100%; background:#06b6d4; border-radius:2px;"></div></div></div>
              <div><div style="display:flex; justify-content:space-between;"><span>Authorization</span><span style="font-family:'JetBrains Mono',monospace; color:#f59e0b;">76%</span></div><div style="height:4px; background:#1e293b; border-radius:2px; margin-top:2px;"><div style="width:76%; height:100%; background:#f59e0b; border-radius:2px;"></div></div></div>
              <div><div style="display:flex; justify-content:space-between;"><span>API Security</span><span style="font-family:'JetBrains Mono',monospace; color:#06b6d4;">81%</span></div><div style="height:4px; background:#1e293b; border-radius:2px; margin-top:2px;"><div style="width:81%; height:100%; background:#06b6d4; border-radius:2px;"></div></div></div>
              <div><div style="display:flex; justify-content:space-between;"><span>Input Validation</span><span style="font-family:'JetBrains Mono',monospace; color:#10b981;">84%</span></div><div style="height:4px; background:#1e293b; border-radius:2px; margin-top:2px;"><div style="width:84%; height:100%; background:#10b981; border-radius:2px;"></div></div></div>
              <div><div style="display:flex; justify-content:space-between;"><span>Data Protection</span><span style="font-family:'JetBrains Mono',monospace; color:#f59e0b;">79%</span></div><div style="height:4px; background:#1e293b; border-radius:2px; margin-top:2px;"><div style="width:79%; height:100%; background:#f59e0b; border-radius:2px;"></div></div></div>
              <div><div style="display:flex; justify-content:space-between;"><span>Communication Security</span><span style="font-family:'JetBrains Mono',monospace; color:#10b981;">91%</span></div><div style="height:4px; background:#1e293b; border-radius:2px; margin-top:2px;"><div style="width:91%; height:100%; background:#10b981; border-radius:2px;"></div></div></div>
            </div>
          </div>
        </div>

        <!-- Section 7: Security Score Trend Chart -->
        <div class="cyber-card">
          <div class="cyber-card-header">
            <div>
              <div class="card-title">Security Score — Last 30 Days</div>
              <div style="font-size:11px; color:#64748b;">Continuous posture trajectory</div>
            </div>
            <span style="color:#10b981; font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:700;">+14% Improvement</span>
          </div>

          <div style="height:150px; display:flex; align-items:flex-end; gap:8px; padding-top:20px;">
            ${[68, 70, 71, 74, 73, 77, 79, 80, 82].map((s, idx) => `
              <div style="flex:1; display:flex; flex-direction:column; align-items:center; gap:4px; height:100%; justify-content:flex-end;">
                <span style="font-size:9px; color:#06b6d4; font-family:'JetBrains Mono',monospace;">${s}%</span>
                <div style="width:100%; height:${((s - 50) / 50) * 100}%; background:linear-gradient(180deg, #06b6d4, rgba(6,182,212,0.2)); border-radius:4px 4px 0 0;"></div>
                <span style="font-size:9px; color:#64748b; font-family:'JetBrains Mono',monospace;">D${idx * 3 + 1}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Quick Recent Findings Table Snapshot -->
      <div class="cyber-card">
        <div class="cyber-card-header">
          <div class="card-title">Recent Vulnerability Detections</div>
          <button class="btn btn-secondary" onclick="window.WM.navigate('vulnerabilities')">View All 30 Findings →</button>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Vulnerability</th><th>Severity</th><th>Component</th><th>Status</th><th>AI Confidence</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${VULNERABILITIES.slice(0, 5).map(v => `
                <tr onclick="window.WM.openVulnDetail('${v.id}')" style="cursor:pointer;">
                  <td style="font-family:'JetBrains Mono',monospace; color:#06b6d4; font-weight:700;">${v.id}</td>
                  <td style="font-weight:600; color:#fff;">${v.title}</td>
                  <td>${renderBadge(v.severity)}</td>
                  <td>${v.component}</td>
                  <td><span style="font-family:'JetBrains Mono',monospace; font-size:10px; color:#ef4444;">${v.status}</span></td>
                  <td style="font-family:'JetBrains Mono',monospace; color:#06b6d4;">${v.aiConfidence}%</td>
                  <td><button class="btn btn-secondary" style="padding:4px 8px; font-size:11px;">Inspect</button></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  function renderApplications() {
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="font-size:20px; font-weight:800; color:#fff;">Target Applications</h2>
          <p style="font-size:12px; color:#64748b;">12 registered target applications under continuous security telemetry</p>
        </div>
        <button class="btn btn-primary" onclick="window.WM.openAddAppModal()">+ Add Application</button>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Application Name</th><th>Environment</th><th>Status</th><th>Security Score</th><th>Last Assessment</th><th>Risk</th><th>Base URL</th>
            </tr>
          </thead>
          <tbody>
            ${APPLICATIONS.map(a => `
              <tr>
                <td style="font-weight:700; color:#fff;">${a.name}<div style="font-size:10px; color:#64748b; font-weight:normal;">${a.tech}</div></td>
                <td><span style="font-family:'JetBrains Mono',monospace; font-size:11px; background:#1e293b; padding:2px 8px; border-radius:6px;">${a.env}</span></td>
                <td><span style="color:#10b981; font-weight:600;">● ${a.status}</span></td>
                <td style="font-family:'JetBrains Mono',monospace; font-weight:700; color:${a.score >= 80 ? '#10b981' : a.score >= 70 ? '#f59e0b' : '#ef4444'};">${a.score}%</td>
                <td style="font-size:11px; color:#94a3b8;">${a.lastAssessment}</td>
                <td>${renderBadge(a.risk)}</td>
                <td style="font-family:'JetBrains Mono',monospace; font-size:10px; color:#06b6d4;">${a.url}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderVulnerabilities() {
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="font-size:20px; font-weight:800; color:#fff;">Vulnerability Findings (30 Records)</h2>
          <p style="font-size:12px; color:#64748b;">Authorized assessment findings with AI confidence scores and safe verification scripts</p>
        </div>
        <div style="display:flex; gap:6px;">
          <input type="text" id="vulnSearchInput" placeholder="Filter by ID, title, or CWE..." onkeyup="window.WM.filterVulns()" style="background:#090e1c; border:1px solid #1e293b; border-radius:8px; padding:6px 12px; font-size:12px; color:#fff; width:240px;" />
        </div>
      </div>

      <div class="table-container">
        <table id="vulnTable">
          <thead>
            <tr>
              <th>ID</th><th>Vulnerability</th><th>Severity</th><th>Component</th><th>Status</th><th>Detected</th><th>AI Confidence</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${VULNERABILITIES.map(v => `
              <tr onclick="window.WM.openVulnDetail('${v.id}')" style="cursor:pointer;">
                <td style="font-family:'JetBrains Mono',monospace; color:#06b6d4; font-weight:700;">${v.id}</td>
                <td style="font-weight:600; color:#fff;">${v.title}<div style="font-size:10px; color:#64748b; font-family:'JetBrains Mono',monospace;">${v.cwe} • CVSS ${v.cvss}</div></td>
                <td>${renderBadge(v.severity)}</td>
                <td>${v.component}</td>
                <td><span style="font-family:'JetBrains Mono',monospace; font-size:11px; color:${v.status === 'Remediated' ? '#10b981' : '#ef4444'};">${v.status}</span></td>
                <td style="font-size:11px; color:#94a3b8;">${v.detected}</td>
                <td style="font-family:'JetBrains Mono',monospace; color:#06b6d4; font-weight:700;">${v.aiConfidence}%</td>
                <td><button class="btn btn-secondary" style="padding:4px 8px; font-size:11px;">Inspect</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderAIAnalyzer() {
    return `
      <div style="margin-bottom:20px;">
        <h2 style="font-size:20px; font-weight:800; color:#fff;">AI Vulnerability Analyzer</h2>
        <p style="font-size:12px; color:#64748b;">Contextual automated diagnosis of raw security test outputs, requests, and logs</p>
      </div>

      <div class="cyber-card" style="margin-bottom:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
          <span style="font-size:12px; font-weight:700; color:#94a3b8; text-transform:uppercase;">Paste Raw Output / HTTP Trace</span>
          <div style="display:flex; gap:6px;">
            <button class="btn btn-secondary" onclick="window.WM.loadAnalyzerPreset('bola')">Preset: BOLA/IDOR</button>
            <button class="btn btn-secondary" onclick="window.WM.loadAnalyzerPreset('sqli')">Preset: SQLi</button>
            <button class="btn btn-secondary" onclick="window.WM.loadAnalyzerPreset('ssrf')">Preset: SSRF</button>
            <button class="btn btn-secondary" onclick="window.WM.loadAnalyzerPreset('error')">Preset: Stack Trace</button>
          </div>
        </div>

        <textarea id="analyzerInput" rows="6" style="width:100%; background:#090e1c; border:1px solid #1e293b; border-radius:10px; padding:12px; font-family:'JetBrains Mono',monospace; font-size:12px; color:#06b6d4; outline:none; resize:vertical;"></textarea>

        <div style="display:flex; justify-content:flex-end; margin-top:12px;">
          <button class="btn btn-primary" onclick="window.WM.runAIAnalysis()">✨ Analyze with AI</button>
        </div>
      </div>

      <div id="analyzerOutput" style="display:none;" class="cyber-card"></div>
    `;
  }

  function renderLiveMonitor() {
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="font-size:20px; font-weight:800; color:#fff;">Live Security Monitor</h2>
          <p style="font-size:12px; color:#64748b;">Real-time simulated telemetry ticker capturing authentication, authorization, and AI anomalies</p>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-secondary" id="pauseLiveBtn" onclick="window.WM.toggleLivePause()">${isLivePaused ? '▶ Resume' : '⏸ Pause'}</button>
          <button class="btn btn-secondary" onclick="window.WM.clearLiveEvents()">🗑️ Clear</button>
        </div>
      </div>

      <div class="cyber-card" style="font-family:'JetBrains Mono',monospace; font-size:12px;">
        <div style="border-bottom:1px solid #1e293b; padding-bottom:8px; margin-bottom:12px; display:flex; justify-content:space-between; color:#64748b; font-size:10px; font-weight:700;">
          <span>TIMESTAMP / SUMMARY</span>
          <span>ACTOR & IP</span>
        </div>
        <div id="liveStreamList" style="display:flex; flex-direction:column; gap:8px; max-height:480px; overflow-y:auto;">
          ${liveEvents.map(e => `
            <div style="display:flex; justify-content:space-between; align-items:center; background:#090e1c; padding:10px 14px; border-radius:8px; border-left:3px solid ${e.sev === 'critical' ? '#ef4444' : e.sev === 'medium' ? '#f59e0b' : '#06b6d4'};">
              <div>
                <span style="color:#64748b; margin-right:8px;">${e.time}</span>
                <span style="font-weight:700; color:#fff;">${e.text}</span>
              </div>
              <div style="color:#06b6d4; font-size:11px;">${e.actor} <span style="color:#64748b;">(${e.ip})</span></div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  function renderAccessTester() {
    return `
      <div style="margin-bottom:20px;">
        <h2 style="font-size:20px; font-weight:800; color:#fff;">Access Control Tester</h2>
        <p style="font-size:12px; color:#64748b;">Simulated Policy Decision Point (PDP) evaluating authorization rules</p>
      </div>

      <div class="cyber-card" style="margin-bottom:20px;">
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:16px; margin-bottom:16px;">
          <div>
            <label style="font-size:11px; font-weight:700; color:#94a3b8; display:block; margin-bottom:6px;">Test User</label>
            <select id="authzUser" style="width:100%; background:#090e1c; border:1px solid #1e293b; border-radius:8px; padding:8px 12px; color:#fff; font-size:12px;">
              <option value="analyst">Demo Analyst (Alex Rivera)</option>
              <option value="viewer">Viewer Account (Morgan Vance)</option>
              <option value="admin">Administrator (Sarah Connor)</option>
            </select>
          </div>
          <div>
            <label style="font-size:11px; font-weight:700; color:#94a3b8; display:block; margin-bottom:6px;">Target Resource</label>
            <select id="authzResource" style="width:100%; background:#090e1c; border:1px solid #1e293b; border-radius:8px; padding:8px 12px; color:#fff; font-size:12px;">
              <option value="admin_users">Admin User Management (/api/admin/users)</option>
              <option value="assessments">Launch Security Assessment (/api/assessments)</option>
              <option value="dashboard">View Security Dashboard (/api/dashboard)</option>
            </select>
          </div>
          <div>
            <label style="font-size:11px; font-weight:700; color:#94a3b8; display:block; margin-bottom:6px;">Expected Permission</label>
            <select id="authzExpected" style="width:100%; background:#090e1c; border:1px solid #1e293b; border-radius:8px; padding:8px 12px; color:#fff; font-size:12px;">
              <option value="DENY">DENY</option>
              <option value="ALLOW">ALLOW</option>
            </select>
          </div>
        </div>
        <button class="btn btn-primary" onclick="window.WM.runAuthzCheck()">Execute Authorization Check</button>
      </div>

      <div id="authzResultCard" class="cyber-card" style="display:none;"></div>
    `;
  }

  function renderReports() {
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:12px;">
        <div>
          <h2 style="font-size:20px; font-weight:800; color:#fff;">AI Security Report Generator</h2>
          <p style="font-size:12px; color:#64748b;">Comprehensive 11-section executive & technical assessment report preview</p>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn-secondary" onclick="window.print()">🖨️ Print / Save as PDF</button>
          <button class="btn btn-primary" onclick="window.WM.exportCSV()">📥 Export CSV</button>
        </div>
      </div>

      <div class="cyber-card" style="padding:32px; font-size:13px; line-height:1.7;">
        <div style="border-bottom:1px solid #1e293b; padding-bottom:16px; margin-bottom:24px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-family:'JetBrains Mono',monospace; font-size:11px; color:#06b6d4; font-weight:800;">WORLD MONITOR ASSURANCE REPORT</div>
            <h1 style="font-size:22px; font-weight:800; color:#fff; margin-top:4px;">Executive Security Assessment Report</h1>
            <div style="font-size:11px; color:#64748b;">Generated: ${new Date().toLocaleDateString()} • Lead Assessor: Alex Rivera • Classification: Authorized Confidential</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:32px; font-family:'JetBrains Mono',monospace; font-weight:800; color:#06b6d4;">82%</div>
            <div style="font-size:10px; color:#64748b; font-weight:700;">OVERALL POSTURE SCORE</div>
          </div>
        </div>

        <h3 style="font-family:'JetBrains Mono',monospace; color:#06b6d4; font-size:14px; margin:16px 0 8px;">1. Executive Summary</h3>
        <p style="color:#94a3b8;">World Monitor evaluated 12 critical application services within authorized test and staging boundaries. 18 open vulnerabilities were identified, including 2 critical-severity findings that require immediate mitigation. Overall security posture is scored at 82/100 (Grade B+).</p>

        <h3 style="font-family:'JetBrains Mono',monospace; color:#06b6d4; font-size:14px; margin:16px 0 8px;">2. Assessment Scope</h3>
        <p style="color:#94a3b8;">Testing was strictly restricted to authorized non-production environments with synthetic datasets. Out-of-scope production customer databases were excluded in compliance with the platform safety charter.</p>

        <h3 style="font-family:'JetBrains Mono',monospace; color:#06b6d4; font-size:14px; margin:16px 0 8px;">3. Methodology</h3>
        <p style="color:#94a3b8;">Followed OWASP ASVS v4.0 verification methodology, encompassing black-box dynamic fuzzing (DAST), authenticated API parameter boundary analysis, and AI-assisted anomaly correlation.</p>

        <h3 style="font-family:'JetBrains Mono',monospace; color:#06b6d4; font-size:14px; margin:16px 0 8px;">4. Applications Tested</h3>
        <p style="color:#94a3b8;">World Monitor Web, Mobile Monitor Client, Analytics API Gateway, Customer Auth Portal, and 8 additional microservices.</p>

        <h3 style="font-family:'JetBrains Mono',monospace; color:#06b6d4; font-size:14px; margin:16px 0 8px;">5. Findings Summary</h3>
        <p style="color:#94a3b8;">Key findings include WM-005 (Dynamic Query Injection in Analytics Gateway, CVSS 9.1), WM-006 (SSRF in Outbound Webhook Dispatcher, CVSS 9.3), and WM-001 (BOLA in User Financial Profile, CVSS 8.4).</p>

        <h3 style="font-family:'JetBrains Mono',monospace; color:#06b6d4; font-size:14px; margin:16px 0 8px;">6. Risk Assessment & Recommendations</h3>
        <p style="color:#94a3b8;">Prioritize prepared statements on the Analytics Gateway, implement RFC-1918 loopback egress filters on the Webhook Dispatcher, and enforce tenancy verification middleware on user endpoints.</p>
      </div>
    `;
  }

  // --- CORE UI CONTROLLER ---

  window.WM = {
    navigate: function(page) {
      activePage = page;
      document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
      const activeBtn = document.querySelector(`[data-page="${page}"]`);
      if (activeBtn) activeBtn.classList.add('active');

      const container = document.getElementById('mainContentArea');
      if (page === 'dashboard') container.innerHTML = renderDashboard();
      else if (page === 'applications') container.innerHTML = renderApplications();
      else if (page === 'vulnerabilities') container.innerHTML = renderVulnerabilities();
      else if (page === 'ai-analyzer') container.innerHTML = renderAIAnalyzer();
      else if (page === 'live-monitor') container.innerHTML = renderLiveMonitor();
      else if (page === 'authorization') container.innerHTML = renderAccessTester();
      else if (page === 'reports') container.innerHTML = renderReports();
      else container.innerHTML = renderDashboard();

      window.scrollTo(0, 0);
    },

    setRole: function(role) {
      currentRole = role;
      document.getElementById('currentRoleDisplay').innerText = role;
    },

    toggleLivePause: function() {
      isLivePaused = !isLivePaused;
      const btn = document.getElementById('pauseLiveBtn');
      if (btn) btn.innerText = isLivePaused ? '▶ Resume' : '⏸ Pause';
    },

    clearLiveEvents: function() {
      liveEvents = [];
      const list = document.getElementById('liveStreamList');
      if (list) list.innerHTML = '<div style="color:#64748b; padding:12px;">No active events.</div>';
    },

    openVulnDetail: function(id) {
      const v = VULNERABILITIES.find(item => item.id === id);
      if (!v) return;

      const modalHtml = `
        <div class="modal-overlay" onclick="window.WM.closeModal(event)">
          <div class="modal-content" onclick="event.stopPropagation()">
            <div class="modal-header">
              <div>
                <span style="font-family:'JetBrains Mono',monospace; color:#06b6d4; font-weight:700;">${v.id}</span>
                <h3 style="font-size:16px; font-weight:800; color:#fff; margin-top:2px;">${escapeHtml(v.title)}</h3>
              </div>
              <button onclick="window.WM.closeModalDirect()" style="background:none; border:none; color:#64748b; font-size:20px; cursor:pointer;">&times;</button>
            </div>
            <div class="modal-body" style="font-size:12px; line-height:1.6; display:flex; flex-direction:column; gap:16px;">
              <div style="display:flex; gap:8px; align-items:center;">
                ${renderBadge(v.severity)}
                <span style="background:#1e293b; padding:3px 8px; border-radius:6px; font-family:'JetBrains Mono',monospace;">CVSS ${v.cvss}</span>
                <span style="background:#1e293b; padding:3px 8px; border-radius:6px; font-family:'JetBrains Mono',monospace; color:#06b6d4;">${v.cwe}</span>
                <span style="color:#64748b; margin-left:auto;">AI Confidence: <strong style="color:#06b6d4;">${v.aiConfidence}%</strong></span>
              </div>

              <div>
                <div style="font-weight:700; color:#94a3b8; text-transform:uppercase; font-size:10px; margin-bottom:4px;">Description</div>
                <div style="background:#090e1c; padding:10px; border-radius:8px; border:1px solid #1e293b; color:#cbd5e1;">${escapeHtml(v.desc)}</div>
              </div>

              <div>
                <div style="font-weight:700; color:#94a3b8; text-transform:uppercase; font-size:10px; margin-bottom:4px;">Captured Evidence</div>
                <pre style="background:#090e1c; padding:10px; border-radius:8px; border:1px solid #1e293b; color:#06b6d4; font-family:'JetBrains Mono',monospace; font-size:11px; overflow-x:auto;">${escapeHtml(v.evidence)}</pre>
              </div>

              <div>
                <div style="font-weight:700; color:#10b981; text-transform:uppercase; font-size:10px; margin-bottom:4px;">Recommended Remediation</div>
                <div style="background:#090e1c; padding:10px; border-radius:8px; border:1px solid #1e293b; color:#10b981; font-family:'JetBrains Mono',monospace; font-size:11px;">${escapeHtml(v.remediation)}</div>
              </div>
            </div>
          </div>
        </div>
      `;

      const modalContainer = document.getElementById('modalContainer');
      modalContainer.innerHTML = modalHtml;
    },

    closeModal: function(e) {
      if (e.target.classList.contains('modal-overlay')) {
        document.getElementById('modalContainer').innerHTML = '';
      }
    },

    closeModalDirect: function() {
      document.getElementById('modalContainer').innerHTML = '';
    },

    openNewAssessmentModal: function() {
      const modalHtml = `
        <div class="modal-overlay" onclick="window.WM.closeModal(event)">
          <div class="modal-content" onclick="event.stopPropagation()">
            <div class="modal-header">
              <h3 style="font-size:16px; font-weight:800; color:#fff;">Launch Authorized Security Assessment</h3>
              <button onclick="window.WM.closeModalDirect()" style="background:none; border:none; color:#64748b; font-size:20px; cursor:pointer;">&times;</button>
            </div>
            <div class="modal-body" style="display:flex; flex-direction:column; gap:14px; font-size:12px;">
              <div style="background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.3); border-radius:8px; padding:12px; color:#f59e0b;">
                <strong>MANDATORY:</strong> Testing is restricted to authorized environments and synthetic/demo data.
              </div>
              <div>
                <label style="font-weight:700; color:#94a3b8; display:block; margin-bottom:4px;">Assessment Name</label>
                <input type="text" id="newAsmName" value="Q4 Web Security Baseline Assessment" style="width:100%; background:#090e1c; border:1px solid #1e293b; border-radius:8px; padding:8px 12px; color:#fff; font-size:12px;" />
              </div>
              <div style="background:#090e1c; border:1px solid rgba(6,182,212,0.3); border-radius:8px; padding:12px;">
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer; color:#fff;">
                  <input type="checkbox" id="authConfirmationCheck" />
                  <span>☑ I confirm that I am authorized to assess this application.</span>
                </label>
              </div>
              <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:8px;">
                <button class="btn btn-secondary" onclick="window.WM.closeModalDirect()">Cancel</button>
                <button class="btn btn-primary" onclick="window.WM.submitNewAssessment()">Start Authorized Assessment</button>
              </div>
            </div>
          </div>
        </div>
      `;
      document.getElementById('modalContainer').innerHTML = modalHtml;
    },

    submitNewAssessment: function() {
      const check = document.getElementById('authConfirmationCheck');
      if (!check || !check.checked) {
        alert('You must confirm explicit authorization before launching an assessment.');
        return;
      }
      alert('Authorized assessment initiated successfully in Safe Mode!');
      window.WM.closeModalDirect();
    },

    openAddAppModal: function() {
      const modalHtml = `
        <div class="modal-overlay" onclick="window.WM.closeModal(event)">
          <div class="modal-content" onclick="event.stopPropagation()">
            <div class="modal-header">
              <h3 style="font-size:16px; font-weight:800; color:#fff;">+ Add Application</h3>
              <button onclick="window.WM.closeModalDirect()" style="background:none; border:none; color:#64748b; font-size:20px; cursor:pointer;">&times;</button>
            </div>
            <div class="modal-body" style="display:flex; flex-direction:column; gap:14px; font-size:12px;">
              <div>
                <label style="font-weight:700; color:#94a3b8; display:block; margin-bottom:4px;">Application Name</label>
                <input type="text" id="newAppName" placeholder="e.g. Identity Gateway" style="width:100%; background:#090e1c; border:1px solid #1e293b; border-radius:8px; padding:8px 12px; color:#fff; font-size:12px;" />
              </div>
              <div style="background:#090e1c; border:1px solid rgba(6,182,212,0.3); border-radius:8px; padding:12px;">
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer; color:#fff;">
                  <input type="checkbox" id="addAppAuthCheck" />
                  <span>☑ I confirm that I am authorized to assess this application.</span>
                </label>
              </div>
              <div style="display:flex; justify-content:flex-end; gap:8px;">
                <button class="btn btn-secondary" onclick="window.WM.closeModalDirect()">Cancel</button>
                <button class="btn btn-primary" onclick="window.WM.submitAddApp()">Register Application</button>
              </div>
            </div>
          </div>
        </div>
      `;
      document.getElementById('modalContainer').innerHTML = modalHtml;
    },

    submitAddApp: function() {
      const check = document.getElementById('addAppAuthCheck');
      const name = document.getElementById('newAppName').value;
      if (!check || !check.checked) {
        alert('You must confirm authorization before onboarding.');
        return;
      }
      if (!name) {
        alert('Please enter an application name.');
        return;
      }
      APPLICATIONS.unshift({
        id: 'app-' + (APPLICATIONS.length + 1),
        name: name,
        env: 'Test Environment',
        status: 'Online',
        score: 85,
        lastAssessment: 'Just now',
        risk: 'Medium',
        url: 'https://test-' + name.toLowerCase().replace(/\s+/g, '-') + '.internal',
        tech: 'Node.js / Docker',
        owner: 'SecOps',
        endpoints: 8
      });
      alert('Application added successfully!');
      window.WM.closeModalDirect();
      window.WM.navigate('applications');
    },

    filterVulns: function() {
      const q = document.getElementById('vulnSearchInput').value.toLowerCase();
      const rows = document.querySelectorAll('#vulnTable tbody tr');
      rows.forEach(r => {
        const text = r.innerText.toLowerCase();
        r.style.display = text.includes(q) ? '' : 'none';
      });
    },

    loadAnalyzerPreset: function(type) {
      const input = document.getElementById('analyzerInput');
      if (type === 'bola') {
        input.value = 'GET /api/v1/users/usr_9981/financial-profile HTTP/1.1\nAuthorization: Bearer <unprivileged_token>\nStatus: 200 OK\nBody: { "userId": "usr_9981", "balance": 184500.00 }';
      } else if (type === 'sqli') {
        input.value = "GET /api/analytics/query?tagFilter=audit' OR '1'='1' -- HTTP/1.1\nStatus: 200 OK\nRecordsReturned: 12400";
      } else if (type === 'ssrf') {
        input.value = 'POST /api/webhooks/test-delivery HTTP/1.1\n{ "destinationUrl": "http://127.0.0.1:8080/actuator/health" }\nStatus: 200 OK - Loopback reached';
      } else {
        input.value = 'POST /api/v1/checkout/validate HTTP/1.1\nHTTP 500: PSQLException Connection refused to postgresql://svc:pass@internal-cluster:5432/core_db';
      }
    },

    runAIAnalysis: function() {
      const input = document.getElementById('analyzerInput').value;
      const card = document.getElementById('analyzerOutput');
      if (!input.trim()) return;

      card.style.display = 'block';
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #1e293b; padding-bottom:12px; margin-bottom:16px;">
          <div>
            <span style="font-family:'JetBrains Mono',monospace; font-size:10px; color:#06b6d4; font-weight:700;">AI VULNERABILITY DIAGNOSTICS</span>
            <h3 style="font-size:18px; font-weight:800; color:#fff; margin-top:2px;">Broken Object Level Authorization (BOLA / IDOR)</h3>
          </div>
          <span class="badge badge-high">High Severity (94% Confidence)</span>
        </div>
        <div style="font-size:12px; color:#cbd5e1; display:flex; flex-direction:column; gap:12px;">
          <div><strong>Why This Matters:</strong> The service accepts user-supplied object IDs without verifying if the caller owns the targeted record.</div>
          <div><strong>Potential Impact:</strong> Cross-tenant data exposure and unauthorized access to confidential customer profiles.</div>
          <div><strong>Recommended Fix:</strong> Enforce tenancy ownership verification in the service controller: <code style="color:#06b6d4; font-family:'JetBrains Mono',monospace;">if (req.user.tenantId !== resource.tenantId) return res.status(403);</code></div>
        </div>
      `;
    },

    runAuthzCheck: function() {
      const user = document.getElementById('authzUser').value;
      const expected = document.getElementById('authzExpected').value;
      const card = document.getElementById('authzResultCard');

      let observed = 'DENY';
      if (user === 'admin') observed = 'ALLOW';
      else if (user === 'analyst' && document.getElementById('authzResource').value !== 'admin_users') observed = 'ALLOW';

      const pass = observed === expected;

      card.style.display = 'block';
      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="font-size:24px;">${pass ? '✅' : '❌'}</div>
            <div>
              <div style="font-size:10px; font-family:'JetBrains Mono',monospace; color:#94a3b8;">AUTHORIZATION CHECK RESULT</div>
              <div style="font-size:20px; font-weight:800; font-family:'JetBrains Mono',monospace; color:${pass ? '#10b981' : '#ef4444'};">${pass ? 'PASS' : 'FAIL'}</div>
            </div>
          </div>
          <div style="font-family:'JetBrains Mono',monospace; font-size:11px;">
            Expected: <strong style="color:#fff;">${expected}</strong> | Observed: <strong style="color:#06b6d4;">${observed}</strong>
          </div>
        </div>
      `;
    },

    exportCSV: function() {
      let csv = 'ID,Title,Severity,Component,Status,CVSS,CWE\n';
      VULNERABILITIES.forEach(v => {
        csv += `"${v.id}","${v.title}","${v.severity}","${v.component}","${v.status}","${v.cvss}","${v.cwe}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'World_Monitor_Vulnerabilities.csv';
      a.click();
    },

    toggleAIDrawer: function() {
      const d = document.getElementById('aiDrawer');
      d.classList.toggle('open');
    },

    sendAIMessage: function(text) {
      const input = document.getElementById('aiChatInput');
      const q = text || input.value;
      if (!q.trim()) return;

      const stream = document.getElementById('aiChatStream');
      stream.innerHTML += `
        <div style="align-self:flex-end; background:#0284c7; color:#fff; padding:10px 14px; border-radius:12px 12px 0 12px; font-size:12px; max-width:85%; margin-bottom:8px;">${escapeHtml(q)}</div>
      `;
      input.value = '';
      stream.scrollTop = stream.scrollHeight;

      setTimeout(() => {
        let ans = `I have evaluated your request: "${escapeHtml(q)}". System is operating in Safe Assessment Mode. Current posture is 82% across 12 targets with 18 open vulnerabilities.`;
        if (q.toLowerCase().includes('findings') || q.toLowerCase().includes('vulnerabilit')) {
          ans = 'Prioritize **WM-005 (SQLi)** in Analytics Gateway and **WM-006 (SSRF)** in Webhook Dispatcher as they have the highest CVSS impact (9.1 and 9.3).';
        }
        stream.innerHTML += `
          <div style="align-self:flex-start; background:#1e293b; color:#cbd5e1; padding:12px 14px; border-radius:12px 12px 12px 0; font-size:12px; max-width:85%; margin-bottom:8px; border:1px solid #334155;">
            <div style="font-size:10px; color:#06b6d4; font-weight:700; margin-bottom:4px;">WORLD MONITOR AI (Safe Mode)</div>
            ${ans}
          </div>
        `;
        stream.scrollTop = stream.scrollHeight;
      }, 500);
    }
  };

  // Live event ticker
  setInterval(() => {
    if (isLivePaused) return;
    const now = new Date().toTimeString().split(' ')[0];
    const newEvt = {
      time: now,
      type: 'TELEMETRY_PULSE',
      text: 'Routine authorization telemetry check [PASS]',
      sev: 'low',
      actor: 'system_pdp',
      ip: '10.240.10.8'
    };
    liveEvents.unshift(newEvt);
    if (liveEvents.length > 30) liveEvents.pop();

    const list = document.getElementById('liveStreamList');
    if (list) {
      const el = document.createElement('div');
      el.style.cssText = 'display:flex; justify-content:space-between; align-items:center; background:#090e1c; padding:10px 14px; border-radius:8px; border-left:3px solid #06b6d4;';
      el.innerHTML = `
        <div>
          <span style="color:#64748b; margin-right:8px;">${newEvt.time}</span>
          <span style="font-weight:700; color:#fff;">${newEvt.text}</span>
        </div>
        <div style="color:#06b6d4; font-size:11px;">${newEvt.actor} <span style="color:#64748b;">(${newEvt.ip})</span></div>
      `;
      list.insertBefore(el, list.firstChild);
    }
  }, 3000);

  // Initial load
  document.addEventListener('DOMContentLoaded', () => {
    window.WM.navigate('dashboard');
  });

})();
