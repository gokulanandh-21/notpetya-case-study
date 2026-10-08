'use client';

import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';

interface ScenarioStep {
  id: number;
  alertTitle: string;
  timestamp: string;
  telemetrySource: string;
  scenarioText: string;
  technicalContext: string;
  options: {
    label: string;
    action: string;
    isCorrect: boolean;
    explanation: string;
    consequence: string;
  }[];
}

const SCENARIOS: ScenarioStep[] = [
  {
    id: 1,
    alertTitle: 'ALERT 01: Anomalous Outbound HTTP POST from Accounting Service',
    timestamp: 'June 27, 2017 — 10:35 UTC',
    telemetrySource: 'Perimeter Egress Firewall / Proxy Log',
    scenarioText: 'A workstation in the Finance department running M.E.Doc initiates outbound HTTP POST requests to 84.200.16.242 transmitting encrypted payloads containing organization metadata.',
    technicalContext: 'The accounting software update daemon has been hijacked by backdoored DLL ZvitPublishedObjects.dll. It is beaconing tax IDs and requesting stage-2 instructions.',
    options: [
      {
        label: 'A. Ignore as routine vendor telemetry update',
        action: 'IGNORE',
        isCorrect: false,
        explanation: 'Allowing the beacon permits the C2 to deliver the destructive wiper perfc.dat across the internal network.',
        consequence: 'Malware dropper successfully downloaded; infection spreads unchecked.',
      },
      {
        label: 'B. Isolate host immediately & block IP at perimeter firewall',
        action: 'ISOLATE_AND_BLOCK',
        isCorrect: true,
        explanation: 'Isolating the endpoint prevents the secondary download and lateral propagation, while perimeter egress blocks deny C2 command execution across the organization.',
        consequence: 'Host isolated from LAN within 4 minutes; C2 channel severed; zero lateral movement.',
      },
      {
        label: 'C. Schedule routine endpoint AV scan for the weekend',
        action: 'SCHEDULE_SCAN',
        isCorrect: false,
        explanation: 'Standard signature-based AV failed to detect NotPetya on June 27 as it utilized in-memory injection and legitimate administrative utilities.',
        consequence: 'Within 45 minutes, entire enterprise Active Directory domain is compromised.',
      },
    ],
  },
  {
    id: 2,
    alertTitle: 'ALERT 02: Rapid Internal TCP 445 SMB Traffic Burst',
    timestamp: 'June 27, 2017 — 10:48 UTC',
    telemetrySource: 'Network Intrusion Detection System (Zeek / Suricata)',
    scenarioText: 'Multiple internal workstations are initiating rapid SMB connections to neighboring subnets. Unauthenticated SMB_COM_TRANSACTION2 packets are observed targeting the srv.sys driver.',
    technicalContext: 'The EternalBlue (CVE-2017-0144) worm module is aggressively sweeping the internal Class-C subnet looking for unpatched MS17-010 endpoints.',
    options: [
      {
        label: 'A. Emergency disable of SMBv1 & segment workstation subnets',
        action: 'BLOCK_SMB',
        isCorrect: true,
        explanation: 'Halting SMBv1 network-wide and enforcing host-based firewall rules blocking client-to-client TCP 445 terminates the worm’s primary unauthenticated transmission vector.',
        consequence: 'Worm transmission fails at boundary routers; unpatched hosts protected from remote exploit.',
      },
      {
        label: 'B. Reboot all affected servers remotely via domain controller',
        action: 'REBOOT_SERVERS',
        isCorrect: false,
        explanation: 'Rebooting machines triggers the corrupt 16-bit bootloader that immediately executes Salsa20 encryption of the Master File Table, permanently destroying the disks.',
        consequence: 'Catastrophic failure: All rebooted workstations display red skull ransom screen permanently unrecoverable.',
      },
      {
        label: 'C. Rely on perimeter firewall to stop external attackers',
        action: 'EXTERNAL_FIREWALL_ONLY',
        isCorrect: false,
        explanation: 'NotPetya has already bypassed perimeter defenses via the trusted software update. Perimeter firewalls cannot stop peer-to-peer lateral propagation.',
        consequence: 'Internal workstations continue infecting each other at wire speed.',
      },
    ],
  },
  {
    id: 3,
    alertTitle: 'ALERT 03: LSASS Memory Injection & Remote Service Creation',
    timestamp: 'June 27, 2017 — 11:05 UTC',
    telemetrySource: 'Endpoint Detection & Response (EDR) / Sysmon Event ID 10',
    scenarioText: 'A suspicious process is requesting PROCESS_VM_READ access to lsass.exe. Simultaneously, Event ID 7045 reports a remote service installation via ADMIN$ using a Domain Admin credential.',
    technicalContext: 'Embedded Mimikatz has harvested cleartext passwords and NTLM hashes. The malware is deploying PsExec and WMIC to leap onto fully patched Windows machines.',
    options: [
      {
        label: 'A. Assume patched systems are immune since MS17-010 was deployed',
        action: 'ASSUME_PATCHED',
        isCorrect: false,
        explanation: 'Patching MS17-010 only stops EternalBlue. With valid harvested credentials, NotPetya uses legitimate Windows tools (PsExec and WMIC) to execute on fully patched machines.',
        consequence: 'Fully patched executive laptops and domain controllers are wiped.',
      },
      {
        label: 'B. Invalidate Active Directory Kerberos TGT & force Tiered credential reset',
        action: 'RESET_CREDENTIALS',
        isCorrect: true,
        explanation: 'Resetting the krbtgt account twice and invalidating domain administrator sessions strips the attackers of harvested credential validity, stopping PsExec and WMIC spread.',
        consequence: 'Lateral authentication attempts rejected with Kerberos auth errors; propagation halted.',
      },
      {
        label: 'C. Pay the $300 Bitcoin ransom to obtain the private decryption key',
        action: 'PAY_RANSOM',
        isCorrect: false,
        explanation: 'NotPetya is a wiper, not ransomware. The installation key is purely random and discarded; the email address was suspended within hours. Decryption is mathematically impossible.',
        consequence: 'Financial loss with zero recovery; files remain permanently destroyed.',
      },
    ],
  },
];

