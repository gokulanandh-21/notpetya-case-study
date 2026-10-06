'use client';

const preventionItems = [
  {
    num: "01",
    title: "Apply MS17-010 Immediately",
    level: "CRITICAL",
    desc: "Patch Windows SMB. NotPetya's primary exploit was publicly patched months before the attack. Organizations that applied MS17-010 could not be reached via EternalBlue."
  },
  {
    num: "02",
    title: "Disable SMBv1 Protocol",
    level: "CRITICAL",
    desc: "SMBv1 is a legacy protocol with no modern use case. Microsoft recommends disabling it entirely. Without SMBv1, EternalBlue cannot function."
  },
  {
    num: "03",
    title: "Offline, Immutable Backups",
    level: "CRITICAL",
    desc: "Backups must be disconnected from the network. NotPetya would have infected and destroyed network-accessible backup systems. Offline backups are the only recovery path."
  },
  {
    num: "04",
    title: "Network Segmentation",
    level: "HIGH",
    desc: "Limit SMB traffic between network segments. Internal firewalls prevent lateral EternalBlue propagation across subnet boundaries."
  },
  {
    num: "05",
    title: "Windows Credential Guard",
    level: "HIGH",
    desc: "Protects LSASS memory from credential dumping attacks like the Mimikatz component NotPetya used."
  },
  {
    num: "06",
    title: "Restrict Administrative Shares",
    level: "HIGH",
    desc: "Limit who can access ADMIN$ and C$ shares. NotPetya used these for PsExec-based propagation."
  },
  {
    num: "07",
    title: "Endpoint Detection & Response",
    level: "HIGH",
    desc: "Behavior-based EDR can detect LSASS access, MBR writes, and mass file modification even without specific malware signatures."
  },
  {
    num: "08",
    title: "Privileged Access Management",
    level: "HIGH",
    desc: "Limit which accounts have domain-wide administrative access. Stolen high-privilege credentials dramatically amplify damage."
  },
  {
    num: "09",
    title: "Application Allowlisting",
    level: "MEDIUM",
    desc: "Prevents unauthorized executables from running. Would have blocked perfc.dat execution in many configurations."
  },
  {
    num: "10",
    title: "Supply-Chain Verification",
    level: "MEDIUM",
    desc: "Vet software vendors' security practices. Monitor update processes for unusual network activity (like an updater scanning port 445)."
  },
  {
    num: "11",
    title: "Incident Response Playbooks",
    level: "MEDIUM",
    desc: "Have a tested playbook for wiper malware before an incident. The response window is extremely narrow—decisions must be made in minutes."
  },
  {
    num: "12",
    title: "Business Continuity Planning",
    level: "MEDIUM",
    desc: "Know how the organization operates with zero systems. Maersk had to manually coordinate ship movements for weeks using whiteboards and WhatsApp."
  }
];

export default function Prevention() {
  return (
    <section id="prevention" className="np-section" style={{ background: 'var(--np-bg-1)' }}>
      <div className="np-container">
        <div className="np-section-num">15 / 19</div>
        <h2 className="np-display np-display-md" style={{ marginBottom: '1.5rem' }}>PREVENTION & ARCHITECTURE</h2>
        <p className="np-body" style={{ maxWidth: '800px', marginBottom: '4rem', color: 'var(--np-white-dim)' }}>
          NotPetya exposed critical gaps in enterprise security. Most organizations affected had at least one of these controls missing, allowing the malware to gain a foothold and spread.
        </p>

        <div className="np-prevent-grid">
          {preventionItems.map((item) => (
            <div key={item.num} className="np-prevent-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div className="np-mono-sm" style={{ color: 'var(--np-white-muted)' }}>{item.num}</div>
                <div className={`np-badge np-badge-${item.level.toLowerCase()}`}>{item.level}</div>
              </div>
              <h3 style={{ fontFamily: 'var(--np-font-body)', fontWeight: 600, fontSize: '1.1rem', color: 'var(--np-white)', marginBottom: '1rem' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--np-white-dim)', lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
