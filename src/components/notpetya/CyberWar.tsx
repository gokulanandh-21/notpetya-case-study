'use client';

import { sandwormProfile } from '@/data/notpetya/mitre';

export default function CyberWar() {
  return (
    <section id="cyberwar" className="np-section">
      <div className="np-container">
        <div className="np-section-num">12 / 19</div>
        <h2 className="np-display np-display-md" style={{ marginBottom: '3rem' }}>CYBER WARFARE & ATTRIBUTION</h2>

        <div className="np-evidence-box warning" style={{ marginBottom: '4rem', fontSize: '1.05rem' }}>
          <strong>IMPORTANT — ASSESSMENT NOTICE:</strong> The attribution statements in this section represent official government and intelligence assessments from multiple allied nations. They are not judicial findings. Russia has consistently denied involvement in these cyber operations. This content presents these assessments accurately and with their original source context.
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '5rem' }}>
          {/* COLUMN 1 */}
          <div>
            <h3 className="np-label np-text-amber" style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '0.75rem' }}>TECHNICAL EVIDENCE</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--np-white-dim)', paddingLeft: '1.2rem', fontSize: '0.95rem' }}>
              <li><strong>Targeted initial vector:</strong> M.E.Doc software was mandatory for doing business in Ukraine.</li>
              <li><strong>Fake ransomware design:</strong> Cryptographically irrecoverable, ensuring permanent data destruction.</li>
              <li><strong>Code reuse:</strong> Significant code overlap with the original 2016 Petya malware and KillDisk (used in previous Ukraine attacks).</li>
              <li><strong>Intelligence gathering:</strong> The M.E.Doc backdoor collected EDRPOU codes (Ukrainian tax IDs) before deploying the payload.</li>
              <li><strong>Infrastructure overlap:</strong> Command and control infrastructure shared similarities with known GRU operations.</li>
            </ul>
          </div>

          {/* COLUMN 2 */}
          <div>
            <h3 className="np-label np-text-amber" style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '0.75rem' }}>GOVERNMENT ASSESSMENT</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ background: 'var(--np-bg-2)', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.05)' }}>
                <div className="np-mono-sm" style={{ color: 'var(--np-white-muted)', marginBottom: '0.5rem' }}>UK NCSC | FEB 15, 2018</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--np-white)', fontStyle: 'italic' }}>"The UK Government judges that the Russian military was almost certainly responsible for the destructive NotPetya cyber-attack of June 2017."</p>
              </div>
              <div style={{ background: 'var(--np-bg-2)', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.05)' }}>
                <div className="np-mono-sm" style={{ color: 'var(--np-white-muted)', marginBottom: '0.5rem' }}>US WHITE HOUSE | FEB 15, 2018</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--np-white)', fontStyle: 'italic' }}>"It was part of the Kremlin's ongoing effort to destabilize Ukraine and demonstrates ever more clearly Russia's involvement in the ongoing conflict."</p>
              </div>
              <div style={{ background: 'var(--np-bg-2)', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.05)' }}>
                <div className="np-mono-sm" style={{ color: 'var(--np-white-muted)', marginBottom: '0.5rem' }}>US DOJ INDICTMENT | OCT 2020</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--np-white)', fontStyle: 'italic' }}>Indicted six GRU Unit 74455 officers for NotPetya, BlackEnergy, and Industroyer.</p>
              </div>
            </div>
          </div>

          {/* COLUMN 3 */}
          <div>
            <h3 className="np-label np-text-amber" style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '0.75rem' }}>INTERPRETATION</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--np-white-dim)', paddingLeft: '1.2rem', fontSize: '0.95rem' }}>
              <li><strong>Economic disruption:</strong> The primary objective was assessed to be the disruption of Ukrainian economic and government infrastructure on Constitution Day.</li>
              <li><strong>Collateral damage:</strong> Global multinationals were treated as acceptable collateral damage, or potentially leveraged to exert broader economic pressure.</li>
              <li><strong>Capability demonstration:</strong> Demonstrated the ability to paralyze national infrastructure via a single supply-chain vector.</li>
              <li><strong>Testing ground:</strong> Ukraine served as a live-fire testing environment for advanced cyber capabilities.</li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)', paddingTop: '4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
          <div>
            <h3 className="np-display np-display-sm" style={{ marginBottom: '1.5rem' }}>THE DEFINITION OF CYBER WARFARE</h3>
            <p className="np-body" style={{ marginBottom: '1.5rem' }}>
              NotPetya forced a global reckoning with the definition of "cyber warfare." Unlike cyber espionage (stealing data) or cybercrime (extorting money), NotPetya was a purely destructive act aimed at a sovereign nation's infrastructure.
            </p>
            <p className="np-body">
              However, because the weapon was digital, it lacked the physical kinetic destruction traditionally required to trigger mutual defense treaties like NATO's Article 5. It existed in the "gray zone" of conflict—highly destructive, but falling just short of conventional war.
            </p>
          </div>
          <div>
            <h3 className="np-display np-display-sm" style={{ marginBottom: '1.5rem' }}>INTERNATIONAL RESPONSE</h3>
            <p className="np-body" style={{ marginBottom: '1.5rem' }}>
              The attack highlighted the lack of binding international norms regarding state behavior in cyberspace. While multiple governments publicly condemned the attack, formal consequences were limited to sanctions and indictments of intelligence officers who remain out of reach.
            </p>
            <p className="np-body">
              In the private sector, NotPetya fundamentally altered the cyber insurance market. Following the attack, insurers (notably Lloyd's of London) introduced strict exclusion clauses for state-sponsored cyberattacks, arguing they constitute acts of war.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
