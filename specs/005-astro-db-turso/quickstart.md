# Quickstart Guide: Database Support with Connection Testing

**Feature**: 005-astro-db-turso  
**Date**: 2026-01-12  
**Purpose**: Step-by-step implementation guide for adding database support

## Prerequisites

- Astro 5.16.8+ installed
- Turso CLI installed and authenticated
- Node.js runtime
- Existing PrivateLayout (from feature 002)

## Step 1: Set Up Turso Database

### 1.1 Install Turso CLI

```bash
# Follow instructions at https://turso.tech/docs/cli
# Or use: curl -sSfL https://get.tur.so/install.sh | bash
```

### 1.2 Authenticate with Turso

```bash
turso auth login
```

### 1.3 Create Database

```bash
turso db create cursor-sdd-test
```

### 1.4 Get Database URL and Token

```bash
# Get database URL
turso db show cursor-sdd-test --url

# Generate access token
turso db tokens create cursor-sdd-test
```

### 1.5 Configure Environment Variables

Create or update `.env` file in project root:

```env
ASTRO_DB_REMOTE_URL=libsql://cursor-sdd-test-<region>.turso.io
ASTRO_DB_APP_TOKEN=<your-access-token>
```

**Note**: For production, set these in your deployment platform's environment variables.

---

## Step 2: Define Database Schema

### 2.1 Create Database Config File

Create `src/db/config.ts`:

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

### 2.2 Push Schema to Turso

```bash
# Push schema to remote Turso database
astro db push --remote
```

---

## Step 3: Create Database Connection Utility

### 3.1 Create Connection Helper

Create `src/lib/db/connection.ts`:

```typescript
import { getSecret } from 'astro:env/server';
import { db } from 'astro:db';
import type { DatabaseQueryResult, TestTableRow } from '../../../specs/005-astro-db-turso/contracts/types';

/**
 * Retrieves database credentials from environment secrets.
 * Returns undefined if credentials are missing.
 */
export function getDatabaseConfig(): { url: string; token: string } | undefined {
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
    const rows = await db.select().from(db.test_table);

    // Transform to TestTableRow format
    const data: TestTableRow[] = rows.map((row) => ({
      id: row.id,
      name: row.name,
      created_at: row.created_at,
    }));

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
```

---

## Step 4: Create Vue Table Component

### 4.1 Create DatabaseTable Component

Create `src/components/vue/DatabaseTable.vue`:

```vue
<script setup lang="ts">
import { DataTable } from 'primevue/datatable';
import { Column } from 'primevue/column';
import { ProgressSpinner } from 'primevue/progressspinner';
import { Message } from 'primevue/message';
import type { DatabaseTableProps, TestTableRow } from '../../../specs/005-astro-db-turso/contracts/types';

const props = defineProps<DatabaseTableProps>();

// Format date for display
const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString();
};
</script>

<template>
  <div class="database-table-container">
    <!-- Loading State -->
    <div v-if="props.loading" class="flex justify-center items-center p-8">
      <ProgressSpinner />
      <span class="ml-4">Loading database data...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="props.error" class="p-4">
      <Message severity="error" :closable="false">
        {{ props.error }}
      </Message>
    </div>

    <!-- Empty State -->
    <div v-else-if="props.data.length === 0" class="p-4">
      <Message severity="info" :closable="false">
        The table is empty.
      </Message>
    </div>

    <!-- Success State: Display Table -->
    <DataTable
      v-else
      :value="props.data"
      :paginator="false"
      :rows="100"
      class="p-datatable-sm"
    >
      <Column field="id" header="ID" :sortable="true" />
      <Column field="name" header="Name" :sortable="true" />
      <Column field="created_at" header="Created At" :sortable="true">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.created_at) }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.database-table-container {
  width: 100%;
}
</style>
```

---

## Step 5: Create Database Test Page

### 5.1 Create Test Page

Create `src/pages/database-test/index.astro`:

