'use client';

import { motion } from 'framer-motion';
import { incidentProfile, keyFacts } from '@/data/notpetya/incident';

export default function ExecutiveOverview() {
  return (
    <section id="overview" className="np-section">
      <div className="np-container">
        <div className="np-section-num">01 / 19</div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '4rem', marginBottom: '4rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
          >
            <h2 className="np-display np-display-md" style={{ marginBottom: '2rem' }}>
              NotPetya was not ransomware.
            </h2>
            <div className="np-body-lg" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <p>
                On June 27, 2017, computer systems across Ukraine began locking up, displaying a red-and-black screen demanding $300 in Bitcoin to decrypt files. Within hours, the malware spread globally, paralyzing multinational corporations, shipping ports, and hospitals.
              </p>
              <p>
                It looked like ransomware. It functioned like a highly aggressive worm. But security researchers soon discovered a terrifying reality: the encryption was irreversible by design.
              </p>
              <p>
                NotPetya was a destructive "wiper" weapon disguised as a criminal extortion scheme. It remains one of the most economically devastating cyberattacks in recorded history.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            style={{ background: 'var(--np-bg-1)', padding: '2.5rem', border: '1px solid rgba(0,0,0,0.06)' }}
          >
            <h3 className="np-label" style={{ marginBottom: '1.5rem' }}>INCIDENT PROFILE</h3>
            <table className="np-profile-table">
              <tbody>
                <tr>
                  <td>Designation</td>
                  <td>{incidentProfile.name}</td>
                </tr>
                <tr>
                  <td>Classification</td>
                  <td className="np-text-red">{incidentProfile.classification}</td>
                </tr>
                <tr>
                  <td>Peak Activity</td>
                  <td>{incidentProfile.peakSpreading}</td>
                </tr>
                <tr>
                  <td>Initial Vector</td>
                  <td>{incidentProfile.initialVector}</td>
                </tr>
                <tr>
                  <td>Propagation</td>
                  <td>{incidentProfile.propagationMethods.join(' • ')}</td>
                </tr>
                <tr>
                  <td>Attribution</td>
                  <td className="np-text-amber">{incidentProfile.attributedActor}</td>
                </tr>
              </tbody>
            </table>
            
            <div className="np-source-tag" style={{ marginTop: '2rem' }}>
              SOURCE: MULTIPLE THREAT INTELLIGENCE REPORTS
            </div>
          </motion.div>
        </div>

        <div className="np-stat-grid">
          {keyFacts.slice(0, 4).map((fact, i) => (
            <motion.div 
              key={i} 
              className="np-stat-item"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="np-stat-value">{fact.value.split(' ')[0]}</div>
              <div className="np-stat-label">{fact.label}</div>
              <div className="np-stat-note">{fact.source}</div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="np-evidence-box critical" 
          style={{ marginTop: '3rem' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <strong>CRITICAL ASSESSMENT:</strong> The malware demanded payment to an email address that was almost immediately shut down by the provider (Posteo). Furthermore, the generated encryption key was not retained in a way that would allow the attackers to decrypt the files even if payment was made. Recovery was structurally impossible.
        </motion.div>
      </div>
    </section>
  );
}
