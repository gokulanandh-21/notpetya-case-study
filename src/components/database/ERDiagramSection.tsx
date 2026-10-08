'use client';

import React, { useState } from 'react';
import { Network, Database, Key, ArrowRight, Info } from 'lucide-react';

interface SchemaEntity {
  name: string;
  type: 'CORE_ENTITY' | 'JUNCTION_TABLE' | 'REFERENCE';
  pk: string;
  fks: { col: string; target: string }[];
  attributes: string[];
  description: string;
}

const SCHEMA_ENTITIES: SchemaEntity[] = [
  {
    name: 'incidents',
    type: 'CORE_ENTITY',
    pk: 'incident_id',
    fks: [],
    attributes: ['name', 'aliases', 'date_started', 'origin_region', 'classification', 'attribution_assessment', 'attribution_confidence', 'estimated_damage_usd', 'description'],
    description: 'Central incident root representing the NotPetya campaign.',
  },
  {
    name: 'timeline_events',
    type: 'CORE_ENTITY',
    pk: 'event_id',
    fks: [
      { col: 'incident_id', target: 'incidents.incident_id' },
      { col: 'source_id', target: 'sources.source_id' },
    ],
    attributes: ['event_date', 'sequence_number', 'time_label', 'category', 'severity', 'title', 'description', 'technical_significance'],
    description: 'Chronological timeline logs linked to the parent incident with formal foreign keys.',
  },
  {
    name: 'attack_stages',
    type: 'CORE_ENTITY',
    pk: 'stage_id',
    fks: [],
    attributes: ['stage_number', 'stage_name', 'tactic', 'description'],
    description: 'High-level chronological phases of the cyberattack kill chain.',
  },
  {
    name: 'attack_techniques',
    type: 'CORE_ENTITY',
    pk: 'technique_id',
    fks: [{ col: 'source_id', target: 'sources.source_id' }],
    attributes: ['mitre_id', 'technique_name', 'tactic', 'description', 'observed_behavior', 'detection_opportunity', 'mitigation_strategy'],
    description: 'Granular MITRE ATT&CK techniques weaponized during the operation.',
  },
  {
    name: 'malware_components',
    type: 'CORE_ENTITY',
    pk: 'component_id',
    fks: [
      { col: 'incident_id', target: 'incidents.incident_id' },
      { col: 'source_id', target: 'sources.source_id' },
    ],
    attributes: ['name', 'component_type', 'purpose', 'behavior'],
    description: 'Modular payloads comprising NotPetya (ZvitPublishedObjects, perfc.dat, Mimikatz, Wiper).',
  },
  {
    name: 'vulnerabilities',
    type: 'CORE_ENTITY',
    pk: 'vulnerability_id',
    fks: [{ col: 'source_id', target: 'sources.source_id' }],
    attributes: ['cve_id', 'ms_bulletin', 'vulnerability_name', 'affected_component', 'cvss_score', 'description', 'patch_release_date'],
    description: 'Exploited protocol vulnerabilities (CVE-2017-0144 / CVE-2017-0145).',
  },
  {
    name: 'victims',
    type: 'CORE_ENTITY',
    pk: 'victim_id',
    fks: [{ col: 'source_id', target: 'sources.source_id' }],
    attributes: ['organization_name', 'country', 'sector', 'impact_summary', 'estimated_loss_usd'],
    description: 'Targeted organizations and critical infrastructure entities.',
  },
  {
    name: 'impact_events',
    type: 'CORE_ENTITY',
    pk: 'impact_id',
    fks: [
      { col: 'victim_id', target: 'victims.victim_id' },
      { col: 'source_id', target: 'sources.source_id' },
    ],
    attributes: ['impact_type', 'severity', 'direct_malware_action', 'operational_consequence', 'recovery_duration_days', 'recovery_notes'],
    description: 'Forensic records decomposing technical impact from enterprise consequences.',
  },
  {
    name: 'mitigations',
    type: 'CORE_ENTITY',
    pk: 'mitigation_id',
    fks: [{ col: 'source_id', target: 'sources.source_id' }],
    attributes: ['mitigation_name', 'category', 'description', 'implementation_concept'],
    description: 'Defense-in-depth security controls mapped to attack techniques.',
  },
  {
    name: 'sources',
    type: 'REFERENCE',
    pk: 'source_id',
    fks: [],
    attributes: ['source_name', 'publisher', 'source_type', 'publication_date', 'url', 'credibility_level'],
    description: 'Primary, governmental, and intelligence references validating forensic facts.',
  },
  {
    name: 'stage_techniques',
    type: 'JUNCTION_TABLE',
    pk: '(stage_id, technique_id)',
    fks: [
      { col: 'stage_id', target: 'attack_stages.stage_id' },
      { col: 'technique_id', target: 'attack_techniques.technique_id' },
    ],
    attributes: [],
    description: 'Many-to-many bridge resolving M:N relationship between attack stages and techniques.',
  },
  {
    name: 'technique_vulnerabilities',
    type: 'JUNCTION_TABLE',
    pk: '(technique_id, vulnerability_id)',
    fks: [
      { col: 'technique_id', target: 'attack_techniques.technique_id' },
      { col: 'vulnerability_id', target: 'vulnerabilities.vulnerability_id' },
    ],
    attributes: [],
    description: 'Many-to-many bridge linking lateral movement techniques to exploited CVEs.',
  },
  {
    name: 'mitigation_techniques',
    type: 'JUNCTION_TABLE',
    pk: '(mitigation_id, technique_id)',
    fks: [
      { col: 'mitigation_id', target: 'mitigations.mitigation_id' },
      { col: 'technique_id', target: 'attack_techniques.technique_id' },
    ],
    attributes: [],
    description: 'Many-to-many bridge associating defensive mitigations with attack techniques.',
  },
];

