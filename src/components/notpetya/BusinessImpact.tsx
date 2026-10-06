'use client';

import { motion } from 'framer-motion';

const damageFigures = [
  { company: 'Merck & Co.', amount: 870, label: '$870M', note: 'Pharmaceutical production halted. Sourced from SEC filings.' },
  { company: 'FedEx (TNT Express)', amount: 400, label: '~$400M', note: 'European logistics network severely disrupted.' },
  { company: 'Saint-Gobain', amount: 384, label: '~$384M', note: 'French construction materials manufacturer.' },
  { company: 'Maersk', amount: 300, label: '~$300M', note: 'Global shipping operations frozen for 10 days.' },
  { company: 'Mondelez', amount: 100, label: '~$100M', note: 'Food and beverage manufacturer.' },
];

const MAX_AMOUNT = 900;

export default function BusinessImpact() {
  return (
    <section id="business-impact" className="np-section">
      <div className="np-container">
        <div className="np-section-num">10 / 19</div>
        <h2 className="np-display np-display-md" style={{ marginBottom: '4rem' }}>BUSINESS IMPACT</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '5rem' }}>
          <div>
            <h3 className="np-label" style={{ color: 'var(--np-white)', marginBottom: '1rem' }}>TECHNICAL IMPACT</h3>
            <ul style={{ color: 'var(--np-white-dim)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '1.2rem' }}>
              <li>Master Boot Records overwritten</li>
              <li>Master File Tables encrypted</li>
              <li>Domain Controllers destroyed</li>
              <li>Virtualization infrastructure offline</li>
              <li>Network switches and routers unreachable</li>
            </ul>
          </div>
          <div style={{ paddingLeft: '2rem', borderLeft: '1px solid rgba(0,0,0,0.1)' }}>
            <h3 className="np-label" style={{ color: 'var(--np-amber)', marginBottom: '1rem' }}>BUSINESS CONSEQUENCE</h3>
            <ul style={{ color: 'var(--np-white-dim)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingLeft: '1.2rem' }}>
              <li>Total operational shutdown</li>
              <li>Supply chain paralysis</li>
              <li>Manufacturing line stoppage</li>
              <li>Total infrastructure replacement cost</li>
              <li>Lost revenue during weeks of recovery</li>
            </ul>
          </div>
        </div>

        <div style={{ background: 'var(--np-bg-2)', padding: '3rem', border: '1px solid rgba(0,0,0,0.05)', marginBottom: '4rem' }}>
          <h3 className="np-label" style={{ marginBottom: '2rem' }}>ESTIMATED FINANCIAL LOSSES (VERIFIED PUBLIC REPORTS)</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {damageFigures.map((fig, idx) => (
              <div key={fig.company} style={{ position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <div style={{ fontFamily: 'var(--np-font-body)', fontWeight: 600, color: 'var(--np-white)' }}>{fig.company}</div>
                  <div style={{ fontFamily: 'var(--np-font-mono)', color: 'var(--np-red)' }}>{fig.label}</div>
                </div>
                
                <div style={{ width: '100%', height: '12px', background: 'rgba(0,0,0,0.05)', borderRadius: '0' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(fig.amount / MAX_AMOUNT) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                    style={{ height: '100%', background: 'var(--np-red)' }}
                  />
                </div>
                
                <div style={{ fontSize: '0.8rem', color: 'var(--np-white-muted)', marginTop: '0.5rem' }}>
                  {fig.note}
                </div>
              </div>
            ))}
          </div>

          <div className="np-evidence-box warning" style={{ marginTop: '3rem' }}>
            <strong>GLOBAL ASSESSMENT:</strong> In February 2018, the US White House formally assessed that NotPetya caused <strong>over $10 billion</strong> in total global damages, making it the most destructive and costly cyberattack in history.
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
          <div>
            <h4 style={{ color: 'var(--np-white)', marginBottom: '1rem', fontFamily: 'var(--np-font-body)' }}>Operational Shutdown</h4>
            <p style={{ color: 'var(--np-white-dim)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              When a company's entire Active Directory environment is destroyed simultaneously, business operations cease instantly. At Maersk, staff were unable to process shipping manifests, open terminal gates, or even communicate via email. They were forced to use WhatsApp and personal Gmail accounts to coordinate global shipping.
            </p>
          </div>
          <div>
            <h4 style={{ color: 'var(--np-white)', marginBottom: '1rem', fontFamily: 'var(--np-font-body)' }}>Supply-Chain Ripple Effects</h4>
            <p style={{ color: 'var(--np-white-dim)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              Because modern logistics are deeply interconnected, the destruction of one company's IT systems ripples outward. When Maersk's terminals froze, ships from other companies could not dock. When TNT Express went down, critical supply chains across Europe halted.
            </p>
          </div>
          <div>
            <h4 style={{ color: 'var(--np-white)', marginBottom: '1rem', fontFamily: 'var(--np-font-body)' }}>Infrastructure Replacement</h4>
            <p style={{ color: 'var(--np-white-dim)', lineHeight: 1.6, fontSize: '0.95rem' }}>
              Because NotPetya destroyed the Master Boot Record and was fundamentally unrecoverable, organizations could not simply decrypt and reboot. Maersk had to completely reinstall 4,000 servers, 45,000 PCs, and 2,500 applications across 130 countries in just ten days.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
