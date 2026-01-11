# Implementation Plan: E2E Testing with Playwright and BDD

**Branch**: `004-playwright-e2e` | **Date**: 2026-01-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-playwright-e2e/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Establish E2E testing infrastructure using Playwright with BDD-style test structure that aligns with feature specifications. Configure Playwright to use system-installed browsers (Firefox, Chromium, or Ungoogled Chromium) on CachyOS Linux since Playwright's auto-install is not available. Organize tests co-located with feature specifications to enable direct validation of specs through executable tests. Research and integrate tooling that aligns with the specify workflow and cursor development environment. This implementation supports Constitution Principle IV (Progressive Testing Discipline) by providing E2E validation capabilities for client-side features.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.

  NOTE: Technology stack is defined in constitution (.specify/memory/constitution.md):
  - Language: JavaScript/TypeScript
  - Runtime: Node.js
  - Framework: Astro
  - UI Components: Vue.js (Vue 3)
  - Styling: Tailwind CSS
  - Component Library: PrimeVue
-->

**Language/Version**: JavaScript/TypeScript (per constitution)  
**Runtime**: Node.js (per constitution)  
**Framework**: Astro (per constitution)  
**UI Components**: Vue.js (Vue 3 composition API, per constitution)  
**Styling**: Tailwind CSS + PrimeVue (per constitution)  
**Storage**: N/A (E2E testing infrastructure only)  
**Testing**: Playwright for E2E testing (per spec - @playwright/test already installed v1.57.0); BDD-style test structure using Playwright's native TypeScript patterns (Cucumber.js rejected - too complex); ESLint integration via eslint-plugin-playwright for test code quality  
**Target Platform**: Web browsers (Firefox, Chromium/Ungoogled Chromium on CachyOS Linux)  
**Project Type**: Web application (Astro framework, per constitution)  
**Performance Goals**: Individual test cases complete within 30 seconds; full test suite (up to 20 tests) completes within 2 minutes (per spec SC-003, SC-008)  
**Constraints**:

- **Browser Installation**: Cannot use Playwright's auto-install browser commands on CachyOS Linux
- **System Browsers Required**: Must use system-installed browsers (Firefox bundled, or Chromium/Ungoogled Chromium via package manager)
- **Browser Configuration**: Playwright must be configured to use system browsers via channel configuration
- **Local Development Only**: CI/CD integration deferred to future enhancement (per spec clarification)
- **Test Organization**: Tests must be co-located with feature specifications (per spec FR-008: `specs/###-feature-name/e2e/` or `specs/###-feature-name/tests/`)

**Scale/Scope**: Local development environment; test suites up to 20 test cases (per spec SC-008)

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Verify compliance with all constitution principles:

- **Type Safety**: All code will use TypeScript with strict mode. Runtime validation (Zod) only at boundaries.
  - ✅ **COMPLIANT**: Test configuration files and test code will use TypeScript; Playwright supports TypeScript
- **Code Quality**: Linting and type checking will pass before any commit.
  - ✅ **COMPLIANT**: Test code must pass existing ESLint and type checking configuration
- **Testing Discipline**: Progressive testing workflow MUST be followed:
  - Static analysis (lint, typecheck) passes
  - Application loads in browser without errors after each change
  - New infrastructure (DB, services) follows progressive integration: connection → test data → UI display → refinement
  - Complete end-to-end validation in running application for all features
  - ✅ **COMPLIANT**: This feature directly implements Constitution Principle IV by providing E2E testing infrastructure. Setup will be validated by: (1) running lint/typecheck on test code, (2) writing and executing a simple E2E test, (3) verifying test execution completes successfully
- **Incremental Delivery**: Features broken into independently testable increments
  - ✅ **COMPLIANT**: Implementation split into: Playwright setup → BDD structure → Tooling research and integration

**Constitution Alignment**: This feature directly implements the E2E testing infrastructure required by Constitution Principle IV (Progressive Testing Discipline). No violations or exceptions needed.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
specs/
├── 002-vue-prime-layouts/
│   ├── e2e/              # NEW: E2E tests for this feature (example)
│   │   └── *.spec.ts
│   └── spec.md
├── 003-linting-tooling/
│   └── spec.md
└── 004-playwright-e2e/
    ├── plan.md
    ├── research.md
    ├── data-model.md
    ├── quickstart.md
    ├── contracts/
    └── spec.md

# Root-level Playwright configuration
playwright.config.ts      # NEW: Playwright configuration file
```

**Structure Decision**: Single project structure with E2E tests co-located with feature specifications (per spec FR-008). Each feature directory can contain an `e2e/` subdirectory for its tests. Playwright configuration file (`playwright.config.ts`) is placed at the repository root to manage browser settings, test execution, and project-wide configuration.

**New Directories to Create**:

- `specs/###-feature-name/e2e/` directories as needed (co-located with specs per FR-008)
- `specs/004-playwright-e2e/contracts/` for contracts (minimal for E2E testing infrastructure)

**New Files to Create**:

- `playwright.config.ts` at repository root for Playwright configuration
- Example E2E test files in feature directories (demonstration)

**Existing Directories/Files to Modify**:

- `package.json` - Add test scripts for Playwright execution
- No changes to `src/` structure required (E2E tests validate running application)

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because      |
| --------- | ---------- | ----------------------------------------- |
| None      | N/A        | N/A - No constitution violations detected |
