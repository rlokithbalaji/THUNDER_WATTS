import React, { useState } from 'react';
import { analyzeVulnerabilityPayload } from '../services/aiService';
import { AIAnalysisResult } from '../types';
import { AIAnalysisCard } from '../components/ai/AIAnalysisCard';
import { Bot, Sparkles, Terminal, ArrowRight, ShieldCheck, RotateCcw } from 'lucide-react';

const SAMPLE_PAYLOADS = [
  {
    name: 'BOLA / IDOR in User API',
    payload: `GET /api/v1/users/usr_9981/financial-profile HTTP/1.1
Host: api-stage.worldmonitor.internal
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (claims: userId=usr_1042, role=Analyst)

HTTP/1.1 200 OK
Content-Type: application/json

{
  "userId": "usr_9981",
  "fullName": "Confidential Test Record",
  "bankAccount": "US89370400440532013000",
  "balance": 184500.00
}`,
  },
  {
    name: 'Dynamic Query / SQL Injection',
    payload: `GET /api/analytics/query?tagFilter=audit' OR '1'='1' -- HTTP/1.1
Host: api-stage.worldmonitor.internal

HTTP/1.1 200 OK
Content-Type: application/json

{
  "totalRecords": 12400,
  "records": [
    { "id": 1, "rawSecret": "internal_token_941" },
    { "id": 2, "rawSecret": "db_master_config" }
  ]
}`,
  },
  {
    name: 'SSRF Loopback Delivery',
    payload: `POST /api/webhooks/test-delivery HTTP/1.1
Host: webhooks.worldmonitor.internal
Content-Type: application/json

{
  "destinationUrl": "http://127.0.0.1:8080/actuator/health",
  "payload": { "ping": true }
}

HTTP/1.1 200 OK
{
  "deliveryStatus": "Success",
  "remoteResponse": "HTTP/1.1 200 OK { status: UP, jvmVersion: 17.0.9 }"
}`,
  },
  {
    name: 'Sensitive Stack Trace Exposure',
    payload: `POST /api/v1/checkout/validate HTTP/1.1
Content-Type: application/json

{ "amount": "invalid_number_payload" }

HTTP/1.1 500 Internal Server Error
Content-Type: text/plain

org.postgresql.util.PSQLException: Connection refused to postgresql://svc_app:pwd_mock_881@db-cluster.internal:5432/core_db
  at com.worldmonitor.dao.UserRecord.query(UserRecord.java:142)
  at com.worldmonitor.controller.CheckoutController.validate(CheckoutController.java:58)`,
  },
];

export const AIVulnAnalyzerPage: React.FC = () => {
  const [inputPayload, setInputPayload] = useState(SAMPLE_PAYLOADS[0].payload);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!inputPayload.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await analyzeVulnerabilityPayload(inputPayload);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-cyan-400" />
            AI Vulnerability Analyzer
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Deep contextual diagnosis of raw security test outputs, HTTP traces, and code findings
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 text-xs font-mono">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Safe Assessment Mode: Active</span>
        </div>
      </div>

      {/* Input Box & Presets */}
      <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>Paste Security Test Output / HTTP Request-Response / Raw Log</span>
          </label>

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
            <span className="text-[10px] text-slate-500 uppercase font-mono mr-1">Presets:</span>
            {SAMPLE_PAYLOADS.map((sample) => (
              <button
                key={sample.name}
                type="button"
                onClick={() => {
                  setInputPayload(sample.payload);
                  setAnalysisResult(null);
                }}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 text-[11px] font-mono border border-slate-700 transition-colors whitespace-nowrap"
              >
                {sample.name}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <textarea
            rows={8}
            value={inputPayload}
            onChange={(e) => setInputPayload(e.target.value)}
            placeholder="Paste raw HTTP request, error response, curl output, or test payload..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-cyan-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 custom-scrollbar leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => {
              setInputPayload('');
              setAnalysisResult(null);
            }}
            className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Input</span>
          </button>

          <button
            onClick={handleAnalyze}
            disabled={!inputPayload.trim() || isAnalyzing}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 text-white font-medium text-xs shadow-lg shadow-cyan-900/30 transition-all flex items-center gap-2 group"
          >
            {isAnalyzing ? (
              <>
                <Bot className="w-4 h-4 animate-spin" />
                <span>Synthesizing Diagnosis...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze with AI</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Output Section */}
      {analysisResult && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
          <AIAnalysisCard result={analysisResult} />
        </div>
      )}
    </div>
  );
};