export default function SOCInvestigationSimulation() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [history, setHistory] = useState<Record<number, number>>({});

  const current = SCENARIOS[currentStepIndex];
  const answered = selectedOption !== null;

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelectedOption(idx);
    setHistory(prev => ({ ...prev, [currentStepIndex]: idx }));
  };

  const handleNext = () => {
    if (currentStepIndex < SCENARIOS.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      setSelectedOption(history[nextIdx] !== undefined ? history[nextIdx] : null);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setSelectedOption(null);
    setHistory({});
  };

  return (
    <section id="soc-simulator" className="np-section" style={{ background: 'var(--np-bg-0)', borderTop: '1px solid var(--np-card-border)' }}>
      <div className="np-container">
        <div className="np-conceptual-badge" style={{ marginBottom: '1.5rem' }}>
          INTERACTIVE DEFENSIVE SIMULATION // SOC INCIDENT RESPONSE
        </div>
        <div className="np-section-num">DEFENSE // YOU ARE THE SOC</div>
        <h2 className="np-display np-display-md" style={{ marginBottom: '1.5rem' }}>
          DECISION MATRIX: RESPONDING TO A HYBRID WIPER
        </h2>
        <p className="np-body-lg" style={{ maxWidth: '850px', marginBottom: '3rem', color: 'var(--np-white-dim)' }}>
          Step into the role of Lead Incident Responder during the opening minutes of June 27, 2017. Real-world defensive telemetry appears on your console. Choose your containment actions and evaluate operational consequences.
        </p>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem' }}>
          {SCENARIOS.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setCurrentStepIndex(idx);
                setSelectedOption(history[idx] !== undefined ? history[idx] : null);
              }}
              style={{
                flex: 1,
                padding: '0.75rem 1rem',
                background: currentStepIndex === idx ? 'var(--np-card-hover)' : 'var(--np-card)',
                border: currentStepIndex === idx ? '1px solid var(--np-amber)' : '1px solid var(--np-card-border)',
                color: currentStepIndex === idx ? 'var(--np-white)' : 'var(--np-white-muted)',
                fontFamily: 'var(--np-font-mono)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span>{`PHASE 0${idx + 1}`}</span>
              {history[idx] !== undefined && (
                <span style={{ marginLeft: 'auto', color: SCENARIOS[idx].options[history[idx]].isCorrect ? '#4ade80' : 'var(--np-red)' }}>
                  {SCENARIOS[idx].options[history[idx]].isCorrect ? '✓' : '✗'}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Console Box */}
        <div
          style={{
            background: 'var(--np-card)',
            border: '1px solid var(--np-card-border)',
            padding: '2.5rem',
            backdropFilter: 'blur(12px)',
            marginBottom: '2rem',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--np-card-border)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <ShieldAlert size={18} color="var(--np-amber)" />
                <span className="np-mono-sm" style={{ color: 'var(--np-amber)' }}>{current.telemetrySource}</span>
              </div>
              <h3 style={{ fontFamily: 'var(--np-font-body)', fontSize: '1.25rem', color: 'var(--np-white)', fontWeight: 600 }}>
                {current.alertTitle}
              </h3>
            </div>
            <div className="np-mono-sm" style={{ color: 'var(--np-white-muted)', background: 'rgba(0,0,0,0.4)', padding: '0.4rem 0.8rem', border: '1px solid var(--np-card-border)' }}>
              {current.timestamp}
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '2rem' }}>
            <p className="np-body" style={{ fontSize: '1.05rem', color: 'var(--np-white)', marginBottom: '1rem' }}>
              {current.scenarioText}
            </p>
            <div className="np-evidence-box" style={{ marginTop: '1rem' }}>
              <strong>FORENSIC CONTEXT: </strong> {current.technicalContext}
            </div>
          </div>

          {/* Decision Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            <div className="np-label" style={{ color: 'var(--np-white-muted)' }}>SELECT SOC CONTAINMENT ACTION:</div>
            {current.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let btnBorder = 'var(--np-card-border)';
              let btnBg = 'rgba(255, 255, 255, 0.02)';

              if (answered) {
                if (opt.isCorrect) {
                  btnBorder = 'rgba(74, 222, 128, 0.6)';
                  btnBg = 'rgba(74, 222, 128, 0.08)';
                } else if (isSelected && !opt.isCorrect) {
                  btnBorder = 'rgba(230, 57, 70, 0.6)';
                  btnBg = 'rgba(230, 57, 70, 0.1)';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={answered}
                  style={{
                    background: btnBg,
                    border: `1px solid ${btnBorder}`,
                    padding: '1.25rem 1.5rem',
                    textAlign: 'left',
                    color: 'var(--np-white)',
                    fontFamily: 'var(--np-font-body)',
                    fontSize: '0.95rem',
                    cursor: answered ? 'default' : 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600 }}>{opt.label}</span>
                    {answered && opt.isCorrect && <CheckCircle2 size={18} color="#4ade80" />}
                    {answered && isSelected && !opt.isCorrect && <AlertTriangle size={18} color="var(--np-red)" />}
                  </div>
                  {answered && (
                    <div style={{ fontSize: '0.85rem', color: opt.isCorrect ? '#86efac' : '#fca5a5', marginTop: '0.25rem', lineHeight: 1.5 }}>
                      <strong>{opt.isCorrect ? 'TACTICAL SUCCESS: ' : 'CRITICAL DEFENSIVE FAILURE: '}</strong>
                      {opt.explanation}
                      <div style={{ marginTop: '0.35rem', color: 'var(--np-white-dim)' }}>
                        <strong>Outcome: </strong> {opt.consequence}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Controls footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid var(--np-card-border)' }}>
            <button
              onClick={handleReset}
              style={{
                background: 'transparent',
                border: '1px solid var(--np-card-border)',
                color: 'var(--np-white-muted)',
                padding: '0.6rem 1.2rem',
                fontFamily: 'var(--np-font-mono)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <RotateCcw size={14} /> RESET SIMULATION
            </button>

            {answered && currentStepIndex < SCENARIOS.length - 1 && (
              <button
                onClick={handleNext}
                style={{
                  background: 'var(--np-white)',
                  color: '#050a10',
                  border: 'none',
                  padding: '0.6rem 1.5rem',
                  fontFamily: 'var(--np-font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                ADVANCE TO NEXT ALERT <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
