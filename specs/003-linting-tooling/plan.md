# Implementation Plan: Development Tooling Setup

**Branch**: `003-linting-tooling` | **Date**: 2026-01-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-linting-tooling/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Establish comprehensive code quality tooling for the Astro + Vue + TypeScript + Tailwind CSS codebase. Configure ESLint for TypeScript, Vue, Astro, and Tailwind CSS validation; integrate Prettier for automated code formatting; ensure `astro check` type checking works across all files; set up Husky pre-commit hooks to automatically enforce quality checks; and resolve existing code quality issues. This implementation directly supports Constitution Principle II (Code Quality Gates) by providing the tooling infrastructure required for enforcement.

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
**Storage**: N/A (tooling configuration only)  
**Testing**: Progressive E2E validation (per constitution) - tooling setup validated by running checks and verifying application still builds/runs  
**Target Platform**: Development environment (Node.js tooling)  
**Project Type**: Web application (Astro framework, per constitution)  
**Performance Goals**: Linting completes within 30 seconds, formatting within 10 seconds, type checking within 60 seconds for codebases under 10,000 lines (per spec SC-001, SC-002, SC-003)  
**Constraints**:

- Must not disrupt existing development workflow; configuration must be compatible with existing Astro + Vue + TypeScript setup
- **Strictness Requirement**: Use strictest configurations possible (strict-type-checked for TypeScript, vue3-recommended for Vue)
- **Exceptions**: Only test files and type definition files (`.d.ts`) can use relaxed rules for mocking purposes
- **Workflow Integration**: Formatting, linting, and fixing MUST be part of developer workflow and ALWAYS be run and corrected before committing

**Scale/Scope**: Single codebase; all existing files must be validated and fixed

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Verify compliance with all constitution principles:

- **Type Safety**: All code will use TypeScript with strict mode. Runtime validation (Zod) only at boundaries.
  - ✅ **COMPLIANT**: This feature sets up tooling to enforce TypeScript strict mode via `astro check` and ESLint
- **Code Quality**: Linting and type checking will pass before any commit.
  - ✅ **COMPLIANT**: This feature directly implements Constitution Principle II by configuring ESLint and Prettier
- **Testing Discipline**: Progressive testing workflow MUST be followed:
  - Static analysis (lint, typecheck) passes
  - Application loads in browser without errors after each change
  - New infrastructure (DB, services) follows progressive integration: connection → test data → UI display → refinement
  - Complete end-to-end validation in running application for all features
  - ✅ **COMPLIANT**: Tooling setup will be validated by: (1) running lint/format/typecheck, (2) verifying application builds, (3) verifying application runs without errors
- **Incremental Delivery**: Features broken into independently testable increments
  - ✅ **COMPLIANT**: Setup split into: ESLint configuration → Prettier integration → Type checking setup → Issue resolution

**Constitution Alignment**: This feature directly implements the tooling infrastructure required by Constitution Principle II (Code Quality Gates). No violations or exceptions needed.

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
src/
├── components/
│   ├── Footer.astro
│   └── vue/
│       ├── HomepageCard.vue
│       ├── PrivateNav.vue
│       ├── PublicNav.vue
│       └── UserProfile.vue
├── layouts/
│   ├── PrivateLayout.astro
│   └── PublicLayout.astro
├── lib/
│   └── fixtures/
│       └── mock-user-session.ts
├── pages/
│   ├── _app.ts
│   ├── about.astro
│   ├── dashboard/
│   │   └── index.astro
│   ├── index.astro
│   └── profile/
│       └── index.astro
└── styles/
    └── global.css
```

**Structure Decision**: Single project structure (Astro application). Configuration files will be added at repository root: `.eslintrc.cjs` (or equivalent), `.prettierrc` (or equivalent), `.prettierignore`, `.eslintignore`. Git hooks directory `.husky/` will be created with `pre-commit` hook. Package.json scripts will be updated for linting, formatting, and type checking operations, plus `prepare` script for Husky installation.

**Configuration Strictness**:

- ESLint will use strictest configurations: `@typescript-eslint/strict-type-checked`, `@typescript-eslint/stylistic-type-checked`, `plugin:vue/vue3-recommended`
- Only test files (`**/*.test.{ts,tsx}`, `**/*.spec.{ts,tsx}`, `tests/**`) and type definition files (`**/*.d.ts`) will have relaxed rules for mocking
- All production code must pass strictest linting rules

**Workflow Integration**:

- Formatting, linting, and fixing are MANDATORY parts of developer workflow
- Husky pre-commit hook automatically runs `format`, `lint:fix`, and `typecheck` before every commit
- Commit is aborted if any check fails
- All issues MUST be corrected before code can be committed (enforced by Git hook)

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - this feature directly implements constitution requirements.
