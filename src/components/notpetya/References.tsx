'use client';

import { sources, sourcesByCategory } from '@/data/notpetya/sources';

export default function References() {
  const categories = [
    { label: 'Government & Primary', data: [...sourcesByCategory.primary, ...sourcesByCategory.government] },
    { label: 'Technical Research', data: sourcesByCategory.technical },
    { label: 'MITRE ATT&CK', data: sourcesByCategory.mitre },
    { label: 'Journalism', data: sourcesByCategory.journalism }
  ];

  return (
    <section id="sources" className="np-section">
      <div className="np-container">
        <div className="np-section-num">19 / 19</div>
        <h2 className="np-display np-display-md" style={{ marginBottom: '1rem' }}>REFERENCES & SOURCES</h2>
        <p className="np-body" style={{ color: 'var(--np-white-dim)', marginBottom: '4rem' }}>
          {sources.length} verified public documents. All sources are publicly available. URLs were accurate at time of compilation.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem' }}>
          {categories.map(cat => {
            if (cat.data.length === 0) return null;

            return (
              <div key={cat.label}>
                <h3 className="np-label" style={{ color: 'var(--np-white)', marginBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '0.75rem' }}>
                  {cat.label.toUpperCase()}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {cat.data.map((source: any) => (
                    <div key={source.id} className="np-ref-item" style={{ fontSize: '0.9rem' }}>
                      <a 
                        href={source.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: 'var(--np-white)', textDecoration: 'none', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}
                      >
                        {source.title} ↗
                      </a>
                      <div className="np-mono-sm" style={{ color: 'var(--np-amber)', marginBottom: '0.5rem' }}>
                        {source.organization} | {source.date}
                      </div>
                      <p style={{ color: 'var(--np-white-dim)', lineHeight: 1.5 }}>
                        {source.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
