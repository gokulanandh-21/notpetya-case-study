'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const NetworkSim = dynamic(() => import('./3d/NetworkSim').then(m => ({ default: m.default })), {
  ssr: false,
  loading: () => (
    <div style={{ width: '100%', height: '100%', background: 'var(--np-bg-solid)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: 'var(--np-font-mono)', fontSize: '0.7rem', color: 'var(--np-white-muted)', letterSpacing: '0.2em' }}>
        LOADING SIMULATION...
      </span>
    </div>
  )
});

export default function PropagationSim() {
  const [simState, setSimState] = useState<'idle' | 'running' | 'paused' | 'complete'>('idle');
  const [simTime, setSimTime] = useState(0);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedLabel, setSelectedLabel] = useState<string>('');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (simState === 'running') {
      interval = setInterval(() => {
        setSimTime(t => {
          if (t >= 21) {
            setSimState('complete');
            return 21;
          }
          return t + 0.1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [simState]);

  const handleNodeClick = (id: string, label: string) => {
    setSelectedNode(id);
    setSelectedLabel(label);
  };

  const getNarrative = () => {
    if (simTime === 0 && simState === 'idle') return "Ready to simulate propagation.";
    if (simTime < 2) return "Patient Zero infected via M.E.Doc software update. Malware executes with SYSTEM privileges.";
    if (simTime < 4) return "Credential harvesting begins. Modified Mimikatz extracts NTLM hashes from LSASS memory.";
    if (simTime < 8) return "EternalBlue propagation: SMB port 445 scanning. Unpatched workstations compromised.";
    if (simTime < 12) return "Credential-based lateral movement: PsExec and WMIC used with harvested credentials. Patched systems compromised.";
    if (simTime < 16) return "Domain Controller compromised. Full network access achieved. Scheduled reboot task created.";
    if (simTime < 21) return "DESTRUCTIVE PAYLOAD: MBR overwriting and MFT encryption underway. Systems unbootable on restart.";
    return "SIMULATION COMPLETE. All systems destroyed. Recovery: not possible without full rebuild.";
  };

  return (
    <section id="simulation" className="np-section">
      <div className="np-container">
        <div className="np-conceptual-badge" style={{ marginBottom: '2rem' }}>
          CONCEPTUAL VISUALIZATION — Based on documented NotPetya propagation techniques. Not a literal reproduction of any victim network.
        </div>
        <div className="np-section-num">07 / 19</div>
        <h2 className="np-display np-display-md" style={{ marginBottom: '3rem' }}>PROPAGATION SIMULATION</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '65% 35%', gap: '2rem', height: '600px' }}>
          {/* LEFT: CANVAS */}
          <div style={{ position: 'relative', border: '1px solid rgba(0,0,0,0.1)' }}>
            <NetworkSim 
              simTime={simTime} 
              onNodeClick={handleNodeClick} 
              selectedNode={selectedNode} 
            />
            {/* Progress bar */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'rgba(0,0,0,0.5)' }}>
              <div style={{ height: '100%', background: 'var(--np-red)', width: `${(simTime / 21) * 100}%`, transition: 'width 0.1s linear' }} />
            </div>
          </div>

          {/* RIGHT: CONTROLS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1.5rem', background: 'var(--np-bg-1)' }}>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => setSimState('running')} 
                disabled={simState === 'running' || simState === 'complete'}
                style={{ flex: 1, padding: '0.75rem', background: 'var(--np-bg-3)', color: 'var(--np-white)', border: '1px solid var(--np-red-border)', fontFamily: 'var(--np-font-mono)', cursor: 'pointer' }}
              >
                SIMULATE
              </button>
              <button 
                onClick={() => setSimState(simState === 'paused' ? 'running' : 'paused')}
                disabled={simState === 'idle' || simState === 'complete'}
                style={{ flex: 1, padding: '0.75rem', background: 'transparent', color: 'var(--np-white)', border: '1px solid rgba(0,0,0,0.2)', fontFamily: 'var(--np-font-mono)', cursor: 'pointer' }}
              >
                {simState === 'paused' ? 'RESUME' : 'PAUSE'}
              </button>
              <button 
                onClick={() => { setSimState('idle'); setSimTime(0); setSelectedNode(null); }}
                style={{ flex: 1, padding: '0.75rem', background: 'transparent', color: 'var(--np-white-dim)', border: '1px solid rgba(0,0,0,0.1)', fontFamily: 'var(--np-font-mono)', cursor: 'pointer' }}
              >
                RESET
              </button>
            </div>

            <div style={{ padding: '1rem', border: '1px solid rgba(0,0,0,0.05)', background: 'var(--np-bg-solid)' }}>
              <h4 className="np-label" style={{ marginBottom: '1rem' }}>STATE LEGEND</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.8rem', fontFamily: 'var(--np-font-mono)', color: 'var(--np-white-dim)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{width:'10px',height:'10px',background:'#1e3448'}}/> CLEAN</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{width:'10px',height:'10px',background:'#8b3820'}}/> INFECTING</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{width:'10px',height:'10px',background:'#dc2626'}}/> COMPROMISED</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{width:'10px',height:'10px',background:'#991b1b'}}/> ENCRYPTING</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{width:'10px',height:'10px',background:'#120808',border:'1px solid #444'}}/> DESTROYED</div>
              </div>
            </div>

            <div style={{ flex: 1, padding: '1.5rem', background: 'var(--np-bg-2)', borderLeft: '2px solid var(--np-red)' }}>
              <div className="np-label np-text-red" style={{ marginBottom: '1rem' }}>T + 00:0{Math.floor(simTime)}:{Math.floor((simTime % 1) * 60).toString().padStart(2, '0')}</div>
              <p className="np-body" style={{ fontSize: '0.95rem' }}>{getNarrative()}</p>
            </div>

            {selectedNode && (
              <div style={{ padding: '1rem', background: 'var(--np-bg-solid)', border: '1px solid rgba(0,0,0,0.1)' }}>
                <div className="np-label" style={{ marginBottom: '0.5rem' }}>SELECTED NODE</div>
                <div style={{ color: 'var(--np-white)', fontFamily: 'var(--np-font-mono)' }}>{selectedLabel}</div>
                <div style={{ color: 'var(--np-white-dim)', fontSize: '0.8rem', marginTop: '0.25rem' }}>ID: {selectedNode}</div>
              </div>
            )}
            {!selectedNode && (
              <div style={{ padding: '1rem', background: 'var(--np-bg-solid)', border: '1px dashed rgba(0,0,0,0.1)', color: 'var(--np-white-muted)', fontSize: '0.85rem', textAlign: 'center' }}>
                Click a node to inspect
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
