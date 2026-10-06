'use client';

import { useState } from 'react';

const TABS = ['ALERT', 'TRIAGE', 'HOST', 'NETWORK', 'LATERAL MOVEMENT', 'CONTAINMENT'];

export default function SOCInvestigation() {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <section id="investigation" className="np-section" style={{ background: 'var(--np-bg-1)' }}>
      <div className="np-container">
        <div className="np-section-num">13 / 19</div>
        <h2 className="np-display np-display-md" style={{ marginBottom: '1.5rem' }}>SOC INVESTIGATION</h2>
        
        <div style={{ background: 'var(--np-red)', color: 'white', padding: '1rem', fontFamily: 'var(--np-font-body)', fontWeight: 600, textAlign: 'center', marginBottom: '3rem', borderRadius: '2px' }}>
          SIMULATED INVESTIGATION — All log entries below are illustrative examples based on documented NotPetya behavior. They are NOT original NotPetya evidence or actual logs.
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '0.25rem', overflowX: 'auto', marginBottom: '2rem', borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? 'var(--np-bg-2)' : 'transparent',
                color: activeTab === tab ? 'var(--np-white)' : 'var(--np-white-dim)',
                border: 'none',
                borderTop: `2px solid ${activeTab === tab ? 'var(--np-red)' : 'transparent'}`,
                padding: '1rem 1.5rem',
                fontFamily: 'var(--np-font-mono)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s ease'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div style={{ background: 'var(--np-bg-2)', border: '1px solid rgba(0,0,0,0.05)', padding: '3rem' }}>
          
          {activeTab === 'ALERT' && (
            <div>
              <h3 className="np-label" style={{ color: 'var(--np-amber)', marginBottom: '1rem' }}>ANALYST OBSERVATION</h3>
              <p className="np-body" style={{ marginBottom: '2rem' }}>
                Initial alerts fire across the SIEM and EDR platforms simultaneously. The sheer volume of alerts indicates an automated, rapidly propagating threat rather than a manual intrusion.
              </p>
              
              <div className="np-log-terminal">
                <div className="np-log-header">ILLUSTRATIVE LOG — NOT ORIGINAL EVIDENCE</div>
                <pre><code>
[10:47:33 UTC] CRITICAL  Mass SMB connection attempts src=10.1.2.45 dst=10.1.2.0/24 port=445 count=847/min{'\n'}
[10:47:35 UTC] HIGH      LSASS memory read by: C:\Windows\perfc.dat (PID:2847) — credential dumping suspected{'\n'}
[10:47:38 UTC] CRITICAL  Scheduled task created: shutdown.exe /r /f /t 3600 — initiated by perfc.dat{'\n'}
[10:48:12 UTC] CRITICAL  Same pattern on 10.1.2.67, 10.1.3.12, 10.1.3.45 — RAPID PROPAGATION
                </code></pre>
              </div>
              
              <div style={{ marginTop: '2rem', paddingLeft: '1rem', borderLeft: '2px solid var(--np-red)' }}>
                <strong>ANALYSIS NOTE:</strong> The combination of mass SMB scanning, LSASS memory access, and automated scheduled reboot tasks indicates a highly aggressive worm with credential theft capabilities. Priority: isolate 10.1.2.45 immediately.
              </div>
            </div>
          )}

          {activeTab === 'TRIAGE' && (
            <div>
              <h3 className="np-label" style={{ color: 'var(--np-amber)', marginBottom: '1rem' }}>ANALYST OBSERVATION</h3>
              <p className="np-body" style={{ marginBottom: '2rem' }}>
                The Incident Response team must quickly determine the scope and intent of the malware. Early reports from helpdesk indicate users are seeing "Check Disk" screens upon reboot.
              </p>
              
              <div className="np-log-terminal">
                <div className="np-log-header">ILLUSTRATIVE LOG — NOT ORIGINAL EVIDENCE</div>
                <pre><code>
INCIDENT: INC-20170627-001{'\n'}
SEVERITY: SEV-1 (CRITICAL){'\n'}
SCOPE: 45 endpoints confirmed infected within 3 minutes; spreading globally{'\n'}
SYMPTOMS: {'\n'}
  1. Spontaneous system reboots (1-hour delay timer){'\n'}
  2. Fake CHKDSK screen displayed on boot{'\n'}
  3. Red/black ransom note demanding $300 BTC after fake CHKDSK
                </code></pre>
              </div>
              
              <div style={{ marginTop: '2rem', paddingLeft: '1rem', borderLeft: '2px solid var(--np-red)' }}>
                <strong>TRIAGE DECISIONS:</strong> Is this ransomware or a wiper? Do not pay the ransom—the email address is already offline. Disconnect all network links between affected and unaffected sites immediately to halt spread.
              </div>
            </div>
          )}

          {activeTab === 'HOST' && (
            <div>
              <h3 className="np-label" style={{ color: 'var(--np-amber)', marginBottom: '1rem' }}>ANALYST OBSERVATION</h3>
              <p className="np-body" style={{ marginBottom: '2rem' }}>
                Forensic investigation of an affected endpoint (Patient Zero equivalent) reveals the execution chain and payload behavior.
              </p>
              
              <div className="np-log-terminal">
                <div className="np-log-header">ILLUSTRATIVE LOG — NOT ORIGINAL EVIDENCE</div>
                <pre><code>
PROCESS TREE:{'\n'}
  └─ ezvit.exe (M.E.Doc updater - SYSTEM privilege){'\n'}
      └─ rundll32.exe{'\n'}
          └─ perfc.dat (NotPetya payload){'\n'}
              ├─ cmd.exe /c schtasks /RU "SYSTEM" /Create /SC once /TN "" /TR "C:\Windows\system32\shutdown.exe /r /f"{'\n'}
              └─ lsass.exe (Memory read access requested){'\n\n'}
FILE SYSTEM:{'\n'}
  C:\Windows\perfc.dat — Zero-byte extension, valid MZ executable header{'\n\n'}
DISK FORENSICS:{'\n'}
  Master Boot Record (Sector 0): MODIFIED — Custom bootloader detected
                </code></pre>
              </div>
            </div>
          )}

          {activeTab === 'NETWORK' && (
            <div>
              <h3 className="np-label" style={{ color: 'var(--np-amber)', marginBottom: '1rem' }}>ANALYST OBSERVATION</h3>
              <p className="np-body" style={{ marginBottom: '2rem' }}>
                Network telemetry reveals how the malware propagates between systems without user interaction.
              </p>
              
              <div className="np-log-terminal">
                <div className="np-log-header">ILLUSTRATIVE LOG — NOT ORIGINAL EVIDENCE</div>
                <pre><code>
[IDS ALERT] MULTIPLE INTERNAL HOSTS SCANNING PORT 445 (SMB){'\n'}
  10.1.2.45 -{'>'} 10.1.0.0/16 (850 connections/min){'\n'}
  10.1.2.67 -{'>'} 10.1.0.0/16 (830 connections/min){'\n\n'}
[IDS ALERT] MS17-010 EXPLOIT SIGNATURE DETECTED{'\n'}
  SRC: 10.1.2.45 | DST: 10.1.2.67 (Unpatched Windows 7){'\n\n'}
[SMB TRAFFIC] ADMINISTRATIVE SHARE ACCESS{'\n'}
  SRC: 10.1.2.45 | DST: 10.1.2.89 | SHARE: IPC${'\n'}
  SRC: 10.1.2.45 | DST: 10.1.2.89 | SHARE: ADMIN$ (psexec_svc pattern)
                </code></pre>
              </div>
            </div>
          )}

          {activeTab === 'LATERAL MOVEMENT' && (
            <div>
              <h3 className="np-label" style={{ color: 'var(--np-amber)', marginBottom: '1rem' }}>ANALYST OBSERVATION</h3>
              <p className="np-body" style={{ marginBottom: '2rem' }}>
                The malware uses stolen credentials to infect fully patched systems. This explains why organizations that applied MS17-010 are still falling.
              </p>
              
              <div className="np-log-terminal">
                <div className="np-log-header">ILLUSTRATIVE LOG — NOT ORIGINAL EVIDENCE</div>
                <pre><code>
[SECURITY LOG] EVENT ID: 4648 (Explicit Credential Use){'\n'}
  ACCOUNT: DOMAIN\svc_admin (Harvested from 10.1.2.45 LSASS){'\n'}
  TARGET: 10.1.3.12 (Fully patched Server 2012 R2){'\n\n'}
[PROCESS LAUNCH] PSEXEC ACTIVITY{'\n'}
  HOST: 10.1.3.12 | PROCESS: psexec.exe spawned by 10.1.2.45 connection{'\n\n'}
[PROCESS LAUNCH] WMI REMOTE EXECUTION{'\n'}
  COMMAND: wmic /node:10.1.3.45 process call create "rundll32.exe C:\Windows\perfc.dat..."
                </code></pre>
              </div>
              
              <div className="np-evidence-box critical" style={{ marginTop: '2rem' }}>
                <strong>CRITICAL FINDING:</strong> Target 10.1.3.12 was verified as fully patched against MS17-010. It was compromised via legitimate Windows administrative tools (PsExec/WMI) using credentials stolen from memory on a different machine.
              </div>
            </div>
          )}

          {activeTab === 'CONTAINMENT' && (
            <div>
              <h3 className="np-label" style={{ color: 'var(--np-amber)', marginBottom: '1rem' }}>ANALYST OBSERVATION</h3>
              <p className="np-body" style={{ marginBottom: '2rem' }}>
                Based on the investigation, standard containment procedures (like AV quarantine) will fail. Drastic infrastructure-level containment is required.
              </p>
              
              <div style={{ background: 'var(--np-bg-1)', padding: '2rem', borderLeft: '4px solid var(--np-red)' }}>
                <h4 style={{ color: 'var(--np-white)', marginBottom: '1.5rem', fontFamily: 'var(--np-font-body)' }}>IMMEDIATE ACTION PLAN</h4>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--np-white-dim)', paddingLeft: '1.2rem' }}>
                  <li><strong>SEVER CONNECTIVITY:</strong> Physically disconnect core switches routing between regional offices. Kill VPN tunnels immediately.</li>
                  <li><strong>DISABLE PROTOCOL:</strong> Deploy GPO to disable SMBv1 globally across the remaining accessible network.</li>
                  <li><strong>CREDENTIAL ROTATION:</strong> Force password resets for ALL Domain Admin and Service accounts immediately (they are likely compromised in memory).</li>
                  <li><strong>DO NOT REBOOT:</strong> Instruct users NOT to reboot machines showing blue screens. Forensic disk images must be taken before the fake CHKDSK destroys the MFT.</li>
                  <li><strong>PREPARE FOR RECOVERY:</strong> Begin spinning up clean, isolated infrastructure from offline backups. Assume the current domain is entirely compromised.</li>
                </ul>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
