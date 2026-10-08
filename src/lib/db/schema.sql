-- ============================================================================
-- THE NOTPETYA CYBER WAR // ACADEMIC DATABASE SCHEMA (3NF RELATIONAL MODEL)
-- Course: Database Management Systems (DBMS) - Case Study Investigation Engine
-- Target Engine: PostgreSQL 14+
-- ============================================================================

-- Drop existing tables in reverse dependency order
DROP TABLE IF EXISTS mitigation_techniques CASCADE;
DROP TABLE IF EXISTS stage_techniques CASCADE;
DROP TABLE IF EXISTS incident_victims CASCADE;
DROP TABLE IF EXISTS technique_vulnerabilities CASCADE;
DROP TABLE IF EXISTS incident_techniques CASCADE;
DROP TABLE IF EXISTS mitigations CASCADE;
DROP TABLE IF EXISTS impact_events CASCADE;
DROP TABLE IF EXISTS victims CASCADE;
DROP TABLE IF EXISTS vulnerabilities CASCADE;
DROP TABLE IF EXISTS malware_components CASCADE;
DROP TABLE IF EXISTS attack_techniques CASCADE;
DROP TABLE IF EXISTS attack_stages CASCADE;
DROP TABLE IF EXISTS timeline_events CASCADE;
DROP TABLE IF EXISTS incidents CASCADE;
DROP TABLE IF EXISTS sources CASCADE;

-- ----------------------------------------------------------------------------
-- 1. SOURCES (Authoritative Citable References)
-- ----------------------------------------------------------------------------
CREATE TABLE sources (
    source_id VARCHAR(32) PRIMARY KEY,
    source_name VARCHAR(255) NOT NULL,
    publisher VARCHAR(255) NOT NULL,
    source_type VARCHAR(64) NOT NULL CHECK (source_type IN ('Government / Advisory', 'Threat Intelligence Report', 'Vendor Technical Bulletin', 'MITRE ATT&CK', 'Corporate Disclosure', 'Reputable Journalism')),
    publication_date DATE,
    url TEXT,
    credibility_level VARCHAR(32) NOT NULL DEFAULT 'High' CHECK (credibility_level IN ('Primary / Official', 'High', 'Corroborated Secondary'))
);

-- ----------------------------------------------------------------------------
-- 2. INCIDENTS (Core Threat Entity)
-- ----------------------------------------------------------------------------
CREATE TABLE incidents (
    incident_id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    aliases TEXT[],
    date_started DATE NOT NULL,
    origin_region VARCHAR(128) NOT NULL,
    classification VARCHAR(255) NOT NULL,
    attribution_assessment VARCHAR(255) NOT NULL,
    attribution_confidence VARCHAR(255) NOT NULL,
    estimated_damage_usd BIGINT,
    description TEXT NOT NULL
);

-- ----------------------------------------------------------------------------
-- 3. ATTACK STAGES (Chronological Framework Stages)
-- ----------------------------------------------------------------------------
CREATE TABLE attack_stages (
    stage_id VARCHAR(32) PRIMARY KEY,
    stage_number INT NOT NULL UNIQUE,
    stage_name VARCHAR(128) NOT NULL,
    tactic VARCHAR(128) NOT NULL,
    description TEXT NOT NULL
);

-- ----------------------------------------------------------------------------
-- 4. ATTACK TECHNIQUES (MITRE ATT&CK Aligned Techniques)
-- ----------------------------------------------------------------------------
CREATE TABLE attack_techniques (
    technique_id VARCHAR(32) PRIMARY KEY,
    mitre_id VARCHAR(32) NOT NULL,
    technique_name VARCHAR(255) NOT NULL,
    tactic VARCHAR(128) NOT NULL,
    description TEXT NOT NULL,
    observed_behavior TEXT NOT NULL,
    detection_opportunity TEXT,
    mitigation_strategy TEXT,
    source_id VARCHAR(32) REFERENCES sources(source_id) ON DELETE SET NULL
);
CREATE INDEX idx_attack_techniques_tactic ON attack_techniques(tactic);
CREATE INDEX idx_attack_techniques_mitre ON attack_techniques(mitre_id);

-- ----------------------------------------------------------------------------
-- 5. TIMELINE EVENTS (Verified Event Log)
-- ----------------------------------------------------------------------------
CREATE TABLE timeline_events (
    event_id VARCHAR(32) PRIMARY KEY,
    incident_id VARCHAR(32) NOT NULL REFERENCES incidents(incident_id) ON DELETE CASCADE,
    event_date DATE NOT NULL,
    sequence_number INT NOT NULL,
    time_label VARCHAR(64) NOT NULL, -- e.g. 'Morning (~10:30 UTC)' - avoids unsupported pseudo-exact minutes
    category VARCHAR(64) NOT NULL CHECK (category IN ('INFECTION', 'PROPAGATION', 'IMPACT', 'DISCOVERY', 'RESPONSE')),
    severity VARCHAR(32) NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    technical_significance TEXT NOT NULL,
    source_id VARCHAR(32) REFERENCES sources(source_id) ON DELETE SET NULL
);
CREATE INDEX idx_timeline_events_incident ON timeline_events(incident_id);
CREATE INDEX idx_timeline_events_category ON timeline_events(category);

-- ----------------------------------------------------------------------------
-- 6. MALWARE COMPONENTS (Modular Architecture Breakdown)
-- ----------------------------------------------------------------------------
CREATE TABLE malware_components (
    component_id VARCHAR(32) PRIMARY KEY,
    incident_id VARCHAR(32) NOT NULL REFERENCES incidents(incident_id) ON DELETE CASCADE,
    name VARCHAR(128) NOT NULL,
    component_type VARCHAR(128) NOT NULL, -- e.g. Dropper, Worm Module, Credential Stealer, Wiper Bootloader
    purpose TEXT NOT NULL,
    behavior TEXT NOT NULL,
    source_id VARCHAR(32) REFERENCES sources(source_id) ON DELETE SET NULL
);

