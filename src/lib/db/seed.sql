-- ============================================================================
-- THE NOTPETYA CYBER WAR // ACADEMIC SEED DATA (AUTHENTIC RESEARCH CORROBORATED)
-- All factual records mapped to verified authoritative sources.
-- ============================================================================

-- 1. SOURCES
INSERT INTO sources (source_id, source_name, publisher, source_type, publication_date, url, credibility_level) VALUES
('src-wh-2018', 'Statement from the Press Secretary on NotPetya Cyberattack', 'The White House', 'Government / Advisory', '2018-02-15', 'https://trumpwhitehouse.archives.gov/briefings-statements/statement-press-secretary-25/', 'Primary / Official'),
('src-ncsc-2018', 'Russian military almost certainly responsible for NotPetya', 'UK National Cyber Security Centre (NCSC)', 'Government / Advisory', '2018-02-15', 'https://www.ncsc.gov.uk/news/russian-military-almost-certainly-responsible-destructive-notpetya-attack', 'Primary / Official'),
('src-cisa-alert', 'Alert (TA17-181A): Petya / NotPetya Ransomware', 'Cybersecurity and Infrastructure Security Agency (CISA)', 'Government / Advisory', '2017-07-01', 'https://www.cisa.gov/news-events/cybersecurity-advisories/ta17-181a', 'Primary / Official'),
('src-mitre-s0368', 'Software: NotPetya (S0368)', 'MITRE ATT&CK', 'MITRE ATT&CK', '2018-10-17', 'https://attack.mitre.org/software/S0368/', 'Primary / Official'),
('src-msrc-ms17010', 'Microsoft Security Bulletin MS17-010 - Critical', 'Microsoft Security Response Center', 'Vendor Technical Bulletin', '2017-03-14', 'https://learn.microsoft.com/en-us/security-updates/securitybulletins/2017/ms17-010', 'Primary / Official'),
('src-ms-analysis', 'New ransomware variant Nyetya exploits EternalBlue on large scale', 'Microsoft Threat Intelligence', 'Threat Intelligence Report', '2017-06-27', 'https://www.microsoft.com/en-us/security/blog/2017/06/27/new-ransomware-variant-nyetya-exploits-eternalblue-repo/', 'Primary / Official'),
('src-talos-nyetya', 'New Ransomware Variant "Nyetya" Exploits EternalBlue', 'Cisco Talos Intelligence Group', 'Threat Intelligence Report', '2017-06-27', 'https://blog.talosintelligence.com/new-ransomware-variant-nyetya/', 'High'),
('src-eset-telebots', 'TeleBots: The Targeted Attacks in Ukraine', 'ESET Research', 'Threat Intelligence Report', '2017-07-04', 'https://www.welivesecurity.com/2017/07/04/telebots-backdoor-found-in-medoc-release/', 'High'),
('src-kaspersky-wiper', 'Schroedinger’s Pet: NotPetya is a Wiper, Not Ransomware', 'Kaspersky Securelist', 'Threat Intelligence Report', '2017-06-28', 'https://securelist.com/schroedingers-petya/78870/', 'High'),
('src-maersk-2017', 'Maersk 2017 Interim / Annual Report Cyber Attack Disclosure', 'A.P. Møller - Mærsk A/S', 'Corporate Disclosure', '2017-08-16', 'https://www.maersk.com/news/articles/2017/08/16/interim-report-q2-2017', 'Primary / Official'),
('src-merck-sec', 'Merck & Co. Form 10-K SEC Filing 2017 Cyber Incident', 'U.S. Securities and Exchange Commission', 'Corporate Disclosure', '2018-02-27', 'https://www.sec.gov/edgar/browse/?CIK=0000310158', 'Primary / Official'),
('src-fedex-sec', 'FedEx Corp Form 10-K TNT Express Cyberattack Disclosure', 'U.S. Securities and Exchange Commission', 'Corporate Disclosure', '2018-07-16', 'https://www.sec.gov/edgar/browse/?CIK=0001048911', 'Primary / Official'),
('src-doj-indict', 'Six Russian GRU Officers Indicted for Worldwide Cyberattacks', 'U.S. Department of Justice', 'Government / Advisory', '2020-10-19', 'https://www.justice.gov/opa/pr/six-russian-gru-officers-charged-connection-worldwide-deployment-destructive-malware', 'Primary / Official');

