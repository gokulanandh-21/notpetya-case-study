'use client';

import React, { useState, useEffect } from 'react';
import { Database, Table, Key, Link2, ExternalLink, RefreshCw } from 'lucide-react';

interface ColumnMeta {
  columnName: string;
  dataType: string;
  isNullable: boolean;
  isPrimaryKey: boolean;
}

interface TableMeta {
  tableName: string;
  description: string;
  rowCount: number;
  columns: ColumnMeta[];
  sampleData: Record<string, any>[];
}

export default function DatabaseExplorer() {
  const [tables, setTables] = useState<TableMeta[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('attack_techniques');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchema = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/schema');
      const data = await res.json();
      if (data.success && data.tables) {
        setTables(data.tables);
        if (!selectedTable && data.tables.length > 0) {
          setSelectedTable(data.tables[0].tableName);
        }
      } else {
        setError(data.error || 'Failed to load database schema');
      }
    } catch (err: any) {
      setError(err.message || 'Network error fetching schema metadata.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchema();
  }, []);

  const current = tables.find(t => t.tableName === selectedTable);

  return (
    <section id="database-explorer" className="np-section" style={{ background: 'var(--np-bg-0)', borderTop: '1px solid var(--np-card-border)' }}>
      <div className="np-container">
        <div className="np-conceptual-badge" style={{ marginBottom: '1.5rem' }}>
          RELATIONAL DBMS // SCHEMA ARCHITECTURE & METADATA
        </div>
        <div className="np-section-num">DATABASE // EXPLORE THE RELATIONAL REPOSITORY</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <h2 className="np-display np-display-md" style={{ marginBottom: '1rem' }}>
              DATABASE EXPLORER
            </h2>
            <p className="np-body-lg" style={{ maxWidth: '850px', color: 'var(--np-white-dim)' }}>
              Inspect live normalized PostgreSQL 3NF relations, entity attributes, constraints, primary/foreign key hierarchies, and sample records directly from the database catalog.
            </p>
          </div>
          <button
            onClick={fetchSchema}
            disabled={loading}
            style={{
              background: 'var(--np-card)',
              border: '1px solid var(--np-card-border)',
              color: 'var(--np-white)',
              padding: '0.6rem 1.2rem',
              fontFamily: 'var(--np-font-mono)',
              fontSize: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> REFRESH METADATA
          </button>
        </div>

        {error && (
          <div className="np-evidence-box critical" style={{ marginBottom: '2rem' }}>
            <strong>DATABASE CONNECTION NOTICE:</strong> {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem', alignItems: 'start' }}>
          {/* Table Selector Sidebar */}
          <div style={{ background: 'var(--np-card)', border: '1px solid var(--np-card-border)', padding: '1.25rem', backdropFilter: 'blur(12px)' }}>
            <div className="np-label" style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--np-white-muted)' }}>
              <Database size={14} /> LIVE TABLES ({tables.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {tables.map(t => (
                <button
                  key={t.tableName}
                  onClick={() => setSelectedTable(t.tableName)}
                  style={{
                    background: selectedTable === t.tableName ? 'var(--np-card-hover)' : 'transparent',
                    border: selectedTable === t.tableName ? '1px solid var(--np-card-border-bright)' : '1px solid transparent',
                    padding: '0.65rem 0.85rem',
                    textAlign: 'left',
                    color: selectedTable === t.tableName ? 'var(--np-white)' : 'var(--np-white-dim)',
                    fontFamily: 'var(--np-font-mono)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Table size={13} color={selectedTable === t.tableName ? 'var(--np-amber)' : 'var(--np-white-muted)'} />
                    {t.tableName}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--np-white-muted)', opacity: 0.8 }}>
                    {t.rowCount} rows
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Table Details */}
          {current ? (
            <div style={{ background: 'var(--np-card)', border: '1px solid var(--np-card-border)', padding: '2.5rem', backdropFilter: 'blur(12px)' }}>
              {/* Table header */}
              <div style={{ borderBottom: '1px solid var(--np-card-border)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span className="np-mono-sm" style={{ color: 'var(--np-amber)', background: 'var(--np-card-hover)', padding: '0.3rem 0.6rem', border: '1px solid var(--np-card-border)' }}>
                      RELATION
                    </span>
                    <h3 style={{ fontFamily: 'var(--np-font-mono)', fontSize: '1.4rem', color: 'var(--np-white)', fontWeight: 600 }}>
                      {current.tableName}
                    </h3>
                  </div>
                  <span className="np-mono-sm" style={{ color: 'var(--np-white-dim)', background: 'rgba(255,255,255,0.03)', padding: '0.4rem 0.8rem', border: '1px solid var(--np-card-border)' }}>
                    {current.rowCount} RECORD{current.rowCount === 1 ? '' : 'S'} STORED
                  </span>
                </div>
                <p style={{ marginTop: '0.75rem', fontSize: '0.95rem', color: 'var(--np-white-dim)', lineHeight: 1.5 }}>
                  {current.description}
                </p>
              </div>

              {/* Columns Table */}
              <div style={{ marginBottom: '2.5rem' }}>
                <div className="np-label" style={{ marginBottom: '1rem', color: 'var(--np-white-muted)' }}>
                  SCHEMA ATTRIBUTES & CONSTRAINTS ({current.columns.length} COLUMNS)
                </div>
                <div style={{ overflowX: 'auto', border: '1px solid var(--np-card-border)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'var(--np-font-mono)', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--np-card-border)' }}>
                        <th style={{ padding: '0.75rem 1rem', color: 'var(--np-white-dim)' }}>COLUMN NAME</th>
                        <th style={{ padding: '0.75rem 1rem', color: 'var(--np-white-dim)' }}>DATA TYPE</th>
                        <th style={{ padding: '0.75rem 1rem', color: 'var(--np-white-dim)' }}>NULLABLE</th>
                        <th style={{ padding: '0.75rem 1rem', color: 'var(--np-white-dim)' }}>KEY CONSTRAINT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {current.columns.map(col => (
                        <tr key={col.columnName} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                          <td style={{ padding: '0.75rem 1rem', color: 'var(--np-white)', fontWeight: 600 }}>
                            {col.columnName}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: '#60a5fa' }}>
                            {col.dataType}
                          </td>
                          <td style={{ padding: '0.75rem 1rem', color: col.isNullable ? 'var(--np-white-muted)' : 'var(--np-amber-light)' }}>
                            {col.isNullable ? 'NULL' : 'NOT NULL'}
                          </td>
                          <td style={{ padding: '0.75rem 1rem' }}>
                            {col.isPrimaryKey ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#4ade80', background: 'rgba(74,222,128,0.1)', padding: '0.2rem 0.5rem', border: '1px solid rgba(74,222,128,0.3)', fontSize: '0.7rem' }}>
                                <Key size={11} /> PRIMARY KEY
                              </span>
                            ) : col.columnName.endsWith('_id') && col.columnName !== 'id' ? (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--np-amber)', background: 'rgba(245,158,11,0.1)', padding: '0.2rem 0.5rem', border: '1px solid rgba(245,158,11,0.3)', fontSize: '0.7rem' }}>
                                <Link2 size={11} /> FOREIGN KEY
                              </span>
                            ) : (
                              <span style={{ color: 'var(--np-white-muted)' }}>—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sample Data */}
              <div>
                <div className="np-label" style={{ marginBottom: '1rem', color: 'var(--np-white-muted)' }}>
                  SAMPLE DATABASE ROWS (PREVIEW)
                </div>
                {current.sampleData && current.sampleData.length > 0 ? (
                  <div style={{ overflowX: 'auto', border: '1px solid var(--np-card-border)' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem', fontFamily: 'var(--np-font-mono)' }}>
                      <thead>
                        <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--np-card-border)' }}>
                          {Object.keys(current.sampleData[0]).map(key => (
                            <th key={key} style={{ padding: '0.65rem 1rem', color: 'var(--np-white-dim)', whiteSpace: 'nowrap' }}>
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {current.sampleData.map((row, rIdx) => (
                          <tr key={rIdx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                            {Object.keys(row).map(key => (
                              <td key={key} style={{ padding: '0.65rem 1rem', color: 'var(--np-white-dim)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {row[key] === null ? <span style={{ color: 'var(--np-white-muted)' }}>NULL</span> : String(row[key])}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--np-white-muted)', border: '1px dashed var(--np-card-border)' }}>
                    No sample data currently present in this table.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--np-white-muted)', background: 'var(--np-card)', border: '1px solid var(--np-card-border)' }}>
              Select a table from the sidebar to inspect schema attributes.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
