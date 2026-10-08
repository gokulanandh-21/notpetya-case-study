# THE NOTPETYA CYBER WAR // RELATIONAL DATABASE INVESTIGATION PLATFORM
## College DBMS Project & Interactive Cyber Threat Intelligence Platform

**Live Deployment URL:** [http://notpetya.vercel.app/](http://notpetya.vercel.app/)  
**Database Engine:** PostgreSQL 14+ (Hosted on Neon / Supabase / Prisma Cloud via `pg`)  
**Frontend Framework:** Next.js 16 (App Router) + React 19 + TypeScript + Three.js / React Three Fiber  
**Architecture:** Normalized 3NF Relational Model, Read-Only SQL Policy Guard, Natural Language to SQL Translation Engine.

---

## 1. Project Purpose & Academic Objective

This system bridges **Database Management Systems (DBMS)** theory with real-world **Cyber Threat Intelligence (CTI)**. Rather than presenting static textual case studies or mock frontend data, the platform is driven by a live, normalized **PostgreSQL** database.

Students, analysts, and professors can investigate the 2017 NotPetya cyber incident through two integrated paths:
1. **Natural Language Queries:** Translated on-the-fly into relational SQL with visible syntax inspection before execution.
2. **Manual SQL Console:** Allowing direct execution of arbitrary read-only queries with interactive diagnostics, table pagination, CSV export, and execution latency benchmarks.

---

## 2. Relational Database Architecture (3NF Model)

The database schema strictly adheres to **Third Normal Form (3NF)**:
* **1NF:** All attributes are atomic; multi-valued fields are decomposed into relational tuples.
* **2NF:** No partial functional dependencies; all non-key attributes fully depend on their relation's primary key.
* **3NF:** No transitive dependencies; non-prime attributes depend solely on candidate keys.

```text
                                [ incidents ]
                                      │
            ┌─────────────────────────┼─────────────────────────┐
            │ 1:M                     │ 1:M                     │ M:N
            ▼                         ▼                         ▼
   [ timeline_events ]       [ malware_components ]    [ incident_techniques ]
            │                                                   │
            │ FK: source_id                                     ▼
            ▼                                         [ attack_techniques ]
       [ sources ] ◄────────────────────────────────────────────┼───────────┐
            ▲                                                   │ M:N       │ M:N
            │ FK: source_id                                     ▼           ▼
            │                                        [ stage_techniques ]  [ technique_vulnerabilities ]
            ├─────────────────────────────────────────► [ attack_stages ]           │
            │                                                                       ▼
            ├─────────────────────────────────────────────────────────────► [ vulnerabilities ]
            │
            ├─────────────────────────────────────────► [ mitigations ]
            │                                                   │ M:N
            │                                                   ▼
            │                                        [ mitigation_techniques ]
            │
            ├─────────────────────────────────────────► [ victims ]
            │                                                   │ 1:M
            │                                                   ▼
            └────────────────────────────────────────► [ impact_events ]
```

### Relational Tables Summary:

| Table Name | Entity Role | Cardinality & Relationships | Purpose |
| :--- | :--- | :--- | :--- |
| `incidents` | Core Incident Root | Parent of events & components | Primary registry of the cyber operation. |
| `sources` | Reference Registry | Foreign key parent for all forensic records | Authoritative citations (CISA, NCSC, White House, Microsoft). |
| `attack_stages` | Sequential Phases | 1:M with `stage_techniques` | 6 Kill-chain stages from initial access to disk wipe. |
| `attack_techniques` | MITRE ATT&CK Matrix | M:N via `incident_techniques`, `stage_techniques` | Observed tactics (EternalBlue, Mimikatz, WMIC, MBR wipe). |
| `timeline_events` | Forensic Audit Log | Child of `incidents` (FK), references `sources` | Chronological event milestones with approximate timing. |
| `malware_components` | Modular Architecture | Child of `incidents` (FK), references `sources` | Breakdown of components (`perfc.dat`, wiper assembly, etc.). |
| `vulnerabilities` | Exploited CVEs | M:N with `attack_techniques` | SMBv1 flaws (CVE-2017-0144 / CVE-2017-0145). |
| `victims` | Afflicted Entities | 1:M with `impact_events` | Multinationals (Maersk, Merck, FedEx TNT, Saint-Gobain). |
| `impact_events` | Forensic Impact Breakdown | Child of `victims` (FK), references `sources` | Distinguishes direct malware action from operational disruption. |
| `mitigations` | Defense Controls | M:N with `attack_techniques` | Hardening controls (SMBv1 deprecation, Credential Guard). |
| `incident_techniques` | Junction Table | Composite PK `(incident_id, technique_id)` | Resolves M:N mapping between incident and techniques. |
| `technique_vulnerabilities` | Junction Table | Composite PK `(technique_id, vulnerability_id)` | Maps attack techniques to specific CVEs. |
| `stage_techniques` | Junction Table | Composite PK `(stage_id, technique_id)` | Maps kill chain stages to granular MITRE techniques. |
| `mitigation_techniques` | Junction Table | Composite PK `(mitigation_id, technique_id)` | Maps mitigations to target attack techniques. |

---

## 3. Security Architecture & Read-Only Policy Enforcement

Because the query engine is exposed to users, **untrusted input is never executed naively**:

1. **Strict Read-Only AST & Lexical Parsing:**
   - Queries must strictly begin with `SELECT` or `WITH`.
   - Any statement containing DDL/DML keywords (`INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `TRUNCATE`, `GRANT`, `REVOKE`, `PG_SLEEP`, `INTO`) is blocked prior to execution with an educational rejection warning.
2. **Single Statement Enforcement:**
   - Semicolon-delimited statement stacking (`SELECT ...; DROP TABLE ...;`) is detected and rejected.
3. **Execution Guardrails:**
   - Statement runtime timeout is capped at `5000ms` via `SET statement_timeout = 5000`.
   - Results are automatically capped at `100` rows using automatic `LIMIT` injection if unbounded.
4. **Credential Isolation:**
   - Database credentials exist solely in server-side environment variables (`DATABASE_URL`). No secrets are bundled in client assets.

---

## 4. Academic Demo Queries (Benchmark Suite)

The query engine comes pre-configured with benchmark queries demonstrating foundational DBMS operations:

### Query 1: Full Relation Scan
```sql
SELECT * FROM attack_techniques;
```

### Query 2: Selection (Filtering with WHERE)
```sql
SELECT technique_name, mitre_id 
FROM attack_techniques 
WHERE tactic = 'Lateral Movement';
```

### Query 3: Entity Inspection
```sql
SELECT * FROM vulnerabilities;
```

### Query 4: Projection (Specific Column Retrieval)
```sql
SELECT organization_name, country, sector 
FROM victims;
```

### Query 5: Aggregation & Grouping (GROUP BY)
```sql
SELECT impact_type, COUNT(*) 
FROM impact_events 
GROUP BY impact_type;
```

### Query 6: Sorting & Ranking (ORDER BY DESC)
```sql
SELECT tactic, COUNT(*) 
FROM attack_techniques 
GROUP BY tactic 
ORDER BY COUNT(*) DESC;
```

### Query 7: Relational Inner Join (2 Tables)
```sql
SELECT v.organization_name, i.impact_type 
FROM victims v 
JOIN impact_events i ON v.victim_id = i.victim_id;
```

### Query 8: Multi-Table Join via Junction Table (3 Tables)
```sql
SELECT a.technique_name, s.stage_name 
FROM attack_techniques a 
JOIN stage_techniques st ON a.technique_id = st.technique_id 
JOIN attack_stages s ON st.stage_id = s.stage_id;
```

---

## 5. Natural Language Query Translation Architecture

```text
User Question: "Show all lateral movement techniques"
        │
        ▼
[ API: /api/nl-query ]
        │
        ├─► Primary: Groq API (LLaMA-3.3-70B with System Schema Constraints)
        │
        └─► Fallback: Deterministic Cyber Rules Engine
        │
        ▼
[ Generated SQL Display ] ──► "SELECT mitre_id, technique_name, tactic, description FROM attack_techniques WHERE tactic = 'Lateral Movement';"
        │
        ▼
[ Security & Policy Validator ] (Blocks DDL/DML, validates relation names)
        │
        ▼
[ API: /api/query ] ──► PostgreSQL Execution (Pool Client, 5000ms statement timeout)
        │
        ▼
[ Client Response: Latency, Row Count, Fields, Table UI, CSV Export ]
```

---

## 6. How to Deploy to Vercel

The application is completely configured for zero-configuration Vercel deployment:

1. **Via Vercel Web Dashboard (Drag & Drop):**
   - Open [https://vercel.com/new/drop](https://vercel.com/new/drop).
   - Drag and drop this folder (`notpetya-deploy`).
   - Add environment variable `DATABASE_URL` under Project Settings if not already configured.
   
2. **Via Git:**
   ```bash
   git add .
   git commit -m "feat: complete academic PostgreSQL DBMS investigation platform"
   git push origin main
   ```

---

## 7. Factual Audit & Corrections Applied

Per academic standards, the following technical inaccuracies were audited and resolved:
1. **TradeLens Removed:** Removed all claims referencing TradeLens during the 2017 incident. Replaced with historically verified descriptions: *“cargo booking systems, terminal systems, and logistics operations”*.
2. **Code Signing Precision:** Removed statements claiming the NotPetya binary itself was signed with a legitimate certificate. Clarified that NotPetya was delivered through a compromised trusted updater mechanism.
3. **Timeline Precision:** Removed unsupported minute-level timestamps; converted timeline into phase-oriented and approximate sequenced intervals.
4. **Market Saturation Claims:** Qualified Ukrainian distribution phrasing to *“mandated tax software used by the vast majority of businesses operating in Ukraine”* avoiding unsubstantiated exact percentages.
5. **Infrastructure Impact:** Refined language from *“Domain Controllers destroyed”* to *“Active Directory infrastructure rendered unavailable across global operations”*, accurately distinguishing direct malware actions from operational fallout.
