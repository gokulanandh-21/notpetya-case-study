'use client';

import { useState } from 'react';
import { mitreTechniques, sandwormProfile } from '@/data/notpetya/mitre';

const TACTICS = [
  'ALL',
  'INITIAL ACCESS',
  'EXECUTION',
  'CREDENTIAL ACCESS',
  'DISCOVERY',
  'LATERAL MOVEMENT',
  'IMPACT'
];

export default function MitreMapping() {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredTechniques = activeFilter === 'ALL'
    ? mitreTechniques
    : mitreTechniques.filter(t => t.tactic.toUpperCase() === activeFilter);

  return (
    <section id="mitre" className="np-section">
      <div className="np-container">
        <div className="np-section-num">08 / 19</div>
        <h2 className="np-display np-display-md" style={{ marginBottom: '1.5rem' }}>MITRE ATT&CK MAPPING</h2>
        <p className="np-body" style={{ maxWidth: '800px', marginBottom: '3rem', color: 'var(--np-white-dim)' }}>
          The behaviors exhibited by NotPetya map to several MITRE ATT&CK techniques. The overarching incident aligns closely with Software: S0368 (NotPetya) and Group: G0034 (Sandworm Team).
        </p>

        {/* TACTIC FILTERS */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          {TACTICS.map(tactic => (
            <button
              key={tactic}
              onClick={() => setActiveFilter(tactic)}
              style={{
                background: activeFilter === tactic ? 'rgba(0,0,0,0.1)' : 'transparent',
                border: `1px solid ${activeFilter === tactic ? 'var(--np-white)' : 'rgba(0,0,0,0.2)'}`,
                color: activeFilter === tactic ? 'var(--np-white)' : 'var(--np-white-dim)',
                padding: '0.5rem 1rem',
                fontFamily: 'var(--np-font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                borderRadius: '2px'
              }}
            >
              {tactic}
            </button>
          ))}
        </div>

        {/* TECHNIQUE LIST */}
        <div className="np-mitre-grid" style={{ marginBottom: '5rem' }}>
          {/* Header Row */}
          <div className="np-mitre-row" style={{ background: 'var(--np-bg-2)', borderBottom: '1px solid rgba(0,0,0,0.1)', cursor: 'default' }}>
            <div className="np-mono-sm" style={{ color: 'var(--np-white-dim)' }}>ID</div>
            <div className="np-mono-sm" style={{ color: 'var(--np-white-dim)' }}>TECHNIQUE / TACTIC</div>
            <div className="np-mono-sm" style={{ color: 'var(--np-white-dim)' }}>OBSERVED BEHAVIOR</div>
          </div>

          {filteredTechniques.map(tech => (
            <div key={tech.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <div 
                className="np-mitre-row" 
                onClick={() => setExpandedId(expandedId === tech.id ? null : tech.id)}
                style={{ cursor: 'pointer', padding: '1.25rem 0' }}
              >
                <div>
                  <span className="np-mitre-tag">{tech.id}</span>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--np-font-body)', fontWeight: 600, color: 'var(--np-white)' }}>{tech.name}</div>
                  <div style={{ fontFamily: 'var(--np-font-mono)', fontSize: '0.7rem', color: 'var(--np-amber)', marginTop: '0.25rem' }}>{tech.tactic.toUpperCase()}</div>
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--np-white-dim)', display: '-webkit-box', WebkitLineClamp: expandedId === tech.id ? 'unset' : 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {tech.observedBehavior}
                </div>
              </div>

              {/* EXPANDED DETAIL */}
              {expandedId === tech.id && (
                <div className="np-mitre-expanded" style={{ padding: '2rem', background: 'var(--np-bg-1)', borderLeft: '2px solid var(--np-amber)', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  
                  <div>
                    <strong className="np-label" style={{ color: 'var(--np-white)' }}>FULL BEHAVIOR:</strong>
                    <p className="np-body" style={{ marginTop: '0.5rem', fontSize: '0.95rem' }}>{tech.observedBehavior}</p>
                  </div>

                  {tech.evidence && (
                    <div className="np-evidence-box">
                      <strong>EVIDENCE:</strong> {tech.evidence}
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                    {tech.detection && (
                      <div>
                        <strong className="np-label" style={{ color: 'var(--np-white)' }}>DETECTION:</strong>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--np-white-dim)', lineHeight: 1.5 }}>{tech.detection}</p>
                      </div>
                    )}
                    {tech.mitigation && (
                      <div>
                        <strong className="np-label" style={{ color: 'var(--np-white)' }}>MITIGATION:</strong>
                        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--np-white-dim)', lineHeight: 1.5 }}>{tech.mitigation}</p>
                      </div>
                    )}
                  </div>

                  <a 
                    href={tech.mitreUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: 'var(--np-amber)', fontFamily: 'var(--np-font-mono)', fontSize: '0.8rem', textDecoration: 'none', alignSelf: 'flex-start', marginTop: '0.5rem' }}
                  >
                    View on MITRE ATT&CK ↗
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* SANDWORM PROFILE */}
        <div style={{ border: '1px solid var(--np-amber-border)', background: 'rgba(217, 119, 6, 0.03)', padding: '3rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem', marginBottom: '2rem' }}>
            <div>
              <h3 className="np-display np-display-sm" style={{ color: 'var(--np-amber)' }}>THREAT ACTOR: {sandwormProfile.groupName.toUpperCase()}</h3>
              <div className="np-mono-sm" style={{ color: 'var(--np-white-dim)', marginTop: '0.5rem' }}>
                ID: {sandwormProfile.mitreId} | ALSO KNOWN AS: {sandwormProfile.alternateNames.join(', ')}
              </div>
            </div>
            <a href={sandwormProfile.mitreUrl} target="_blank" rel="noopener noreferrer" className="np-mitre-tag" style={{ border: '1px solid var(--np-amber)', background: 'transparent' }}>VIEW G0034 PROFILE</a>
          </div>

          <div className="np-evidence-box warning" style={{ marginBottom: '2rem' }}>
            <strong>ATTRIBUTION ASSESSMENT:</strong> {sandwormProfile.attributionNote}
          </div>

          <h4 className="np-label" style={{ marginBottom: '1rem', color: 'var(--np-white)' }}>KNOWN OPERATIONS:</h4>
          <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', listStyle: 'none' }}>
            {sandwormProfile.knownOperations.map((op, i) => (
              <li key={i} style={{ padding: '1rem', background: 'var(--np-bg-2)', border: '1px solid rgba(0,0,0,0.05)', fontSize: '0.9rem', color: 'var(--np-white-dim)' }}>
                {op}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
