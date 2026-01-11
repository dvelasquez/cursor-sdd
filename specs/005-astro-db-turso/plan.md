# Implementation Plan: Database Support with Connection Testing

**Branch**: `005-astro-db-turso` | **Date**: 2026-01-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-astro-db-turso/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

**Primary Requirement**: Add database support using Astro DB (astro:db) integrated with Turso, enabling the application to read data from a database table and display it on a private page. Focus is on testing database connectivity and data retrieval capabilities.

**Technical Approach**: Integrate Astro DB with Turso using libSQL, configure database connection via environment variables using `getSecret()` from `astro:env/server`, create a test database table, implement a private page that queries and displays table data, and handle all error states (connection failures, empty tables, timeouts, structure changes) with user-friendly messages.

## Technical Context

**Language/Version**: JavaScript/TypeScript (TypeScript with strict mode, per constitution)  
**Runtime**: Node.js (per constitution)  
**Framework**: Astro 5.16.8 (per constitution and current package.json)  
**UI Components**: Vue.js 3.5.26 (Vue 3 composition API, per constitution and current package.json)  
**Component Library**: PrimeVue 4.5.4 (per constitution, for table display component)  
**Styling**: Tailwind CSS 4.1.18 (per constitution and current package.json) + PrimeVue  
**Storage**: Turso (libSQL/SQLite) via Astro DB integration  
**Database Integration**: Astro DB (astro:db) - built-in Astro database integration using libSQL  
**Secrets Management**: `getSecret()` from `astro:env/server` module (per spec requirement)  
**Testing**: Progressive E2E validation (per constitution): static analysis, browser loading verification, progressive integration (connection → test data → UI display → refinement), end-to-end user journey testing  
**Target Platform**: Web browsers (modern browsers - last 2 major versions of Chrome, Firefox, Safari, Edge)  
**Project Type**: Web application (Astro framework with SSR, per constitution)  
**Performance Goals**: <3 seconds page load with database data (SC-001), 100% connection success rate with valid credentials (SC-002)  
**Constraints**: Support tables up to 100 rows (SC-005), user-friendly error messages (no technical details exposed), loading indicator during data fetch (FR-008)  
**Scale/Scope**: Single database table read-only access, connection testing focus, no write operations

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Verify compliance with all constitution principles:

- **Type Safety**: ✅ All code will use TypeScript with strict mode. Runtime validation (Zod) only at boundaries (database connection credentials retrieval). Domain logic uses pure TypeScript interfaces.
- **Code Quality**: ✅ Linting and type checking will pass before any commit. ESLint and Prettier configurations enforced.
- **Testing Discipline**: ✅ Progressive testing workflow MUST be followed:
  - Static analysis (lint, typecheck) passes using `astro check` or `tsc --noEmit`
  - Application loads in browser without errors after each change (`npm run dev` and manual verification)
  - For database integration: connection test → test data insertion → UI display → error handling refinement
  - Complete end-to-end validation in running application: visit database test page, verify data display, test error states, verify loading indicator
- **Incremental Delivery**: ✅ Feature broken into independently testable increments:
  - Database connection setup and configuration
  - Database schema definition and test data
  - Private page with data display
  - Error handling and edge cases
- **Technology Stack Compliance**: ✅ Using constitution-defined stack:
  - TypeScript/JavaScript ✅
  - Node.js runtime ✅
  - Astro framework ✅ (already configured)
  - Vue.js 3 composition API ✅ (already configured)
  - Tailwind CSS ✅ (already configured)
  - PrimeVue component library ✅ (already configured)
  - Astro DB + Turso ✅ (new addition, justified for database support)
- **Vue Component Patterns**: ✅ Vue components will follow Vue 3 composition API patterns
- **Styling Approach**: ✅ Styling uses Tailwind CSS utility classes; PrimeVue DataTable component used for table display
- **RO-RO Pattern**: ✅ Functions with >2 parameters will use named object parameters
- **Async Safety**: ✅ Database queries will use proper error handling; connection errors return typed Result objects

**Gate Status**: ✅ PASS - All constitution principles satisfied. No violations detected. Phase 0 research complete - see research.md.

## Project Structure

### Documentation (this feature)

```text
specs/005-astro-db-turso/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification (/speckit.specify command output)
├── research.md          # Phase 0 output (/speckit.plan command) - ✅ CREATED
├── data-model.md        # Phase 1 output (/speckit.plan command) - ✅ CREATED
├── quickstart.md        # Phase 1 output (/speckit.plan command) - ✅ CREATED
├── contracts/           # Phase 1 output (/speckit.plan command) - ✅ CREATED
│   ├── README.md        # Contracts documentation
│   └── types.ts         # Database and data types
├── checklists/          # Existing: quality checklists
│   └── requirements.md
└── tasks.md             # Phase 2 output (/speckit.tasks command) - NOT created by /speckit.plan
```

### Source Code (repository root)

```text
src/
├── db/                   # New: Astro DB configuration and schema
│   ├── config.ts         # Database schema definition
│   └── seed.ts           # Optional: test data seeding script
├── lib/                  # Existing + New: utility functions
│   ├── fixtures/         # Existing: mock data fixtures
│   └── db/               # New: database connection utilities
│       └── connection.ts # Database connection helper using getSecret()
├── pages/                # Existing + New: Astro pages
│   ├── dashboard/        # Existing: dashboard page
│   ├── profile/          # Existing: profile page
│   └── database-test/    # New: database test page (private)
│       └── index.astro   # Page that displays database table data
├── components/           # Existing: Astro and Vue components
│   └── vue/              # Existing: Vue components
│       └── DatabaseTable.vue  # New: Vue component for displaying table data
└── layouts/              # Existing: Astro layouts
    └── PrivateLayout.astro    # Existing: used by database-test page
```

**Structure Decision**: Single project structure (Option 1) - Astro application with database integration. New directories: `src/db/` for Astro DB schema configuration, `src/lib/db/` for database connection utilities, `src/pages/database-test/` for the test page, and `src/components/vue/DatabaseTable.vue` for the table display component.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. All technology choices align with constitution:
- Astro DB is the official Astro database integration (framework-native)
- Turso is a recommended database provider for Astro DB
- `getSecret()` from `astro:env/server` is the recommended approach for secrets management in Astro 5.x