-- ----------------------------------------------------------------------------
-- 7. VULNERABILITIES (Exploited CVEs and Bulletins)
-- ----------------------------------------------------------------------------
CREATE TABLE vulnerabilities (
    vulnerability_id VARCHAR(32) PRIMARY KEY,
    cve_id VARCHAR(32) NOT NULL UNIQUE,
    ms_bulletin VARCHAR(32),
    vulnerability_name VARCHAR(255) NOT NULL,
    affected_component VARCHAR(255) NOT NULL,
    cvss_score NUMERIC(3,1),
    description TEXT NOT NULL,
    patch_release_date DATE,
    source_id VARCHAR(32) REFERENCES sources(source_id) ON DELETE SET NULL
);

-- ----------------------------------------------------------------------------
-- 8. VICTIMS (Affected Organizations)
-- ----------------------------------------------------------------------------
CREATE TABLE victims (
    victim_id VARCHAR(32) PRIMARY KEY,
    organization_name VARCHAR(255) NOT NULL,
    country VARCHAR(128) NOT NULL,
    sector VARCHAR(128) NOT NULL,
    impact_summary TEXT NOT NULL,
    estimated_loss_usd BIGINT,
    source_id VARCHAR(32) REFERENCES sources(source_id) ON DELETE SET NULL
);
CREATE INDEX idx_victims_sector ON victims(sector);
CREATE INDEX idx_victims_country ON victims(country);

-- ----------------------------------------------------------------------------
-- 9. IMPACT EVENTS (Detailed Forensic & Operational Impacts per Victim)
-- ----------------------------------------------------------------------------
CREATE TABLE impact_events (
    impact_id VARCHAR(32) PRIMARY KEY,
    victim_id VARCHAR(32) NOT NULL REFERENCES victims(victim_id) ON DELETE CASCADE,
    impact_type VARCHAR(128) NOT NULL, -- e.g. 'Active Directory Disruption', 'Supply Chain Freeze', 'Operational Outage'
    severity VARCHAR(32) NOT NULL CHECK (severity IN ('Catastrophic', 'Critical', 'Severe', 'Moderate')),
    direct_malware_action TEXT NOT NULL, -- Direct technical impact (e.g. MBR overwritten, MFT Salsa20 encrypted)
    operational_consequence TEXT NOT NULL, -- Downstream enterprise consequence (e.g. Booking terminals halted)
    recovery_duration_days INT,
    recovery_notes TEXT,
    source_id VARCHAR(32) REFERENCES sources(source_id) ON DELETE SET NULL
);
CREATE INDEX idx_impact_events_victim ON impact_events(victim_id);
CREATE INDEX idx_impact_events_severity ON impact_events(severity);

-- ----------------------------------------------------------------------------
-- 10. MITIGATIONS (Defensive Countermeasures)
-- ----------------------------------------------------------------------------
CREATE TABLE mitigations (
    mitigation_id VARCHAR(32) PRIMARY KEY,
    mitigation_name VARCHAR(255) NOT NULL,
    category VARCHAR(128) NOT NULL, -- e.g. 'Network Hardening', 'Credential Hygiene', 'Supply Chain Verification'
    description TEXT NOT NULL,
    implementation_concept TEXT NOT NULL,
    source_id VARCHAR(32) REFERENCES sources(source_id) ON DELETE SET NULL
);

-- ----------------------------------------------------------------------------
-- 11. JUNCTION TABLES (Many-to-Many Relationships in 3NF)
-- ----------------------------------------------------------------------------

-- Incident <-> Attack Techniques
CREATE TABLE incident_techniques (
    incident_id VARCHAR(32) REFERENCES incidents(incident_id) ON DELETE CASCADE,
    technique_id VARCHAR(32) REFERENCES attack_techniques(technique_id) ON DELETE CASCADE,
    PRIMARY KEY (incident_id, technique_id)
);

-- Technique <-> Vulnerabilities
CREATE TABLE technique_vulnerabilities (
    technique_id VARCHAR(32) REFERENCES attack_techniques(technique_id) ON DELETE CASCADE,
    vulnerability_id VARCHAR(32) REFERENCES vulnerabilities(vulnerability_id) ON DELETE CASCADE,
    PRIMARY KEY (technique_id, vulnerability_id)
);

-- Incident <-> Victims
CREATE TABLE incident_victims (
    incident_id VARCHAR(32) REFERENCES incidents(incident_id) ON DELETE CASCADE,
    victim_id VARCHAR(32) REFERENCES victims(victim_id) ON DELETE CASCADE,
    PRIMARY KEY (incident_id, victim_id)
);

-- Attack Stage <-> Attack Techniques
CREATE TABLE stage_techniques (
    stage_id VARCHAR(32) REFERENCES attack_stages(stage_id) ON DELETE CASCADE,
    technique_id VARCHAR(32) REFERENCES attack_techniques(technique_id) ON DELETE CASCADE,
    PRIMARY KEY (stage_id, technique_id)
);

-- Mitigation <-> Attack Techniques
CREATE TABLE mitigation_techniques (
    mitigation_id VARCHAR(32) REFERENCES mitigations(mitigation_id) ON DELETE CASCADE,
    technique_id VARCHAR(32) REFERENCES attack_techniques(technique_id) ON DELETE CASCADE,
    PRIMARY KEY (mitigation_id, technique_id)
);
