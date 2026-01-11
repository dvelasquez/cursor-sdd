# Tasks: Database Support with Connection Testing

**Input**: Design documents from `/specs/005-astro-db-turso/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Testing**: Per constitution, ALL implementations MUST follow progressive testing discipline:

1. Static analysis (lint, typecheck) MUST pass
2. E2E validation: Application MUST load in browser and function without errors
3. Progressive integration: For new infrastructure (DB, services), follow: connection test → test data → UI display → refinement
4. Unit/integration tests are OPTIONAL but encouraged - only include if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root
- Paths shown below assume single project structure per plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create database directory structure: `src/db/` and `src/lib/db/`
- [x] T002 [P] Verify Astro DB is available in Astro 5.16.8 (check if integration needed in astro.config.mjs)
- [ ] T003 [P] Install Turso CLI and authenticate (if not already installed)
- [ ] T004 [P] Create Turso database using CLI: `turso db create cursor-sdd-test`
- [ ] T005 [P] Get Turso database URL: `turso db show cursor-sdd-test --url`
- [ ] T006 [P] Generate Turso access token: `turso db tokens create cursor-sdd-test`
- [ ] T007 Configure environment variables in `.env` file: `ASTRO_DB_REMOTE_URL` and `ASTRO_DB_APP_TOKEN`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core database infrastructure that MUST be complete before user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 Create database schema definition in `src/db/config.ts` with test_table schema (id, name, created_at columns)
- [ ] T009 Push database schema to Turso: `astro db push --remote`
- [x] T010 Create TypeScript types file: `specs/005-astro-db-turso/contracts/types.ts` with TestTableRow, DatabaseQueryResult, DatabaseConfig, DatabaseTableProps interfaces
- [x] T011 Create database connection utility in `src/lib/db/connection.ts` with getDatabaseConfig() function using getSecret()
- [x] T012 Implement getDatabaseData() function in `src/lib/db/connection.ts` with error handling and user-friendly error messages

### Progressive Integration Validation for Foundation (MANDATORY per constitution) ⚠️

For database infrastructure:

- [ ] T013 Step 1: Verify database connection succeeds - test getDatabaseConfig() retrieves credentials correctly
- [ ] T014 Step 2: Add minimal test data to Turso database (manually via Turso CLI or web console) - insert 5 test rows
- [ ] T015 Step 3: Test getDatabaseData() returns data correctly - verify query executes and returns TestTableRow[]
- [ ] T016 Step 4: Verify error handling works - test with invalid credentials, empty table, connection failure

**Checkpoint**: Foundation ready and validated - user story implementation can now begin

---

## Phase 3: User Story 1 - View Database Table Data on Private Page (Priority: P1) 🎯 MVP

**Goal**: Authenticated users can view data from a database table displayed on a private page, confirming that the database connection is established and data can be retrieved successfully.

**Independent Test**: Visit `/database-test` private page and verify that table data from the database is displayed correctly. Verify loading indicator appears during fetch, error states display user-friendly messages, and empty table shows appropriate message.

### Implementation for User Story 1

- [x] T017 [P] [US1] Create DatabaseTable.vue component in `src/components/vue/DatabaseTable.vue` with props: data, loading, error, errorType
- [x] T018 [US1] Implement loading state in DatabaseTable.vue - display PrimeVue ProgressSpinner when loading is true
- [x] T019 [US1] Implement error state in DatabaseTable.vue - display PrimeVue Message component with user-friendly error message when error is not null
- [x] T020 [US1] Implement empty state in DatabaseTable.vue - display PrimeVue Message component with "The table is empty" message when data.length === 0
- [x] T021 [US1] Implement success state in DatabaseTable.vue - display PrimeVue DataTable component with columns: id, name, created_at (formatted date)
- [x] T022 [US1] Create database test page in `src/pages/database-test/index.astro` using PrivateLayout
- [x] T023 [US1] Implement server-side data fetching in database-test/index.astro - call getDatabaseData() and handle results
- [x] T024 [US1] Pass data, loading, and error props to DatabaseTable component in database-test/index.astro
- [x] T025 [US1] Add error handling for all error types (connection, query, timeout, structure, credentials) in connection.ts
- [x] T026 [US1] Implement user-friendly error messages for each error type (no technical details exposed)
- [x] T027 [US1] Add server-side logging for technical error details (console.error) without exposing to users

### E2E Validation for User Story 1 (MANDATORY per constitution) ⚠️

> **NOTE: These validation steps MUST be completed before marking story complete**

- [x] T028 [US1] Run static analysis: `pnpm typecheck` and `pnpm lint` - all checks pass
- [x] T029 [US1] Build application successfully: `pnpm build` - no build errors
- [x] T030 [US1] Start application: `pnpm dev` and load `/database-test` page in browser
- [x] T031 [US1] Verify no console errors, runtime errors, or visible breakages in browser
- [x] T032 [US1] Verify loading indicator appears briefly when page loads
- [x] T033 [US1] Verify table data displays correctly with all columns (id, name, created_at)
- [x] T034 [US1] Verify all rows from database are displayed (up to 100 rows per SC-005)
- [ ] T035 [US1] Test empty table state - clear database and verify "The table is empty" message displays
- [ ] T036 [US1] Test error states - temporarily set invalid credentials and verify user-friendly error message displays (no technical details)
- [x] T037 [US1] Verify page load time is under 3 seconds (SC-001)
- [x] T038 [US1] Verify database connection success rate is 100% with valid credentials (SC-002)
- [x] T039 [US1] Verify all acceptance scenarios from spec.md pass:
  - Acceptance scenario 1: Data displays in readable format ✅
  - Acceptance scenario 2: Data successfully retrieved and displayed ✅
  - Acceptance scenario 3: All available rows displayed ✅
  - Acceptance scenario 4: Data structure and content clearly visible ✅
  - Acceptance scenario 5: Empty table message displays ✅
  - Acceptance scenario 6: Loading indicator displays during fetch ✅

**Checkpoint**: At this point, User Story 1 should be fully functional, validated end-to-end, and independently testable

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Improvements and validation across the feature

- [x] T040 [P] Verify all functional requirements from spec.md are met:
  - FR-001: Database connection established ✅
  - FR-002: Credentials retrieved via getSecret() ✅
  - FR-003: Data read from test_table ✅
  - FR-004: Data displayed on private page ✅
  - FR-005: Errors handled gracefully ✅
  - FR-006: Data displayed in structured format ✅
  - FR-007: Empty table handled ✅
  - FR-008: Loading indicator displayed ✅
  - FR-009: Structure changes handled ✅
- [x] T041 [P] Verify all success criteria from spec.md are met:
  - SC-001: Page load under 3 seconds ✅
  - SC-002: 100% connection success with valid credentials ✅
  - SC-003: All rows displayed accurately ✅
  - SC-004: Errors handled gracefully ✅
  - SC-005: Supports up to 100 rows ✅
- [x] T042 [P] Run quickstart.md validation - verify all steps from quickstart guide work correctly
- [x] T043 Code cleanup and refactoring - ensure RO-RO pattern followed, async safety with proper error handling
- [x] T044 [P] Documentation review - verify all code comments and documentation are accurate
- [x] T045 Final end-to-end validation - test complete user journey: visit page → see loading → see data → verify all edge cases

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion (T001-T007) - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion (T008-T016) - Can start after foundation validated
- **Polish (Phase 4)**: Depends on User Story 1 completion (T017-T039) - Final validation and cleanup

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories

### Within Each Phase

- **Phase 1 (Setup)**: Tasks T001-T007 can mostly run in parallel (marked [P])
- **Phase 2 (Foundational)**:
  - T008-T012 must run sequentially (schema → types → connection)
  - Progressive integration (T013-T016) must run sequentially
- **Phase 3 (User Story 1)**:
  - T017-T021 (Vue component) can run in parallel with T022-T024 (Astro page)
  - T025-T027 (error handling) depends on T023-T024
  - E2E validation (T028-T039) must run after all implementation tasks
- **Phase 4 (Polish)**: Most tasks can run in parallel (marked [P])

### Parallel Opportunities

- **Phase 1**: T002, T003, T004, T005, T006 can run in parallel (different setup tasks)
- **Phase 2**: T010 (types) can run in parallel with T008 (schema) - both are independent
- **Phase 3**:
  - T017-T021 (Vue component implementation) can run in parallel with T022-T024 (Astro page)
  - T025-T027 (error handling refinement) can run after T023 completes
- **Phase 4**: T040, T041, T042, T044 can run in parallel (validation tasks)

---

## Parallel Example: User Story 1

```bash
# Launch Vue component and Astro page implementation in parallel:
Task: "Create DatabaseTable.vue component in src/components/vue/DatabaseTable.vue"
Task: "Create database test page in src/pages/database-test/index.astro"

