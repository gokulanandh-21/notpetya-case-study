// MITRE ATT&CK Technique Mappings for NotPetya
// Source: MITRE ATT&CK G0034 (Sandworm Team), S0368 (NotPetya)
// All technique IDs verified against MITRE ATT&CK Enterprise framework

export interface MitreTechnique {
  id: string;
  name: string;
  tactic: string;
  tacticId: string;
  observedBehavior: string;
  evidence: string;
  detection: string;
  mitigation: string;
  mitreUrl: string;
}

export const mitreTechniques: MitreTechnique[] = [
  {
    id: 'T1195.002',
    name: 'Supply Chain Compromise: Compromise Software Supply Chain',
    tactic: 'Initial Access',
    tacticId: 'TA0001',
    observedBehavior: 'NotPetya was distributed via a backdoored update to M.E.Doc accounting software. Victims received the malware as part of a trusted software update signed with a valid certificate.',
    evidence: 'ESET Research (July 2017) documented the M.E.Doc backdoor. Microsoft Security Blog confirmed the initial infection vector.',
    detection: 'Monitor for unusual software update behavior; software integrity verification; behavioral monitoring of update processes; anomalous network connections from update processes.',
    mitigation: 'Verify software integrity via cryptographic signing; implement software composition analysis; enforce vendor security requirements; monitor update processes with EDR.',
    mitreUrl: 'https://attack.mitre.org/techniques/T1195/002/',
  },
  {
    id: 'T1003.001',
    name: 'OS Credential Dumping: LSASS Memory',
    tactic: 'Credential Access',
    tacticId: 'TA0006',
    observedBehavior: 'NotPetya used a modified Mimikatz module to harvest NTLM hashes and cleartext credentials from LSASS process memory. Harvested credentials enabled lateral movement beyond EternalBlue-accessible systems.',
    evidence: 'Cisco Talos, Microsoft Security, ESET Research — all documented the Mimikatz-derived credential harvesting. This is why patching MS17-010 alone was insufficient.',
    detection: 'Monitor LSASS process access; alert on unexpected ReadProcessMemory calls against LSASS; Windows Event ID 4624/4625 anomalies; EDR telemetry for credential dumping tools.',
    mitigation: 'Enable Windows Credential Guard; configure LSA Protection (RunAsPPL); use Protected Users group; deploy PAM solutions; Privileged Access Workstations.',
    mitreUrl: 'https://attack.mitre.org/techniques/T1003/001/',
  },
  {
    id: 'T1210',
    name: 'Exploitation of Remote Services',
    tactic: 'Lateral Movement',
    tacticId: 'TA0008',
    observedBehavior: 'NotPetya exploited MS17-010 (EternalBlue: CVE-2017-0144, EternalRomance: CVE-2017-0145) in the Windows SMBv1 protocol to achieve unauthenticated remote code execution on unpatched systems.',
    evidence: 'MS17-010 (Microsoft); CVE-2017-0144, CVE-2017-0145 (NVD); documented in all major NotPetya analysis reports.',
    detection: 'IDS/IPS signatures for EternalBlue; SMBv1 usage monitoring; anomalous SMB traffic; process creation from System (PID 4); network scanning detection.',
    mitigation: 'Apply MS17-010; disable SMBv1; block SMB at network boundaries; deploy IDS/IPS; patch management program.',
    mitreUrl: 'https://attack.mitre.org/techniques/T1210/',
  },
  {
    id: 'T1021.002',
    name: 'Remote Services: SMB/Windows Admin Shares',
    tactic: 'Lateral Movement',
    tacticId: 'TA0008',
    observedBehavior: 'NotPetya used PsExec to copy itself to remote systems via ADMIN$ administrative share using harvested credentials, then executed the copy remotely.',
    evidence: 'Cisco Talos; Microsoft Security; US-CERT Alert AA17-181A',
    detection: 'Monitor for PsExec execution; ADMIN$ file creation monitoring; Windows Event ID 5145 (network share access); lateral movement detection in SIEM.',
    mitigation: 'Restrict administrative share access; disable ADMIN$ where not needed; network segmentation; least-privilege; PAM solutions.',
    mitreUrl: 'https://attack.mitre.org/techniques/T1021/002/',
  },
  {
    id: 'T1047',
    name: 'Windows Management Instrumentation',
    tactic: 'Lateral Movement / Execution',
    tacticId: 'TA0008',
    observedBehavior: 'NotPetya used WMIC to execute itself on remote systems using harvested credentials as an alternative lateral movement path to PsExec.',
    evidence: 'MITRE ATT&CK S0368; Cisco Talos analysis; Microsoft Security documentation.',
    detection: 'Monitor WMIC process creation; WMI activity logging (enable WMI provider logs); Windows Event ID 4688 with WMIC command line monitoring.',
    mitigation: 'Restrict WMI access where not needed; monitor WMI usage; application control to restrict WMIC to authorized users.',
    mitreUrl: 'https://attack.mitre.org/techniques/T1047/',
  },
  {
    id: 'T1561.001',
    name: 'Disk Wipe: Disk Content Wipe',
    tactic: 'Impact',
    tacticId: 'TA0040',
    observedBehavior: 'NotPetya overwrote the Master Boot Record (MBR) with a custom bootloader, rendering systems unbootable. This is the primary destructive payload.',
    evidence: 'Kaspersky Lab; Bitdefender; ESET Research; Cisco Talos — all documented the MBR overwrite behavior.',
    detection: 'Monitor for MBR write operations; endpoint behavior monitoring for direct disk access; EDR alerts for low-level disk I/O from unexpected processes.',
    mitigation: 'Endpoint protection with behavior-based MBR protection; immutable offline backups; tested recovery procedures.',
    mitreUrl: 'https://attack.mitre.org/techniques/T1561/001/',
  },
  {
    id: 'T1486',
    name: 'Data Encrypted for Impact',
    tactic: 'Impact',
    tacticId: 'TA0040',
    observedBehavior: 'NotPetya encrypted the NTFS Master File Table (MFT) using a one-time symmetric key not retained for recovery — making decryption permanently impossible. This was disguised as ransomware.',
    evidence: 'Cryptographic analysis by Kaspersky, ESET, and others confirmed the non-recoverable design. The "installation ID" displayed in the ransom note was randomly generated with no connection to any encryption key.',
    detection: 'Monitor for mass file access and modification; entropy analysis of file I/O; MFT access monitoring; behavior-based ransomware detection in EDR.',
    mitigation: 'Immutable offline backups; tested backup restoration; endpoint protection; application control.',
    mitreUrl: 'https://attack.mitre.org/techniques/T1486/',
  },
  {
    id: 'T1490',
    name: 'Inhibit System Recovery',
    tactic: 'Impact',
    tacticId: 'TA0040',
    observedBehavior: 'NotPetya deleted Windows Volume Shadow Copies, preventing recovery via built-in Windows system restore mechanisms.',
    evidence: 'Malware analysis reports documented vssadmin.exe usage to delete shadow copies — a common ransomware and wiper technique.',
    detection: 'Monitor vssadmin.exe execution; Windows Event ID 524 (system catalog deleted); monitor for volume shadow copy deletion commands.',
    mitigation: 'Offline backups not accessible from the infected system; test recovery procedures; monitor for shadow copy deletion.',
    mitreUrl: 'https://attack.mitre.org/techniques/T1490/',
  },
  {
    id: 'T1046',
    name: 'Network Service Discovery',
    tactic: 'Discovery',
    tacticId: 'TA0007',
    observedBehavior: 'NotPetya scanned local subnets for systems with TCP port 445 (SMB) open to identify propagation targets.',
    evidence: 'Network traffic analysis during incident response documented systematic internal scanning. Documented by Microsoft Security and Cisco Talos.',
    detection: 'Detect internal port scanning; monitor for high-rate connection attempts from a single host; network anomaly detection.',
    mitigation: 'Network segmentation; internal firewalls; network traffic monitoring; IDS/IPS for scanning detection.',
    mitreUrl: 'https://attack.mitre.org/techniques/T1046/',
  },
  {
    id: 'T1053.005',
    name: 'Scheduled Task/Job: Scheduled Task',
    tactic: 'Execution / Persistence',
    tacticId: 'TA0002',
    observedBehavior: 'NotPetya created a Windows scheduled task to trigger a system reboot approximately one hour after initial infection, giving propagation time before the destructive payload activated.',
    evidence: 'Multiple malware analysis reports documented the scheduled task mechanism as the trigger for the destructive reboot sequence.',
    detection: 'Monitor for scheduled task creation by unexpected processes; Windows Event ID 4698 (scheduled task created); audit task scheduler logs.',
    mitigation: 'Application allowlisting; monitoring task scheduler; restrict who can create scheduled tasks.',
    mitreUrl: 'https://attack.mitre.org/techniques/T1053/005/',
  },
];

