'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

const HeroGlobe = dynamic(() => import('./3d/HeroGlobe'), {
  ssr: false,
  loading: () => <div style={{ height: '100%', background: 'var(--np-bg-solid)' }} />,
});

export default function HeroSection() {
  return (
    <section className="np-hero">
      <div className="np-hero-canvas">
        <HeroGlobe />
      </div>

      <div className="np-hero-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="np-hero-eyebrow">
            <span className="np-hero-year">2017</span>
            <div className="np-status critical">
              <div className="np-status-dot" />
              <span>UKRAINE → GLOBAL</span>
            </div>
          </div>

          <h1 className="np-hero-title">
            THE NOTPETYA
            <span className="line-2">CYBER WAR</span>
          </h1>

          <p className="np-hero-subtitle">
            How a compromised software update became one of the most destructive cyber incidents in modern history.
          </p>

          <div className="np-hero-meta">
            <div className="np-hero-meta-item">
              <span className="np-hero-meta-label">INITIAL VECTOR</span>
              <span className="np-hero-meta-value">SUPPLY-CHAIN COMPROMISE</span>
            </div>
            <div className="np-hero-meta-sep" />
            <div className="np-hero-meta-item">
              <span className="np-hero-meta-label">PROPAGATION</span>
              <span className="np-hero-meta-value">ETERNALBLUE + CREDENTIALS</span>
            </div>
            <div className="np-hero-meta-sep" />
            <div className="np-hero-meta-item">
              <span className="np-hero-meta-label">CLASSIFICATION</span>
              <span className="np-hero-meta-value">DESTRUCTIVE WIPER</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="np-scroll-cue">
        <span className="np-scroll-cue-text">SCROLL TO INVESTIGATE</span>
        <div className="np-scroll-cue-line" />
      </div>
    </section>
  );
}
