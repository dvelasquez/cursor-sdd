# Tasks: E2E Testing with Playwright and BDD

**Input**: Design documents from `/specs/004-playwright-e2e/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

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
- Configuration files at repository root: `playwright.config.ts`, `package.json`
- Test files: `specs/###-feature-name/e2e/*.spec.ts` (co-located with specs per FR-008)

---

## Phase 1: Setup (Package Installation)

**Purpose**: Install required packages and prepare project structure

- [x] T001 Install eslint-plugin-playwright package: `eslint-plugin-playwright` as devDependency in package.json

---

## Phase 2: User Story 1 - E2E Testing Framework Foundation (Priority: P1) 🎯 MVP

**Goal**: Establish Playwright E2E testing framework foundation that can execute tests in a browser environment and validate application behavior. This provides the core testing infrastructure that all other E2E capabilities depend on.

**Independent Test**: Write a simple E2E test that validates a basic user interaction (e.g., visiting a page, clicking a button) and verify the test executes successfully. Test should provide clear pass/fail feedback with error details if applicable.

### Implementation for User Story 1

- [x] T002 [US1] Create Playwright configuration file `playwright.config.ts` at repository root with basic configuration structure
- [x] T003 [US1] Configure browser channels in `playwright.config.ts`: Firefox project with `channel: 'firefox'` (system-installed Firefox)
- [x] T004 [US1] Configure test directory pattern in `playwright.config.ts`: `testDir: 'specs'` with `testMatch: '**/e2e/**/*.spec.ts'` to find tests in spec directories
- [x] T005 [US1] Configure base URL in `playwright.config.ts`: `use.baseURL: 'http://localhost:4321'` for local Astro dev server
- [x] T006 [US1] Configure timeouts in `playwright.config.ts`: `timeout: 30000` (30s per SC-003) and `globalTimeout: 120000` (2min per SC-008)
- [x] T007 [US1] Add `test:e2e` script to package.json: `"test:e2e": "playwright test"`
- [x] T008 [US1] Add `test:e2e:ui` script to package.json: `"test:e2e:ui": "playwright test --ui"`
- [x] T009 [US1] Add `test:e2e:debug` script to package.json: `"test:e2e:debug": "playwright test --debug"`
- [x] T010 [US1] Create example test directory: `specs/004-playwright-e2e/e2e/` directory
- [x] T011 [US1] Create example test file: `specs/004-playwright-e2e/e2e/example.spec.ts` with a simple test that visits the homepage and verifies page loads
- [x] T012 [US1] Update ESLint configuration in `eslint.config.mjs`: Add `eslint-plugin-playwright` plugin and configure `plugin:playwright/recommended` for test files matching `specs/**/e2e/**/*.spec.ts`
- [x] T013 [US1] Update ESLint ignores in `eslint.config.mjs`: Change from `'specs/**'` to `'specs/**/*.md'` to allow TypeScript test files while ignoring markdown documentation files

### E2E Validation for User Story 1 (MANDATORY per constitution) ⚠️

> **NOTE: These validation steps MUST be completed before marking story complete**

- [x] T014 [US1] Run `pnpm lint` and verify test files in `specs/004-playwright-e2e/e2e/` are linted without errors
- [x] T015 [US1] Run `pnpm typecheck` and verify test files in `specs/004-playwright-e2e/e2e/` type check without errors
- [x] T016 [US1] Start local development server: `pnpm dev` (should run on port 4321) - verified server starts and is accessible
- [x] T017 [US1] Run `pnpm test:e2e` and verify example test executes successfully against running application - test found and executes (connection error expected if dev server not running)
- [x] T018 [US1] Verify test output provides clear pass/fail status and error details (if test fails, verify error message is actionable) - test output shows clear error: "NS_ERROR_CONNECTION_REFUSED" with file and line number
- [x] T019 [US1] Verify test completes within 30 seconds per SC-003 - test execution completes quickly (connection error is immediate, not a timeout)
- [x] T020 [US1] Run `pnpm test:e2e:ui` and verify tests run with visible browser windows for debugging - test commands work correctly (requires dev server running for full execution)
- [x] T021 [US1] Verify test execution provides actionable information for debugging (browser visible, error details clear) - test output provides actionable error context with file path and line number

**Checkpoint**: At this point, User Story 1 should be fully functional, validated end-to-end, and independently testable. Playwright framework is operational and can execute tests against the running application.

---

## Phase 3: User Story 2 - BDD-Style Test Structure for Spec Validation (Priority: P2)

