'use client';

import { useState, useEffect } from 'react';

const navLinks = [
  { label: 'Overview', href: '#overview' },
  { label: 'Attack', href: '#attack' },
  { label: 'Impact', href: '#impact' },
  { label: 'Investigation', href: '#investigation' },
  { label: 'Lessons', href: '#lessons' },
  { label: 'Sources', href: '#sources' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 80);

      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docH > 0 ? (scrollY / docH) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Progress bar */}
      <div
        className="np-progress"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
      />

      <nav className={`np-nav${scrolled ? ' scrolled' : ''}`} aria-label="Case study navigation">
        <a href="#overview" className="np-nav-logo" aria-label="NotPetya Case Study — return to top">
          <span className="np-nav-logo-mark" aria-hidden="true" />
          NOTPETYA / CASE STUDY
        </a>

        {/* Desktop links */}
        <ul className="np-nav-links" role="list">
          {navLinks.map(link => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="np-nav-mobile-toggle"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          style={{
            display: 'none',
            background: 'none',
            border: '1px solid rgba(0,0,0,0.12)',
            color: 'var(--np-white-dim)',
            padding: '0.4rem 0.75rem',
            fontFamily: 'var(--np-font-mono)',
            fontSize: '0.65rem',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            textTransform: 'uppercase',
          }}
        >
          {menuOpen ? 'CLOSE' : 'MENU'}
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '60px',
            left: 0,
            right: 0,
            background: 'rgba(8,8,8,0.97)',
            borderBottom: '1px solid rgba(0,0,0,0.06)',
            zIndex: 99,
            padding: '1.5rem',
          }}
        >
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {navLinks.map(link => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    fontFamily: 'var(--np-font-body)',
                    fontSize: '1rem',
                    color: 'var(--np-white-dim)',
                    textDecoration: 'none',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
