// NotPetya Incident Core Data
// Sources: WIRED, Sandworm (Andy Greenberg), CISA, UK NCSC, Microsoft, Cisco Talos

export const incidentProfile = {
  name: 'NotPetya',
  classification: 'Destructive Malware / Cyberweapon (Wiper)',
  firstDetected: 'June 27, 2017',
  peakSpreading: 'June 27–28, 2017',
  primaryRegion: 'Ukraine',
  globalSpread: true,
  initialVector: 'M.E.Doc software supply-chain compromise',
  propagationMethods: ['EternalBlue (MS17-010)', 'EternalRomance (MS17-010)', 'Mimikatz credential theft', 'PsExec', 'WMIC'],
  primaryImpact: 'Irreversible disk encryption / MBR destruction',
  estimatedDamage: '$10 billion+ (US government estimate; widely reported)',
  estimatedDamageNote: 'The White House in February 2018 attributed this damage figure. Some estimates vary.',
  ransomDemand: '$300 in Bitcoin (per infected machine)',
  recoveryImpossible: true,
  recoveryNote: 'The decryption key mechanism was non-functional; recovery was not designed into the malware.',
  attributedActor: 'Sandworm Team (GRU Unit 74455)',
  attributionSource: 'US DOJ (February 2020 indictment), UK NCSC, Australian Cyber Security Centre, Canadian Centre for Cyber Security',
  attributionCaveats: 'Attribution is a government assessment based on technical evidence and intelligence. Russia denied involvement.',
  affectedCountries: ['Ukraine', 'Russia', 'United States', 'France', 'Germany', 'United Kingdom', 'Denmark', 'Norway', 'Australia', 'India', 'Poland'],
};

export const keyFacts = [
  {
    label: 'Date of Major Outbreak',
    value: 'June 27, 2017',
    source: 'Multiple contemporaneous reports',
  },
  {
    label: 'Estimated Global Damage',
    value: 'Over \$10 billion',
    source: 'White House briefing, February 15, 2018; Wired, Andy Greenberg',
  },
  {
    label: 'Initial Infection Vector',
    value: 'M.E.Doc accounting software update',
    source: 'ESET Research, Cisco Talos, Microsoft Security',
  },
  {
    label: 'Exploit Used',
    value: 'EternalBlue / EternalRomance (MS17-010)',
    source: 'Microsoft Security Response Center, MITRE ATT&CK',
  },
  {
    label: 'Maersk Systems Lost',
    value: '~45,000 PCs, 4,000 servers, 2,500 applications',
    source: 'Maersk Chairman Jim Hagemann Snabe, Davos 2018 (reported by Wired)',
  },
  {
    label: 'Merck Estimated Loss',
    value: '\$870 million (production, operations, remediation)',
    source: 'Merck 2017 annual report; widely reported',
  },
  {
    label: 'Attribution',
    value: 'GRU (Russian military intelligence), Sandworm Team',
    source: 'US DOJ indictment (October 2020), UK NCSC, US CISA',
  },
];