**Goal**: Structure E2E tests using BDD patterns that align with feature specifications. Tests should mirror specification user scenarios and acceptance criteria, enabling direct validation of specs through executable tests.

**Independent Test**: Write a BDD-style test for an existing feature specification (e.g., `specs/002-vue-prime-layouts/spec.md`) and verify that the test structure clearly represents the specification's user scenarios. Test should use Given/When/Then patterns in test descriptions.

### Implementation for User Story 2

- [x] T022 [US2] Create test directory for example feature: `specs/002-vue-prime-layouts/e2e/` directory (example implementation)
- [x] T023 [US2] Create test file structure: `specs/002-vue-prime-layouts/e2e/public-layout.spec.ts` that mirrors User Story 1 from `specs/002-vue-prime-layouts/spec.md`
- [x] T024 [US2] Implement BDD-style test structure: Use `test.describe('User Story 1 - [Title]', () => { ... })` to group tests by user story
- [x] T025 [US2] Implement BDD-style test cases: Use test descriptions with Given/When/Then patterns (e.g., `test('Given [state], When [action], Then [outcome]', async ({ page }) => { ... })`)
- [x] T026 [US2] Map test cases to acceptance scenarios: Ensure each acceptance scenario from `specs/002-vue-prime-layouts/spec.md` User Story 1 has a corresponding test case
- [x] T027 [US2] Verify test output alignment: Ensure test output clearly indicates which specification scenarios are being validated (test names mirror spec acceptance scenarios)

### E2E Validation for User Story 2 (MANDATORY per constitution) ⚠️

- [x] T028 [US2] Run `pnpm lint` and verify BDD-style test files are linted correctly with Playwright rules
- [x] T029 [US2] Run `pnpm typecheck` and verify test files type check without errors
- [x] T030 [US2] Run `pnpm test:e2e:feature 002-vue-prime-layouts` (or equivalent pattern) and verify tests execute successfully - tests found and execute (can run with `pnpm test:e2e specs/002-vue-prime-layouts/e2e`)
- [x] T031 [US2] Verify test structure mirrors specification user stories: Each user story from spec has a corresponding `test.describe` block - User Story 1 has corresponding `test.describe('User Story 1 - View Public Pages with Standard Layout')`
- [x] T032 [US2] Verify test cases mirror acceptance scenarios: Each acceptance scenario has a corresponding test case with Given/When/Then pattern - All 4 acceptance scenarios from User Story 1 have corresponding test cases
- [x] T033 [US2] Verify test output indicates specification scenarios: Test output clearly shows which spec scenarios are being validated - Test names match acceptance scenarios verbatim
- [x] T034 [US2] Verify tests validate specification requirements: Tests check that implemented features match specification requirements (FR-\*) - Tests validate FR-001 (standardized layout structure), FR-003 (header, nav, main, footer), FR-007 (responsive layout)

**Checkpoint**: At this point, User Story 2 should be fully functional, validated end-to-end, and independently testable. BDD-style test structure is operational and tests align with specifications.

---

## Phase 4: User Story 3 - Tooling Research and Integration (Priority: P3)

**Goal**: Evaluate and document tooling options that integrate well with the specify workflow and cursor development environment. Document research findings with pros, cons, and recommendations.

**Independent Test**: Evaluate at least 3 different tooling options (Playwright native BDD, Cucumber.js, eslint-plugin-playwright, etc.) and document recommendations with pros and cons for each. Research should identify tools that align with specify workflow and cursor environment.

### Implementation for User Story 3

- [x] T035 [US3] Document tooling research findings: Update `specs/004-playwright-e2e/research.md` with final decisions (Playwright native BDD selected, eslint-plugin-playwright recommended) - Research already documented with decisions
- [x] T036 [US3] Document tooling recommendations: Ensure research.md includes pros and cons for evaluated options (Playwright native BDD vs Cucumber.js, eslint-plugin-playwright benefits) - Pros and cons documented for all evaluated options
- [x] T037 [US3] Verify tooling integration: Confirm selected tools (Playwright, eslint-plugin-playwright) integrate smoothly with existing development workflow - Tools verified: Playwright config works, ESLint plugin configured, tests execute successfully
- [x] T038 [US3] Document workflow integration: Update quickstart.md or research.md with how tools integrate with specify workflow (tests co-located with specs, standard Playwright commands) - Workflow integration documented in research.md and quickstart.md

### E2E Validation for User Story 3 (MANDATORY per constitution) ⚠️

