// src/data/notpetya/attackChain.ts
// NotPetya attack chain — technically accurate per public research

export interface MitreTag {
  id: string;     // e.g. T1195.002
  name: string;   // e.g. Supply Chain Compromise: Compromise Software Supply Chain
  tactic: string; // e.g. Initial Access
}

export interface AttackStage {
  id: string;         // stage-01 … stage-07
  number: string;     // '01' … '07'
  phase: string;      // Short phase label (caps)
  title: string;
  description: string;
  mechanism: string;  // How it technically works
  whyUsed: string;    // Strategic / operational rationale
  mitre: MitreTag[];
  detection: string[];
  mitigation: string[];
  evidence: string;   // Real-world evidence / source
}

export const attackChain: AttackStage[] = [
  {
    id: 'stage-01',
    number: '01',
    phase: 'INITIAL ACCESS',
    title: 'Supply-Chain Compromise via M.E.Doc',
    description:
      'Sandworm operators compromised the update infrastructure of M.E.Doc — a Ukrainian accounting application mandated by the Ukrainian government for tax reporting. A backdoored DLL (ZvitPublishedObjects.dll) was silently delivered to ~80% of Ukrainian businesses over months before the destructive payload was triggered.',
    mechanism:
      'The attackers gained access to Intellect Service\'s internal update server. They replaced the legitimate update DLL with a trojanised version that maintained full accounting functionality (to avoid detection) while adding a hidden module: it exfiltrated EDRPOU tax codes, email addresses, and cached proxy/VPN credentials via HTTP POST to attacker infrastructure, and downloaded/executed additional payloads on command. Three update-based delivery events occurred: April 14, May 15, and June 27, 2017.',
    whyUsed:
      'Supply-chain compromise via trusted software sidesteps endpoint security entirely — no phishing email, no user action, no suspicious process spawn. The mandatory nature of M.E.Doc for Ukrainian tax compliance guaranteed near-universal penetration of the Ukrainian business sector, including multinational subsidiaries operating in Ukraine.',
    mitre: [
      { id: 'T1195.002', name: 'Supply Chain Compromise: Compromise Software Supply Chain', tactic: 'Initial Access' },
      { id: 'T1071.001', name: 'Application Layer Protocol: Web Protocols (C2 exfil)', tactic: 'Command & Control' },
    ],
    detection: [
      'Monitor software update processes for unexpected child process spawning or outbound network connections',
      'Verify code-signing certificates on software updates against a known-good baseline',
      'Alert on DLL modifications in trusted application directories',
      'Network egress filtering: block unexpected outbound connections from accounting software processes',
    ],
    mitigation: [
      'Implement software supply-chain integrity checks (e.g. SLSA, code signing verification)',
      'Isolate business-critical software on segmented networks with strict egress rules',
      'Use application whitelisting to prevent unauthorised DLL loading',
      'Require multi-party code review for update pipelines of critical vendors',
    ],
    evidence:
      'ESET TeleBots report (January 2018) and Ukrainian Cyber Police confirmed the backdoored DLL after seizing M.E.Doc servers on June 28, 2017. Cisco Talos independently corroborated the C2 infrastructure.',
  },
  {
    id: 'stage-02',
    number: '02',
    phase: 'EXECUTION',
    title: 'Payload Delivery & Local Execution',
    description:
      'The M.E.Doc backdoor downloaded and executed the NotPetya binary (perfc.dat, later perfc). The binary required no elevation on its own — it used scheduled tasks or the token of the already-running M.E.Doc process (which ran as SYSTEM or a privileged user in many corporate environments).',
    mechanism:
      'The binary was dropped to %WINDIR% and executed via a scheduled task or rundll32.exe. It immediately checked for the existence of C:\\Windows\\perfc (a mutex file) — if absent, execution proceeded. The binary was compiled with debug information stripped and used export function #1 to initiate execution, avoiding the default entry point heuristics used by some AV engines.',
    whyUsed:
      'Using the existing M.E.Doc process context avoided the need for a separate privilege escalation step. Running as SYSTEM gave the worm access to LSASS for credential harvesting without additional exploitation.',
    mitre: [
      { id: 'T1053.005', name: 'Scheduled Task/Job: Scheduled Task', tactic: 'Execution' },
      { id: 'T1218.011', name: 'System Binary Proxy Execution: Rundll32', tactic: 'Defense Evasion' },
      { id: 'T1036', name: 'Masquerading (perfc.dat disguised as legitimate file)', tactic: 'Defense Evasion' },
    ],
    detection: [
      'Alert on rundll32.exe spawning from accounting software processes',
      'Monitor scheduled task creation in %WINDIR% by non-administrative software',
      'Detect execution of DLLs with no exports other than ordinal #1',
    ],
    mitigation: [
      'Principle of least privilege: accounting software should not run as SYSTEM',
      'Application control (e.g. Windows Defender Application Control) to block unauthorised executables in %WINDIR%',
      'Scheduled task creation monitoring and alerting via SIEM',
    ],
    evidence:
      'Kaspersky Lab and ESET reverse-engineering of the NotPetya binary, June–July 2017. Microsoft security blog confirmed the rundll32 execution vector.',
  },
  {
    id: 'stage-03',
    number: '03',
    phase: 'CREDENTIAL ACCESS',
    title: 'LSASS Credential Harvesting via Mimikatz',
    description:
      'NotPetya embedded stripped-down x86 and x64 versions of the Mimikatz credential-harvesting tool. These were injected into LSASS to extract plaintext passwords, NTLM hashes, and Kerberos tickets from memory.',
    mechanism:
      'The embedded Mimikatz module performed a targeted sekurlsa::logonpasswords-equivalent operation: it opened a handle to lsass.exe, walked the in-memory credential structures (WDIGEST, NTLM, Kerberos SSP caches), and extracted all credentials of users who had previously authenticated on the host. On Windows versions with WDigest enabled (pre-KB2871997), plaintext passwords were extracted directly. On newer systems, NTLM hashes were sufficient for Pass-the-Hash propagation.',
    whyUsed:
      'Credential harvesting was the critical second-stage propagation mechanism. EternalBlue only worked against unpatched systems, but harvested credentials worked everywhere — including fully-patched machines. Any host where a domain admin had ever logged in became a springboard to the entire domain, regardless of patch status.',
    mitre: [
      { id: 'T1003.001', name: 'OS Credential Dumping: LSASS Memory', tactic: 'Credential Access' },
      { id: 'T1550.002', name: 'Use Alternate Authentication Material: Pass the Hash', tactic: 'Lateral Movement' },
    ],
    detection: [
      'Monitor for anomalous LSASS memory read access (e.g. via Windows Event ID 10, Sysmon)',
      'Alert on processes opening PROCESS_VM_READ handle to lsass.exe',
      'Credential Guard (Windows 10+) prevents LSASS plaintext extraction',
      'Enable Protected Process Light (PPL) for LSASS',
    ],
    mitigation: [
      'Enable Windows Credential Guard on all hosts',
      'Disable WDigest authentication (registry: HKLM\\SYSTEM\\...\\WDigest → UseLogonCredential = 0)',
      'Apply KB2871997 on legacy Windows systems',
      'Enforce tiered admin model — domain admins should never log onto workstations interactively',
    ],
    evidence:
      'Independently confirmed by Kaspersky Lab, ESET, and Crowdstrike. Mimikatz author Benjamin Delpy confirmed the embedded version was based on his code.',
  },
  {
    id: 'stage-04',
    number: '04',
    phase: 'LATERAL MOVEMENT',
    title: 'SMB Exploitation — EternalBlue / EternalRomance',
    description:
      'NotPetya\'s worm component scanned local subnets using ARP and DHCP lease enumeration to find hosts with TCP 139 or 445 open, then attempted exploitation via EternalBlue (CVE-2017-0144) and EternalRomance (CVE-2017-0145).',
    mechanism:
      'EternalBlue targeted a heap buffer overflow in the Windows SMBv1 srv.sys driver triggered by a malformed SMB_COM_TRANSACTION2 request. Successful exploitation yielded arbitrary kernel-mode code execution without authentication. EternalRomance exploited a type-confusion flaw in the same driver. Both exploits were part of the NSA\'s Equation Group toolkit, leaked by the Shadow Brokers in April 2017. Microsoft had patched both in MS17-010 on March 14, 2017 — 75 days before NotPetya — but large numbers of enterprise systems remained unpatched.',
    whyUsed:
      'Unauthenticated remote kernel exploitation required zero credentials and zero user interaction. It was the primary "first hop" vector into networks where no compromised credentials were yet available, and was catastrophically effective against unpatched legacy Windows environments.',
    mitre: [
      { id: 'T1210', name: 'Exploitation of Remote Services', tactic: 'Lateral Movement' },
      { id: 'T1570', name: 'Lateral Tool Transfer', tactic: 'Lateral Movement' },
    ],
    detection: [
      'Monitor for malformed SMB_COM_TRANSACTION2 packets (IDS/IPS signatures available)',
      'Alert on kernel driver crashes or unusual kernel pool allocations on SMB servers',
      'Honeypot SMB hosts on internal subnets',
      'Network flow analysis: sudden spike in 445/TCP connections from a single source',
    ],
    mitigation: [
      'Apply MS17-010 immediately — this was available 75 days before NotPetya',
      'Disable SMBv1 across the entire network (Group Policy)',
      'Block SMB (139, 445) between workstations — only allow to designated file servers',
      'Enable Windows Firewall on all hosts as a default-deny inbound policy',
    ],
    evidence:
      'US-CERT Alert TA17-181A confirmed EternalBlue/EternalRomance usage. NSA tools were originally published by the Shadow Brokers on April 14, 2017.',
  },
  {
    id: 'stage-05',
    number: '05',
    phase: 'LATERAL MOVEMENT',
    title: 'Credential-Based Spread — PsExec & WMIC',
    description:
      'Using credentials harvested from LSASS, NotPetya copied itself to the ADMIN$ share of remote hosts and executed via a custom PsExec-like module or Windows Management Instrumentation (WMIC). This vector bypassed patch status entirely.',
    mechanism:
      'The custom PsExec module: (1) authenticated to the ADMIN$ share using harvested NTLM hashes via Pass-the-Hash, (2) copied the NotPetya DLL to C:\\Windows\\, (3) created a remote service or scheduled task to execute it. WMIC was used as a fallback: wmic /node:<target> process call create "rundll32.exe C:\\Windows\\perfc.dat,#1". Both methods required only valid network credentials — no exploit, no vulnerability, no user interaction.',
    whyUsed:
      'This was NotPetya\'s most strategically devastating feature: a fully-patched machine was still vulnerable if a compromised account had ever authenticated on an infected host. In flat enterprise networks where domain administrators logged onto workstations, a single admin credential gave network-wide access to every machine in the domain.',
    mitre: [
      { id: 'T1021.002', name: 'Remote Services: SMB/Windows Admin Shares', tactic: 'Lateral Movement' },
      { id: 'T1047', name: 'Windows Management Instrumentation', tactic: 'Execution' },
      { id: 'T1550.002', name: 'Use Alternate Authentication Material: Pass the Hash', tactic: 'Lateral Movement' },
    ],
    detection: [
      'Alert on creation of services or scheduled tasks from ADMIN$ share writes',
      'Monitor WMIC remote execution (Event ID 4688 with wmic.exe /node: in command line)',
      'Detect Pass-the-Hash: Event ID 4624 Logon Type 3 with NTLM auth from unusual source',
      'Flag lateral movement: same credential used across multiple hosts in rapid succession',
    ],
    mitigation: [
      'Network segmentation: restrict ADMIN$ access to dedicated management hosts only',
      'Tiered administration model: separate admin accounts for workstations vs. servers vs. DCs',
      'Enable SMB signing to mitigate Pass-the-Hash on file shares',
      'Disable WMIC for non-administrative users via Group Policy',
      'Local Administrator Password Solution (LAPS) to prevent credential reuse across workstations',
    ],
    evidence:
      'Microsoft Security blog (July 2017) and Wired\'s "The Untold Story of NotPetya" (2018) detail both PsExec and WMIC vectors. Confirmed by Crowdstrike and Symantec.',
  },
  {
    id: 'stage-06',
    number: '06',
    phase: 'IMPACT',
    title: 'MBR / MFT Encryption — Permanent Destruction',
    description:
      'After spreading to all reachable hosts, NotPetya overwrote the Master Boot Record with a custom bootloader and encrypted the Master File Table using Salsa20, rendering the operating system and all files permanently unrecoverable.',
    mechanism:
      'NotPetya set a Windows scheduled task to reboot the machine in 1–2 hours (tunable by the operators). During the wait period, it silently encrypted the MFT using a randomly-generated Salsa20 key. The key was then encrypted with an RSA-2048 public key — but the corresponding private key was never transmitted anywhere and was discarded after use, making decryption mathematically impossible. On reboot, the custom MBR bootloader displayed the fake ransomware note and a victim "installation ID" (which was random noise, not an encoded key).',
    whyUsed:
      'The 1-hour delay maximised network propagation before any host rebooted — an infected host could continue spreading while appearing normal. The fake ransomware framing was a deliberate deception operation: it created attribution confusion (was this financially motivated?) and deterred immediate attribution to a nation-state. The irrecoverability by design confirms the intent was destruction, not extortion.',
    mitre: [
      { id: 'T1561.002', name: 'Disk Wipe: Disk Structure Wipe (MBR/MFT)', tactic: 'Impact' },
      { id: 'T1485', name: 'Data Destruction', tactic: 'Impact' },
      { id: 'T1496', name: 'Resource Hijacking (scheduled reboot)', tactic: 'Impact' },
    ],
    detection: [
      'Monitor for write access to the MBR (raw disk I/O to \\\\.\\ PhysicalDrive0)',
      'Alert on scheduled tasks created by non-system processes that trigger a system reboot',
      'Detect Salsa20 / high-entropy writes to NTFS metadata files ($MFT)',
      'Endpoint behavioral analytics: file encryption at scale (many files in rapid succession)',
    ],
    mitigation: [
      'Immutable offline backups (3-2-1 rule) — the only true recovery path',
      'Block raw disk access for non-kernel processes via Windows security policy',
      'UEFI Secure Boot prevents custom MBR bootloaders from executing',
      'Endpoint Detection and Response (EDR) with behavioral MBR-write detection',
    ],
    evidence:
      'Comae Technologies (Matt Suiche) first documented the deliberate irrecoverability on June 27, 2017. Kaspersky Lab and ESET confirmed independently. The fake installation ID was the key evidence that this was a wiper.',
  },
  {
    id: 'stage-07',
    number: '07',
    phase: 'ATTRIBUTION',
    title: 'Post-Incident Attribution to GRU Sandworm',
    description:
      'NotPetya was formally attributed to Sandworm (GRU Unit 74455) by the United States, United Kingdom, Australia, Canada, New Zealand, and the European Union based on forensic, intelligence, and signals evidence — making it one of the most publicly attributed state-sponsored cyberattacks in history.',
    mechanism:
      'Attribution evidence included: (1) code overlap and TTP similarity with prior Sandworm campaigns (BlackEnergy 2015–16, Industroyer/Crashoverride 2016); (2) infrastructure reuse — C2 IP addresses overlapping with known GRU-associated domains; (3) the M.E.Doc backdoor\'s targeting precision (Ukrainian tax software) consistent with GRU strategic priorities; (4) signals intelligence assessed by Five Eyes partners. Six GRU officers (Unit 74455 and Unit 26165) were indicted by the US DOJ on October 19, 2020, specifically for NotPetya and related attacks.',
    whyUsed:
      'The geopolitical context is inseparable from the technical attack: NotPetya was deployed on the eve of Ukrainian Constitution Day (June 28) during an active armed conflict. Ukraine\'s infrastructure had been a testing ground for Sandworm since at least 2015 (BlackEnergy power grid attacks). NotPetya represented an escalation from disruptive attacks to maximally destructive infrastructure destruction with deliberate global economic collateral damage.',
    mitre: [
      { id: 'G0034', name: 'Sandworm Team (GRU Unit 74455)', tactic: 'Threat Actor' },
      { id: 'T1583', name: 'Acquire Infrastructure', tactic: 'Resource Development' },
    ],
    detection: [
      'Threat intelligence sharing (sector-specific ISACs) enables pre-attack TTP correlation',
      'Attribution requires forensic, SIGINT, and HUMINT convergence — beyond individual org capability',
      'MITRE ATT&CK mapping enables detection of Sandworm TTPs before full attack execution',
    ],
    mitigation: [
      'Engage national CERT / government cyber agencies for threat intelligence on state actors',
      'Implement ATT&CK-based detection coverage to identify Sandworm precursor activity',
      'Participate in coordinated vulnerability disclosure and patch cadences',
      'Political/diplomatic countermeasures (indictments, sanctions) as deterrence',
    ],
    evidence:
      'White House attribution statement, February 15, 2018. UK NCSC attribution, same date. DOJ indictment, October 19, 2020. EU Council conclusions, October 2020.',
  },
];