```astro
---
import PrivateLayout from '../../layouts/PrivateLayout.astro';
import DatabaseTable from '../../components/vue/DatabaseTable.vue';
import { getDatabaseData } from '../../lib/db/connection';
import type { TestTableRow } from '../../../specs/005-astro-db-turso/contracts/types';

// Fetch database data server-side
let data: TestTableRow[] = [];
let loading = false;
let error: string | null = null;

try {
  loading = true;
  const result = await getDatabaseData();
  
  if (result.success && result.data) {
    data = result.data;
  } else {
    error = result.error || 'An unknown error occurred.';
  }
} catch (err) {
  error = 'Unable to connect to database. Please try again later.';
  console.error('Database fetch error:', err);
} finally {
  loading = false;
}
---

<PrivateLayout>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-6">Database Connection Test</h1>
    <p class="text-gray-400 mb-6">
      This page tests the database connection and displays data from the test_table.
    </p>
    
    <DatabaseTable 
      client:load
      data={data}
      loading={loading}
      error={error}
    />
  </div>
</PrivateLayout>
```

---

## Step 6: Seed Test Data (Optional)

### 6.1 Create Seed Script

Create `src/db/seed.ts`:

```typescript
import { db } from 'astro:db';

export async function seedTestData() {
  const testData = [
    { name: 'Test Item 1' },
    { name: 'Test Item 2' },
    { name: 'Test Item 3' },
    { name: 'Test Item 4' },
    { name: 'Test Item 5' },
  ];

  // Note: This requires write operations which are out of scope
  // For initial testing, manually insert data via Turso CLI or web interface
  // turso db shell cursor-sdd-test
  // INSERT INTO test_table (name) VALUES ('Test Item 1');
}
```

**Note**: Since write operations are out of scope, seed data manually:
- Use Turso web console, or
- Use `turso db shell cursor-sdd-test` to run SQL commands

---

## Step 7: Progressive Testing

### 7.1 Static Analysis

```bash
# Type checking
pnpm typecheck

# Linting
pnpm lint
```

### 7.2 Connection Test

1. Start dev server: `pnpm dev`
2. Verify environment variables are loaded
3. Check console for connection errors

### 7.3 Data Display Test

1. Visit `/database-test` page
2. Verify loading indicator appears
3. Verify table data displays correctly
4. Verify all rows are shown

### 7.4 Error Handling Test

1. **Connection Error**: Temporarily set invalid `ASTRO_DB_REMOTE_URL`
2. **Empty Table**: Clear all data from table
3. **Timeout**: (May require network throttling or invalid query)

### 7.5 End-to-End Validation

1. Load page in browser
2. Verify no console errors
3. Verify table displays correctly
4. Verify error states work
5. Verify loading indicator works

---

## Troubleshooting

### Database Connection Fails

- Verify `ASTRO_DB_REMOTE_URL` and `ASTRO_DB_APP_TOKEN` are set
- Check Turso database is accessible: `turso db show cursor-sdd-test`
- Verify network connectivity to Turso

### Schema Push Fails

- Verify schema is correctly defined in `src/db/config.ts`
- Check Turso database exists and is accessible
- Verify credentials are correct

### Data Not Displaying

- Check browser console for errors
- Verify database has data (use Turso CLI: `turso db shell cursor-sdd-test`)
- Check server-side logs for query errors

### Type Errors

- Verify all imports use correct paths
- Check `contracts/types.ts` exports are correct
- Run `pnpm typecheck` to identify issues

---

## Next Steps

After completing this quickstart:

1. ✅ Verify all acceptance scenarios pass
2. ✅ Test all edge cases
3. ✅ Verify success criteria are met
4. ✅ Run end-to-end validation
5. ✅ Document any issues or improvements needed

---

## References

- [Astro DB Documentation](https://docs.astro.build/en/guides/astro-db/)
- [Turso Integration Guide](https://docs.astro.build/en/guides/backend/turso/)
- [astro:env/server API](https://docs.astro.build/en/reference/modules/astro-env/)
- [PrimeVue DataTable](https://primevue.org/datatable/)
