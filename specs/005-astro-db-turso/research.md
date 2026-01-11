# Research: Database Support with Connection Testing

**Feature**: 005-astro-db-turso  
**Date**: 2026-01-12  
**Purpose**: Research Astro DB integration with Turso and secrets management

## Research Questions

### Q1: How does Astro DB (astro:db) work and integrate with Turso?

**Decision**: Use Astro DB (astro:db) - Astro's built-in database integration that uses libSQL (SQLite fork) and integrates seamlessly with Turso.

**Rationale**:
- Astro DB is the official database integration for Astro framework
- Built on libSQL, an open-source fork of SQLite optimized for serverless environments
- Native integration with Turso, a distributed database platform built on libSQL
- Provides type-safe database queries with TypeScript support
- Schema is defined in `db/config.ts` using Astro DB's schema definition API
- Supports both local development (SQLite file) and remote deployment (Turso)

**Alternatives Considered**:
- Direct better-sqlite3 integration: Rejected - requires manual connection management, no type safety, not framework-native
- Prisma with Turso: Rejected - adds unnecessary abstraction layer, Astro DB provides native integration
- Direct Turso client library: Rejected - Astro DB provides better integration and type safety

**Implementation Notes**:
- Database schema defined in `src/db/config.ts`
- Use `db.push()` for local development, `db.push --remote` for Turso deployment
- Environment variables: `ASTRO_DB_REMOTE_URL` and `ASTRO_DB_APP_TOKEN` for Turso connection
- Queries use Astro DB's query API: `db.select()`, `db.get()`, etc.

---

### Q2: How to configure Turso database connection?

**Decision**: Configure Turso connection using environment variables `ASTRO_DB_REMOTE_URL` and `ASTRO_DB_APP_TOKEN`, retrieved via `getSecret()` from `astro:env/server`.

**Rationale**:
- Turso requires database URL and access token for authentication
- Environment variables provide secure credential storage
- `getSecret()` is the recommended Astro 5.x approach for accessing secrets
- Works consistently across different deployment environments (local, staging, production)

**Alternatives Considered**:
- Hardcoded credentials: Rejected - security risk, not suitable for production
- `process.env` directly: Rejected - `getSecret()` is adapter-aware and recommended for Astro 5.x
- External secrets manager (AWS Secrets Manager, etc.): Deferred - overkill for initial connection testing phase

**Implementation Notes**:
- Create Turso database using CLI: `turso db create <database-name>`
- Get database URL: `turso db show <database-name> --url`
- Generate access token: `turso db tokens create <database-name>`
- Store in environment variables (`.env` file for local, deployment platform for production)
- Use `getSecret('ASTRO_DB_REMOTE_URL')` and `getSecret('ASTRO_DB_APP_TOKEN')` in code

---

### Q3: How to use getSecret() from astro:env/server?

**Decision**: Use `getSecret()` function from `astro:env/server` module to retrieve database credentials.

**Rationale**:
- `getSecret()` is the recommended approach in Astro 5.x for accessing environment variables
- Adapter-aware implementation ensures consistency across deployment environments
- Returns string or undefined (handles missing variables gracefully)
- Can only be used in Astro context (middlewares, routes, endpoints, components, framework components, modules)
- Cannot be used in `astro.config.mjs` or scripts (use `process.env` there)

**Alternatives Considered**:
- `import.meta.env`: Rejected - only works for variables defined in schema, not for dynamic secrets
- `process.env`: Rejected - not adapter-aware, may behave differently across environments

**Implementation Notes**:
```typescript
import { getSecret } from 'astro:env/server';

const dbUrl = getSecret('ASTRO_DB_REMOTE_URL');
const dbToken = getSecret('ASTRO_DB_APP_TOKEN');
```
- Returns `string | undefined`
- Must handle undefined case (credentials missing)
- Use in Astro components, API routes, or utility functions called from Astro context

---

### Q4: What database table structure should be used for testing?

**Decision**: Create a simple test table with common data types (id, name, created_at) for connection testing.

**Rationale**:
- Simple structure allows focus on connection testing rather than complex schema
- Common data types (integer, text, timestamp) validate basic functionality
- Easy to seed with test data
- Sufficient for demonstrating read operations