export default function ERDiagramSection() {
  const [selectedEntity, setSelectedEntity] = useState<string>('incidents');
  const active = SCHEMA_ENTITIES.find(e => e.name === selectedEntity) || SCHEMA_ENTITIES[0];

  return (
    <section id="er-diagram" className="np-section" style={{ background: 'var(--np-bg-1)', borderTop: '1px solid var(--np-card-border)' }}>
      <div className="np-container">
        <div className="np-conceptual-badge" style={{ marginBottom: '1.5rem' }}>
          ACADEMIC DBMS MODEL // 3RD NORMAL FORM (3NF) ENTITY-RELATIONSHIP
        </div>
        <div className="np-section-num">DATA ARCHITECTURE // RELATIONAL ER SCHEMA</div>
        <h2 className="np-display np-display-md" style={{ marginBottom: '1.5rem' }}>
          RELATIONAL ENTITY-RELATIONSHIP ARCHITECTURE
        </h2>
        <p className="np-body-lg" style={{ maxWidth: '850px', marginBottom: '3.5rem', color: 'var(--np-white-dim)' }}>
          The NotPetya Investigation repository is modeled in Third Normal Form (3NF). Cardinality is maintained through surrogate primary keys, referential foreign key constraints, and dedicated junction tables eliminating update anomalies.
        </p>

        {/* ER Model Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {SCHEMA_ENTITIES.map(entity => {
            const isSelected = selectedEntity === entity.name;
            return (
              <div
                key={entity.name}
                onClick={() => setSelectedEntity(entity.name)}
                style={{
                  background: isSelected ? 'var(--np-card-hover)' : 'var(--np-card)',
                  border: isSelected ? '1px solid var(--np-amber)' : '1px solid var(--np-card-border)',
                  padding: '1.5rem',
                  backdropFilter: 'blur(12px)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--np-card-border)', paddingBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Database size={16} color={entity.type === 'JUNCTION_TABLE' ? '#60a5fa' : 'var(--np-amber)'} />
                    <span style={{ fontFamily: 'var(--np-font-mono)', fontWeight: 700, fontSize: '0.95rem', color: 'var(--np-white)' }}>
                      {entity.name}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--np-font-mono)',
                      fontSize: '0.65rem',
                      color: entity.type === 'JUNCTION_TABLE' ? '#60a5fa' : entity.type === 'REFERENCE' ? '#4ade80' : 'var(--np-white-muted)',
                      background: 'rgba(255,255,255,0.04)',
                      padding: '0.2rem 0.5rem',
                      border: '1px solid var(--np-card-border)',
                    }}
                  >
                    {entity.type.replace('_', ' ')}
                  </span>
                </div>

                {/* Primary Key */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem', fontFamily: 'var(--np-font-mono)', fontSize: '0.8rem', color: '#4ade80' }}>
                  <Key size={12} />
                  <span><strong>PK: </strong>{entity.pk}</span>
                </div>

                {/* Foreign Keys */}
                {entity.fks.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '0.75rem', fontFamily: 'var(--np-font-mono)', fontSize: '0.75rem', color: 'var(--np-amber)' }}>
                    {entity.fks.map(fk => (
                      <div key={fk.col} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <ArrowRight size={11} />
                        <span>FK: {fk.col} → {fk.target}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Attributes preview */}
                {entity.attributes.length > 0 && (
                  <div style={{ fontSize: '0.75rem', color: 'var(--np-white-muted)', fontFamily: 'var(--np-font-mono)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.5rem' }}>
                    + {entity.attributes.length} attributes ({entity.attributes.slice(0, 3).join(', ')}...)
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Entity Inspector */}
        <div style={{ background: 'var(--np-card)', border: '1px solid var(--np-card-border)', padding: '2.5rem', backdropFilter: 'blur(12px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Info size={18} color="var(--np-amber)" />
            <span className="np-mono-sm" style={{ color: 'var(--np-amber)' }}>RELATIONAL INTEGRITY SPECIFICATION</span>
          </div>
          <h3 style={{ fontFamily: 'var(--np-font-mono)', fontSize: '1.4rem', color: 'var(--np-white)', marginBottom: '0.75rem' }}>
            Relation: {active.name} ({active.type})
          </h3>
          <p style={{ color: 'var(--np-white-dim)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            {active.description}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div>
              <div className="np-label" style={{ color: 'var(--np-white-muted)', marginBottom: '0.5rem' }}>CARDINALITY & KEYS</div>
              <ul style={{ listStyle: 'none', padding: 0, fontFamily: 'var(--np-font-mono)', fontSize: '0.85rem', color: 'var(--np-white-dim)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li style={{ color: '#4ade80' }}>🔑 Primary Key: {active.pk}</li>
                {active.fks.map(fk => (
                  <li key={fk.col} style={{ color: 'var(--np-amber)' }}>
                    🔗 Foreign Key: {fk.col} references {fk.target} (ON DELETE CASCADE/SET NULL)
                  </li>
                ))}
                {active.fks.length === 0 && <li style={{ color: 'var(--np-white-muted)' }}>Root entity with zero external parent dependencies.</li>}
              </ul>
            </div>

            <div>
              <div className="np-label" style={{ color: 'var(--np-white-muted)', marginBottom: '0.5rem' }}>NORMAL FORM (3NF) AUDIT</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--np-white-dim)', lineHeight: 1.5 }}>
                Satisfies 1NF (atomic attributes), 2NF (no partial functional dependencies on candidate keys), and 3NF (no transitive dependencies; non-prime attributes depend solely on candidate keys).
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