-- 2. INCIDENTS
INSERT INTO incidents (incident_id, name, aliases, date_started, origin_region, classification, attribution_assessment, attribution_confidence, estimated_damage_usd, description) VALUES
('inc-notpetya-2017', 'The NotPetya Cyber Incident', ARRAY['NotPetya', 'Nyetya', 'Petna', 'ExPetr', 'Diskcoder.C'], '2017-06-27', 'Ukraine (Global Blast Radius)', 'Destructive Cyberweapon / Wiper Masquerading as Ransomware', 'Sandworm Team / GRU Unit 74455 (Main Intelligence Directorate, Russian Federation)', 'High (Multi-government joint attribution: US, UK, AUS, CAN, NZ, EU)', 10000000000, 'On June 27, 2017, a devastating cyberattack initiated via a compromised software update to M.E.Doc accounting software paralyzed corporate networks across Ukraine before spreading globally via automated SMB exploits and credential harvesting. Despite displaying a ransom note demanding $300 in Bitcoin, the malware permanently overwrote drive sectors and encrypted Master File Tables with unrecoverable keys, inflicting over $10 billion in damage worldwide.');

-- 3. ATTACK STAGES
INSERT INTO attack_stages (stage_id, stage_number, stage_name, tactic, description) VALUES
('stg-1', 1, 'Initial Supply-Chain Access', 'Initial Access', 'Compromise of the M.E.Doc tax software build and distribution pipeline in Ukraine.'),
('stg-2', 2, 'Automated Execution & Privilege Inheritance', 'Execution', 'Spawning the perfc.dat payload with elevated updater process tokens and system privileges.'),
('stg-3', 3, 'Memory Credential Harvesting', 'Credential Access', 'Extracting plaintext passwords, NTLM hashes, and Kerberos tickets from LSASS memory via embedded Mimikatz.'),
('stg-4', 4, 'Host & Network Discovery', 'Discovery', 'Automated scanning of subnets, ARP cache tables, DHCP leases, and Active Directory domains.'),
('stg-5', 5, 'Dual-Vector Lateral Movement', 'Lateral Movement', 'Simultaneous propagation using EternalBlue/EternalRomance for unpatched hosts and PsExec/WMIC with stolen credentials for patched hosts.'),
('stg-6', 6, 'Permanent System & Disk Destruction', 'Impact', 'Overwriting the Master Boot Record with a corrupt bootloader and irreversibly encrypting the NTFS Master File Table with Salsa20.');

