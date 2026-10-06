'use client';

import { motion } from 'framer-motion';

const historicalContext = [
  {
    year: '2015',
    event: 'BlackEnergy Attacks',
    relevance: 'The first known successful cyberattack on a power grid, leaving 225,000 Ukrainians without electricity. Attributed to the same actor.'
  },
  {
    year: '2016',
    event: 'Industroyer (Crashoverride)',
    relevance: 'A highly sophisticated malware framework designed specifically to disrupt industrial control systems. Used against a Kyiv transmission station.'
  },
  {
    year: 'SPRING 2017',
    event: 'The Shadow Brokers Leak',
    relevance: 'A mysterious group leaked highly classified NSA exploits to the public, including EternalBlue (SMBv1 buffer overflow), which was weaponized by NotPetya.'
  },
  {
    year: 'JUNE 2017',
    event: 'Constitution Day',
    relevance: 'The attack was launched on the eve of Ukrainian Constitution Day, a public holiday, maximizing the disruptive impact when IT staff were likely out of office.'
  }
];

export default function HistoricalContext() {
  return (
    <section id="context" className="np-section" style={{ background: 'var(--np-bg-1)' }}>
      <div className="np-container">
        <div className="np-section-num">02 / 19</div>
        <h2 className="np-display np-display-md" style={{ marginBottom: '4rem' }}>HISTORICAL CONTEXT</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem' }}>
          <div className="np-body">
            <p style={{ marginBottom: '1.5rem' }}>
              The NotPetya attack did not occur in a vacuum. Since the 2014 annexation of Crimea, Ukraine has functioned as an active testing ground for state-sponsored cyber operations.
            </p>
            <p style={{ marginBottom: '1.5rem' }}>
              The attackers required a mechanism to distribute their payload widely within Ukraine. They found the perfect vehicle in <strong>M.E.Doc</strong> (Me Doc), an accounting software package. M.E.Doc was practically ubiquitous in Ukraine because it was one of only two software options approved by the Ukrainian government for submitting corporate tax documents. 
            </p>
            <p style={{ marginBottom: '1.5rem' }}>
              By compromising the update servers of this single trusted software vendor, the attackers gained administrative execution capabilities across the majority of Ukrainian corporate networks. This is the devastating nature of a supply-chain compromise: the victim willingly downloads and executes the malware, trusting it as a legitimate vendor update.
            </p>

            <div className="np-evidence-box" style={{ marginTop: '2.5rem' }}>
              <strong>PRECURSOR OPERATIONS:</strong> The threat actor assessed to be behind NotPetya (Sandworm) had previously targeted Ukraine with highly sophisticated, destructive attacks, most notably the BlackEnergy (2015) and Industroyer (2016) attacks which caused power outages in the dead of winter.
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '16px', top: '10px', bottom: '10px', width: '1px', background: 'var(--np-red-border)' }} />
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
              {historicalContext.map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ delay: idx * 0.15 }}
                  style={{ position: 'relative', paddingLeft: '3rem' }}
                >
                  <div style={{ 
                    position: 'absolute', 
                    left: '12px', 
                    top: '6px', 
                    width: '9px', 
                    height: '9px', 
                    borderRadius: '50%', 
                    background: 'var(--np-red)',
                    boxShadow: '0 0 10px var(--np-red)'
                  }} />
                  <div className="np-label np-text-red" style={{ marginBottom: '0.5rem' }}>{item.year}</div>
                  <h4 style={{ fontFamily: 'var(--np-font-body)', fontSize: '1.1rem', fontWeight: 600, color: 'var(--np-white)', marginBottom: '0.5rem' }}>
                    {item.event}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--np-white-dim)', lineHeight: 1.6 }}>
                    {item.relevance}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
