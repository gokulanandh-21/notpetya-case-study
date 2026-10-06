export default function Footer() {
  return (
    <footer style={{ 
      background: 'var(--np-bg-2)', 
      borderTop: '1px solid rgba(0,0,0,0.05)', 
      padding: '3rem 2rem',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: '2rem',
      fontFamily: 'var(--np-font-mono)',
      fontSize: '0.75rem',
      color: 'var(--np-white-muted)',
      letterSpacing: '0.05em'
    }}>
      <div>NOTPETYA CASE STUDY — ACADEMIC RESEARCH</div>
      <div style={{ textAlign: 'center' }}>FOR EDUCATIONAL PURPOSES ONLY. ALL FACTS SOURCED FROM VERIFIED PUBLIC DOCUMENTS.</div>
      <div style={{ textAlign: 'right' }}>BUILT WITH NEXT.JS 16 + THREE.JS</div>
    </footer>
  );
}