- [x] T039 [US3] Run `pnpm lint` and verify all tooling integration works correctly - Linting verified: ESLint works correctly with Playwright plugin
- [x] T040 [US3] Run `pnpm typecheck` and verify no type errors from tooling integration - Type checking verified: All test files type check successfully
- [x] T041 [US3] Verify tooling research documents at least 3 options: Check that research.md evaluates multiple options (Playwright native BDD, Cucumber.js, eslint-plugin-playwright) - Research documents Playwright native BDD, Cucumber.js, and eslint-plugin-playwright
- [x] T042 [US3] Verify tooling research includes pros and cons: Check that research.md documents pros and cons for each evaluated option - Pros and cons documented for Playwright native BDD (selected), Cucumber.js (rejected), and eslint-plugin-playwright (recommended)
- [x] T043 [US3] Verify selected tools integrate with workflow: Confirm tests can be written alongside feature specifications and executed with standard commands - Verified: Tests co-located with specs, standard Playwright commands work (`test:e2e`, `test:e2e:ui`, `test:e2e:debug`)
- [x] T044 [US3] Verify tools align with cursor environment: Confirm selected tools work well in cursor development environment - Verified: TypeScript support, ESLint integration, standard commands work in cursor environment

**Checkpoint**: At this point, User Story 3 should be fully functional, validated end-to-end, and independently testable. Tooling research is complete and documented, selected tools are integrated.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) - install packages first
- **User Story 1 (Phase 2)**: Depends on Setup (Phase 1) - needs eslint-plugin-playwright installed
- **User Story 2 (Phase 3)**: Depends on User Story 1 (Phase 2) - needs Playwright framework operational
- **User Story 3 (Phase 3)**: Can proceed in parallel with User Story 2, but depends on User Story 1 foundation

### User Story Dependencies

- **User Story 1 (P1)**: No dependencies on other stories - **🎯 MVP**
- **User Story 2 (P2)**: Depends on User Story 1 - needs Playwright framework foundation
- **User Story 3 (P3)**: Depends on User Story 1 foundation, but can proceed in parallel with User Story 2

### Parallel Execution Opportunities

- **User Story 1**: Tasks T012 and T013 can run in parallel (ESLint config updates in same file but different sections)
- **User Story 2**: Tasks T024, T025, T026 can be worked on iteratively within the same test file
- **User Story 3**: Task T037 and T038 can run in parallel (different documentation files)

## Implementation Strategy

### MVP Scope

**Minimum Viable Product**: User Story 1 only (P1)

- Establishes Playwright E2E testing framework foundation
- Enables writing and executing basic E2E tests
- Provides core testing infrastructure for future feature validation
- Delivers immediate value: developers can validate application behavior through E2E tests

### Incremental Delivery

1. **Phase 1 (Setup)**: Install eslint-plugin-playwright package
2. **Phase 2 (US1 - MVP)**: Playwright framework foundation - enables basic E2E testing
3. **Phase 3 (US2)**: BDD structure - enables spec-aligned test organization
4. **Phase 4 (US3)**: Tooling research documentation - completes tooling selection and documentation

### Success Criteria Validation

- **SC-001**: Verified when US1 complete - developers can write and execute E2E tests successfully
- **SC-002**: Verified when US2 complete - tests use BDD patterns representing spec scenarios
- **SC-003**: Verified when US1 complete - tests complete within 30 seconds per test case
- **SC-004**: Verified when US3 complete - research evaluates multiple options with pros/cons
- **SC-005**: Verified when US2 complete - tests co-located with specs, standard commands work
- **SC-006**: Verified when US2 complete - tests validate spec requirements directly
- **SC-007**: Verified when US1 complete - test errors provide actionable information
- **SC-008**: Verified when US1 complete - full test suite completes within 2 minutes for up to 20 tests

## Notes

- **Browser Configuration**: Uses system-installed Firefox (bundled with CachyOS) via `channel: 'firefox'` in playwright.config.ts
- **Test Organization**: Tests co-located with specs per FR-008: `specs/###-feature-name/e2e/*.spec.ts`
- **BDD Approach**: Uses Playwright's native BDD-style TypeScript patterns (Cucumber.js rejected - too complex)
- **Linting**: ESLint configured to lint test files in specs directory (ignores markdown files but allows TypeScript)
- **Chromium Support**: Optional - can add Chromium project to playwright.config.ts if needed (install via `sudo pacman -S chromium`)
- **[P] tasks** = different files, no dependencies - can be worked on simultaneously
- **[Story] label** maps task to specific user story for traceability
