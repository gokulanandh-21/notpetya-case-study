// src/data/notpetya/timeline.ts
// Factually accurate events from the NotPetya cyberattack — June 27, 2017

export type EventCategory =
  | 'INFECTION'
  | 'PROPAGATION'
  | 'IMPACT'
  | 'RESPONSE'
  | 'DISCOVERY';

export type Severity = 'critical' | 'high' | 'medium' | 'low';

export interface TimelineEvent {
  id: string;
  time: string;           // HH:MM UTC or descriptive
  date: string;           // Human-readable date label
  category: EventCategory;
  severity: Severity;
  title: string;
  summary: string;
  technical?: string;     // Expanded technical details
  affected?: string[];    // Affected organizations / systems
  source?: string;        // Attribution / source note
}

export const timelineEvents: TimelineEvent[] = [
  {
    id: 'evt-01',
    time: '~10:30',
    date: 'June 27, 2017',
    category: 'INFECTION',
    severity: 'critical',
    title: 'M.E.Doc Update Server Delivers Malicious Payload',
    summary:
      'The attackers — later attributed to Sandworm (GRU Unit 74455) — pushed a trojanised software update through M.E.Doc, a widely-used Ukrainian accounting application. The update contained a backdoor that had been present in M.E.Doc since at least April 2017.',
    technical:
      'The malicious DLL was injected into the legitimate M.E.Doc update process (ZvitPublishedObjects.dll). On execution it collected EDRPOU codes, email addresses, and proxy/VPN credentials before downloading the NotPetya binary. The C2 communication used HTTP POST requests to 84.200.16.242. The backdoor pre-dated the June 27 attack by months, suggesting long-term supply-chain compromise.',
    affected: ['M.E.Doc users across Ukraine — estimated 80% of Ukrainian businesses used the software'],
    source: 'ESET, Cisco Talos, Ukrainian Cyber Police',
  },
  {
    id: 'evt-02',
    time: '~10:30',
    date: 'June 27, 2017',
    category: 'INFECTION',
    severity: 'critical',
    title: 'Initial Execution — Disk Encryption Begins',
    summary:
      'The NotPetya binary (perfc.dat, later signed as a legitimate binary) was dropped and executed on infected hosts. It immediately began encrypting the Master Boot Record (MBR) and Master File Table (MFT) of the local drive.',
    technical:
      'NotPetya replaced the legitimate MBR with a custom bootloader that displayed the ransom note. It then encrypted the MFT using Salsa20, making the file system inaccessible. Unlike genuine ransomware, the encryption keys were never transmitted to a C2 server — recovery was impossible by design. The 1-hour wait timer before reboot was used to maximise lateral spread before victims noticed.',
    affected: ['Initial Ukrainian hosts with M.E.Doc installed'],
    source: 'Kaspersky Lab, ESET',
  },
  {
    id: 'evt-03',
    time: '~10:45',
    date: 'June 27, 2017',
    category: 'PROPAGATION',
    severity: 'critical',
    title: 'EternalBlue / EternalRomance Lateral Movement Begins',
    summary:
      'NotPetya began scanning local subnets for hosts with TCP port 445 (SMB) open, exploiting the NSA-developed EternalBlue (CVE-2017-0144) and EternalRomance (CVE-2017-0145) vulnerabilities to spread without user interaction.',
    technical:
      'EternalBlue targets a buffer overflow in the Windows SMBv1 srv.sys driver. NotPetya sent crafted SMB_COM_TRANSACTION2 packets, triggering the overflow to achieve kernel-level code execution. EternalRomance exploited a type-confusion bug in the same SMBv1 implementation. Both vulnerabilities were patched by Microsoft in MS17-010 (March 14, 2017), but many corporate networks had not applied it. The worm component iterated through ARP tables and DHCP server leases to enumerate reachable hosts.',
    source: 'US-CERT, Microsoft MSRC, Shadow Brokers disclosure (April 2017)',
  },
  {
    id: 'evt-04',
    time: '~11:00',
    date: 'June 27, 2017',
    category: 'PROPAGATION',
    severity: 'critical',
    title: 'Credential Harvesting via Mimikatz — Network-Wide Spread',
    summary:
      'A stripped-down Mimikatz module extracted plaintext credentials and NTLM hashes from LSASS memory. These were then used with PsExec and WMIC to spread to patched machines that were otherwise immune to EternalBlue.',
    technical:
      'NotPetya embedded a modified Mimikatz (x86 and x64) that performed LSASS memory dumps. Harvested credentials were used with a custom PsExec-like module: NotPetya copied itself to the ADMIN$ share of remote hosts and scheduled execution via the Windows Task Scheduler or Service Control Manager. WMIC (Windows Management Instrumentation) was used as a fallback for remote process creation. This dual propagation method — exploit-based AND credential-based — allowed NotPetya to jump across fully-patched network segments wherever a compromised admin account had logged in.',
    source: 'Microsoft Security Response, Wired (Sandworm book), Crowdstrike',
  },
  {
    id: 'evt-05',
    time: '~11:30',
    date: 'June 27, 2017',
    category: 'IMPACT',
    severity: 'critical',
    title: 'Maersk Network Goes Dark — 45,000 PCs Affected',
    summary:
      'A.P. Møller–Maersk, the world\'s largest container shipping company, suffered catastrophic system failure. 45,000 PCs, 4,000 servers, and 2,500 applications became inoperable within minutes, including the critical cargo booking system TradeLens.',
    technical:
      'Maersk\'s infection vector was a single Ukrainian subsidiary that used M.E.Doc. Because Maersk\'s internal network was flat — VPNs connected all global offices — NotPetya propagated from one compromised host across all continents. The company lost its entire Active Directory infrastructure. Recovery required physically shipping a clean domain controller from Ghana (the only AD controller that was offline during the attack) to restart the rebuild.',
    affected: ['Maersk (45,000 PCs, 4,000 servers)', '76 port terminals globally'],
    source: 'Maersk CEO Søren Skou public statements; Wired investigation',
  },
  {
    id: 'evt-06',
    time: '~12:00',
    date: 'June 27, 2017',
    category: 'IMPACT',
    severity: 'critical',
    title: 'Ukrainian Critical Infrastructure Struck',
    summary:
      'Ukraine\'s central bank, government ministries, Kyiv Boryspil International Airport, the Kyiv Metro, and Chernobyl\'s radiation monitoring network were all taken offline within hours of the initial outbreak.',
    technical:
      'Chernobyl\'s automatic radiation monitoring system was forced into manual mode — technicians recorded readings with dosimeters and pen and paper. The Kyiv Metro\'s payment systems were knocked offline (though trains continued to run). Ukrenergo (the national power grid operator) was partially affected. Ukraine\'s Deputy Prime Minister Pavlo Rozenko posted a photo of a BSOD on his office computer, illustrating how thoroughly government systems were compromised.',
    affected: [
      'National Bank of Ukraine',
      'Ukrainian Cabinet of Ministers',
      'Kyiv Boryspil Airport (flight info boards offline)',
      'Chernobyl radiation monitoring',
      'Ukrenergo (partial)',
      'Oschadbank (state savings bank)',
    ],
    source: 'Ukrainian CERT-UA, IAEA Chernobyl statements',
  },
  {
    id: 'evt-07',
    time: '~13:00',
    date: 'June 27, 2017',
    category: 'IMPACT',
    severity: 'critical',
    title: 'Merck, FedEx TNT Express, Reckitt Benckiser — Global Multinationals Hit',
    summary:
      'The attack spread well beyond Ukraine as multinational corporations\' infected subsidiaries propagated NotPetya across global corporate networks. Merck, FedEx\'s TNT Express division, and Reckitt Benckiser suffered severe disruption.',
    technical:
      'Each multinational had at least one Ukrainian entity connected to the parent network. Because NotPetya required no user action once inside a network, the spread was automated and near-instant. Merck lost approximately $870 million in damages, including the destruction of manufacturing systems for vaccine production. FedEx TNT reported $400 million in losses and never fully recovered its TNT-branded systems. Reckitt Benckiser (now Reckitt) reported a £100 million revenue hit due to manufacturing disruption.',
    affected: ['Merck (~$870M impact)', 'FedEx TNT (~$400M impact)', 'Reckitt Benckiser (~£100M)', 'Mondelez International', 'Saint-Gobain'],
    source: 'SEC filings, earnings calls, White House attribution statement (Feb 2018)',
  },
  {
    id: 'evt-08',
    time: '~14:00',
    date: 'June 27, 2017',
    category: 'DISCOVERY',
    severity: 'high',
    title: 'Security Researchers Identify NotPetya as Wiper, Not Ransomware',
    summary:
      'Analysts at Kaspersky Lab, ESET, and Comae Technologies independently concluded that NotPetya was not genuine ransomware — the encryption was designed to be irreversible, making it a destructive wiper masquerading as ransomware.',
    technical:
      'Comae\'s Matt Suiche was first to publicly note that the MBR overwrite was intentionally destructive: unlike Petya (the malware NotPetya superficially resembled), the victim\'s installation ID displayed in the ransom note was randomly generated and contained no encoded key material. Even if a victim paid the $300 Bitcoin ransom and received a valid key, decryption was mathematically impossible because no key was ever stored. ESET and Kaspersky confirmed the finding within hours.',
    source: 'Matt Suiche / Comae blog; Kaspersky Lab analysis; ESET TeleBots report',
  },
  {
    id: 'evt-09',
    time: '~16:00',
    date: 'June 27, 2017',
    category: 'DISCOVERY',
    severity: 'high',
    title: 'Kill Switch / Vaccination Discovered',
    summary:
      'Security researcher Amit Serper discovered that NotPetya checked for the existence of a read-only file at C:\\Windows\\perfc before executing. Creating this file on a host prevented infection — acting as a local "vaccine."',
    technical:
      'The perfc check was a mutex-like anti-reinfection guard. NotPetya would not execute if this file existed. Serper\'s discovery allowed rapid deployment of a vaccination script across enterprise environments. However, the check only prevented the initial payload execution — it did not stop the worm from propagating across the network, it only prevented a given host from running the destructive payload a second time. The kill switch was therefore less effective than WannaCry\'s domain-based kill switch.',
    source: 'Amit Serper / Cybereason blog post, June 27 2017',
  },
  {
    id: 'evt-10',
    time: 'June 28',
    date: 'June 28, 2017',
    category: 'RESPONSE',
    severity: 'high',
    title: 'Ukrainian Police Raid Intellect Service (M.E.Doc Offices)',
    summary:
      'Ukrainian National Police conducted a raid on Intellect Service, the company behind M.E.Doc, and seized their servers as forensic evidence. Intellect Service initially denied being the infection vector before evidence was published.',
    technical:
      'Forensic analysis of the seized M.E.Doc servers confirmed the backdoored DLL in the update mechanism. Ukrainian cyber investigators found evidence that the update infrastructure had been compromised since at least April 2017, and possibly as early as January 2017. Three separate NotPetya delivery events were later identified through the M.E.Doc update channel (April 14, May 15, and June 27 — the June 27 being the most destructive).',
    source: 'Ukrainian Cyber Police, ESET TeleBots report (January 2018)',
  },
  {
    id: 'evt-11',
    time: 'June 28–July 2017',
    date: 'June 28 – July 2017',
    category: 'RESPONSE',
    severity: 'medium',
    title: 'Enterprise Recovery Operations Begin',
    summary:
      'Affected organisations began multi-week to multi-month rebuilding operations. Maersk\'s recovery — reinstalling 45,000 PCs and 4,000 servers in 10 days — became a reference case study in large-scale incident response.',
    technical:
      'Maersk described re-imaging machines manually across 600 global locations simultaneously, coordinating via WhatsApp (since email was down). Their recovery was enabled by the single offline AD controller in Ghana, which was physically flown to the UK. Merck hired hundreds of contractors and relied on emergency supply of vaccines stockpiled with the US Centers for Disease Control (CDC) after their manufacturing systems were destroyed. The CDC stockpile intervention became part of subsequent US government cyber-risk assessments.',
    affected: ['Maersk (10-day rebuild)', 'Merck (months-long manufacturing disruption)'],
    source: 'Wired "The Untold Story of NotPetya" (Aug 2018); Merck SEC filings',
  },
  {
    id: 'evt-12',
    time: 'February 15, 2018',
    date: 'February 15, 2018',
    category: 'RESPONSE',
    severity: 'medium',
    title: 'US, UK, Australia, Canada Formally Attribute NotPetya to Russia',
    summary:
      'The White House, UK NCSC, Australian Signals Directorate, and Canadian Centre for Cyber Security formally attributed NotPetya to the Russian military intelligence agency GRU, specifically Sandworm (later identified as GRU Unit 74455).',
    technical:
      'Attribution was based on overlapping TTPs with prior Sandworm campaigns (BlackEnergy, Industroyer/Crashoverride), infrastructure reuse, code similarity analysis, and signals intelligence. The US later indicted six GRU officers in October 2020 (including for NotPetya). Russia denied involvement. The attack was characterised by the White House as "the most destructive and costly cyberattack in history."',
    source: 'White House press release Feb 15 2018; DOJ indictment Oct 19 2020',
  },
];
