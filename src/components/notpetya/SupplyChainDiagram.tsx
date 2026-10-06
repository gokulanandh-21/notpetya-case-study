'use client';

import { useState } from 'react';
import { attackChain } from '@/data/notpetya/attackChain';
import { motion, AnimatePresence } from 'framer-motion';

const supplyChainNodes = [
  {
    id: 'node1',
    title: 'M.E.DOC UPDATE SERVER',
    status: 'COMPROMISED INFRASTRUCTURE',
    statusClass: 'critical',
    desc: 'Attackers gain access to the vendor\'s update mechanism.',
    connector: 'BACKDOOR DEPLOYED',
    detail: 'Months before the attack, the threat actor breached the infrastructure of Intellect Service (makers of M.E.Doc). They successfully inserted a backdoor into the source code of the software update mechanism itself.',
    evidence: 'ESET researchers discovered the backdoor code which collected organization tax IDs (EDRPOU codes) and allowed arbitrary code execution.',
  },
  {
    id: 'node2',
    title: 'MALICIOUS UPDATE PACKAGE',
    status: 'WEAPONIZED SOFTWARE',
    statusClass: 'critical',
    desc: 'Legitimate certificate used to sign malicious payload.',
    connector: 'AUTO-UPDATE PROCESS',
    detail: 'The update containing NotPetya was digitally signed using the legitimate M.E.Doc cryptographic certificate. This is the hallmark of a high-tier supply-chain attack: the payload bypassed standard security controls because it arrived signed by a trusted vendor.',
    evidence: 'Digital signature analysis confirmed the malicious update was signed with the valid Intellect Service certificate.',
  },
  {
    id: 'node3',
    title: 'VICTIM ORGANIZATION',
    status: 'ANY M.E.DOC USER',
    statusClass: 'warning',
    desc: 'Target organization downloads the trusted update.',
    connector: 'SYSTEM EXECUTION',
    detail: 'Target organizations in Ukraine, or international companies with Ukrainian branches, downloaded the update automatically as part of normal IT operations. The software was mandatory for Ukrainian tax compliance.',
    evidence: 'Traffic analysis showed affected organizations communicating with updat[.]me-doc[.]com[.]ua immediately prior to infection.',
  },
  {
    id: 'node4',
    title: 'NOTPETYA PAYLOAD',
    status: 'SYSTEM PRIVILEGES ACQUIRED',
    statusClass: 'critical',
    desc: 'Malware inherits the updater\'s high privileges.',
    connector: null,
    detail: 'Because software updaters require deep system access to install files, M.E.Doc ran with elevated privileges. The NotPetya payload inherited these SYSTEM-level privileges, giving it the necessary permissions to harvest credentials, scan the network, and overwrite the Master Boot Record.',
    evidence: 'Malware analysis by Cisco Talos and others confirmed NotPetya executed as a child process of the M.E.Doc updater (ezvit.exe).',
  }
];

export default function SupplyChainDiagram() {
  const [activeNode, setActiveNode] = useState('node1');
  
  const activeData = supplyChainNodes.find(n => n.id === activeNode) || supplyChainNodes[0];

  return (
    <section id="supply-chain" className="np-section">
      <div className="np-container">
        <div className="np-conceptual-badge" style={{ marginBottom: '2rem' }}>SUPPLY-CHAIN ATTACK VISUALIZATION</div>
        <div className="np-section-num">03 / 19</div>
        <h2 className="np-display np-display-md" style={{ marginBottom: '4rem' }}>THE INITIAL COMPROMISE</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem' }}>
          
          {/* LEFT: DIAGRAM */}
          <div className="np-chain-diagram">
            {supplyChainNodes.map((node, idx) => (
              <div key={node.id}>
                <div 
                  className={`np-diagram-node ${activeNode === node.id ? 'active' : ''} ${(idx === 0 || idx === 1) ? 'compromised' : ''}`}
                  onClick={() => setActiveNode(node.id)}
                >
                  <div className={`np-status ${node.statusClass}`} style={{ marginBottom: '0.5rem' }}>
                    <div className="np-status-dot" />
                    {node.status}
                  </div>
                  <h4 style={{ fontFamily: 'var(--np-font-body)', fontWeight: 600, color: 'var(--np-white)' }}>{node.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--np-white-dim)', marginTop: '0.5rem' }}>{node.desc}</p>
                </div>
                
                {node.connector && (
                  <div className="np-diagram-connector">
                    <div className={`np-diagram-connector-line ${idx === 0 || idx === 1 ? 'infected' : ''}`} />
                    <div className="np-mono-sm" style={{ paddingLeft: '1.5rem', color: idx === 0 || idx === 1 ? 'var(--np-red)' : 'var(--np-white-muted)' }}>
                      ↓ {node.connector}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* RIGHT: DETAIL PANEL */}
          <div>
            <div style={{ position: 'sticky', top: '120px', background: 'var(--np-bg-2)', border: '1px solid rgba(0,0,0,0.08)', padding: '2.5rem' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeNode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={`np-status ${activeData.statusClass}`} style={{ marginBottom: '1rem' }}>
                    <div className="np-status-dot" />
                    {activeData.status}
                  </div>
                  <h3 className="np-display np-display-sm" style={{ marginBottom: '1.5rem' }}>{activeData.title}</h3>
                  <p className="np-body" style={{ marginBottom: '2rem' }}>{activeData.detail}</p>
                  
                  <div className="np-evidence-box">
                    <strong>EVIDENCE:</strong> {activeData.evidence}
                  </div>
                  
                  <div className="np-source-tag" style={{ marginTop: '1.5rem' }}>
                    ATT&CK T1195.002: COMPROMISE SOFTWARE SUPPLY CHAIN
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
