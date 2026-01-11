# Contracts: Database Support with Connection Testing

**Feature**: 005-astro-db-turso  
**Date**: 2026-01-12  
**Purpose**: Define TypeScript contracts and interfaces for database operations

## Overview

This feature focuses on **read-only database operations** for connection testing. As such, there are **no REST API endpoints** requiring HTTP contracts. Instead, this directory contains:

1. **Database Type Contracts** - TypeScript interfaces for database operations and data structures
2. **Component Interface Contracts** - Type definitions for Vue components
3. **Error Handling Contracts** - Type definitions for error states and messages

**Note**: When write operations are implemented in a future feature, API contracts will be added to that feature's contracts directory.

---

## Database Contracts

### TestTableRow

Represents a single row from the `test_table` database table.

```typescript
interface TestTableRow {
  id: number;
  name: string;
  created_at: Date | string;
}
```

**Usage**: Return type for database queries, prop type for table display components.

---

### DatabaseQueryResult

Result of a database query operation, including success status, data, and error information.

```typescript
interface DatabaseQueryResult {
  success: boolean;
  data?: TestTableRow[];
  error?: string;
  errorType?: 'connection' | 'query' | 'timeout' | 'structure' | 'credentials';
}
```

**Usage**: Return type for database query functions, error handling logic.

---

### DatabaseConfig

Database connection configuration retrieved from environment secrets.

```typescript
interface DatabaseConfig {
  url: string;
  token: string;
}
```

**Usage**: Internal type for database connection utilities.

---

## Component Contracts

### DatabaseTableProps

Props for the `DatabaseTable.vue` Vue component that displays database table data.

```typescript
interface DatabaseTableProps {
  data: TestTableRow[];
  loading: boolean;
  error: string | null;
  errorType?: 'connection' | 'query' | 'timeout' | 'structure' | 'empty';
}
```

**Props**:

- `data`: Array of table rows to display
- `loading`: Boolean indicating if data is being fetched
- `error`: Error message string or null if no error
- `errorType`: Optional error category for specific error handling

**Usage**: Props interface for `src/components/vue/DatabaseTable.vue`.

---

## Error Message Contracts

### Error Messages

User-friendly error messages (no technical details) for different error scenarios:

```typescript
type ErrorMessage =
  | 'Unable to connect to database. Please try again later.'
  | 'Request timed out. Please try again.'
  | 'The table is empty.'
  | 'Unable to display data. The table structure may have changed.'
  | 'Database configuration error. Please contact support.';
```

**Usage**: Error messages displayed to users on the database test page.

---

## Function Contracts

### getDatabaseData()

Server-side function that retrieves data from the database.

```typescript
async function getDatabaseData(): Promise<DatabaseQueryResult>;
```

**Returns**: `DatabaseQueryResult` with success status, data, or error information.

**Usage**: Called from Astro page component to fetch database data.

**Error Handling**:

- Catches all database errors
- Categorizes error types
- Returns user-friendly error messages
- Logs technical details server-side (not exposed to users)

---

## Type Exports

All types are exported from `contracts/types.ts` for use throughout the application:

```typescript
export type { TestTableRow, DatabaseQueryResult, DatabaseConfig, DatabaseTableProps };
```

---

## Usage Examples

### In Astro Page Component

```typescript
import type { TestTableRow, DatabaseQueryResult } from '../../contracts/types';

const result: DatabaseQueryResult = await getDatabaseData();
if (result.success && result.data) {
  const rows: TestTableRow[] = result.data;
  // Pass to Vue component
}
```

### In Vue Component

```typescript
import type { DatabaseTableProps, TestTableRow } from '../../contracts/types';

const props = defineProps<DatabaseTableProps>();
// Use props.data, props.loading, props.error
```

---

## Validation

All contracts follow these principles:

1. **Type Safety**: All interfaces use TypeScript strict mode
2. **No Runtime Validation**: Domain logic uses pure TypeScript interfaces (no Zod schemas)
3. **Boundary Validation**: Secrets retrieval uses `getSecret()` which handles undefined cases
4. **Error Handling**: All error types are explicitly defined
5. **User-Friendly**: Error messages contain no technical details

---

## Future Extensions

When write operations are added in a future feature, the following contracts may be added:

- `CreateTableRowRequest` - Request body for creating new rows
- `UpdateTableRowRequest` - Request body for updating rows
- `DeleteTableRowRequest` - Request body for deleting rows
- REST API endpoint contracts (if API routes are added)
