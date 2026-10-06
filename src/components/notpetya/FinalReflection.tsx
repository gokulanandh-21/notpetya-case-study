'use client';

export default function FinalReflection() {
  return (
    <section id="reflection" className="np-section" style={{ background: 'var(--np-bg-1)', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
      <div className="np-container-narrow">
        <div className="np-section-num">18 / 19</div>
        
        <div className="np-pullquote" style={{ marginTop: '2rem', marginBottom: '5rem', fontSize: '1.8rem', textAlign: 'center' }}>
          "The most consequential attacks are not always those that steal the most data. Sometimes the objective is silence. Sometimes it is disruption. NotPetya demonstrated that a single compromised software update could silence a tenth of the global economy's shipping capacity overnight."
        </div>

        <h2 className="np-display np-display-md" style={{ marginBottom: '2rem', textAlign: 'center' }}>WHAT NOTPETYA CHANGED</h2>
        
        <ul style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.5rem', 
          color: 'var(--np-white-dim)', 
          fontSize: '1.05rem', 
          lineHeight: 1.6,
          maxWidth: '700px',
          margin: '0 auto 5rem auto',
          paddingLeft: '1.5rem'
        }}>
          <li><strong>Board-Level Governance:</strong> Enterprise patch management and offline backup strategies were elevated from IT operational tasks to board-level risk metrics.</li>
          <li><strong>Supply-Chain Awareness:</strong> Software supply-chain security was recognized as a critical, hard-to-defend attack surface, foreshadowing incidents like SolarWinds.</li>
          <li><strong>Economic Validation:</strong> The concept of "cyber warfare" received real-world economic validation, proving that digital weapons could cause physical-world economic damage on par with natural disasters.</li>
          <li><strong>Diplomatic Mechanisms:</strong> Coordinated international attribution (where multiple governments simultaneously point the finger at a specific state actor) became a standard diplomatic tool.</li>
          <li><strong>Insurance Restructuring:</strong> The cyber insurance market was fundamentally restructured, with major underwriters enforcing strict exclusion clauses for state-sponsored acts of cyber war.</li>
        </ul>

        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ width: '40px', height: '2px', background: 'var(--np-red)', margin: '0 auto 2rem auto' }} />
          <p className="np-body-lg" style={{ color: 'var(--np-white)' }}>
            NotPetya remains, by most assessments, the single most economically destructive cyberattack in recorded history. Its lessons continue to shape enterprise security architecture, government cyber policy, and the evolving norms of state behavior in cyberspace.
          </p>
        </div>
      </div>
    </section>
  );
}