-- 4. ATTACK TECHNIQUES
INSERT INTO attack_techniques (technique_id, mitre_id, technique_name, tactic, description, observed_behavior, detection_opportunity, mitigation_strategy, source_id) VALUES
('tech-t1195-002', 'T1195.002', 'Supply Chain Compromise: Compromise Software Supply Chain', 'Initial Access', 'Adversaries manipulate application code or update mechanisms prior to delivery to consumers.', 'Backdoored DLL (ZvitPublishedObjects.dll) delivered through official M.E.Doc accounting software update servers to Ukrainian corporate systems.', 'Monitor updater processes for unusual network egress or child process spawning.', 'Enforce software bill of materials (SBOM), binary attestation, and segmented updater isolation.', 'src-eset-telebots'),
('tech-t1059-003', 'T1059.003', 'Command and Scripting Interpreter: Windows Command Shell', 'Execution', 'Adversaries abuse command line interpreters to execute commands and utilities.', 'Invoked rundll32.exe to execute perfc.dat export #1; scheduled force reboots via shutdown.exe /r /f.', 'Audit process execution of command shells spawning from non-administrative parent binaries.', 'Restrict standard users from running administrative utilities and monitor process genealogy.', 'src-ms-analysis'),
('tech-t1003-001', 'T1003.001', 'OS Credential Dumping: LSASS Memory', 'Credential Access', 'Adversaries attempt to dump credentials from the Local Security Authority Subsystem Service (LSASS) process memory.', 'Embedded customized 32-bit and 64-bit Mimikatz modules injected into processes to extract plaintext credentials and NTLM hashes.', 'Alert on PROCESS_VM_READ access requests to lsass.exe from unauthorized binaries.', 'Enable Windows Defender Credential Guard, LSA Protection (RunAsPPL), and restricted admin mode.', 'src-mitre-s0368'),
('tech-t1046', 'T1046', 'Network Service Discovery', 'Discovery', 'Adversaries attempt to get a listing of services running on remote hosts.', 'Enumerated network adapters, ARP tables, and subnet broadcast ranges targeting TCP ports 139 and 445.', 'Detect anomalous rapid internal TCP 445 port-sweep behaviors across broadcast subnets.', 'Implement internal network microsegmentation and IDS alerts on sweep patterns.', 'src-cisa-alert'),
('tech-t1210', 'T1210', 'Exploitation of Remote Services', 'Lateral Movement', 'Adversaries exploit vulnerabilities in network services to move laterally.', 'Weaponized NSA EternalBlue (CVE-2017-0144) and EternalRomance (CVE-2017-0145) SMBv1 flaws to remotely execute shellcode without authentication.', 'Network signatures for SMBv1 buffer overflow negotiation packets (Tree Connect AndX).', 'Disable SMBv1 completely and enforce security patch MS17-010 across all endpoints.', 'src-msrc-ms17010'),
('tech-t1570', 'T1570', 'Lateral Tool Transfer', 'Lateral Movement', 'Adversaries transfer tools or files between systems within an environment.', 'Copied perfc.dat to remote ADMIN$ network shares using stolen credentials.', 'Monitor and alert on abnormal file writes to ADMIN$ and IPC$ administrative shares.', 'Disable SMB file sharing across internal workstations and restrict administrative share access.', 'src-talos-nyetya'),
('tech-t1021-002', 'T1021.002', 'Remote Services: SMB/Windows Admin Shares', 'Lateral Movement', 'Adversaries abuse SMB and administrative shares to execute code on remote endpoints.', 'Used stolen credentials with PsExec-like functionality to launch remote commands on patched workstations.', 'Log and correlate Event ID 4624 (Type 3 network logon) followed by Service Installation (Event ID 7045).', 'Apply Least Privilege Administrative Models (Tiered Active Directory administration).', 'src-mitre-s0368'),
('tech-t1047', 'T1047', 'Windows Management Instrumentation', 'Execution', 'Adversaries abuse WMI to execute malicious commands and scripts remotely.', 'Executed wmic.exe /node:\"<IP>\" process call create to launch perfc.dat on remote targets using harvested domain credentials.', 'Monitor WMI process creation events (Sysmon Event ID 19, 20, 21) and wmic.exe CLI activity.', 'Restrict RPC/DCOM communication between workstations; filter RPC endpoint mapper.', 'src-cisa-alert'),
('tech-t1561-002', 'T1561.002', 'Disk Wipe: Disk Structure Wipe', 'Impact', 'Adversaries erase or corrupt storage structures such as partition tables or Master Boot Records.', 'Overwrote Sector 0 (MBR) with a destructive 16-bit bootloader and encrypted the Master File Table (MFT) using Salsa20 with a randomly discarded key.', 'Heuristic detection of direct PhysicalDrive0 write access by non-system disk utilities.', 'Deploy EDR solutions that enforce disk volume lock-down and block raw disk write operations.', 'src-kaspersky-wiper'),
('tech-t1486', 'T1486', 'Data Encrypted for Impact', 'Impact', 'Adversaries encrypt data on target systems to interrupt availability.', 'Encrypted target documents and user files with AES-128; however, recovery key was fabricated, making it a pure wiper.', 'File creation bursts with known extension modifications and ransom note drops.', 'Maintain immutable offline backups with verified isolated restoration testing.', 'src-kaspersky-wiper');

