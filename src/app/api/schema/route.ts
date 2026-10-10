import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db/client';

export interface TableColumnMetadata {
  columnName: string;
  dataType: string;
  isNullable: boolean;
  isPrimaryKey: boolean;
  foreignKeyRef?: string;
}

export interface TableMetadata {
  tableName: string;
  description: string;
  rowCount: number;
  columns: TableColumnMetadata[];
  sampleData: Record<string, any>[];
}

const TABLE_DESCRIPTIONS: Record<string, string> = {
  incidents: 'Master incident registry detailing classifications, damage estimates, and attribution assessments.',
  timeline_events: 'Chronological event record of infection, propagation, discovery, and response milestones.',
  attack_techniques: 'MITRE ATT&CK enterprise techniques weaponized during the NotPetya campaign.',
  attack_stages: 'High-level sequential attack phases from supply-chain compromise to disk destruction.',
  malware_components: 'Modular components comprising the NotPetya payload (backdoor, worm, wiper, Mimikatz).',
  vulnerabilities: 'CVE records exploited for unauthenticated remote code execution (MS17-010).',
  victims: 'Documented corporate and governmental organizations afflicted worldwide.',
  impact_events: 'Forensic breakdown distinguishing direct malware actions from operational consequences.',
  mitigations: 'Defensive engineering controls and architectural hardening countermeasures.',
  sources: 'Authoritative, citable references with formal credibility and evidence ratings.',
  incident_techniques: 'Many-to-many junction mapping techniques to the incident.',
  technique_vulnerabilities: 'Many-to-many junction linking attack techniques to CVE vulnerabilities.',
  incident_victims: 'Many-to-many junction linking victims to the incident.',
  stage_techniques: 'Many-to-many junction mapping framework stages to granular techniques.',
  mitigation_techniques: 'Many-to-many junction connecting defensive mitigations to target techniques.',
};

export async function GET() {
  try {
    // 1. Fetch tables and column definitions strictly for NotPetya CTI tables
    const allowedTableList = Object.keys(TABLE_DESCRIPTIONS);
    const colQuery = `
      SELECT 
        c.table_name,
        c.column_name,
        c.data_type,
        c.is_nullable,
        CASE WHEN tc.constraint_type = 'PRIMARY KEY' THEN true ELSE false END as is_pk
      FROM information_schema.columns c
      LEFT JOIN information_schema.key_column_usage kcu
        ON c.table_name = kcu.table_name AND c.column_name = kcu.column_name
      LEFT JOIN information_schema.table_constraints tc
        ON kcu.constraint_name = tc.constraint_name AND tc.constraint_type = 'PRIMARY KEY'
      WHERE c.table_schema = 'public'
        AND c.table_name = ANY($1::text[])
      ORDER BY c.table_name, c.ordinal_position;
    `;
    const colRes = await executeQuery(colQuery, [allowedTableList]);

    const tablesMap: Record<string, TableColumnMetadata[]> = {};
    for (const r of colRes.rows) {
      if (!tablesMap[r.table_name]) tablesMap[r.table_name] = [];
      tablesMap[r.table_name].push({
        columnName: r.column_name,
        dataType: r.data_type,
        isNullable: r.is_nullable === 'YES',
        isPrimaryKey: !!r.is_pk,
      });
    }

    const tableList: TableMetadata[] = [];
    for (const tableName of Object.keys(tablesMap)) {
      // Row count with quoted table name
      const countRes = await executeQuery(`SELECT COUNT(*) as count FROM "${tableName}"`);
      const rowCount = parseInt(countRes.rows[0]?.count || '0', 10);

      // Sample 3 records with quoted table name
      const sampleRes = await executeQuery(`SELECT * FROM "${tableName}" LIMIT 3`);

      tableList.push({
        tableName,
        description: TABLE_DESCRIPTIONS[tableName] || 'Forensic database relation.',
        rowCount,
        columns: tablesMap[tableName],
        sampleData: sampleRes.rows,
      });
    }

    return NextResponse.json({
      success: true,
      tables: tableList,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch schema metadata.' },
      { status: 500 }
    );
  }
}
