import { AIAnalysisResult, Vulnerability, SecurityAlert } from '../types';

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  badge?: string;
}

export const AI_SUGGESTIONS = [
  'Analyze my latest findings',
  'Explain this vulnerability',
  'Summarize today\'s security events',
  'What evidence should I collect?',
  'Generate remediation recommendations',
  'Create a security report',
  'Explain this API response',
];

export async function askAIAssistant(
  question: string,
  contextData?: { vulnerabilities?: Vulnerability[]; alerts?: SecurityAlert[] }
): Promise<string> {
  // Simulate natural AI thinking latency
  await new Promise(resolve => setTimeout(resolve, 800));

  const q = question.toLowerCase();

  if (q.includes('latest findings') || q.includes('analyze findings') || q.includes('finding')) {
    return `### 🛡️ AI Security Findings Analysis

Based on current authorized telemetry:
1. **Critical Focus**: You have **2 Critical Vulnerabilities** requiring prompt attention:
   - **WM-005: Unsanitized Query Injection** in *Analytics API Gateway* (CVSS 9.1). Parameterized queries must be enforced immediately.
   - **WM-006: Server-Side Request Forgery (SSRF)** in *Partner Webhook Dispatcher* (CVSS 9.3). Implement RFC-1918 private IP egress filters.
2. **High Severity Risks (6 items)**: High-priority items include **WM-001 (BOLA/IDOR)** in customer financial profiles and **WM-004 (PII Leakage)** in detailed stack traces.
3. **Posture Trajectory**: Remediation of WM-008 (CORS Permissive) and WM-009 (Secret Exposure) lifted the overall security posture to **82%**.

*Recommendation: Prioritize input validation filters on the Analytics Gateway before proceeding to production validation.*`;
  }

  if (q.includes('explain') && (q.includes('vulnerability') || q.includes('bola') || q.includes('idor'))) {
    return `### 🔍 Broken Object Level Authorization (BOLA / IDOR) Explained

**What it is:**
BOLA (OWASP API Top 10 #1) occurs when an application exposes endpoints that take user-supplied object IDs without verifying if the authenticated user has explicit rights to access that specific record.

**In World Monitor Scope (WM-001):**
- **Vulnerable Pattern:** \`GET /api/v1/users/{id}/financial-profile\`
- **Observed Flaw:** The endpoint checked *authentication* (valid JWT present), but missed *authorization* (did \`jwt.userId === {id}\`?).
- **Remediation:**
\`\`\`typescript
// Enforce tenant authorization guard
const sessionUser = req.user;
if (sessionUser.id !== req.params.id && !sessionUser.roles.includes('Admin')) {
  return res.status(403).json({ error: 'Forbidden: Unauthorized object access' });
}
\`\`\``;
  }

  if (q.includes('summarize') || q.includes('security events') || q.includes('events today')) {
    return `### 📊 Real-Time Security Events Summary (Last 24 Hours)

- **Total Requests Tracked:** 24,800+ API calls monitored across 12 microservices.
- **Authentication Telemetry:**
  - **2,841 Successful Logins** with 78% multi-factor authentication (MFA) adoption.
  - **143 Failed Logins** flagged, featuring a credential spray anomaly from IP \`198.51.100.42\`.
- **System Safeguards:** WAF & Rate Limiters dropped 12 anomalous request bursts.
- **Active Scans:** 4 authorized DAST/SAST assessments actively executing within test boundaries.
- **System Health:** No external exfiltration detected; system operating securely in Safe Assessment Mode.`;
  }

  if (q.includes('evidence') || q.includes('collect')) {
    return `### 📋 Authorized Security Testing Evidence Guidelines

To validate findings without disrupting operational stability, capture the following artifacts:
1. **Sanitized HTTP Request & Response Headers:**
   - Redact live production tokens or proprietary PII.
   - Include timestamp, HTTP method, path, and status code (e.g., HTTP 200 vs expected HTTP 403).
2. **Deterministic Reproduction Steps:**
   - Clear environment preconditions (e.g. "Authenticated as Analyst Test Persona in Staging").
   - Safe curl or Postman payload reproduction.
3. **Telemetry Logs:**
   - Server correlation IDs, CloudWatch / Fluentd event stamps.
4. **Code References:**
   - Git commit hash, affected controller or middleware line numbers.`;
  }

  if (q.includes('remediation') || q.includes('fix')) {
    return `### 🛠️ Strategic Remediation Plan

1. **Immediate P0 Action:** Apply prepared statement parameter bindings to \`/api/analytics/query\` to extinguish WM-005 SQL injection.
2. **Immediate P1 Action:** Deploy egress firewall IP validator on the Webhook Dispatcher to block RFC-1918 loopback SSRF calls.
3. **Defense-in-Depth:**
   - Append \`Content-Security-Policy\` and \`Strict-Transport-Security\` to global reverse proxy headers.
   - Set \`HttpOnly\`, \`Secure\`, and \`SameSite=Strict\` on all authentication cookies.
4. **Verification Step:** Run automated regression tests in the Staging sandbox before releasing to demo production.`;
  }

  if (q.includes('report')) {
    return `### 📑 Security Assessment Report Synthesis

I can automatically synthesize a comprehensive 11-section executive and technical assessment report.
Key elements ready for export:
- Executive Summary & Overall Risk Grade (**B+ / 82%**)
- Complete Inventory of 30 Tested Findings with CWE/CVSS scores
- OWASP ASVS & Top 10 Alignment Matrix
- Verification Proof-of-Concepts (Safe Authorized Synthetics)

*Tip: Navigate to the **Reports** page in the left sidebar to customize sections and export PDF or CSV.*`;
  }

  if (q.includes('api response') || q.includes('api')) {
    return `### 🔌 API Response Security Analysis

When reviewing API responses, verify the following 4 pillars:
1. **Authorization Enclosure:** Ensure sensitive fields (hashes, keys, PII) are excluded via DTO serializers.
2. **Error Hygiene:** Generic error bodies should hide internal stack traces, DB connection strings, and server versions.
3. **Security Headers:** Response must include \`X-Content-Type-Options: nosniff\` and \`Cache-Control: no-store\`.
4. **Rate Limit Headers:** Response headers should broadcast \`X-RateLimit-Limit\` and \`X-RateLimit-Remaining\`.`;
  }

  return `### 🤖 World Monitor AI Assistant (Safe Assessment Mode)

I have analyzed your query: **"${question}"**.

**Analysis:**
- System operates in **Authorized Assessment Mode** with synthetic/demo boundaries.
- No offensive or unauthorized exploitation actions are permitted.
- Current posture score is **82%** across 12 registered applications.
- 18 open vulnerabilities tracked, with 2 critical items flagged for immediate mitigation.

Feel free to ask for deeper technical breakdowns on any finding ID (e.g., *WM-001*, *WM-005*), log parsing, or remediation diffs.`;
}