-- 5. TIMELINE EVENTS (Sourced, without unsupported exact timestamps)
INSERT INTO timeline_events (event_id, incident_id, event_date, sequence_number, time_label, category, severity, title, description, technical_significance, source_id) VALUES
('evt-01', 'inc-notpetya-2017', '2017-06-27', 1, 'Morning (~10:30 UTC)', 'INFECTION', 'critical', 'Trojanized Software Update Delivered via M.E.Doc', 'Sandworm threat operators pushed a trojanized update (containing backdoored ZvitPublishedObjects.dll) through M.E.Doc tax reporting software servers in Ukraine.', 'Supply-chain vector bypassed boundary firewalls and perimeter defenses directly into corporate environments.', 'src-eset-telebots'),
('evt-02', 'inc-notpetya-2017', '2017-06-27', 2, 'Late Morning', 'INFECTION', 'critical', 'Initial Endpoint Execution & Disk Destruction Routine', 'The dropped perfc.dat binary executed with elevated privileges, immediately preparing the MBR overwrite routine and initiating a 60-minute shutdown timer.', 'Execution scheduled a forced reboot (shutdown.exe /r /f) to trigger the corrupt bootloader before defenders could react.', 'src-kaspersky-wiper'),
('evt-03', 'inc-notpetya-2017', '2017-06-27', 3, 'Late Morning', 'PROPAGATION', 'critical', 'Automated SMB Lateral Exploitation (EternalBlue/EternalRomance)', 'NotPetya scanned local subnets for open TCP 445 ports and weaponized SMBv1 buffer overflow vulnerabilities to compromise remote systems unpatched for MS17-010.', 'Spread occurred automatically without any user interaction or phishing requirement.', 'src-msrc-ms17010'),
('evt-04', 'inc-notpetya-2017', '2017-06-27', 4, 'Midday', 'PROPAGATION', 'critical', 'LSASS In-Memory Credential Dumping via Mimikatz', 'Embedded Mimikatz modules dumped plaintext domain credentials and NTLM tokens from memory, launching remote executions via PsExec and WMIC.', 'Allowed the worm to leap onto fully patched Windows systems across network segments where domain administrators had logged in.', 'src-ms-analysis'),
('evt-05', 'inc-notpetya-2017', '2017-06-27', 5, 'Midday', 'IMPACT', 'critical', 'Maersk Global IT Infrastructure Disrupted', 'Global shipping giant A.P. Møller-Maersk experienced enterprise-wide infrastructure failure across 76 ports worldwide after a single Ukrainian subsidiary machine propagated the malware.', 'Paralyzed 45,000 workstations, 4,000 servers, and terminal cargo operational systems globally.', 'src-maersk-2017'),
('evt-06', 'inc-notpetya-2017', '2017-06-27', 6, 'Early Afternoon', 'IMPACT', 'critical', 'Ukrainian Critical Infrastructure & Banking Paralyzed', 'National Bank of Ukraine, Kyiv Boryspil Airport, radiation monitoring stations at Chernobyl, and government ministries were knocked offline.', 'Direct operational consequences forced Chernobyl technicians to conduct manual dosimeter measurements.', 'src-cisa-alert'),
('evt-07', 'inc-notpetya-2017', '2017-06-27', 7, 'Afternoon', 'IMPACT', 'critical', 'Multinational Corporations Paralyzed (Merck, FedEx TNT, Saint-Gobain)', 'Multinational companies with Ukrainian corporate connections suffered rapid worldwide system shutdowns, disrupting global vaccine manufacturing and parcel delivery.', 'Merck sustained ~$870M and FedEx TNT sustained ~$400M in irrecoverable enterprise losses.', 'src-merck-sec'),
('evt-08', 'inc-notpetya-2017', '2017-06-27', 8, 'Evening', 'DISCOVERY', 'high', 'Forensic Researchers Identify Irreversible Wiper Mechanics', 'Security researchers at Kaspersky, ESET, and Comae Technologies reverse-engineered the payload and revealed that the encryption key was randomly discarded.', 'Conclusively proved that NotPetya was state-sponsored destructive sabotage, not commercial cybercrime extortion.', 'src-kaspersky-wiper'),
('evt-09', 'inc-notpetya-2017', '2017-06-27', 9, 'Night', 'DISCOVERY', 'medium', 'Vaccination Artifact Identified (C:\\Windows\\perfc)', 'Security researcher Amit Serper discovered that creating a read-only file named perfc in the Windows directory aborted malware execution.', 'Provided immediate temporary endpoint vaccination while networks were isolated and remediated.', 'src-cisa-alert'),
('evt-10', 'inc-notpetya-2017', '2017-06-28', 10, 'Next Day', 'RESPONSE', 'high', 'Ukrainian Cyber Police Seize M.E.Doc Infrastructure', 'Ukrainian authorities conducted forensic seizures of Intellect Service servers to halt secondary update distributions.', 'Forensic analysis confirmed that M.E.Doc servers had been breached months prior to the June attack.', 'src-eset-telebots'),
('evt-11', 'inc-notpetya-2017', '2018-02-15', 11, 'February 2018', 'RESPONSE', 'high', 'Five Eyes & Allied Joint Formal Attribution to Russian GRU', 'The United States, United Kingdom, Australia, Canada, New Zealand, and European allies formally attributed NotPetya to the Russian military (GRU Unit 74455 / Sandworm).', 'Represented one of the largest multi-national public cyber attribution disclosures in modern history.', 'src-wh-2018');

