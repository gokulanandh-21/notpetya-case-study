'use client';

import { useState } from 'react';
import { affectedOrganizations } from '@/data/notpetya/incident';
import { motion } from 'framer-motion';

// Very rough SVG paths for a stylized map background
const SVG_MAP_PATHS = [
  "M 100,120 L 180,110 L 220,160 L 200,220 L 140,240 L 100,200 Z", // NA
  "M 160,240 L 200,230 L 220,300 L 200,360 L 160,350 L 140,290 Z", // SA
  "M 440,100 L 520,95 L 540,130 L 510,155 L 450,150 L 430,120 Z", // EU
  "M 450,160 L 520,155 L 540,240 L 510,310 L 460,320 L 430,240 L 440,170 Z", // AF
  "M 530,90 L 700,80 L 730,160 L 680,200 L 590,190 L 540,160 L 530,110 Z", // AS
  "M 640,280 L 710,270 L 730,320 L 690,340 L 640,330 L 625,300 Z", // AU
];

function getSvgCoords(lat: number, lng: number): { x: number, y: number } {
  // Simple equirectangular projection to 800x400 viewBox
  const x = (lng + 180) * (800 / 360);
  const y = (90 - lat) * (400 / 180);
  return { x, y };
}

export default function GlobalImpact() {
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  const selectedOrg = affectedOrganizations.find(o => o.name === selectedOrgId);

  return (
    <section id="impact" className="np-section" style={{ background: 'var(--np-bg-1)' }}>
      <div className="np-container">
        <div className="np-section-num">09 / 19</div>
        <h2 className="np-display np-display-md" style={{ marginBottom: '1.5rem' }}>GLOBAL IMPACT</h2>
        <p className="np-body" style={{ maxWidth: '800px', marginBottom: '4rem', color: 'var(--np-white-dim)' }}>
          NotPetya spread beyond Ukraine within hours. Because multinational corporations connect their global networks, a single infected office in Kyiv was enough to take down operations worldwide.
        </p>

        <div style={{ position: 'relative', width: '100%', maxWidth: '1000px', margin: '0 auto 4rem auto', aspectRatio: '2/1', background: 'var(--np-bg-2)', border: '1px solid rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          
          <svg viewBox="0 0 800 400" style={{ width: '100%', height: '100%' }}>
            {/* Map background paths */}
            {SVG_MAP_PATHS.map((d, i) => (
              <path key={i} d={d} fill="#141a24" stroke="#2a3a4a" strokeWidth="1" strokeLinejoin="round" />
            ))}

            {/* Grid lines */}
            <path d="M 0,200 L 800,200 M 400,0 L 400,400 M 200,0 L 200,400 M 600,0 L 600,400" stroke="#1c2a38" strokeWidth="0.5" strokeDasharray="4 4" />

            {/* Impact points */}
            {affectedOrganizations.map(org => {
              const { x, y } = getSvgCoords(org.lat, org.lng);
              const isSelected = selectedOrgId === org.name;
              
              return (
                <g key={org.name} onClick={() => setSelectedOrgId(org.name)} style={{ cursor: 'pointer' }}>
                  {isSelected && (
                    <circle cx={x} cy={y} r="15" fill="none" stroke="var(--np-red)" strokeWidth="1">
                      <animate attributeName="r" values="10;25" dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="1;0" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle 
                    cx={x} 
                    cy={y} 
                    r={isSelected ? 6 : 4} 
                    fill="var(--np-red)" 
                    opacity={isSelected ? 1 : 0.7}
                    stroke="#fff"
                    strokeWidth={isSelected ? 1.5 : 0}
                  />
                  {/* Subtle label on map */}
                  <text x={x + 10} y={y + 4} fill={isSelected ? '#fff' : 'rgba(0,0,0,0.4)'} fontSize="10" fontFamily="var(--np-font-mono)">
                    {org.name.split(' ')[0].toUpperCase()}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Detail overlay panel inside the map area */}
          <div style={{ 
            position: 'absolute', 
            bottom: '1rem', 
            left: '1rem', 
            right: '1rem', 
            maxWidth: '450px',
            background: 'rgba(10, 15, 20, 0.9)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0,0,0,0.1)', 
            padding: '1.5rem',
            pointerEvents: 'none' // Let clicks pass through to map where panel doesn't have content
          }}>
            {selectedOrg ? (
              <div style={{ pointerEvents: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h4 style={{ fontFamily: 'var(--np-font-body)', fontWeight: 600, fontSize: '1.1rem', color: 'var(--np-white)' }}>{selectedOrg.name}</h4>
                  <span className="np-mono-sm" style={{ color: 'var(--np-amber)', background: 'rgba(217,119,6,0.1)', padding: '0.2rem 0.5rem' }}>{selectedOrg.sector}</span>
                </div>
                <div className="np-mono-sm" style={{ color: 'var(--np-white-dim)', marginBottom: '1rem' }}>HQ: {selectedOrg.country}</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--np-white-dim)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {selectedOrg.impact}
                </p>
                <div className="np-source-tag" style={{ fontSize: '0.65rem' }}>SOURCE: {selectedOrg.source}</div>
              </div>
            ) : (
              <div style={{ color: 'var(--np-white-muted)', fontFamily: 'var(--np-font-mono)', fontSize: '0.8rem', textAlign: 'center', padding: '1rem' }}>
                CLICK A RED NODE TO VIEW IMPACT DETAILS
              </div>
            )}
          </div>
        </div>

        {/* Grid of cards below map */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {affectedOrganizations.map(org => (
            <div 
              key={org.name}
              onClick={() => setSelectedOrgId(org.name)}
              style={{
                padding: '1.5rem',
                background: selectedOrgId === org.name ? 'rgba(0,0,0,0.05)' : 'var(--np-bg-2)',
                border: `1px solid ${selectedOrgId === org.name ? 'var(--np-red-border)' : 'rgba(0,0,0,0.05)'}`,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong style={{ color: 'var(--np-white)', fontSize: '1.05rem' }}>{org.name}</strong>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--np-red)', marginTop: '6px' }} />
              </div>
              <div className="np-mono-sm" style={{ color: 'var(--np-white-dim)', marginBottom: '1rem' }}>{org.sector} | {org.country}</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--np-white-muted)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {org.impact}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
