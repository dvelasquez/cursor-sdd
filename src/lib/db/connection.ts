import { getSecret } from 'astro:env/server';
import { db, test_table } from 'astro:db';
import type {
  DatabaseQueryResult,
  TestTableRow,
  DatabaseConfig,
} from '../../../specs/005-astro-db-turso/contracts/types';

/**
 * Retrieves database credentials from environment secrets.
 * Returns undefined if credentials are missing.
 */
export function getDatabaseConfig(): DatabaseConfig | undefined {
  const url = getSecret('ASTRO_DB_REMOTE_URL');
  const token = getSecret('ASTRO_DB_APP_TOKEN');

  if (!url || !token) {
    return undefined;
  }

  return { url, token };
}

/**
 * Fetches all rows from the test_table.
 * Handles errors gracefully and returns user-friendly error messages.
 */
export async function getDatabaseData(): Promise<DatabaseQueryResult> {
  try {
    // Verify credentials are available
    const config = getDatabaseConfig();
    if (!config) {
      return {
        success: false,
        error: 'Database configuration error. Please contact support.',
        errorType: 'credentials',
      };
    }

    // Execute query using Astro DB
    const rows = await db.select().from(test_table);

    // Transform to TestTableRow format
    const data: TestTableRow[] = rows.map(
      (row: { id: number; name: string; created_at: Date }) => ({
        id: row.id,
        name: row.name,
        created_at: row.created_at,
      }),
    );

    // Handle empty table
    if (data.length === 0) {
      return {
        success: true,
        data: [],
        error: 'The table is empty.',
        errorType: 'empty',
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    // Categorize and handle errors
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Log technical details server-side (not exposed to users)
    console.error('Database error:', errorMessage);

    // Determine error type
    let errorType: DatabaseQueryResult['errorType'] = 'query';
    let userMessage = 'Unable to connect to database. Please try again later.';

    if (errorMessage.includes('timeout') || errorMessage.includes('ETIMEDOUT')) {
      errorType = 'timeout';
      userMessage = 'Request timed out. Please try again.';
    } else if (errorMessage.includes('connection') || errorMessage.includes('ECONNREFUSED')) {
      errorType = 'connection';
      userMessage = 'Unable to connect to database. Please try again later.';
    } else if (errorMessage.includes('column') || errorMessage.includes('schema')) {
      errorType = 'structure';
      userMessage = 'Unable to display data. The table structure may have changed.';
    }

    return {
      success: false,
      error: userMessage,
      errorType,
    };
  }
}
