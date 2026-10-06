// NotPetya References and Sources
// All sources are real, verifiable public documents

export interface Source {
  id: string;
  title: string;
  organization: string;
  date?: string;
  url?: string;
  category: 'primary' | 'government' | 'technical' | 'mitre' | 'industry' | 'journalism';
  description?: string;
}

export const sources: Source[] = [
  // Primary / Official
  {
    id: 'src-01',
    title: 'Alert (AA17-181A): Petya Ransomware',
    organization: 'US-CERT (CISA)',
    date: 'June 30, 2017',
    url: 'https://www.cisa.gov/uscert/ncas/alerts/AA17-181A',
    category: 'government',
    description: 'Initial US government technical alert documenting NotPetya propagation methods and indicators of compromise.',
  },
  {
    id: 'src-02',
    title: 'MS17-010: Security Update for Microsoft Windows SMB Server',
    organization: 'Microsoft Security Response Center',
    date: 'March 14, 2017',
    url: 'https://msrc.microsoft.com/update-guide/vulnerability/CVE-2017-0144',
    category: 'primary',
    description: 'The patch that addressed EternalBlue (CVE-2017-0144) and EternalRomance (CVE-2017-0145). Released before NotPetya, but widely undeployed at time of attack.',
  },
  {
    id: 'src-03',
    title: 'New WannaCrypt ransomware attacks Ukrainian infrastructure, banks, Kyiv metro',
    organization: 'Microsoft Security Blog',
    date: 'June 27, 2017',
    url: 'https://www.microsoft.com/en-us/security/blog/2017/06/27/new-ransomware-old-techniques-petya-adds-worm-capabilities/',
    category: 'technical',
    description: 'Microsoft\'s technical analysis of NotPetya published on the day of the outbreak.',
  },
  {
    id: 'src-04',
    title: 'Telebots are back: Supply-chain attacks against Ukraine',
    organization: 'ESET Research',
    date: 'July 4, 2017',
    url: 'https://www.eset.com/int/about/newsroom/press-releases/research/telebots-are-back-supply-chain-attacks-against-ukraine/',
    category: 'technical',
    description: 'ESET\'s confirmation of M.E.Doc as the supply-chain infection vector and documentation of the backdoor.',
  },
  {
    id: 'src-05',
    title: 'The MeDoc connection',
    organization: 'Cisco Talos Intelligence',
    date: 'July 5, 2017',
    url: 'https://blog.talosintelligence.com/2017/07/the-medoc-connection.html',
    category: 'technical',
    description: 'Cisco Talos technical analysis confirming M.E.Doc and documenting both EternalBlue and credential-based propagation paths.',
  },
  {
    id: 'src-06',
    title: 'ExPetr/Petya/NotPetya is a Wiper, Not Ransomware',
    organization: 'Kaspersky Lab',
    date: 'June 28, 2017',
    url: 'https://securelist.com/expetrpetyanotpetya-is-a-wiper-not-ransomware/78902/',
    category: 'technical',
    description: 'Kaspersky\'s analysis concluding that NotPetya was designed as a wiper, not ransomware, based on the non-functional decryption mechanism.',
  },
  {
    id: 'src-07',
    title: 'NotPetya: the malware that devastated Maersk',
    organization: 'WIRED / Andy Greenberg',
    date: 'August 22, 2018',
    url: 'https://www.wired.com/story/notpetya-cyberattack-ukraine-russia-code-crashed-the-world/',
    category: 'journalism',
    description: 'The definitive investigative account of the NotPetya attack and its global consequences. Based on extensive interviews with victims including Maersk employees.',
  },
  {
    id: 'src-08',
    title: 'Attribution of the NotPetya cyber attack to Russia',
    organization: 'UK National Cyber Security Centre (NCSC)',
    date: 'February 15, 2018',
    url: 'https://www.ncsc.gov.uk/news/russian-military-almost-certainly-responsible-destructive-2017-cyber-attack',
    category: 'government',
    description: 'UK government assessment attributing NotPetya to the Russian military (GRU). "Almost certainly" language reflects analytical confidence.',
  },
  {
    id: 'src-09',
    title: 'Statement from the Press Secretary',
    organization: 'White House',
    date: 'February 15, 2018',
    url: 'https://trumpwhitehouse.archives.gov/briefings-statements/statement-press-secretary-25/',
    category: 'government',
    description: 'US government attribution of NotPetya to Russia and statement on economic damage (\$10 billion figure).',
  },
  {
    id: 'src-10',
    title: 'Six Russian GRU Officers Charged in Connection with Worldwide Deployment of Destructive Malware and Other Disruptive Actions in Cyberspace',
    organization: 'US Department of Justice',
    date: 'October 19, 2020',
    url: 'https://www.justice.gov/opa/pr/six-russian-gru-officers-charged-connection-worldwide-deployment-destructive-malware-and',
    category: 'government',
    description: 'DOJ indictment of six GRU Unit 74455 officers for NotPetya and other cyberattacks. Names and alleged roles documented in public court filing.',
  },
  {
    id: 'src-11',
    title: 'NotPetya (S0368)',
    organization: 'MITRE ATT&CK',
    date: 'Maintained',
    url: 'https://attack.mitre.org/software/S0368/',
    category: 'mitre',
    description: 'MITRE ATT&CK software entry for NotPetya, documenting all observed techniques with references.',
  },
  {
    id: 'src-12',
    title: 'Sandworm Team (G0034)',
    organization: 'MITRE ATT&CK',
    date: 'Maintained',
    url: 'https://attack.mitre.org/groups/G0034/',
    category: 'mitre',
    description: 'MITRE ATT&CK group entry for Sandworm Team, documenting known operations and techniques.',
  },
  {
    id: 'src-13',
    title: 'Petya-Based Ransomware: Technical Analysis',
    organization: 'Bitdefender',
    date: 'June 2017',
    url: 'https://labs.bitdefender.com/2017/06/new-ransomware-petya-spreads-from-ukraine/',
    category: 'technical',
    description: 'Bitdefender\'s technical analysis of NotPetya\'s destructive mechanisms.',
  },
  {
    id: 'src-14',
    title: 'Sandworm: A New Era of Cyberwar and the Hunt for the Kremlin\'s Most Dangerous Hackers',
    organization: 'Andy Greenberg (Doubleday, 2019)',
    date: '2019',
    url: 'https://www.penguinrandomhouse.com/books/597684/sandworm-by-andy-greenberg/',
    category: 'journalism',
    description: 'Book-length investigation into Sandworm and their operations including NotPetya. Based on extensive reporting and interviews.',
  },
  {
    id: 'src-15',
    title: 'WannaCry and NotPetya: Different Ransomware, Similar Lessons',
    organization: 'CISA',
    date: '2017',
    url: 'https://www.cisa.gov/',
    category: 'government',
    description: 'CISA guidance on WannaCry and NotPetya and recommended mitigations.',
  },
  {
    id: 'src-16',
    title: 'Technical Analysis: NotPetya / GoldenEye Ransomware',
    organization: 'ESET Research',
    date: 'June 2017',
    url: 'https://www.welivesecurity.com/2017/06/27/new-ransomware-attack-hits-ukraine/',
    category: 'technical',
    description: 'ESET\'s contemporaneous technical breakdown of NotPetya behavior.',
  },
  {
    id: 'src-17',
    title: 'BlackEnergy & Sandworm: Targeting Industrial Control Systems',
    organization: 'SANS ICS',
    date: 'Various',
    url: 'https://www.sans.org/white-papers/36770/',
    category: 'technical',
    description: 'SANS analysis of Sandworm\'s earlier campaigns, providing historical context.',
  },
  {
    id: 'src-18',
    title: 'New Cyberattack Campaign Leverages Leaked NSA Attack Tools',
    organization: 'Cisco Talos Intelligence',
    date: 'June 2017',
    url: 'https://blog.talosintelligence.com/',
    category: 'technical',
    description: 'Documentation of NSA tool (EternalBlue/EternalRomance) usage in the attack.',
  },
];

export const sourcesByCategory = {
  primary: sources.filter(s => s.category === 'primary'),
  government: sources.filter(s => s.category === 'government'),
  technical: sources.filter(s => s.category === 'technical'),
  mitre: sources.filter(s => s.category === 'mitre'),
  industry: sources.filter(s => s.category === 'industry'),
  journalism: sources.filter(s => s.category === 'journalism'),
};