-- 6. MALWARE COMPONENTS
INSERT INTO malware_components (component_id, incident_id, name, component_type, purpose, behavior, source_id) VALUES
('comp-medoc-backdoor', 'inc-notpetya-2017', 'ZvitPublishedObjects.dll', 'Supply Chain Backdoor', 'Establish long-term persistent access into M.E.Doc user environments.', 'Intercepted software update routines, exfiltrated corporate tax ID numbers (EDRPOU), and downloaded stage-2 payloads from C2 (84.200.16.242).', 'src-eset-telebots'),
('comp-perfc-dat', 'inc-notpetya-2017', 'perfc.dat', 'Primary Dropper & Coordinator', 'Coordinate local credential harvesting, lateral worm spreading, and disk destruction.', 'Export #1 loaded by rundll32.exe; checks for vaccination file, drops secondary modules, scans subnets, and schedules reboot.', 'src-ms-analysis'),
('comp-mimikatz-mod', 'inc-notpetya-2017', 'Embedded Mimikatz Module', 'In-Memory Credential Stealer', 'Harvest domain and local administrative credentials from RAM.', 'Stripped-down 32-bit and 64-bit binaries extracted plaintext passwords, NTLM hashes, and Kerberos tickets directly from the LSASS process.', 'src-mitre-s0368'),
('comp-eternal-worm', 'inc-notpetya-2017', 'EternalBlue / EternalRomance Module', 'Remote Exploitation Engine', 'Propagate across local networks without authentication via SMBv1 vulnerabilities.', 'Crafted SMB_COM_TRANSACTION2 packets sent to port 445 triggering kernel pool memory corruptions in srv.sys driver.', 'src-msrc-ms17010'),
('comp-psexec-wmic', 'inc-notpetya-2017', 'PsExec & WMIC Deployment Engine', 'Credential-Based Execution Module', 'Execute malware remotely on patched systems using legitimate administrative protocols.', 'Copied perfc.dat to ADMIN$ shares and invoked execution using Windows Management Instrumentation or Service Control Manager.', 'src-talos-nyetya'),
('comp-bootloader', 'inc-notpetya-2017', 'Corrupt 16-Bit Bootloader & Wiper', 'MBR Overwrite & MFT Wiper', 'Permanently destroy Master Boot Record and encrypt Master File Table.', 'Replaces sector 0 with custom assembly code, displays fake CHKDSK banner while encrypting MFT with Salsa20 using non-recoverable random key.', 'src-kaspersky-wiper');

-- 7. VULNERABILITIES
INSERT INTO vulnerabilities (vulnerability_id, cve_id, ms_bulletin, vulnerability_name, affected_component, cvss_score, description, patch_release_date, source_id) VALUES
('vuln-cve-2017-0144', 'CVE-2017-0144', 'MS17-010', 'EternalBlue SMBv1 Remote Code Execution', 'Microsoft Windows Server Message Block 1.0 (srv.sys)', 9.8, 'Buffer overflow in SMBv1 allows unauthenticated remote attackers to execute arbitrary code with SYSTEM privileges via crafted packets.', '2017-03-14', 'src-msrc-ms17010'),
('vuln-cve-2017-0145', 'CVE-2017-0145', 'MS17-010', 'EternalRomance SMBv1 Type Confusion', 'Microsoft Windows SMBv1 Protocol Implementation', 9.8, 'Type confusion flaw in SMBv1 allows unauthenticated attackers to overwrite security descriptors and achieve arbitrary memory read/write in kernel.', '2017-03-14', 'src-msrc-ms17010');