export const affectedOrganizations = [
  {
    name: 'Maersk',
    sector: 'Shipping / Logistics',
    country: 'Denmark',
    impact: 'Lost approximately 45,000 PCs and 4,000 servers. Unable to process shipping orders for days. Estimated \$200–300 million loss.',
    source: 'Andy Greenberg, WIRED (2018); Maersk Davos statement',
    lat: 55.676,
    lng: 12.568,
  },
  {
    name: 'Merck (Pharmaceuticals)',
    sector: 'Pharmaceutical',
    country: 'United States',
    impact: 'Production disrupted; unable to manufacture certain drugs. Estimated \$870 million total impact.',
    source: 'Merck 2017 Annual Report',
    lat: 40.714,
    lng: -74.006,
  },
  {
    name: 'FedEx (TNT Express)',
    sector: 'Logistics',
    country: 'United States',
    impact: 'TNT Express (FedEx subsidiary) severely disrupted. Some systems never fully recovered. Estimated \$400 million loss.',
    source: 'FedEx SEC Filing Q4 2017; widely reported',
    lat: 35.149,
    lng: -90.048,
  },
  {
    name: 'Mondelez International',
    sector: 'Food / Manufacturing',
    country: 'United States',
    impact: 'Global operations disrupted. Estimated \$100 million in damages.',
    source: 'Mondelez SEC filings; widely reported',
    lat: 41.878,
    lng: -87.629,
  },
  {
    name: 'Rosneft',
    sector: 'Energy / Oil',
    country: 'Russia',
    impact: 'Major Russian oil company hit; operations temporarily disrupted.',
    source: 'Reuters, June 27, 2017; Rosneft statements',
    lat: 55.755,
    lng: 37.617,
  },
  {
    name: 'Chernobyl Nuclear Power Plant',
    sector: 'Critical Infrastructure / Nuclear',
    country: 'Ukraine',
    impact: 'Radiation monitoring systems went offline. Staff resorted to manual monitoring. No radiation leak occurred.',
    source: 'Ukrainian government statements; widely reported',
    lat: 51.389,
    lng: 30.099,
  },
  {
    name: 'Ukrainian Central Bank',
    sector: 'Financial',
    country: 'Ukraine',
    impact: 'Multiple Ukrainian banks affected. The National Bank of Ukraine issued warnings about cyberattacks.',
    source: 'National Bank of Ukraine statement, June 27, 2017',
    lat: 50.450,
    lng: 30.524,
  },
  {
    name: "Kyiv Boryspil International Airport",
    sector: 'Transportation / Infrastructure',
    country: 'Ukraine',
    impact: 'Airport systems affected; departure boards failed.',
    source: 'Widely reported; Ukrainian media',
    lat: 50.345,
    lng: 30.894,
  },
  {
    name: 'Saint-Gobain',
    sector: 'Construction / Manufacturing',
    country: 'France',
    impact: 'Global construction materials company affected. Estimated \$384 million impact.',
    source: 'Saint-Gobain financial reports; widely reported',
    lat: 48.856,
    lng: 2.352,
  },
  {
    name: 'Heritage Valley Health System',
    sector: 'Healthcare',
    country: 'United States',
    impact: 'Hospital systems disrupted in Western Pennsylvania. Operations affected.',
    source: 'US-CERT Alert AA17-181A; widely reported',
    lat: 40.441,
    lng: -79.995,
  },
];

export const whyNotRansomware = {
  headline: 'NotPetya was designed to destroy, not to extort.',
  points: [
    {
      title: 'No functional decryption key mechanism',
      detail: 'The ransomware demanded payment to an email address that email provider Posteo shut down before victims could even send payment confirmations. The MFT (Master File Table) encryption key was never stored in a recoverable way. Recovery was structurally impossible.',
      source: 'Kaspersky Lab analysis (June 27, 2017); ESET Research',
    },
    {
      title: 'MBR overwrite was the primary objective',
      detail: 'NotPetya overwrote the Master Boot Record (MBR) with a custom bootloader that displayed a ransom demand on reboot. This prevented the operating system from loading regardless of payment.',
      source: 'Malware analysis by Kaspersky, Bitdefender, Microsoft',
    },
    {
      title: 'Targeted infrastructure, not random victims',
      detail: 'The initial deployment through M.E.Doc — accounting software used primarily by Ukrainian businesses — suggests deliberate targeting of Ukrainian economic infrastructure, not a financially motivated global campaign.',
      source: 'ESET Research; Microsoft Security Blog',
    },
    {
      title: 'Destructive capability exceeded any ransomware operational need',
      detail: 'NotPetya spread laterally even within networks that had no exposed internet SMB. It used stolen credentials to move to systems that EternalBlue could not reach. This level of sophistication is inconsistent with simple financial extortion.',
      source: 'Cisco Talos analysis; US-CERT; MITRE ATT&CK',
    },
  ],
};
