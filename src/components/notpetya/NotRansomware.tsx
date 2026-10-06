'use client';

import { whyNotRansomware } from '@/data/notpetya/incident';
import { motion } from 'framer-motion';

export default function NotRansomware() {
  return (
    <section id="not-ransomware" className="np-section" style={{ background: 'var(--np-bg-1)' }}>
      <div className="np-container">
        <div className="np-section-num">11 / 19</div>
        <h2 className="np-display np-display-md" style={{ marginBottom: '2rem' }}>NOT RANSOMWARE</h2>

        <div className="np-pullquote" style={{ marginBottom: '4rem' }}>
          "NotPetya was designed to destroy, not to extort."
          <div className="np-pullquote-cite">
            — Consensus of major threat intelligence firms, June 2017
          </div>
        </div>

        <div style={{ marginBottom: '4rem', overflowX: 'auto' }}>
          <table className="np-compare-table" style={{ width: '100%', minWidth: '800px' }}>
            <thead>
              <tr>
                <th style={{ width: '20%' }}>DIMENSION</th>
                <th style={{ width: '40%' }}>TRADITIONAL RANSOMWARE</th>
                <th className="highlight" style={{ width: '40%' }}>NOTPETYA (WIPER)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Objective</strong></td>
                <td>Financial extortion</td>
                <td className="highlight np-text-red">Infrastructure destruction (assessment)</td>
              </tr>
              <tr>
                <td><strong>Decryption Key</strong></td>
                <td>Retained by attacker; released on payment</td>
                <td className="highlight">Not retained — cryptographically irrecoverable</td>
              </tr>
              <tr>
                <td><strong>Master Boot Record</strong></td>
                <td>Usually left intact to allow OS boot and payment</td>
                <td className="highlight np-text-red">Overwritten — system rendered unbootable</td>
              </tr>
              <tr>
                <td><strong>Propagation</strong></td>
                <td>Often requires user interaction (phishing)</td>
                <td className="highlight">Multi-vector: EternalBlue + credential theft</td>
              </tr>
              <tr>
                <td><strong>Victim Selection</strong></td>
                <td>Broad, opportunistic (spray and pray)</td>
                <td className="highlight">Ukraine-focused initial vector (M.E.Doc)</td>
              </tr>
              <tr>
                <td><strong>Recovery Possible</strong></td>
                <td>Yes — via payment or offline backup</td>
                <td className="highlight np-text-red">No — full OS reinstall required</td>
              </tr>
              <tr>
                <td><strong>Payment Mechanism</strong></td>
                <td>Functional Tor site or BTC wallet</td>
                <td className="highlight">Non-functional (email shut down by Posteo)</td>
              </tr>
              <tr>
                <td><strong>Financial Motivation</strong></td>
                <td>Yes</td>
                <td className="highlight">None evident (assessment: geopolitical)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="np-display np-display-sm" style={{ marginBottom: '2rem' }}>WHY DECRYPTION WAS IMPOSSIBLE</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          {whyNotRansomware.points.map((point, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              style={{ background: 'var(--np-bg-2)', border: '1px solid rgba(0,0,0,0.08)', padding: '2rem' }}
            >
              <h4 style={{ fontFamily: 'var(--np-font-body)', fontWeight: 600, color: 'var(--np-white)', marginBottom: '1rem', fontSize: '1.1rem' }}>
                {point.title}
              </h4>
              <p style={{ color: 'var(--np-white-dim)', lineHeight: 1.6, fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                {point.detail}
              </p>
              <div className="np-source-tag">{point.source}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
