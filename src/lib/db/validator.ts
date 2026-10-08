/**
 * Validation and Security Guard for the NotPetya Academic SQL Interface
 * Enforces strict read-only execution, prevents DDL/DML, restricts to existing tables,
 * and provides clear, human-friendly error messages with "Did you mean?" suggestions.
 */

export interface ValidationResult {
  valid: boolean;
  cleanSql?: string;
  error?: {
    type: 'DISALLOWED_STATEMENT' | 'SYNTAX_ERROR' | 'UNKNOWN_TABLE' | 'EMPTY_QUERY' | 'MULTIPLE_STATEMENTS';
    title: string;
    message: string;
    suggestion?: string;
    line?: number;
    column?: number;
  };
}

export const ALLOWED_TABLES = [
  'incidents',
  'timeline_events',
  'attack_techniques',
  'malware_components',
  'vulnerabilities',
  'victims',
  'impact_events',
  'attack_stages',
  'mitigations',
  'sources',
  'incident_techniques',
  'technique_vulnerabilities',
  'incident_victims',
  'stage_techniques',
  'mitigation_techniques',
];

const DISALLOWED_KEYWORDS = [
  'INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 'TRUNCATE',
  'CREATE', 'GRANT', 'REVOKE', 'EXEC', 'EXECUTE', 'CALL',
  'MERGE', 'REPLACE', 'RENAME', 'SET', 'VACUUM', 'LOCK',
  'COPY', 'INTO', 'PG_SLEEP', 'DBSHUTDOWN', 'SYSTEM'
];

export function validateSql(rawSql: string): ValidationResult {
  if (!rawSql || !rawSql.trim()) {
    return {
      valid: false,
      error: {
        type: 'EMPTY_QUERY',
        title: 'Empty Query',
        message: 'No SQL query provided. Enter a SELECT query or choose an example from above.',
      },
    };
  }

  // Strip block and line comments
  let stripped = rawSql
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/--.*$/gm, ' ')
    .trim();

  if (!stripped) {
    return {
      valid: false,
      error: {
        type: 'EMPTY_QUERY',
        title: 'Empty Query',
        message: 'Query contains only comments. Please write a valid SELECT query.',
      },
    };
  }

  // Remove trailing semicolons
  while (stripped.endsWith(';')) {
    stripped = stripped.slice(0, -1).trim();
  }

  // Check for multiple statements (separated by ;)
  if (stripped.includes(';')) {
    return {
      valid: false,
      error: {
        type: 'MULTIPLE_STATEMENTS',
        title: 'Multiple Statements Detected',
        message: 'Only single queries are allowed in this academic interface for security and referential integrity.',
        suggestion: 'Remove semicolons separating statements and execute one SELECT statement at a time.',
      },
    };
  }

  // Strict read-only starting check
  const upperSql = stripped.toUpperCase();
  const startsWithAllowed = upperSql.startsWith('SELECT') || upperSql.startsWith('WITH');
  if (!startsWithAllowed) {
    // Check if user typed common typographical errors
    if (/^FORM\b/.test(upperSql) || /SELECT.*?\bFORM\b/.test(upperSql)) {
      return {
        valid: false,
        error: {
          type: 'SYNTAX_ERROR',
          title: 'Syntax Error',
          message: 'Unexpected keyword "FORM" found in query.',
          suggestion: 'Did you mean "FROM"?',
        },
      };
    }

    return {
      valid: false,
      error: {
        type: 'DISALLOWED_STATEMENT',
        title: 'Read-Only Policy Violation',
        message: 'The query console strictly operates with read-only database permissions. Queries must start with SELECT or WITH.',
        suggestion: 'Modify your query to start with SELECT.',
      },
    };
  }

  // Check for disallowed keywords as isolated tokens
  const tokens = upperSql.split(/[\s,()=<>+*\/]+/).filter(Boolean);
  for (const token of tokens) {
    if (DISALLOWED_KEYWORDS.includes(token)) {
      // Disallow INSERT, UPDATE, DROP, DELETE, etc.
      // Exception: "INTO" inside SELECT is forbidden (e.g. SELECT INTO)
      return {
        valid: false,
        error: {
          type: 'DISALLOWED_STATEMENT',
          title: 'Prohibited Keyword Detected',
          message: `The keyword "${token}" is blocked. Destructive and modification statements (DDL/DML) are prohibited in this investigation console.`,
          suggestion: 'Only read-only SELECT operations on NotPetya forensic tables are permitted.',
        },
      };
    }
  }

  // Check for common typos like FORM instead of FROM
  if (/\bFORM\b/i.test(stripped) && !/'[^']*FORM[^']*'/i.test(stripped)) {
    return {
      valid: false,
      error: {
        type: 'SYNTAX_ERROR',
        title: 'Syntax Error: Unexpected Keyword',
        message: 'Unexpected keyword "FORM" in SQL statement.',
        suggestion: 'Replace "FORM" with "FROM".',
      },
    };
  }

  // Automatically append LIMIT if not present, or cap at 100
  let finalSql = stripped;
  if (!/\bLIMIT\b/i.test(finalSql)) {
    finalSql = `${finalSql} LIMIT 100`;
  }

  return {
    valid: true,
    cleanSql: finalSql,
  };
}