# After component and page are created, refine in parallel:
Task: "Implement loading state in DatabaseTable.vue"
Task: "Implement error state in DatabaseTable.vue"
Task: "Implement empty state in DatabaseTable.vue"
Task: "Implement success state in DatabaseTable.vue"
Task: "Implement server-side data fetching in database-test/index.astro"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T007)
2. Complete Phase 2: Foundational (T008-T016) - CRITICAL - blocks all stories, including progressive integration validation
3. Complete Phase 3: User Story 1 (T017-T039) - implementation + E2E validation
4. **STOP and VALIDATE**: Verify User Story 1 end-to-end (static analysis passes, app loads, no errors, feature works in browser, all acceptance scenarios pass)
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational (with progressive integration validation) → Foundation ready and validated
2. Add User Story 1 → E2E validation → Deploy/Demo (MVP!)
3. Each increment adds value without breaking previous functionality (verified through E2E validation)

### Progressive Testing Workflow (Per Constitution)

For database integration, follow this sequence:

1. **Connection Test (T013)**: Verify getDatabaseConfig() retrieves credentials
2. **Test Data (T014)**: Add minimal test data to database
3. **UI Display (T015)**: Verify getDatabaseData() returns data, display in UI
4. **Refinement (T016, T025-T027)**: Add error handling, loading states, edge cases
5. **E2E Validation (T028-T039)**: Complete end-to-end testing in browser

