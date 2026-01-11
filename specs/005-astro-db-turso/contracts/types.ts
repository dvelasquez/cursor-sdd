/**
 * Contracts: Database Support with Connection Testing
 *
 * TypeScript interfaces and types for database operations and components.
 * All types use TypeScript strict mode (per constitution).
 */

/**
 * Represents a single row from the test_table database table.
 */
export interface TestTableRow {
  id: number;
  name: string;
  created_at: Date | string; // Date object or ISO string depending on query method
}

/**
 * Result of a database query operation.
 * Used for error handling and data retrieval results.
 */
export interface DatabaseQueryResult {
  success: boolean;
  data?: TestTableRow[];
  error?: string;
  errorType?: 'connection' | 'query' | 'timeout' | 'structure' | 'credentials' | 'empty';
}

/**
 * Database connection configuration retrieved from environment secrets.
 * Internal type for database connection utilities.
 */
export interface DatabaseConfig {
  url: string;
  token: string;
}

/**
 * Props for the DatabaseTable.vue Vue component.
 * Used to display database table data with loading and error states.
 */
export interface DatabaseTableProps {
  data: TestTableRow[];
  loading: boolean;
  error: string | null;
  errorType?: 'connection' | 'query' | 'timeout' | 'structure' | 'empty';
}

/**
 * User-friendly error messages (no technical details).
 * These messages are displayed to users on the database test page.
 */
export type ErrorMessage =
  | 'Unable to connect to database. Please try again later.'
  | 'Request timed out. Please try again.'
  | 'The table is empty.'
  | 'Unable to display data. The table structure may have changed.'
  | 'Database configuration error. Please contact support.';

/**
 * Error type categories for database operations.
 */
export type DatabaseErrorType =
  | 'connection'
  | 'query'
  | 'timeout'
  | 'structure'
  | 'credentials'
  | 'empty';
