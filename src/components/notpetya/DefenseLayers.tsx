'use client';

import React from 'react';
import { Layers, ShieldCheck, AlertCircle } from 'lucide-react';

interface DefenseLayer {
  layer: string;
  threatAddressed: string;
  defensiveControl: string;
  whyItMatters: string;
  remainingLimitation: string;
}

const DEFENSE_LAYERS: DefenseLayer[] = [
  {
    layer: '1. Software Supply Chain & Vendor Attestation',
    threatAddressed: 'Backdoored software updates delivered from trusted third-party vendor infrastructure (M.E.Doc).',
    defensiveControl: 'SLSA Level 3+ build provenance, cryptographic signature verification, sandbox staging rings for all software updates.',
    whyItMatters: 'Prevents automatic, uninspected execution of malicious DLLs inheriting administrative software updater tokens.',
    remainingLimitation: 'Cannot prevent threats if the vendor’s private signing keys or core source repository are deeply compromised.',
  },
  {
    layer: '2. Endpoint Memory & LSA Protection',
    threatAddressed: 'LSASS in-memory credential harvesting via embedded Mimikatz module.',
    defensiveControl: 'Windows Defender Credential Guard, LSA Protection (RunAsPPL), and Restricted Admin Mode.',
    whyItMatters: 'Isolates LSASS secrets inside a hardware-isolated Virtualization-Based Security (VBS) container, preventing memory dumping.',
    remainingLimitation: 'Does not stop attackers if valid domain credentials are already known via external keyloggers or token reuse.',
  },
  {
    layer: '3. SMBv1 Deprecation & Port 445 Segmentation',
    threatAddressed: 'Unauthenticated kernel RCE via EternalBlue (CVE-2017-0144) and EternalRomance (CVE-2017-0145).',
    defensiveControl: 'Complete removal of the SMBv1 feature (`FS-SMB1`), applying MS17-010, and host-based firewall blocking client-to-client TCP 445.',
    whyItMatters: 'Completely eliminates the worm’s ability to propagate across subnets without credentials at network wire speed.',
    remainingLimitation: 'Does not prevent credential-based lateral movement (PsExec/WMIC) if domain admin credentials have been stolen.',
  },
  {
    layer: '4. Tiered Active Directory Administrative Model',
    threatAddressed: 'Domain-wide compromise via stolen Domain Admin credentials utilized by PsExec and WMIC.',
    defensiveControl: 'Strict 3-Tier Architecture (Tier 0: Domain Controllers; Tier 1: Servers; Tier 2: Workstations).',
    whyItMatters: 'Guarantees that high-privilege credentials never touch standard workstations, preventing credential theft from escalating to forest compromise.',
    remainingLimitation: 'Requires complex ongoing architectural governance; single operational lapses can leak credentials.',
  },
  {
    layer: '5. Workstation Microsegmentation & RPC Filtering',
    threatAddressed: 'Peer-to-peer lateral movement across corporate workstation subnets.',
    defensiveControl: 'Deny all inbound workstation-to-workstation traffic; isolate branch VPNs into distinct security zones.',
    whyItMatters: 'Even if a branch office workstation is infected, the malware cannot leap across the enterprise flat network.',
    remainingLimitation: 'Requires dedicated software-defined network enforcement and fine-grained firewall policy maintenance.',
  },
  {
    layer: '6. Immutable Air-Gapped Backups & Disaster Recovery',
    threatAddressed: 'Permanent disk destruction (MBR overwrite and MFT Salsa20 encryption) rendering recovery impossible.',
    defensiveControl: 'Air-gapped, write-once-read-many (WORM) offline backups of Active Directory forests and core operational data.',
    whyItMatters: 'Allows clean enterprise bare-metal restoration without relying on external salvage or paying non-existent ransomware decrypters.',
    remainingLimitation: 'Recovery at scale requires multi-day rebuilding cycles; business operations experience downtime during reimaging.',
  },
];

export default function DefenseLayersSection() {
  return (
    <section id="defense-layers" className="np-section" style={{ background: 'var(--np-bg-1)', borderTop: '1px solid var(--np-card-border)' }}>
      <div className="np-container">
        <div className="np-conceptual-badge" style={{ marginBottom: '1.5rem' }}>
          ARCHITECTURAL RESILIENCE // DEFENSIVE CONTROLS
        </div>
        <div className="np-section-num">DEFENSE // WHAT WOULD HAVE STOPPED NOTPETYA?</div>
        <h2 className="np-display np-display-md" style={{ marginBottom: '1.5rem' }}>
          MULTI-LAYERED DEFENSE: DISSECTING THE KILL CHAIN
        </h2>
        <p className="np-body-lg" style={{ maxWidth: '850px', marginBottom: '3.5rem', color: 'var(--np-white-dim)' }}>
          No single control would have stopped NotPetya. Because it was a hybrid worm utilizing supply-chain delivery, memory harvesting, remote SMB exploitation, and legitimate admin tools, only layered defense-in-depth could contain it.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem' }}>
          {DEFENSE_LAYERS.map((d, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--np-card)',
                border: '1px solid var(--np-card-border)',
                padding: '2rem',
                backdropFilter: 'blur(12px)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
                transition: 'border-color 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--np-card-border)', paddingBottom: '1rem' }}>
                <Layers size={20} color="var(--np-amber)" />
                <h3 style={{ fontFamily: 'var(--np-font-body)', fontSize: '1.05rem', fontWeight: 600, color: 'var(--np-white)' }}>
                  {d.layer}
                </h3>
              </div>

              <div>
                <div className="np-mono-sm" style={{ color: 'var(--np-red)', marginBottom: '0.35rem' }}>THREAT ADDRESSED:</div>
                <p style={{ fontSize: '0.9rem', color: 'var(--np-white-dim)', lineHeight: 1.5 }}>{d.threatAddressed}</p>
              </div>

              <div>
                <div className="np-mono-sm" style={{ color: '#4ade80', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ShieldCheck size={14} /> DEFENSIVE CONTROL:
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--np-white)', lineHeight: 1.5 }}>{d.defensiveControl}</p>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1rem', border: '1px solid var(--np-card-border)' }}>
                <div className="np-mono-sm" style={{ color: 'var(--np-white-muted)', marginBottom: '0.25rem' }}>WHY IT MATTERS:</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--np-white-dim)', lineHeight: 1.5 }}>{d.whyItMatters}</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--np-amber-light)', lineHeight: 1.5 }}>
                <AlertCircle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Limitation:</strong> {d.remainingLimitation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
