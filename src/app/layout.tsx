import type { Metadata } from 'next';
import './globals.css';
import './notpetya.css';

export const metadata: Metadata = {
  title: 'The NotPetya Cyber War — Interactive Case Study',
  description:
    'An in-depth interactive case study examining the NotPetya cyberattack of 2017: supply-chain compromise, technical analysis, global impact, attribution, and lessons learned.',
  keywords: [
    'NotPetya', 'cyberattack', 'cybersecurity', 'case study', 'EternalBlue',
    'M.E.Doc', 'Sandworm', 'GRU', 'cyberwar', 'ransomware', 'wiper malware',
    'MITRE ATT&CK', 'MS17-010', 'Ukraine', '2017',
  ],
  openGraph: {
    title: 'The NotPetya Cyber War — Interactive Case Study',
    description: 'How a compromised software update became one of the most destructive cyber incidents in modern history.',
    type: 'website',
  },
};

export default function NotPetyaLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
