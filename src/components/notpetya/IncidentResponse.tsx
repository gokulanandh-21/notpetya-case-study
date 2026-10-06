'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STAGES = [
  { id: 'detect', label: 'DETECT' },
  { id: 'contain', label: 'CONTAIN' },
  { id: 'eradicate', label: 'ERADICATE' },
  { id: 'recover', label: 'RECOVER' },
  { id: 'lessons', label: 'LESSONS LEARNED' }
];

export default function IncidentResponse() {
  const [activeStage, setActiveStage] = useState('detect');

  return (
    <section id="response" className="np-section">
      <div className="np-container">
        <div className="np-section-num">14 / 19</div>
        <h2 className="np-display np-display-md" style={{ marginBottom: '3rem' }}>INCIDENT RESPONSE LIFECYCLE</h2>

        <div className="np-ir-stages" style={{ marginBottom: '3rem' }}>
          {STAGES.map((stage) => (
            <div 
              key={stage.id}
              className={`np-ir-stage ${activeStage === stage.id ? 'active' : ''}`}
              onClick={() => setActiveStage(stage.id)}
            >
              {stage.label}
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--np-bg-2)', border: '1px solid rgba(0,0,0,0.05)', padding: '3rem', minHeight: '400px' }}>
          <AnimatePresence mode="wait">
            {activeStage === 'detect' && (
              <motion.div key="detect" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h3 className="np-display np-display-sm" style={{ marginBottom: '1.5rem', color: 'var(--np-white)' }}>PHASE 1: DETECTION & ANALYSIS</h3>
                <p className="np-body" style={{ marginBottom: '2rem' }}>
                  The detection window for NotPetya was incredibly short. From initial execution to system reboot and MBR destruction, the malware operated within roughly an hour.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                  <div>
                    <h4 className="np-label" style={{ marginBottom: '1rem', color: 'var(--np-amber)' }}>KEY INDICATORS</h4>
                    <ul style={{ color: 'var(--np-white-dim)', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
                      <li>Mass SMB (TCP 445) scanning internally</li>
                      <li>Unexpected LSASS memory access</li>
                      <li>Scheduled tasks creating 1-hour delayed reboots</li>
                      <li>Creation of perfc.dat without extension</li>
                      <li>Fake CHKDSK screens on endpoint monitors</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="np-label" style={{ marginBottom: '1rem', color: 'var(--np-red)' }}>CRITICAL RISK</h4>
                    <p style={{ color: 'var(--np-white-dim)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                      Once a system reboots and displays the CHKDSK screen, the MFT encryption is actively occurring. Powering off the machine at this exact moment might save some data, but the MBR is already destroyed.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeStage === 'contain' && (
              <motion.div key="contain" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h3 className="np-display np-display-sm" style={{ marginBottom: '1.5rem', color: 'var(--np-white)' }}>PHASE 2: CONTAINMENT</h3>
                <p className="np-body" style={{ marginBottom: '2rem' }}>
                  Because NotPetya leveraged stolen credentials, software-based containment (like AV blocking) was insufficient. The only effective containment was physical or architectural isolation.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                  <div>
                    <h4 className="np-label" style={{ marginBottom: '1rem', color: 'var(--np-amber)' }}>IMMEDIATE ACTIONS</h4>
                    <ul style={{ color: 'var(--np-white-dim)', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
                      <li>Sever network links between data centers/offices</li>
                      <li>Disable VPN access to stop remote spread</li>
                      <li>Disable the SMBv1 protocol globally via GPO</li>
                      <li>Block execution of psexec.exe and wmic.exe</li>
                      <li>Disable the M.E.Doc update service/domain</li>
                    </ul>
                  </div>
                  <div className="np-evidence-box critical">
                    <strong>THE "BIG RED BUTTON":</strong> Many organizations survived only because an IT administrator literally ran into the server room and yanked the core network cables, cutting the company in half before the worm could cross the ocean.
                  </div>
                </div>
              </motion.div>
            )}

            {activeStage === 'eradicate' && (
              <motion.div key="eradicate" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h3 className="np-display np-display-sm" style={{ marginBottom: '1.5rem', color: 'var(--np-white)' }}>PHASE 3: ERADICATION</h3>
                <p className="np-body" style={{ marginBottom: '2rem' }}>
                  Eradication was brutally simple: affected systems were destroyed. There was no "cleaning" NotPetya off a machine.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                  <div>
                    <h4 className="np-label" style={{ marginBottom: '1rem', color: 'var(--np-amber)' }}>REQUIREMENTS</h4>
                    <ul style={{ color: 'var(--np-white-dim)', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
                      <li>Full disk wipe of all affected hardware</li>
                      <li>Complete rebuild of Active Directory from known-good state</li>
                      <li>Mandatory password resets for 100% of domain accounts</li>
                      <li>Revocation of all current Kerberos tickets</li>
                      <li>Verification that MS17-010 is applied to all new builds</li>
                    </ul>
                  </div>
                  <div>
                    <p style={{ color: 'var(--np-white-dim)', fontSize: '0.95rem', lineHeight: 1.6, padding: '1rem', background: 'var(--np-bg-solid)', borderLeft: '2px solid var(--np-white)' }}>
                      "You do not clean a wiper. You throw the drive in the bin, put a new one in, and start again. If you trust a wiped drive, you're taking a risk you don't need to take."
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeStage === 'recover' && (
              <motion.div key="recover" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h3 className="np-display np-display-sm" style={{ marginBottom: '1.5rem', color: 'var(--np-white)' }}>PHASE 4: RECOVERY</h3>
                <p className="np-body" style={{ marginBottom: '2rem' }}>
                  Recovery from NotPetya took weeks, and in some cases, months. It required heroic efforts from IT staff, often working 20-hour days.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                  <div>
                    <h4 className="np-label" style={{ marginBottom: '1rem', color: 'var(--np-amber)' }}>THE RECOVERY PROCESS</h4>
                    <ul style={{ color: 'var(--np-white-dim)', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
                      <li>Locate offline/tape backups that survived the attack</li>
                      <li>Verify backup integrity (ensure they aren't infected)</li>
                      <li>Rebuild core infrastructure (DNS, DHCP, AD) first</li>
                      <li>Image thousands of employee laptops manually via USB</li>
                      <li>Staged reconnection of business units</li>
                    </ul>
                  </div>
                  <div className="np-evidence-box">
                    <strong>THE DOMAIN CONTROLLER MIRACLE:</strong> Maersk's global Active Directory was completely wiped. They only recovered because a single Domain Controller in Ghana had been offline due to a local power outage during the attack, preserving a copy of the AD database.
                  </div>
                </div>
              </motion.div>
            )}

            {activeStage === 'lessons' && (
              <motion.div key="lessons" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <h3 className="np-display np-display-sm" style={{ marginBottom: '1.5rem', color: 'var(--np-white)' }}>PHASE 5: POST-INCIDENT (LESSONS)</h3>
                <p className="np-body" style={{ marginBottom: '2rem' }}>
                  The aftermath of NotPetya reshaped enterprise security architecture globally.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                  <div>
                    <h4 className="np-label" style={{ marginBottom: '1rem', color: 'var(--np-amber)' }}>ARCHITECTURAL CHANGES</h4>
                    <ul style={{ color: 'var(--np-white-dim)', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
                      <li>"Flat networks" were abandoned in favor of strict segmentation</li>
                      <li>Offline, immutable backups became a mandatory board-level requirement</li>
                      <li>Patch SLAs for critical vulnerabilities were reduced from 30 days to 48 hours</li>
                      <li>Privileged Access Management (PAM) adoption accelerated</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