export async function analyzeVulnerabilityPayload(rawInput: string): Promise<AIAnalysisResult> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const text = rawInput.toLowerCase();

  if (text.includes('select') || text.includes('union') || text.includes('sql') || text.includes("' or '1'='1") || text.includes('database')) {
    return {
      potentialVulnerability: 'Unsanitized Dynamic Query Injection (SQL / NoSQL Injection)',
      severity: 'Critical',
      confidence: 96,
      affectedComponent: 'Data Layer / Query Parser',
      whyThisMatters: 'Unsanitized user inputs concatenated into datastore execution pipelines allow attackers to alter query semantics, bypass access controls, or extract confidential database records.',
      potentialImpact: 'Total loss of data confidentiality and integrity; unauthorized modification of telemetry records.',
      evidence: rawInput.trim() || "Query: SELECT * FROM audit_logs WHERE tag = '' OR '1'='1' --",
      recommendedFix: `// Remediation: Use Parameterized Queries or Prepared Statements
const query = 'SELECT * FROM audit_logs WHERE tag = $1';
const result = await db.query(query, [sanitizedTag]);`,
      retestProcedure: 'Submit boundary characters such as single quotes, double dashes, and Boolean syntax in authorized staging. Verify the application treats inputs as literal strings and returns 400 or properly filtered results without database syntax errors.',
    };
  }

  if (text.includes('169.254') || text.includes('127.0.0.1') || text.includes('localhost') || text.includes('webhook') || text.includes('ssrf')) {
    return {
      potentialVulnerability: 'Server-Side Request Forgery (SSRF)',
      severity: 'Critical',
      confidence: 94,
      affectedComponent: 'Outbound Egress / Webhook Subsystem',
      whyThisMatters: 'The server accepts external destination URLs and performs HTTP requests without restricting loopback or internal RFC-1918 addresses, exposing internal microservices.',
      potentialImpact: 'Reconnaissance of internal infrastructure, unauthorized interaction with internal metadata services (e.g. AWS 169.254.169.254), or lateral movement.',
      evidence: rawInput.trim() || 'Webhook target resolved to 127.0.0.1:8080/actuator/health',
      recommendedFix: `// Enforce strict IP resolution blacklist
const isReservedIP = (ip: string) => /^(10\\.|172\\.(1[6-9]|2[0-9]|3[01])\\.|192\\.168\\.|127\\.|169\\.254)/.test(ip);
const resolvedIP = await dns.lookup(url.hostname);
if (isReservedIP(resolvedIP)) throw new Error('Blocked egress to internal network');`,
      retestProcedure: 'Attempt outbound delivery to simulated internal IP addresses (e.g. 127.0.0.1, 10.0.0.1). Ensure the service validates the resolved IP address and halts the connection prior to sending HTTP payloads.',
    };
  }

  if (text.includes('stacktrace') || text.includes('exception') || text.includes('password') || text.includes('connection string') || text.includes('error')) {
    return {
      potentialVulnerability: 'Sensitive Information Disclosure in Error Responses',
      severity: 'High',
      confidence: 92,
      affectedComponent: 'API Error Handling Middleware',
      whyThisMatters: 'Detailed application stack traces and internal system details returned in HTTP 500 error responses reveal architecture, library versions, and database topology to callers.',
      potentialImpact: 'Facilitates targeted vulnerability exploitation and leakage of customer data or connection credentials.',
      evidence: rawInput.trim() || 'Error: Connection failed to postgresql://svc:pass@internal-cluster:5432/core_db',
      recommendedFix: `// Generic error sanitization middleware
app.use((err, req, res, next) => {
  logger.error(err); // Log full stack internally
  res.status(500).json({
    error: 'InternalServerError',
    message: 'An unexpected error occurred. Reference correlation ID: ' + req.id
  });
});`,
      retestProcedure: 'Trigger controlled 500 errors by passing invalid types to the target endpoint. Confirm that the HTTP response provides only a sanitized correlation ID without stack traces or credentials.',
    };
  }

  // Default response for BOLA / Generic test
  return {
    potentialVulnerability: 'Broken Object Level Authorization (BOLA / IDOR)',
    severity: 'High',
    confidence: 94,
    affectedComponent: 'API Authorization Controller',
    whyThisMatters: 'The service relies on user-supplied IDs to query data objects without verifying that the requesting identity possesses the ownership or organizational permissions for that object.',
    potentialImpact: 'Cross-tenant data exposure and unauthorized modification or exfiltration of sensitive entities.',
    evidence: rawInput.trim() || 'GET /api/v1/users/usr_9981/financial-profile HTTP/1.1 returned HTTP 200 OK for unprivileged token.',
    recommendedFix: `// Implement tenancy ownership verification
const target = await db.findUserById(req.params.id);
if (target.tenantId !== req.user.tenantId && !req.user.hasRole('SecurityAdmin')) {
  return res.status(403).json({ error: 'AccessDenied', message: 'Unauthorized object access' });
}`,
    retestProcedure: 'Issue authenticated requests using User A token against User B resources in the authorized sandbox. Confirm the server returns HTTP 403 Forbidden with zero data disclosure.',
  };
}