/**
 * Format PostgreSQL native errors into human-readable instructional diagnostics
 */
export function formatDatabaseError(err: any): { title: string; message: string; suggestion?: string; line?: number; column?: number } {
  const errMsg = err?.message || String(err);

  // Table does not exist (relation does not exist)
  const relMatch = errMsg.match(/relation "([^"]+)" does not exist/i);
  if (relMatch) {
    const attemptedTable = relMatch[1];
    const closest = findClosestTable(attemptedTable);
    return {
      title: 'Table Not Found',
      message: `Table "${attemptedTable}" does not exist in the NotPetya investigation schema.`,
      suggestion: closest ? `Available related table: "${closest}"` : `Available tables: ${ALLOWED_TABLES.join(', ')}`,
    };
  }

  // Column does not exist
  const colMatch = errMsg.match(/column "([^"]+)" does not exist/i);
  if (colMatch) {
    const attemptedCol = colMatch[1];
    return {
      title: 'Column Not Found',
      message: `Column "${attemptedCol}" does not exist in the queried relation.`,
      suggestion: `Check the Database Explorer below for the exact schema columns for each table.`,
    };
  }

  // Syntax error at or near
  const synMatch = errMsg.match(/syntax error at or near "([^"]+)"/i);
  if (synMatch) {
    return {
      title: 'SQL Syntax Error',
      message: `Syntax error encountered at or near "${synMatch[1]}".`,
      suggestion: 'Check SQL keywords, commas between column lists, and string quotation (use single quotes for values).',
    };
  }

  // Statement timeout
  if (errMsg.includes('statement timeout')) {
    return {
      title: 'Execution Timeout',
      message: 'The query exceeded the maximum allowed runtime of 5000ms.',
      suggestion: 'Add WHERE filters or reduce join complexity to optimize retrieval performance.',
    };
  }

  return {
    title: 'Query Execution Failed',
    message: errMsg.replace(/password=.+?(?=\s|$)/gi, 'password=***'),
  };
}

function findClosestTable(name: string): string | null {
  const lower = name.toLowerCase();
  for (const table of ALLOWED_TABLES) {
    if (table.includes(lower) || lower.includes(table)) {
      return table;
    }
    // Lev-distance or substring
    if (table.replace(/_/g, '').includes(lower.replace(/_/g, ''))) {
      return table;
    }
  }
  if (lower === 'malware' || lower === 'components') return 'malware_components';
  if (lower === 'attacks' || lower === 'techniques') return 'attack_techniques';
  if (lower === 'timeline' || lower === 'events') return 'timeline_events';
  if (lower === 'stages') return 'attack_stages';
  if (lower === 'vuln' || lower === 'cve') return 'vulnerabilities';
  if (lower === 'impact') return 'impact_events';
  return null;
}
