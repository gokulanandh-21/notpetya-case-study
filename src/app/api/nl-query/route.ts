import { NextRequest, NextResponse } from 'next/server';
import { validateSql } from '@/lib/db/validator';

const SYSTEM_SCHEMA_PROMPT = `
You are a PostgreSQL Database Architect assisting cyber threat intelligence analysts investigating the 2017 NotPetya cyber incident.
Convert the user's natural language question into a single, syntactically correct, read-only PostgreSQL SELECT query.

DATABASE SCHEMA:
1. incidents (incident_id VARCHAR PK, name VARCHAR, aliases TEXT[], date_started DATE, origin_region VARCHAR, classification VARCHAR, attribution_assessment VARCHAR, attribution_confidence VARCHAR, estimated_damage_usd BIGINT, description TEXT)
2. attack_stages (stage_id VARCHAR PK, stage_number INT, stage_name VARCHAR, tactic VARCHAR, description TEXT)
3. attack_techniques (technique_id VARCHAR PK, mitre_id VARCHAR, technique_name VARCHAR, tactic VARCHAR, description TEXT, observed_behavior TEXT, detection_opportunity TEXT, mitigation_strategy TEXT, source_id VARCHAR FK)
4. timeline_events (event_id VARCHAR PK, incident_id VARCHAR FK, event_date DATE, sequence_number INT, time_label VARCHAR, category VARCHAR, severity VARCHAR, title VARCHAR, description TEXT, technical_significance TEXT, source_id VARCHAR FK)
5. malware_components (component_id VARCHAR PK, incident_id VARCHAR FK, name VARCHAR, component_type VARCHAR, purpose TEXT, behavior TEXT, source_id VARCHAR FK)
6. vulnerabilities (vulnerability_id VARCHAR PK, cve_id VARCHAR, ms_bulletin VARCHAR, vulnerability_name VARCHAR, affected_component VARCHAR, cvss_score NUMERIC, description TEXT, patch_release_date DATE, source_id VARCHAR FK)
7. victims (victim_id VARCHAR PK, organization_name VARCHAR, country VARCHAR, sector VARCHAR, impact_summary TEXT, estimated_loss_usd BIGINT, source_id VARCHAR FK)
8. impact_events (impact_id VARCHAR PK, victim_id VARCHAR FK, impact_type VARCHAR, severity VARCHAR, direct_malware_action TEXT, operational_consequence TEXT, recovery_duration_days INT, recovery_notes TEXT, source_id VARCHAR FK)
9. mitigations (mitigation_id VARCHAR PK, mitigation_name VARCHAR, category VARCHAR, description TEXT, implementation_concept TEXT, source_id VARCHAR FK)
10. sources (source_id VARCHAR PK, source_name VARCHAR, publisher VARCHAR, source_type VARCHAR, publication_date DATE, url TEXT, credibility_level VARCHAR)
11. incident_techniques (incident_id VARCHAR, technique_id VARCHAR)
12. technique_vulnerabilities (technique_id VARCHAR, vulnerability_id VARCHAR)
13. incident_victims (incident_id VARCHAR, victim_id VARCHAR)
14. stage_techniques (stage_id VARCHAR, technique_id VARCHAR)
15. mitigation_techniques (mitigation_id VARCHAR, technique_id VARCHAR)

STRICT RULES:
1. Return ONLY the raw SQL SELECT statement. No markdown code fences (\`\`\`sql), no explanations, no commentary.
2. Only SELECT queries are permitted. Never output INSERT, UPDATE, DELETE, DROP, ALTER, TRUNCATE, etc.
3. Use exact table and column names from the schema above.
4. For case-insensitive text matching, use ILIKE.
5. Limit results to 50 if unbounded.
6. Target valid PostgreSQL syntax.
`;

