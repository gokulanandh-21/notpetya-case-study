'use client';

import { useState } from 'react';
import { timelineEvents } from '@/data/notpetya/timeline';
import { motion } from 'framer-motion';

const filters = ['ALL', 'INFECTION', 'PROPAGATION', 'IMPACT', 'RESPONSE', 'DISCOVERY'];

export default function TimelineSection() {
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredEvents = activeFilter === 'ALL' 
    ? timelineEvents 
    : timelineEvents.filter(e => e.category.toUpperCase() === activeFilter);

  return (
    <section id="june27" className="np-section" style={{ background: 'var(--np-bg-1)' }}>
      <div className="np-container-narrow">
        <div className="np-section-num">04 / 19</div>
        <h2 className="np-display np-display-lg" style={{ marginBottom: '1rem' }}>JUNE 27, 2017</h2>
        <p className="np-body-lg" style={{ marginBottom: '3rem', color: 'var(--np-white-dim)' }}>
          The day that cost the global economy over ten billion dollars.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '4rem' }}>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: 'var(--np-font-mono)',
                fontSize: '0.7rem',
                letterSpacing: '0.15em',
                cursor: 'pointer',
                padding: '0.5rem 0',
                color: activeFilter === f ? 'var(--np-white)' : 'var(--np-white-muted)',
                borderBottom: `2px solid ${activeFilter === f ? 'var(--np-red)' : 'transparent'}`,
                transition: 'all 0.2s ease'
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="np-timeline">
          <div className="np-timeline-line" />
          
          {filteredEvents.map((evt, idx) => (
            <motion.div 
              key={evt.id}
              className={`np-timeline-event ${evt.severity}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: Math.min(idx * 0.1, 0.5) }}
              onClick={() => setExpandedId(expandedId === evt.id ? null : evt.id)}
            >
              <div className="np-timeline-time">{evt.time}</div>
              <div className="np-timeline-body">
                <div className="np-timeline-category" style={{ 
                  color: evt.category === 'IMPACT' ? 'var(--np-red)' : 
                         evt.category === 'PROPAGATION' ? 'var(--np-amber-light)' : 'var(--np-white-muted)'
                }}>
                  {evt.category}
                </div>
                <h3 className="np-timeline-title">{evt.title}</h3>
                <p className="np-timeline-desc">{evt.summary}</p>
                
                {expandedId === evt.id && evt.technical && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={{ marginTop: '1.5rem', overflow: 'hidden' }}
                  >
                    <div className="np-evidence-box">
                      <strong>TECHNICAL DETAIL:</strong> {evt.technical}
                    </div>
                    {evt.source && (
                      <div className="np-source-tag">{evt.source}</div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