// ─── Technical deep-dive detail blocks ────────────────────────────────────────

export interface TechnicalDetail {
  id: string;
  category: 'exploit' | 'credential' | 'payload';
  title: string;
  subtitle: string;
  cve?: string;
  patch?: string;
  patchDate?: string;
  description: string;
  codeBlock?: string;
  codeLanguage?: string;
  points: string[];
}

export const technicalDetails: TechnicalDetail[] = [
  {
    id: 'tech-eternalblue',
    category: 'exploit',
    title: 'EternalBlue',
    subtitle: 'SMBv1 Buffer Overflow',
    cve: 'CVE-2017-0144',
    patch: 'MS17-010',
    patchDate: 'March 14, 2017',
    description:
      'A heap buffer overflow in the Windows SMBv1 kernel driver (srv.sys), exploited via malformed SMB_COM_TRANSACTION2 packets. Achieves unauthenticated, remote kernel-mode code execution.',
    codeBlock: `TCP Port   : 445 (SMB direct) / 139 (SMB over NetBIOS)
Protocol   : SMBv1 (Server Message Block v1)
Driver     : srv.sys (Windows kernel driver)
Exploit    : Heap buffer overflow in FEA/NTFEALIST parsing
Privilege  : SYSTEM (kernel mode, no authentication)
Patch      : MS17-010 — March 14, 2017`,
    codeLanguage: 'text',
    points: [
      'Exploits the SMBv1 driver present in all Windows versions from XP to Server 2016',
      'Requires no credentials — purely network-accessible',
      'Originally developed by the NSA Equation Group, leaked by Shadow Brokers April 14, 2017',
      'WannaCry (May 2017) and NotPetya (June 2017) both weaponised this exploit within weeks of the leak',
      'Patch available 75 days before NotPetya — failure to patch was the decisive vulnerability',
    ],
  },
  {
    id: 'tech-eternalromance',
    category: 'exploit',
    title: 'EternalRomance',
    subtitle: 'SMBv1 Type Confusion',
    cve: 'CVE-2017-0145',
    patch: 'MS17-010',
    patchDate: 'March 14, 2017',
    description:
      'A type-confusion vulnerability in the Windows SMBv1 implementation that allows an unauthenticated attacker to write arbitrary data to kernel memory, achieving remote code execution.',
    codeBlock: `TCP Port   : 445 (SMB direct) / 139 (SMB over NetBIOS)
Protocol   : SMBv1 (Server Message Block v1)
Driver     : srv.sys (Windows kernel driver)
Exploit    : Type confusion in SMB_COM_WRITE_ANDX handling
Privilege  : SYSTEM (kernel mode, no authentication)
Patch      : MS17-010 — March 14, 2017`,
    codeLanguage: 'text',
    points: [
      'Works against Windows XP through Windows Server 2008 R2',
      'Used as a fallback when EternalBlue fails (different code path in srv.sys)',
      'Both CVEs patched simultaneously in MS17-010',
      'NotPetya attempted EternalBlue first, falling back to EternalRomance on failure',
    ],
  },
  {
    id: 'tech-mimikatz',
    category: 'credential',
    title: 'Mimikatz (Embedded)',
    subtitle: 'LSASS Memory Credential Extraction',
    description:
      'NotPetya included both x86 and x64 builds of a stripped Mimikatz module. It opened a handle to lsass.exe, walked in-memory credential provider structures, and extracted plaintext passwords and NTLM hashes.',
    codeBlock: `Process    : lsass.exe (Local Security Authority Subsystem)
Access     : PROCESS_VM_READ | PROCESS_QUERY_INFORMATION
Credential : WDigest SSP (plaintext, if UseLogonCredential=1)
           : NTLM hashes (Pass-the-Hash capable)
           : Kerberos TGTs (Pass-the-Ticket capable)
Usage      : PsExec (ADMIN$ share lateral movement)
           : WMIC remote process creation`,
    codeLanguage: 'text',
    points: [
      'Credential harvesting allowed spread to fully-patched systems — bypassing EternalBlue mitigation entirely',
      'A single domain admin credential logged onto any infected host granted domain-wide access',
      'WDigest plaintext extraction worked on pre-Windows 10 systems without KB2871997',
      'NTLM hash extraction (Pass-the-Hash) worked on all Windows versions',
      'Credential Guard (Windows 10+) would have blocked LSASS memory access',
    ],
  },
  {
    id: 'tech-psexec',
    category: 'credential',
    title: 'PsExec / WMIC Lateral Movement',
    subtitle: 'Credential-Based Remote Execution',
    description:
      'Using harvested credentials, NotPetya copied itself to remote ADMIN$ shares and created services or scheduled tasks to execute on target hosts — requiring no exploit and bypassing patch status.',
    codeBlock: `# PsExec-equivalent operation:
net use \\\\<target>\\ADMIN$ /user:<domain>\\<user> <password>
copy perfc.dat \\\\<target>\\ADMIN$\\perfc.dat
sc \\\\<target> create <svcname> binpath= "rundll32 perfc.dat,#1"
sc \\\\<target> start <svcname>

# WMIC fallback:
wmic /node:<target> /user:<user> /password:<pass> \\
  process call create "rundll32.exe C:\\Windows\\perfc.dat,#1"`,
    codeLanguage: 'bash',
    points: [
      'Requires no vulnerability — uses legitimate Windows admin features',
      'Effective against fully-patched, otherwise secure hosts',
      'Network segmentation (blocking ADMIN$ between workstations) would have contained spread',
      'LAPS (Local Admin Password Solution) prevents lateral movement using shared local admin passwords',
      'Tiered administration model is the primary architectural mitigation',
    ],
  },
];