// Fallback deterministic SQL generator for core patterns if LLM fails or is unconfigured
function generateDeterministicSql(nlQuery: string): string {
  const q = nlQuery.toLowerCase().trim();

  if (q.includes('lateral movement')) {
    return "SELECT mitre_id, technique_name, tactic, description FROM attack_techniques WHERE tactic = 'Lateral Movement';";
  }
  if (q.includes('vulnerabilit') || q.includes('cve') || q.includes('exploit')) {
    return 'SELECT cve_id, ms_bulletin, vulnerability_name, affected_component, cvss_score FROM vulnerabilities;';
  }
  if (q.includes('credential access') || q.includes('mimikatz') || q.includes('lsass')) {
    return "SELECT mitre_id, technique_name, observed_behavior, detection_opportunity FROM attack_techniques WHERE tactic = 'Credential Access';";
  }
  if (q.includes('malware') || q.includes('component')) {
    return 'SELECT name, component_type, purpose, behavior FROM malware_components ORDER BY name;';
  }
  if (q.includes('victim') && (q.includes('ukraine') || q.includes('country'))) {
    return "SELECT organization_name, country, sector, impact_summary FROM victims WHERE country ILIKE '%Ukraine%';";
  }
  if (q.includes('victim') || q.includes('organization') || q.includes('affected')) {
    return 'SELECT organization_name, country, sector, estimated_loss_usd FROM victims ORDER BY estimated_loss_usd DESC NULLS LAST;';
  }
  if (q.includes('initial access') || q.includes('m.e.doc') || q.includes('supply chain')) {
    return "SELECT technique_name, observed_behavior, mitigation_strategy FROM attack_techniques WHERE tactic = 'Initial Access';";
  }
  if (q.includes('smb') || q.includes('eternalblue')) {
    return "SELECT a.technique_name, a.mitre_id, v.cve_id, v.vulnerability_name FROM attack_techniques a JOIN technique_vulnerabilities tv ON a.technique_id = tv.technique_id JOIN vulnerabilities v ON tv.vulnerability_id = v.vulnerability_id;";
  }
  if (q.includes('high severity') || q.includes('catastrophic') || (q.includes('impact') && q.includes('sever'))) {
    return "SELECT v.organization_name, i.impact_type, i.severity, i.operational_consequence FROM victims v JOIN impact_events i ON v.victim_id = i.victim_id WHERE i.severity IN ('Catastrophic', 'Critical');";
  }
  if (q.includes('timeline') || q.includes('what happened') || q.includes('events')) {
    return 'SELECT time_label, category, severity, title, description FROM timeline_events ORDER BY sequence_number;';
  }
  if (q.includes('mitigation') || q.includes('stop') || q.includes('defense') || q.includes('prevent')) {
    return 'SELECT mitigation_name, category, description, implementation_concept FROM mitigations ORDER BY category;';
  }
  if (q.includes('attribution') || q.includes('actor') || q.includes('who') || q.includes('sandworm')) {
    return 'SELECT name, origin_region, attribution_assessment, attribution_confidence, estimated_damage_usd FROM incidents;';
  }
  if (q.includes('stage') && q.includes('technique')) {
    return 'SELECT s.stage_number, s.stage_name, a.mitre_id, a.technique_name FROM attack_stages s JOIN stage_techniques st ON s.stage_id = st.stage_id JOIN attack_techniques a ON st.technique_id = a.technique_id ORDER BY s.stage_number;';
  }
  if (q.includes('count') && q.includes('tactic')) {
    return 'SELECT tactic, COUNT(*) as technique_count FROM attack_techniques GROUP BY tactic ORDER BY technique_count DESC;';
  }

  // Default fallback
  return "SELECT mitre_id, technique_name, tactic, description FROM attack_techniques ORDER BY tactic;";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ success: false, error: 'Query prompt string required.' }, { status: 400 });
    }

    const trimmed = query.trim();
    let generatedSql = '';
    let generatorUsed = 'deterministic-pattern-engine';

    // 1. Try Groq API if available in environment
    if (process.env.GROQ_API_KEY) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: SYSTEM_SCHEMA_PROMPT },
              { role: 'user', content: trimmed },
            ],
            temperature: 0.1,
            max_tokens: 300,
          }),
        });

        if (groqRes.ok) {
          const data = await groqRes.json();
          let raw = data.choices?.[0]?.message?.content || '';
          raw = raw.replace(/```sql/gi, '').replace(/```/g, '').trim();
          if (raw.toLowerCase().startsWith('select') || raw.toLowerCase().startsWith('with')) {
            generatedSql = raw;
            generatorUsed = 'groq-llama-3.3-70b';
          }
        }
      } catch (e) {
        console.warn('Groq NL-to-SQL failed, falling back:', e);
      }
    }

    // 2. If no LLM SQL obtained, use deterministic cyber analyst pattern engine
    if (!generatedSql) {
      generatedSql = generateDeterministicSql(trimmed);
      generatorUsed = 'deterministic-cyber-rules-engine';
    }

    // 3. Validate generated SQL through safety validator
    const validation = validateSql(generatedSql);
    if (!validation.valid || !validation.cleanSql) {
      return NextResponse.json({
        success: false,
        error: {
          title: 'SQL Generation Policy Rejection',
          message: 'The query generator produced SQL that did not meet read-only security constraints.',
          details: validation.error?.message,
        },
      }, { status: 422 });
    }

    return NextResponse.json({
      success: true,
      naturalLanguageQuery: trimmed,
      generatedSql: validation.cleanSql,
      generator: generatorUsed,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: {
        title: 'Query Generation Error',
        message: err.message || 'Failed to interpret natural language query.',
      },
    }, { status: 500 });
  }
}