export interface LogAnalysisTimelineEvent {
  time: string;
  category: 'Normal' | 'Suspicious' | 'Potential Security Issue';
  count: number;
  description: string;
}

export interface LogAnalysisReport {
  normalCount: number;
  suspiciousCount: number;
  issuesCount: number;
  explanation: string;
  timeline: LogAnalysisTimelineEvent[];
}

export async function analyzeLogsContent(rawLogs: string): Promise<LogAnalysisReport> {
  await new Promise(resolve => setTimeout(resolve, 900));

  return {
    normalCount: 4210,
    suspiciousCount: 143,
    issuesCount: 12,
    explanation: 'AI Log Analysis detected a concentrated credential spray pattern between 08:20 and 08:35 UTC. 143 failed authentication attempts were recorded against 18 distinct username permutations originating from CIDR block 198.51.100.0/24. Concurrently, 12 authorization boundary failures occurred on the `/api/v1/users/{id}/financial-profile` endpoint indicating active IDOR parameter fuzzing. All abnormal attempts were successfully isolated by the policy guard without data breach.',
    timeline: [
      { time: '08:00', category: 'Normal', count: 520, description: 'Routine morning API telemetry' },
      { time: '08:15', category: 'Normal', count: 680, description: 'User login surge' },
      { time: '08:25', category: 'Suspicious', count: 85, description: 'Burst of failed logins from 198.51.100.42' },
      { time: '08:30', category: 'Potential Security Issue', count: 12, description: 'BOLA parameter tampering requests on /users' },
      { time: '08:35', category: 'Suspicious', count: 58, description: 'Secondary password spray on admin accounts' },
      { time: '08:40', category: 'Normal', count: 410, description: 'Traffic normalized after rate-limiting intervention' },
    ]
  };
}