**Alternatives Considered**:
- Complex multi-table schema: Rejected - out of scope, focus is connection testing
- No predefined table: Rejected - need test data to verify connection works

**Implementation Notes**:
- Table name: `test_table` (or similar descriptive name)
- Columns: `id` (integer, primary key), `name` (text), `created_at` (timestamp)
- Seed with 5-10 test rows for initial testing
- Can be expanded later if needed

---

### Q5: How to display database table data in the UI?

**Decision**: Use PrimeVue DataTable component for structured table display, with loading indicator and error states.

**Rationale**:
- PrimeVue DataTable provides professional table display with built-in features
- Aligns with existing PrimeVue component library usage
- Supports loading states, empty states, and error handling
- Responsive and accessible out of the box
- Can be styled with Tailwind CSS via tailwindcss-primeui plugin

**Alternatives Considered**:
- Plain HTML table: Rejected - lacks loading/error states, less professional appearance
- Custom Vue table component: Rejected - reinventing the wheel, PrimeVue already available
- Astro-only table (no Vue): Rejected - need reactive loading states, PrimeVue provides better UX

**Implementation Notes**:
- Create `DatabaseTable.vue` component using PrimeVue DataTable
- Props: `data` (array of table rows), `loading` (boolean), `error` (string | null)
- Display loading indicator when `loading === true`
- Display error message when `error !== null`
- Display empty message when `data.length === 0`
- Use Tailwind CSS for additional styling if needed

---

### Q6: How to handle database errors gracefully?

**Decision**: Catch all database errors, categorize them (connection, query, timeout, structure), and display user-friendly messages without technical details.

**Rationale**:
- Per spec requirement: user-friendly error messages, no technical details
- Different error types need different handling (connection vs query vs timeout)
- Graceful degradation maintains application stability
- User experience is prioritized over technical debugging information

**Alternatives Considered**:
- Show raw error messages: Rejected - violates spec requirement (no technical details)
- Silent failures: Rejected - users need feedback about what went wrong
- Redirect to error page: Rejected - spec requires error display on the page

**Implementation Notes**:
- Connection errors: "Unable to connect to database. Please try again later."
- Query timeout: "Request timed out. Please try again."
- Empty table: "The table is empty."
- Structure changes: "Unable to display data. The table structure may have changed."
- Missing credentials: "Database configuration error. Please contact support."
- Log technical details server-side for debugging, but never expose to users

---

## Technology Versions

- **Astro**: 5.16.8 (current project version)
- **Astro DB**: Built into Astro 5.x (no separate package)
- **Turso**: Latest stable (managed service, version not applicable)
- **libSQL**: Underlying database engine (managed by Turso)
- **PrimeVue**: 4.5.4 (current project version)
- **Vue.js**: 3.5.26 (current project version)

## Dependencies

### New Dependencies Required
- None - Astro DB is built into Astro 5.x
- Turso CLI (for database management, not runtime dependency)

### Existing Dependencies Used
- `astro`: 5.16.8 (provides astro:db and astro:env/server)
- `@astrojs/vue`: 5.1.4 (Vue integration)
- `primevue`: 4.5.4 (DataTable component)
- `vue`: 3.5.26 (Vue framework)

## Configuration Files

### New Files
- `src/db/config.ts` - Astro DB schema definition
- `src/lib/db/connection.ts` - Database connection utilities using getSecret()
- `src/pages/database-test/index.astro` - Test page for displaying database data
- `src/components/vue/DatabaseTable.vue` - Vue component for table display

### Modified Files
- `.env` (or deployment platform environment variables) - Add `ASTRO_DB_REMOTE_URL` and `ASTRO_DB_APP_TOKEN`
- `astro.config.mjs` - May need to add Astro DB integration if not already present (check if needed)

## References

- [Astro DB Documentation](https://docs.astro.build/en/guides/astro-db/)
- [Astro DB + Turso Integration](https://docs.astro.build/en/guides/backend/turso/)
- [Astro Environment Variables](https://docs.astro.build/en/guides/environment-variables/)
- [astro:env/server API](https://docs.astro.build/en/reference/modules/astro-env/)
- [Turso Documentation](https://docs.turso.tech/)
- [PrimeVue DataTable](https://primevue.org/datatable/)