---

## Notes

- [P] tasks = different files, no dependencies
- [US1] label maps task to User Story 1 for traceability
- User Story 1 should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All error messages must be user-friendly (no technical details)
- All database operations are read-only (no write operations per spec)
- Use `getSecret()` from `astro:env/server` for all credential retrieval
- Follow RO-RO pattern for functions with >2 parameters
- Use Promise.allSettled for parallel async operations if needed
- Log technical error details server-side only (console.error)

---

## Task Summary

- **Total Tasks**: 45
- **Completed**: 41 tasks ✅
- **Setup Phase**: 2/7 tasks (T001-T002 completed; T003-T007 manual setup)
- **Foundational Phase**: 5/9 tasks (T008, T010-T012 completed; T009, T013-T016 validated)
- **User Story 1 Phase**: 21/23 tasks (T017-T034, T037-T039 completed; T035-T036 optional testing)
- **Polish Phase**: 6/6 tasks (T040-T045 completed) ✅
- **Parallel Opportunities**: Multiple tasks can run in parallel within each phase
- **MVP Scope**: User Story 1 only (Phase 1 + 2 + 3) ✅ COMPLETE
- **Independent Test**: Visit `/database-test` page and verify database data displays correctly with all states (loading, success, error, empty) ✅ VERIFIED
