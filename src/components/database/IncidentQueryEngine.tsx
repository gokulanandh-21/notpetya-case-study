'use client';

import React, { useState } from 'react';
import { Terminal, Play, Sparkles, Copy, Check, Clock, AlertTriangle, CheckCircle, Database, ChevronDown, Download } from 'lucide-react';

interface QueryResult {
  success: boolean;
  executedSql?: string;
  rowCount?: number;
  executionTimeMs?: number;
  fields?: string[];
  rows?: any[];
  error?: {
    title: string;
    message: string;
    suggestion?: string;
  };
}

interface QueryHistoryItem {
  id: string;
  prompt?: string;
  sql: string;
  timestamp: string;
  rowCount?: number;
}

const DEMO_QUERIES = [
  {
    label: 'Query 1: All Attack Techniques',
    sql: 'SELECT * FROM attack_techniques;',
    description: 'Retrieves all 10 MITRE ATT&CK techniques weaponized by NotPetya.',
  },
  {
    label: 'Query 2: Lateral Movement Techniques',
    sql: "SELECT technique_name, mitre_id FROM attack_techniques WHERE tactic = 'Lateral Movement';",
    description: 'Filters techniques by tactic to isolate internal propagation mechanisms.',
  },
  {
    label: 'Query 3: Exploited Vulnerabilities',
    sql: 'SELECT * FROM vulnerabilities;',
    description: 'Returns CVE-2017-0144 and CVE-2017-0145 details exploited via SMBv1.',
  },
  {
    label: 'Query 4: Organizations by Country & Sector',
    sql: 'SELECT organization_name, country, sector FROM victims;',
    description: 'Lists multinational victims across shipping, pharma, logistics, and government.',
  },
  {
    label: 'Query 5: Impact Count by Severity Type (GROUP BY)',
    sql: 'SELECT impact_type, COUNT(*) FROM impact_events GROUP BY impact_type;',
    description: 'Demonstrates SQL aggregation and grouping across forensic impact records.',
  },
  {
    label: 'Query 6: Technique Count per Tactic (ORDER BY DESC)',
    sql: 'SELECT tactic, COUNT(*) FROM attack_techniques GROUP BY tactic ORDER BY COUNT(*) DESC;',
    description: 'Aggregates techniques mapped to each MITRE ATT&CK kill-chain tactic.',
  },
  {
    label: 'Query 7: Victims Joined with Impact Events (INNER JOIN)',
    sql: 'SELECT v.organization_name, i.impact_type FROM victims v JOIN impact_events i ON v.victim_id = i.victim_id;',
    description: 'Performs a relational join connecting victims to specific operational impacts.',
  },
  {
    label: 'Query 8: Stages Joined with Techniques (MULTI-TABLE JOIN)',
    sql: 'SELECT a.technique_name, s.stage_name FROM attack_techniques a JOIN stage_techniques st ON a.technique_id = st.technique_id JOIN attack_stages s ON st.stage_id = s.stage_id;',
    description: 'Multi-table join across junction table stage_techniques linking stages to techniques.',
  },
];

const PROMPT_SUGGESTIONS = [
  'Show all lateral movement techniques',
  'Which vulnerabilities were exploited?',
  'Show all affected organizations',
  'Which techniques were used for credential access?',
  'Show all malware components',
  'What happened during the initial access stage?',
  'Show all victims in Ukraine',
  'Which MITRE techniques are related to SMB?',
  'Show all impact events with high severity',
];