-- 8. VICTIMS
INSERT INTO victims (victim_id, organization_name, country, sector, impact_summary, estimated_loss_usd, source_id) VALUES
('vic-maersk', 'A.P. Møller - Maersk', 'Denmark (Global Operations)', 'Maritime Logistics & Shipping', 'Complete outage of 45,000 endpoints and 4,000 servers; 76 port terminal booking facilities halted worldwide.', 300000000, 'src-maersk-2017'),
('vic-merck', 'Merck & Co.', 'United States', 'Pharmaceutical & Healthcare', 'Destruction of manufacturing and research networks, forcing temporary cessation of vaccine production.', 870000000, 'src-merck-sec'),
('vic-fedex-tnt', 'FedEx / TNT Express', 'Netherlands / United States', 'Transportation & Logistics', 'Near total paralysis of European parcel sorting and operational systems; data permanently destroyed.', 400000000, 'src-fedex-sec'),
('vic-saint-gobain', 'Saint-Gobain', 'France', 'Construction & Building Materials', 'Enterprise logistics, order routing, and industrial plants worldwide halted for multiple weeks.', 384000000, 'src-wh-2018'),
('vic-mondelez', 'Mondelez International', 'United States', 'Food & Consumer Goods', 'Order processing and shipping operations seized, leading to global inventory and retail shipment delays.', 188000000, 'src-wh-2018'),
('vic-reckitt', 'Reckitt Benckiser', 'United Kingdom', 'Consumer Health & Hygiene', 'Factory production interrupted across multiple manufacturing hubs globally.', 130000000, 'src-wh-2018'),
('vic-ukraine-infra', 'Ukrainian Critical Infrastructure (Grid & Transit)', 'Ukraine', 'Government & Utilities', 'Radiation monitoring at Chernobyl, flight boards at Kyiv Boryspil Airport, and state banking paralyzed.', 1000000000, 'src-cisa-alert');

-- 9. IMPACT EVENTS (Distinguishing direct malware actions from enterprise consequences)
INSERT INTO impact_events (impact_id, victim_id, impact_type, severity, direct_malware_action, operational_consequence, recovery_duration_days, recovery_notes, source_id) VALUES
('imp-01', 'vic-maersk', 'Active Directory Infrastructure Disruption', 'Catastrophic', 'MBR overwrite and MFT encryption destroyed local and server storage on all reachable domain controllers.', 'Domain infrastructure rendered completely unavailable; shipping staff reverted to manual whiteboards across 76 global ports.', 10, 'A lone offline Domain Controller in Ghana (saved by a local power outage) was flown to Maidenhead, UK to seed the enterprise AD rebuild.', 'src-maersk-2017'),
('imp-02', 'vic-merck', 'Pharmaceutical Manufacturing Shutdown', 'Catastrophic', 'Malware corrupted Active Directory forest and encrypted manufacturing execution system databases.', 'Ceased bulk formulation of Gardasil HPV vaccines, requiring government emergency stockpile requests.', 60, 'Rebuilt thousands of servers and validated sterile manufacturing environments over two months.', 'src-merck-sec'),
('imp-03', 'vic-fedex-tnt', 'Logistics Operations Halt', 'Catastrophic', 'Irreversible encryption of TNT Express shipment routing and sorting hubs across Europe.', 'Permanent loss of legacy operational databases; package delivery operations forced into paper records.', 90, 'FedEx incurred hundreds of millions in accelerated IT modernisation and lost market volume.', 'src-fedex-sec'),
('imp-04', 'vic-ukraine-infra', 'Chernobyl Radiation Monitoring System Disruption', 'Critical', 'Automated radiation sensing server workstations rendered unbootable after MBR wipe.', 'Technicians forced to don manual dosimeters and conduct physical manual perimeter radiation surveys.', 5, 'Environmental safety confirmed; systems reimaged and hardened.', 'src-cisa-alert');

