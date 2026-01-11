# Data Model: Database Support with Connection Testing

**Feature**: 005-astro-db-turso  
**Date**: 2026-01-12  
**Purpose**: Define database schema and data structures for connection testing

## Database Schema

### Test Table: `test_table`

A simple table for testing database connectivity and data retrieval.

**Purpose**: Provides test data to verify database connection, query execution, and data display functionality.

**Schema Definition** (Astro DB format in `src/db/config.ts`):

```typescript
import { defineDb, defineTable, column } from 'astro:db';

const TestTable = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    name: column.text(),
    created_at: column.date({ default: new Date() }),
  },
});

export default defineDb({
  tables: {
    test_table: TestTable,
  },
});
```

**Columns**:

| Column | Type | Constraints | Description |
|--------|------|------------|-------------|
| `id` | `number` | Primary Key, Auto-increment | Unique identifier for each row |
| `name` | `text` | Not null | Test name field |
| `created_at` | `date` | Default: current timestamp | Record creation timestamp |

**Indexes**: None required for initial testing phase.

**Relationships**: None (single table for connection testing).

---

## TypeScript Interfaces

### Database Row Type

```typescript
/**
 * Represents a single row from the test_table
 */
interface TestTableRow {
  id: number;
  name: string;
  created_at: Date | string; // Date object or ISO string depending on query method
}
```

### Database Query Result

```typescript
/**
 * Result of a database query operation
 */
interface DatabaseQueryResult {
  success: boolean;
  data?: TestTableRow[];
  error?: string;
  errorType?: 'connection' | 'query' | 'timeout' | 'structure' | 'credentials';
}
```

### Database Connection Configuration

```typescript
/**
 * Database connection configuration retrieved from secrets
 */
interface DatabaseConfig {
  url: string;
  token: string;
}
```

### Component Props

```typescript
/**
 * Props for DatabaseTable Vue component
 */
interface DatabaseTableProps {
  data: TestTableRow[];
  loading: boolean;
  error: string | null;
  errorType?: 'connection' | 'query' | 'timeout' | 'structure' | 'empty';
}
```

---

## Data Flow

### Database Connection Flow

```
Page Request (Private Route: /database-test)
  ↓
Astro Page Component (database-test/index.astro)
  ↓
Server-Side Data Fetching:
  1. Retrieve secrets using getSecret()
     - ASTRO_DB_REMOTE_URL
     - ASTRO_DB_APP_TOKEN
  2. Establish database connection (via Astro DB)
  3. Execute query: SELECT * FROM test_table
  4. Handle errors (connection, timeout, structure changes)
  ↓
Pass data/error to Vue component
  ↓
DatabaseTable.vue Component
  ├─ Loading State: Show loading indicator
  ├─ Error State: Show user-friendly error message
  ├─ Empty State: Show "table is empty" message
  └─ Success State: Display table data using PrimeVue DataTable
```

### Error Handling Flow

```
Database Operation
  ↓
Error Occurs?
  ├─ Yes → Categorize Error Type
  │   ├─ Connection Error → "Unable to connect to database"
  │   ├─ Query Timeout → "Request timed out"
  │   ├─ Missing Credentials → "Database configuration error"
  │   ├─ Structure Mismatch → "Unable to display data"
  │   └─ Empty Table → "The table is empty"
  │
  └─ No → Return Data Successfully
```

---

## Test Data

### Seed Data

For initial testing, seed the `test_table` with the following data:

```typescript
const seedData: TestTableRow[] = [
  { id: 1, name: 'Test Item 1', created_at: new Date('2026-01-12T10:00:00Z') },
  { id: 2, name: 'Test Item 2', created_at: new Date('2026-01-12T10:01:00Z') },
  { id: 3, name: 'Test Item 3', created_at: new Date('2026-01-12T10:02:00Z') },
  { id: 4, name: 'Test Item 4', created_at: new Date('2026-01-12T10:03:00Z') },
  { id: 5, name: 'Test Item 5', created_at: new Date('2026-01-12T10:04:00Z') },
];
```

**Purpose**: Provides sample data to verify:
- Data retrieval works correctly
- All rows are displayed (SC-003)
- Data structure is preserved (SC-003)
- Table display renders correctly

---

## Constraints & Assumptions

1. **Read-Only Access**: This feature only reads data; no write operations (per spec Out of Scope)
2. **Single Table**: Only `test_table` is used for connection testing
3. **No Schema Changes**: Table structure is fixed during this phase (structure changes are error cases)
4. **Max 100 Rows**: Table supports up to 100 rows for display (SC-005)
5. **Type Safety**: All database operations use TypeScript interfaces
6. **Secrets Required**: Database credentials must be available via environment variables
7. **Private Page**: Database test page is only accessible to authenticated users (uses PrivateLayout)

---

## Validation Rules

### Data Retrieval Validation

- **Connection**: Database URL and token must be valid
- **Query**: SELECT query must execute successfully
- **Data Format**: Retrieved data must match `TestTableRow` interface
- **Row Count**: Must handle 0-100 rows correctly

### Error Validation

- **Connection Errors**: Must be caught and categorized
- **Timeout Errors**: Must be detected and reported
- **Empty Table**: Must be distinguished from errors
- **Structure Mismatch**: Must be detected when columns don't match expected schema

### Display Validation

- **Loading State**: Must show during data fetch
- **Error State**: Must show user-friendly message (no technical details)
- **Empty State**: Must show "table is empty" message
- **Success State**: Must display all rows in structured format

---

## Future Extensions (Out of Scope)

The following are explicitly out of scope for this feature but may be added later:

- Multiple table support
- Write operations (INSERT, UPDATE, DELETE)
- Complex queries (JOINs, aggregations)
- Data filtering, sorting, pagination
- Schema migrations
- Database connection pooling
- Transaction management
