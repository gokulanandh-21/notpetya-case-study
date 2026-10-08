import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/db/client';
import { validateSql, formatDatabaseError } from '@/lib/db/validator';

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  try {
    const body = await req.json();
    const { sql } = body;

    if (!sql || typeof sql !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: {
            title: 'Invalid Request',
            message: 'SQL string parameter is required in request body.',
          },
        },
        { status: 400 }
      );
    }

    // Security & syntax validation
    const validation = validateSql(sql);
    if (!validation.valid || !validation.cleanSql) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error,
        },
        { status: 400 }
      );
    }

    // Execute verified read-only SQL
    const result = await executeQuery(validation.cleanSql);
    const executionTimeMs = Date.now() - startTime;

    const fields = result.fields.map(f => f.name);

    return NextResponse.json({
      success: true,
      executedSql: validation.cleanSql,
      rowCount: result.rowCount || result.rows.length,
      executionTimeMs,
      fields,
      rows: result.rows,
    });
  } catch (err: any) {
    const executionTimeMs = Date.now() - startTime;
    const formatted = formatDatabaseError(err);
    return NextResponse.json(
      {
        success: false,
        executionTimeMs,
        error: formatted,
      },
      { status: 400 }
    );
  }
}