-- 10. MITIGATIONS
INSERT INTO mitigations (mitigation_id, mitigation_name, category, description, implementation_concept, source_id) VALUES
('mit-disable-smbv1', 'Disable SMBv1 & Apply MS17-010', 'Protocol Hardening', 'Completely deprecate and remove SMBv1 protocol drivers from all Windows systems and apply security bulletin MS17-010.', 'Remove-WindowsFeature FS-SMB1 via PowerShell and block port 445 at internal subnet boundaries.', 'src-msrc-ms17010'),
('mit-cred-guard', 'Windows Defender Credential Guard', 'Identity & Memory Protection', 'Isolate LSASS memory in a hardware-virtualized container to prevent memory scraping tools.', 'Enable Virtualization-Based Security (VBS) and LSA Protection (RunAsPPL) to block unauthorized memory read operations.', 'src-ms-analysis'),
('mit-net-seg', 'Internal Workstation Microsegmentation', 'Network Architecture', 'Prevent peer-to-peer workstation lateral communication across corporate subnets.', 'Implement host-based firewalls blocking workstation-to-workstation TCP 139/445 traffic; restrict RPC/DCOM.', 'src-cisa-alert'),
('mit-supply-chain-val', 'Software Supply Chain Verification (SLSA)', 'Supply Chain Security', 'Implement rigorous verification, binary attestation, and staging environments for vendor updates.', 'Validate cryptographic digital signatures, monitor update process egress, and test updates in isolated sandbox rings.', 'src-eset-telebots'),
('mit-tier-admin', 'Tiered Administrative Security Model', 'Privilege Management', 'Prevent Domain Admins from logging into standard workstations to deny credential harvesting opportunities.', 'Enforce Active Directory Administrative Tiering (Tier 0 Domain Controllers, Tier 1 Servers, Tier 2 Endpoints).', 'src-mitre-s0368');

-- 11. JUNCTION TABLE ASSOCIATIONS
-- Incident Techniques
INSERT INTO incident_techniques (incident_id, technique_id) VALUES
('inc-notpetya-2017', 'tech-t1195-002'),
('inc-notpetya-2017', 'tech-t1059-003'),
('inc-notpetya-2017', 'tech-t1003-001'),
('inc-notpetya-2017', 'tech-t1046'),
('inc-notpetya-2017', 'tech-t1210'),
('inc-notpetya-2017', 'tech-t1570'),
('inc-notpetya-2017', 'tech-t1021-002'),
('inc-notpetya-2017', 'tech-t1047'),
('inc-notpetya-2017', 'tech-t1561-002'),
('inc-notpetya-2017', 'tech-t1486');

-- Technique Vulnerabilities
INSERT INTO technique_vulnerabilities (technique_id, vulnerability_id) VALUES
('tech-t1210', 'vuln-cve-2017-0144'),
('tech-t1210', 'vuln-cve-2017-0145');

-- Incident Victims
INSERT INTO incident_victims (incident_id, victim_id) VALUES
('inc-notpetya-2017', 'vic-maersk'),
('inc-notpetya-2017', 'vic-merck'),
('inc-notpetya-2017', 'vic-fedex-tnt'),
('inc-notpetya-2017', 'vic-saint-gobain'),
('inc-notpetya-2017', 'vic-mondelez'),
('inc-notpetya-2017', 'vic-reckitt'),
('inc-notpetya-2017', 'vic-ukraine-infra');

-- Stage Techniques
INSERT INTO stage_techniques (stage_id, technique_id) VALUES
('stg-1', 'tech-t1195-002'),
('stg-2', 'tech-t1059-003'),
('stg-3', 'tech-t1003-001'),
('stg-4', 'tech-t1046'),
('stg-5', 'tech-t1210'),
('stg-5', 'tech-t1570'),
('stg-5', 'tech-t1021-002'),
('stg-5', 'tech-t1047'),
('stg-6', 'tech-t1561-002'),
('stg-6', 'tech-t1486');

-- Mitigation Techniques
INSERT INTO mitigation_techniques (mitigation_id, technique_id) VALUES
('mit-disable-smbv1', 'tech-t1210'),
('mit-cred-guard', 'tech-t1003-001'),
('mit-net-seg', 'tech-t1046'),
('mit-net-seg', 'tech-t1021-002'),
('mit-supply-chain-val', 'tech-t1195-002'),
('mit-tier-admin', 'tech-t1003-001'),
('mit-tier-admin', 'tech-t1021-002');