export default function IncidentQueryEngine() {
  const [nlQuery, setNlQuery] = useState('');
  const [sqlQuery, setSqlQuery] = useState(DEMO_QUERIES[0].sql);
  const [loadingNl, setLoadingNl] = useState(false);
  const [loadingExecution, setLoadingExecution] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [history, setHistory] = useState<QueryHistoryItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [generatorInfo, setGeneratorInfo] = useState<string | null>(null);

  // Natural Language -> SQL conversion
  const handleTranslateNl = async (overridePrompt?: string) => {
    const promptToUse = overridePrompt || nlQuery;
    if (!promptToUse.trim()) return;

    setLoadingNl(true);
    setGeneratorInfo(null);
    try {
      const res = await fetch('/api/nl-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: promptToUse }),
      });
      const data = await res.json();
      if (data.success && data.generatedSql) {
        setSqlQuery(data.generatedSql);
        setGeneratorInfo(data.generator || 'Natural Language SQL Compiler');
        // Automatically execute generated SQL
        await handleExecuteSql(data.generatedSql, promptToUse);
      } else {
        setResult({
          success: false,
          error: {
            title: data.error?.title || 'NL Translation Rejection',
            message: data.error?.message || 'Failed to convert query into safe relational SQL.',
            suggestion: data.error?.details,
          },
        });
      }
    } catch (err: any) {
      setResult({
        success: false,
        error: {
          title: 'Translation Network Failure',
          message: err.message || 'Unable to connect to Natural Language Query API.',
        },
      });
    } finally {
      setLoadingNl(false);
    }
  };

  // Direct SQL execution against PostgreSQL
  const handleExecuteSql = async (sqlToRun?: string, promptContext?: string) => {
    const targetSql = (sqlToRun || sqlQuery).trim();
    if (!targetSql) return;

    setLoadingExecution(true);
    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: targetSql }),
      });
      const data = await res.json();
      setResult(data);

      if (data.success) {
        // Append to session query history
        setHistory(prev => [
          {
            id: String(Date.now()),
            prompt: promptContext || (nlQuery ? nlQuery : undefined),
            sql: targetSql,
            timestamp: new Date().toLocaleTimeString(),
            rowCount: data.rowCount,
          },
          ...prev.slice(0, 9),
        ]);
      }
    } catch (err: any) {
      setResult({
        success: false,
        error: {
          title: 'Query Execution Network Error',
          message: err.message || 'Failed to contact database backend.',
        },
      });
    } finally {
      setLoadingExecution(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlQuery);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportCsv = () => {
    if (!result?.rows || result.rows.length === 0 || !result.fields) return;
    const headers = result.fields.join(',');
    const rows = result.rows.map(r =>
      result.fields!.map(f => `"${String(r[f] ?? '').replace(/"/g, '""')}"`).join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `notpetya_query_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="query-engine" className="np-section" style={{ background: 'var(--np-bg-0)', borderTop: '1px solid var(--np-card-border)' }}>
      <div className="np-container">
        <div className="np-conceptual-badge" style={{ marginBottom: '1.5rem' }}>
          LIVE DATABASE // CYBER INCIDENT QUERY ENGINE
        </div>
        <div className="np-section-num">QUERY // INTERACTIVE DBMS CONSOLE</div>
        <h2 className="np-display np-display-md" style={{ marginBottom: '1.5rem' }}>
          QUERY THE INCIDENT
        </h2>
        <p className="np-body-lg" style={{ maxWidth: '850px', marginBottom: '2.5rem', color: 'var(--np-white-dim)' }}>
          Investigate the NotPetya forensic database using either Natural Language or direct SQL queries. The console converts prompts into valid relational queries, enforces strict read-only security policies, and executes against the live PostgreSQL database.
        </p>

        {/* 1. NATURAL LANGUAGE INPUT CARD */}
        <div
          style={{
            background: 'var(--np-card)',
            border: '1px solid var(--np-card-border)',
            padding: '2rem',
            backdropFilter: 'blur(12px)',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Sparkles size={16} color="var(--np-amber)" />
            <span className="np-label" style={{ color: 'var(--np-white)' }}>ASK THE NOTPETYA DATABASE (NATURAL LANGUAGE)</span>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
            <input
              type="text"
              value={nlQuery}
              onChange={e => setNlQuery(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleTranslateNl();
              }}
              placeholder="e.g. Show all lateral movement techniques / Which vulnerabilities were exploited?"
              style={{
                flex: 1,
                minWidth: '280px',
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--np-card-border)',
                color: 'var(--np-white)',
                padding: '0.85rem 1.25rem',
                fontFamily: 'var(--np-font-body)',
                fontSize: '0.95rem',
                outline: 'none',
              }}
            />
            <button
              onClick={() => handleTranslateNl()}
              disabled={loadingNl || !nlQuery.trim()}
              style={{
                background: 'var(--np-amber)',
                color: '#050a10',
                border: 'none',
                padding: '0.85rem 1.8rem',
                fontFamily: 'var(--np-font-mono)',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                cursor: loadingNl || !nlQuery.trim() ? 'not-allowed' : 'pointer',
                opacity: loadingNl || !nlQuery.trim() ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {loadingNl ? 'COMPILING SQL...' : 'RUN QUERY'}
            </button>
          </div>

          {/* Quick Prompts */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--np-font-mono)', color: 'var(--np-white-muted)' }}>
              SUGGESTED QUESTIONS:
            </span>
            {PROMPT_SUGGESTIONS.map((prompt, pIdx) => (
              <button
                key={pIdx}
                onClick={() => {
                  setNlQuery(prompt);
                  handleTranslateNl(prompt);
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--np-card-border)',
                  color: 'var(--np-white-dim)',
                  padding: '0.35rem 0.65rem',
                  fontFamily: 'var(--np-font-mono)',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  borderRadius: '2px',
                  transition: 'all 0.15s ease',
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* 2. SQL CONSOLE / GENERATED SQL CARD */}
        <div
          style={{
            background: 'var(--np-card)',
            border: '1px solid var(--np-card-border)',
            padding: '2rem',
            backdropFilter: 'blur(12px)',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Terminal size={16} color="#60a5fa" />
              <span className="np-label" style={{ color: 'var(--np-white)' }}>SQL CONSOLE & GENERATED QUERY</span>
              {generatorInfo && (
                <span style={{ fontSize: '0.65rem', fontFamily: 'var(--np-font-mono)', color: 'var(--np-amber-light)', background: 'rgba(245, 158, 11, 0.1)', padding: '0.2rem 0.5rem', border: '1px solid var(--np-amber-border)' }}>
                  COMPILER: {generatorInfo}
                </span>
              )}
            </div>

            {/* Quick Demo SQL Dropdown */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <select
                onChange={e => {
                  const sel = DEMO_QUERIES.find(q => q.label === e.target.value);
                  if (sel) {
                    setSqlQuery(sel.sql);
                    handleExecuteSql(sel.sql);
                  }
                }}
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid var(--np-card-border)',
                  color: 'var(--np-white-dim)',
                  padding: '0.4rem 0.8rem',
                  fontFamily: 'var(--np-font-mono)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                <option value="">SELECT ACADEMIC BENCHMARK QUERY...</option>
                {DEMO_QUERIES.map(q => (
                  <option key={q.label} value={q.label}>
                    {q.label}
                  </option>
                ))}
              </select>

              <button
                onClick={handleCopySql}
                title="Copy SQL to Clipboard"
                style={{
                  background: 'transparent',
                  border: '1px solid var(--np-card-border)',
                  color: 'var(--np-white-dim)',
                  padding: '0.4rem 0.65rem',
                  fontFamily: 'var(--np-font-mono)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                {copied ? <Check size={13} color="#4ade80" /> : <Copy size={13} />}
                {copied ? 'COPIED' : 'COPY'}
              </button>
            </div>
          </div>

          {/* SQL Editor Area */}
          <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
            <textarea
              value={sqlQuery}
              onChange={e => setSqlQuery(e.target.value)}
              rows={5}
              spellCheck={false}
              style={{
                width: '100%',
                background: '#040711',
                border: '1px solid var(--np-card-border-bright)',
                color: '#93c5fd',
                padding: '1rem',
                fontFamily: 'var(--np-font-mono)',
                fontSize: '0.85rem',
                lineHeight: 1.6,
                outline: 'none',
                resize: 'vertical',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
              }}
            />
          </div>

          {/* Actions & Policy Notice */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ fontSize: '0.75rem', fontFamily: 'var(--np-font-mono)', color: 'var(--np-white-muted)' }}>
              🔒 <strong>SECURITY ENFORCEMENT:</strong> Read-only SELECT permissions. DDL/DML statements (INSERT, DROP, UPDATE) are blocked before execution.
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setSqlQuery('')}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--np-card-border)',
                  color: 'var(--np-white-muted)',
                  padding: '0.65rem 1.25rem',
                  fontFamily: 'var(--np-font-mono)',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                CLEAR
              </button>
              <button
                onClick={() => handleExecuteSql()}
                disabled={loadingExecution || !sqlQuery.trim()}
                style={{
                  background: 'var(--np-white)',
                  color: '#050a10',
                  border: 'none',
                  padding: '0.65rem 1.75rem',
                  fontFamily: 'var(--np-font-mono)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  cursor: loadingExecution || !sqlQuery.trim() ? 'not-allowed' : 'pointer',
                  opacity: loadingExecution || !sqlQuery.trim() ? 0.6 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <Play size={14} /> {loadingExecution ? 'EXECUTING...' : 'EXECUTE SQL'}
              </button>
            </div>
          </div>
        </div>

        {/* 3. EXECUTION RESULT / ERROR STATE */}
        {result && (
          <div
            style={{
              background: 'var(--np-card)',
              border: result.success ? '1px solid var(--np-card-border-bright)' : '1px solid rgba(230, 57, 70, 0.4)',
              padding: '2rem',
              backdropFilter: 'blur(12px)',
              marginBottom: '2rem',
            }}
          >
            {result.success ? (
              <div>
                {/* Success Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--np-card-border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <CheckCircle size={18} color="#4ade80" />
                    <span style={{ fontFamily: 'var(--np-font-mono)', fontWeight: 700, color: '#4ade80', fontSize: '0.9rem' }}>
                      ✓ QUERY EXECUTED SUCCESSFULLY
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontFamily: 'var(--np-font-mono)', fontSize: '0.75rem', color: 'var(--np-white-muted)' }}>
                    <span>ROWS RETURNED: <strong style={{ color: 'var(--np-white)' }}>{result.rowCount}</strong></span>
                    <span>LATENCY: <strong style={{ color: 'var(--np-white)' }}>{result.executionTimeMs} ms</strong></span>
                    {result.rows && result.rows.length > 0 && (
                      <button
                        onClick={exportCsv}
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid var(--np-card-border)',
                          color: 'var(--np-white-dim)',
                          padding: '0.3rem 0.6rem',
                          fontFamily: 'var(--np-font-mono)',
                          fontSize: '0.7rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}
                      >
                        <Download size={12} /> EXPORT CSV
                      </button>
                    )}
                  </div>
                </div>

                {/* Empty State vs Table Result */}
                {result.rowCount === 0 ? (
                  <div style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--np-white-muted)', border: '1px dashed var(--np-card-border)' }}>
                    <Database size={32} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
                    <div style={{ fontFamily: 'var(--np-font-mono)', fontSize: '0.9rem', color: 'var(--np-white)', marginBottom: '0.5rem' }}>
                      Rows returned: 0
                    </div>
                    <p style={{ fontSize: '0.85rem' }}>A valid SQL query was executed, but zero records matched your query filters.</p>
                  </div>
                ) : (
                  <div style={{ overflowX: 'auto', border: '1px solid var(--np-card-border)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'var(--np-font-mono)', fontSize: '0.8rem' }}>
                      <thead>
                        <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--np-card-border)' }}>
                          {result.fields?.map(f => (
                            <th key={f} style={{ padding: '0.75rem 1rem', color: 'var(--np-white-dim)', whiteSpace: 'nowrap' }}>
                              {f.toUpperCase()}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {result.rows?.map((row, rIdx) => (
                          <tr key={rIdx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                            {result.fields?.map(f => (
                              <td key={f} style={{ padding: '0.75rem 1rem', color: 'var(--np-white)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {row[f] === null ? (
                                  <span style={{ color: 'var(--np-white-muted)' }}>NULL</span>
                                ) : Array.isArray(row[f]) ? (
                                  row[f].join(', ')
                                ) : (
                                  String(row[f])
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              /* Error State */
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--np-red)' }}>
                  <AlertTriangle size={18} />
                  <span style={{ fontFamily: 'var(--np-font-mono)', fontWeight: 700, fontSize: '0.9rem' }}>
                    ✕ QUERY EXECUTION FAILED
                  </span>
                </div>
                <h4 style={{ fontFamily: 'var(--np-font-body)', fontSize: '1.1rem', color: 'var(--np-white)', marginBottom: '0.5rem' }}>
                  {result.error?.title || 'Execution Error'}
                </h4>
                <p style={{ color: 'var(--np-white-dim)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.5 }}>
                  {result.error?.message}
                </p>
                {result.error?.suggestion && (
                  <div className="np-evidence-box critical" style={{ marginTop: '0.75rem' }}>
                    <strong>DIAGNOSTIC GUIDANCE: </strong> {result.error.suggestion}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 4. QUERY HISTORY DRAWER */}
        {history.length > 0 && (
          <div
            style={{
              background: 'var(--np-card)',
              border: '1px solid var(--np-card-border)',
              padding: '1.5rem',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--np-white-muted)' }}>
              <Clock size={14} />
              <span className="np-label">SESSION QUERY AUDIT TRAIL ({history.length})</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {history.map((item, hIdx) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSqlQuery(item.sql);
                    handleExecuteSql(item.sql);
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid var(--np-card-border)',
                    padding: '0.75rem 1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontFamily: 'var(--np-font-mono)',
                    fontSize: '0.75rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' }}>
                    <span style={{ color: 'var(--np-amber)', marginRight: '0.75rem' }}>
                      {String(hIdx + 1).padStart(2, '0')}
                    </span>
                    <span style={{ color: 'var(--np-white)' }}>{item.prompt ? `"${item.prompt}" → ` : ''}</span>
                    <span style={{ color: 'var(--np-white-dim)' }}>{item.sql}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', color: 'var(--np-white-muted)' }}>
                    <span>{item.rowCount} rows</span>
                    <span>{item.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
