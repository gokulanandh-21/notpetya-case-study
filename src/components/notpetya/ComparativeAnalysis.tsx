'use client';

export default function ComparativeAnalysis() {
  return (
    <section id="comparative" className="np-section">
      <div className="np-container">
        <div className="np-section-num">16 / 19</div>
        <h2 className="np-display np-display-md" style={{ marginBottom: '1.5rem' }}>COMPARATIVE ANALYSIS</h2>
        <p className="np-body" style={{ maxWidth: '800px', marginBottom: '4rem', color: 'var(--np-white-dim)' }}>
          To understand NotPetya's unique position in cyber history, it must be compared against both the malware it imitated (Petya) and the worm that immediately preceded it (WannaCry).
        </p>

        <div style={{ overflowX: 'auto', marginBottom: '4rem' }}>
          <table className="np-compare-table" style={{ width: '100%', minWidth: '900px' }}>
            <thead>
              <tr>
                <th style={{ width: '16%' }}>DIMENSION</th>
                <th style={{ width: '28%' }}>PETYA (2016)</th>
                <th style={{ width: '28%' }}>WANNACRY (MAY 2017)</th>
                <th className="highlight" style={{ width: '28%' }}>NOTPETYA (JUNE 2017)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Classification</strong></td>
                <td>Ransomware</td>
                <td>Ransomware Worm</td>
                <td className="highlight np-text-red">Destructive Wiper (Assessment)</td>
              </tr>
              <tr>
                <td><strong>Initial Vector</strong></td>
                <td>Phishing emails (HR targeted)</td>
                <td>Internet-exposed SMB ports</td>
                <td className="highlight">M.E.Doc supply chain compromise</td>
              </tr>
              <tr>
                <td><strong>Propagation</strong></td>
                <td>None (manual execution)</td>
                <td>EternalBlue (MS17-010) only</td>
                <td className="highlight">EternalBlue + Credential theft</td>
              </tr>
              <tr>
                <td><strong>Primary Target</strong></td>
                <td>Opportunistic / General</td>
                <td>Global unpatched Windows</td>
                <td className="highlight">Ukraine (then global collateral)</td>
              </tr>
              <tr>
                <td><strong>MBR Impact</strong></td>
                <td>Encrypted (reversible)</td>
                <td>None (file encryption only)</td>
                <td className="highlight np-text-red">Overwritten (irreversible)</td>
              </tr>
              <tr>
                <td><strong>Recovery Possible</strong></td>
                <td>Yes (if paid)</td>
                <td>Yes (if patched/backed up)</td>
                <td className="highlight np-text-red">No (full rebuild required)</td>
              </tr>
              <tr>
                <td><strong>Kill Switch?</strong></td>
                <td>No</td>
                <td>Yes (unregistered domain)</td>
                <td className="highlight">No (local file check only)</td>
              </tr>
              <tr>
                <td><strong>Est. Damage</strong></td>
                <td>Limited</td>
                <td>~$4 billion</td>
                <td className="highlight np-text-red">&gt;$10 billion</td>
              </tr>
              <tr>
                <td><strong>Attribution</strong></td>
                <td>Cybercriminals (Janus)</td>
                <td>Lazarus Group (North Korea)</td>
                <td className="highlight">Sandworm / GRU Unit 74455 (Russia)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="np-evidence-box">
          <strong>THE LETHAL COMBINATION:</strong> WannaCry proved that EternalBlue could be used to create a self-propagating worm. But WannaCry was easily stopped: it had a hardcoded kill-switch domain, and it only infected unpatched machines. NotPetya learned from these mistakes. It had no network kill-switch, and by adding credential-stealing capabilities (Mimikatz + PsExec), it ensured it could spread even to systems that were fully patched against EternalBlue.
        </div>
      </div>
    </section>
  );
}
