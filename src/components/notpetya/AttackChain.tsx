'use client';

import { useState } from 'react';
import { attackChain, technicalDetails } from '@/data/notpetya/attackChain';
import { motion, AnimatePresence } from 'framer-motion';

export default function AttackChain() {
  const [activeStageId, setActiveStageId] = useState(attackChain[0].id);
  
  const activeStage = attackChain.find(s => s.id === activeStageId) || attackChain[0];

  return (
    <>
      {/* SECTION 06A: TECHNICAL ARCHITECTURE (Exploit vs Creds) */}
      <section id="technical" className="np-section">
        <div className="np-container">
          <div className="np-section-num">06 / 19</div>
          <h2 className="np-display np-display-md" style={{ marginBottom: '1.5rem' }}>TECHNICAL ARCHITECTURE</h2>
          <p className="np-body-lg" style={{ marginBottom: '4rem', maxWidth: '800px' }}>
            NotPetya used two distinct propagation mechanisms simultaneously. Understanding both is essential to grasping why it spread beyond patched systems.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
            {/* EXPLOIT COLUMN */}
            <div>
              <h3 className="np-label np-text-red" style={{ marginBottom: '1rem' }}>EXPLOIT-BASED PROPAGATION</h3>
              <p className="np-body" style={{ marginBottom: '1.5rem' }}>
                NotPetya leveraged leaked NSA exploits to move laterally across unpatched systems via the SMBv1 protocol. This allowed unauthenticated remote code execution.
              </p>
              
              <div className="np-code-block" style={{ marginBottom: '1.5rem' }}>
                <pre>
                  <code>
                    Protocol: SMBv1{'\n'}
                    Ports:    TCP 139, TCP 445{'\n'}
                    CVE:      CVE-2017-0144 (EternalBlue){'\n'}
                              CVE-2017-0145 (EternalRomance){'\n'}
                    Patch:    MS17-010 (March 14, 2017){'\n'}
                    Impact:   Unauthenticated SYSTEM RCE
                  </code>
                </pre>
              </div>

              <div className="np-evidence-box">
                EternalBlue was originally developed by the NSA. It was leaked by the Shadow Brokers group on April 14, 2017 — ten weeks before NotPetya.
              </div>
              <div className="np-source-tag" style={{ marginTop: '1rem' }}>SOURCE: MICROSOFT MSRC</div>
            </div>

            {/* CREDENTIAL COLUMN */}
            <div>
              <h3 className="np-label np-text-amber" style={{ marginBottom: '1rem' }}>CREDENTIAL-BASED PROPAGATION</h3>
              <p className="np-body" style={{ marginBottom: '1.5rem' }}>
                Simultaneously, NotPetya harvested credentials from infected machines' memory and used legitimate Windows administrative tools to move laterally to fully patched systems.
              </p>
              
              <div className="np-code-block" style={{ marginBottom: '1.5rem' }}>
                <pre>
                  <code>
                    Tool:     Modified Mimikatz (32/64-bit){'\n'}
                    Target:   LSASS process memory{'\n'}
                    Extracts: NTLM hashes, plaintext credentials{'\n'}
                    Uses:     PsExec (ADMIN$ share), WMIC{'\n'}
                  </code>
                </pre>
              </div>

              <div className="np-evidence-box critical">
                This is why patching MS17-010 alone was insufficient. Systems that were fully patched were still compromised via stolen credentials and legitimate admin tools.
              </div>
              <div className="np-source-tag" style={{ marginTop: '1rem' }}>SOURCE: CISCO TALOS INCIDENT RESPONSE</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 05: INTERACTIVE ATTACK CHAIN */}
      <section id="attack" className="np-section" style={{ background: 'var(--np-bg-1)' }}>
        <div className="np-container">
          <div className="np-section-num">05 / 19</div>
          <h2 className="np-display np-display-md" style={{ marginBottom: '4rem' }}>ATTACK CHAIN</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem' }}>
            {/* LEFT: CHAIN LIST */}
            <div>
              {attackChain.map((stage, idx) => (
                <div 
                  key={stage.id}
                  className={`np-chain-stage ${activeStageId === stage.id ? 'active' : ''}`}
                  onClick={() => setActiveStageId(stage.id)}
                >
                  <div className="np-chain-num">0{idx + 1}</div>
                  <div>
                    <div className="np-chain-phase">{stage.phase}</div>
                    <h3 className="np-chain-title">{stage.title}</h3>
                    <p className="np-chain-desc">{stage.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT: DETAIL PANEL */}
            <div>
              <div style={{ position: 'sticky', top: '100px', background: 'var(--np-bg-2)', border: '1px solid rgba(0,0,0,0.06)', padding: '2.5rem' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStageId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="np-label np-text-amber" style={{ marginBottom: '1rem' }}>{activeStage.phase}</div>
                    <h3 className="np-display np-display-sm" style={{ marginBottom: '1rem' }}>{activeStage.title}</h3>
                    
                    <div className="np-chain-mitre-tags" style={{ marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {activeStage.mitre.map(m => (
                        <span key={m.id} className="np-mitre-tag">{m.id}</span>
                      ))}
                    </div>

                    <p className="np-body" style={{ marginBottom: '2rem' }}>{activeStage.description}</p>

                    <div style={{ marginBottom: '2rem' }}>
                      <strong style={{ color: 'var(--np-white)' }}>Mechanism: </strong>
                      <span style={{ color: 'var(--np-white-dim)' }}>{activeStage.mechanism}</span>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                      <strong style={{ color: 'var(--np-white)' }}>Why Attackers Used This: </strong>
                      <span style={{ color: 'var(--np-white-dim)' }}>{activeStage.whyUsed}</span>
                    </div>

                    {activeStage.detection && (
                      <div className="np-evidence-box" style={{ marginBottom: '1rem' }}>
                        <strong>DETECTION OPPORTUNITY:</strong>
                        <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem' }}>
                          {activeStage.detection.map((d, i) => <li key={i}>{d}</li>)}
                        </ul>
                      </div>
                    )}

                    {activeStage.mitigation && (
                      <div className="np-evidence-box" style={{ marginBottom: '1rem' }}>
                        <strong>MITIGATION:</strong>
                        <ul style={{ paddingLeft: '1.2rem', marginTop: '0.5rem' }}>
                          {activeStage.mitigation.map((m, i) => <li key={i}>{m}</li>)}
                        </ul>
                      </div>
                    )}

                    <div className="np-source-tag" style={{ marginTop: '2rem' }}>EVIDENCE: {activeStage.evidence}</div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 06B: MBR DESTRUCTION FLOW */}
      <section className="np-section">
        <div className="np-container-narrow">
          <div className="np-section-num">06B / 19</div>
          <h2 className="np-display np-display-sm" style={{ marginBottom: '2rem', textAlign: 'center' }}>DISK DESTRUCTION SEQUENCE</h2>
          <p className="np-body" style={{ textAlign: 'center', marginBottom: '4rem', color: 'var(--np-red)' }}>
            While displaying a fake "Check Disk" screen, NotPetya was performing irreversible disk destruction.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            {[
              "Execute perfc.dat (SYSTEM Privileges)",
              "Generate Random Installation ID (No Key Stored)",
              "Overwrite Sector 0 (MBR) with Custom Bootloader",
              "Schedule Fake CHKDSK on Reboot",
              "Force System Reboot (shutdown /r /f)",
              "Fake CHKDSK Encrypts MFT with Salsa20",
              "Display Ransom Note (System Unrecoverable)"
            ].map((stage, idx, arr) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ 
                  background: 'var(--np-bg-2)', 
                  border: '1px solid var(--np-red-border)', 
                  padding: '1.5rem 2.5rem', 
                  minWidth: '300px',
                  textAlign: 'center',
                  color: 'var(--np-white)' 
                }}>
                  {stage}
                </div>
                {idx < arr.length - 1 && (
                  <div style={{ height: '30px', width: '2px', background: 'var(--np-red)' }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
