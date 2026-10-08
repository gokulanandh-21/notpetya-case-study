import { Pool, QueryResult, QueryResultRow } from 'pg';

let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not defined.');
    }

    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }
  return pool;
}

export async function executeQuery<T extends QueryResultRow = any>(
  sql: string,
  params: any[] = []
): Promise<QueryResult<T>> {
  const p = getDbPool();
  const client = await p.connect();
  try {
    // Enforce 5 second execution timeout for safety
    await client.query('SET statement_timeout = 5000');
    const res = await client.query<T>(sql, params);
    return res;
  } finally {
    client.release();
  }
}