export const sandwormProfile = {
  groupName: 'Sandworm Team',
  alternateNames: ['Telebots', 'Voodoo Bear', 'BlackEnergy Group', 'ELECTRUM', 'IRIDIUM', 'G0034'],
  mitreId: 'G0034',
  attributedNation: 'Russia',
  attributedOrganization: 'GRU Unit 74455 (Russian Military Intelligence)',
  attributionNote: 'Attribution is a government assessment from multiple allied nations (US, UK, Australia, Canada, New Zealand). The Russian government has denied involvement. No individual has been judicially convicted.',
  attributionSources: [
    'US Department of Justice indictment, October 15, 2020 (unsealed October 19, 2020)',
    'UK National Cyber Security Centre (NCSC), February 15, 2018',
    'White House Press Secretary statement, February 15, 2018',
    'Australian Cyber Security Centre, February 15, 2018',
  ],
  knownOperations: [
    'BlackEnergy attacks on Ukrainian power grid (2015)',
    'Industroyer/CrashOverride (2016)',
    'NotPetya (2017)',
    'Olympic Destroyer (2018 Winter Olympics)',
    'VPNFilter malware campaign (2018)',
    'Cyclops Blink (2022)',
  ],
  mitreUrl: 'https://attack.mitre.org/groups/G0034/',
};
