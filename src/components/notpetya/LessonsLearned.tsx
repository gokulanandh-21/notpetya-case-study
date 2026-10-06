'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const audiences = [
  {
    id: 'org',
    title: 'FOR ORGANIZATIONS',
    lessons: [
      { t: 'Patching as a Board Metric', d: 'Patch velocity is no longer just an IT metric; it is a critical business risk indicator. MS17-010 was available for months before NotPetya struck.' },
      { t: 'Offline Backup Necessity', d: 'Network-attached backups were destroyed alongside production data. Immutable, offline, and regularly tested backups are the only true fail-safe against wipers.' },
      { t: 'Vendor Risk Assessment', d: 'Trusting a software vendor means trusting their security posture. Supply-chain security must be part of procurement and ongoing risk management.' },
      { t: 'Flat Networks are Fatal', d: 'Without internal segmentation, a single compromised workstation in a remote office can take down the global corporate data center in minutes.' }
    ]
  },
  {
    id: 'soc',
    title: 'FOR SOC TEAMS',
    lessons: [
      { t: 'Monitor Native Tools (LOLBins)', d: 'NotPetya used legitimate tools (PsExec, WMIC) to spread. SOCs must baseline normal administrative behavior to detect anomalous use of native tools.' },
      { t: 'LSASS Protection is Critical', d: 'Credential dumping from memory (via Mimikatz-like behavior) was the key to bypassing patches. EDR must monitor and block unauthorized LSASS access.' },
      { t: 'Cross-Segment Visibility', d: 'Detecting lateral movement requires visibility into traffic moving between internal network segments, not just north-south traffic at the perimeter.' },
      { t: 'Speed of Triage', d: 'When a worm moves at machine speed, human triage is too slow. Automated isolation based on high-confidence behavioral indicators is necessary.' }
    ]
  },
  {
    id: 'arch',
    title: 'FOR SECURITY ENGINEERS',
    lessons: [
      { t: 'Credential Exposure Defeats Patching', d: 'An architecture that relies solely on patching the perimeter is brittle. If a Domain Admin credential is stolen, the patch status of the target machine is irrelevant.' },
      { t: 'The "Assume Breach" Paradigm', d: 'Networks must be designed under the assumption that a trusted endpoint or software update will eventually be compromised.' },
      { t: 'Privilege Separation', d: 'Tiered administrative models (like Microsoft\'s Tier Model) prevent credentials harvested on a workstation from being used to compromise a Domain Controller.' }
    ]
  },
  {
    id: 'gov',
    title: 'FOR GOVERNMENTS & POLICYMAKERS',
    lessons: [
      { t: 'Critical Infrastructure Vulnerability', d: 'Private sector networks (shipping, logistics, healthcare) are de facto critical infrastructure, yet they bear the brunt of state-sponsored cyber operations.' },
      { t: 'The Collateral Damage Problem', d: 'Cyber weapons cannot be easily contained geographically. An attack intended for Ukraine caused billions in damage to allied nations.' },
      { t: 'Need for Cyber Norms', d: 'The lack of enforceable international agreements regarding cyber warfare allows state actors to operate with relative impunity below the threshold of armed conflict.' }
    ]
  }
];

export default function LessonsLearned() {
  const [activeId, setActiveId] = useState(audiences[0].id);

  return (
    <section id="lessons" className="np-section" style={{ background: 'var(--np-bg-1)' }}>
      <div className="np-container">
        <div className="np-section-num">17 / 19</div>
        <h2 className="np-display np-display-md" style={{ marginBottom: '3rem' }}>LESSONS LEARNED</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '4rem' }}>
          
          {/* LEFT: TABS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {audiences.map(aud => (
              <button
                key={aud.id}
                onClick={() => setActiveId(aud.id)}
                style={{
                  textAlign: 'left',
                  padding: '1.5rem',
                  background: activeId === aud.id ? 'var(--np-bg-2)' : 'transparent',
                  border: 'none',
                  borderLeft: `3px solid ${activeId === aud.id ? 'var(--np-red)' : 'transparent'}`,
                  color: activeId === aud.id ? 'var(--np-white)' : 'var(--np-white-dim)',
                  fontFamily: 'var(--np-font-body)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {aud.title}
              </button>
            ))}
          </div>

          {/* RIGHT: CONTENT */}
          <div style={{ minHeight: '400px' }}>
            <AnimatePresence mode="wait">
              {audiences.map(aud => (
                aud.id === activeId && (
                  <motion.div
                    key={aud.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="np-display np-display-sm" style={{ marginBottom: '2.5rem', color: 'var(--np-white)' }}>
                      {aud.title}
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                      {aud.lessons.map((lesson, idx) => (
                        <div key={idx}>
                          <h4 style={{ fontFamily: 'var(--np-font-body)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--np-amber)', marginBottom: '0.75rem' }}>
                            {lesson.t}
                          </h4>
                          <p style={{ color: 'var(--np-white-dim)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                            {lesson.d}
                          </p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
