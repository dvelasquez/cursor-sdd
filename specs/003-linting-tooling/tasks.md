# Tasks: Development Tooling Setup

**Input**: Design documents from `/specs/003-linting-tooling/`
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
- Configuration files at repository root: `.eslintrc.cjs`, `.prettierrc`, `.prettierignore`, `.eslintignore`
- Git hooks directory: `.husky/pre-commit`

---

## Phase 1: Setup (Package Installation)

**Purpose**: Install required packages and prepare project structure

- [x] T001 Install ESLint packages: `eslint`, `eslint-plugin-astro`, `eslint-plugin-vue`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`, `eslint-plugin-tailwindcss` as devDependencies in package.json
- [x] T002 Install Prettier packages: `prettier`, `prettier-plugin-astro`, `eslint-config-prettier`, `eslint-plugin-prettier` as devDependencies in package.json
- [x] T003 Install Husky packages: `husky`, `lint-staged` as devDependencies in package.json

---

## Phase 2: User Story 1 - Code Quality Validation Workflow (Priority: P1) 🎯 MVP

**Goal**: Establish ESLint configuration for TypeScript, Vue, Astro, and Tailwind CSS validation, and ensure type checking works via `astro check`. This provides the foundation for code quality validation.

**Independent Test**: Run `pnpm lint` and `pnpm typecheck` commands and verify they execute successfully, analyze all supported file types, and report code quality issues and type errors.

### Implementation for User Story 1

- [x] T004 [US1] Create ESLint configuration file `eslint.config.mjs` (flat config format for ESLint 9) with root parser `@typescript-eslint/parser` and parserOptions.project pointing to tsconfig.json
- [x] T005 [US1] Configure ESLint plugins in `eslint.config.mjs`: `@typescript-eslint`, `vue`, `astro`, `prettier` (tailwindcss skipped due to Tailwind v4 compatibility issue)
- [x] T006 [US1] Add strictest ESLint configs to `eslint.config.mjs`: `flat/strict-type-checked`, `flat/stylistic-type-checked`, `flat/recommended` for Vue and Astro, Prettier integration
- [x] T007 [US1] Configure parser overrides in `eslint.config.mjs` for `.astro` files using `astro-eslint-parser` with TypeScript sub-parser
- [x] T008 [US1] Configure parser overrides in `eslint.config.mjs` for `.vue` files using `vue-eslint-parser` with TypeScript sub-parser
- [x] T009 [US1] Add exceptions in `eslint.config.mjs` overrides section for test files (`**/*.test.{ts,tsx,js,jsx}`, `**/*.spec.{ts,tsx,js,jsx}`, `tests/**`) with relaxed rules for mocking
- [x] T010 [US1] Add exceptions in `eslint.config.mjs` overrides section for type definition files (`**/*.d.ts`) with relaxed rules for partial types
- [x] T011 [P] [US1] Create `.eslintignore` file with ignore patterns for `node_modules/`, `dist/`, `.astro/` directory
- [x] T012 [US1] Add `lint` script to package.json: `"lint": "eslint ."`
- [x] T013 [US1] Add `lint:fix` script to package.json: `"lint:fix": "eslint . --fix"`
- [x] T014 [US1] Add `typecheck` script to package.json: `"typecheck": "astro check"`

### E2E Validation for User Story 1 (MANDATORY per constitution) ⚠️

> **NOTE: These validation steps MUST be completed before marking story complete**

- [x] T015 [US1] Run `pnpm lint` and verify it analyzes TypeScript, Vue, and Astro files without errors
- [x] T016 [US1] Run `pnpm typecheck` and verify it checks all files and reports type errors (if any exist) - 0 errors found
- [x] T017 [US1] Build application successfully with `pnpm build` (no build errors)
- [ ] T018 [US1] Start application with `pnpm dev` and load pages in browser
- [ ] T019 [US1] Verify no console errors, runtime errors, or visible breakages in browser
- [x] T020 [US1] Verify linting and type checking commands produce actionable feedback per acceptance scenarios

**Checkpoint**: At this point, User Story 1 should be fully functional, validated end-to-end, and independently testable. ESLint and type checking are operational.

---

## Phase 3: User Story 2 - Automated Code Formatting (Priority: P2)

**Goal**: Configure Prettier for consistent code formatting and integrate it with ESLint to prevent conflicts. This enables automated code formatting as part of the developer workflow.

**Independent Test**: Run `pnpm format` command on files with inconsistent formatting and verify they are automatically reformatted according to project standards.

### Implementation for User Story 2

- [x] T021 [US2] Create Prettier configuration file `.prettierrc` with core options: `printWidth: 100`, `singleQuote: true`, `trailingComma: "all"`, `tabWidth: 2`
- [x] T022 [US2] Add `prettier-plugin-astro` to plugins array in `.prettierrc`
- [x] T023 [US2] Configure overrides in `.prettierrc` for `.astro` files with parser: "astro"
- [x] T024 [P] [US2] Create `.prettierignore` file with ignore patterns for `node_modules/`, `dist/`, `.astro/` directory, build artifacts
- [x] T025 [US2] Add `format` script to package.json: `"format": "prettier --write ."`
- [x] T026 [US2] Add `format:check` script to package.json: `"format:check": "prettier --check ."`
- [x] T027 [US2] Verify ESLint configuration in `eslint.config.mjs` includes Prettier integration (prettierConfig and prettierPlugin already configured)
- [x] T028 [US2] Verify ESLint configuration in `eslint.config.mjs` has `prettier/prettier: 'error'` rule set (already configured)

### E2E Validation for User Story 2 (MANDATORY per constitution) ⚠️

- [x] T029 [US2] Run `pnpm format` and verify it formats TypeScript, Vue, and Astro files
- [x] T030 [US2] Run `pnpm format:check` and verify it reports formatting status correctly
- [x] T031 [US2] Run `pnpm lint` and verify no conflicts between Prettier and ESLint
- [x] T032 [US2] Build application successfully with `pnpm build` (no build errors)
- [ ] T033 [US2] Start application with `pnpm dev` and load pages in browser
- [ ] T034 [US2] Verify no console errors, runtime errors, or visible breakages in browser
- [x] T035 [US2] Verify formatting command automatically reformats code per acceptance scenarios

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently and be validated end-to-end. Formatting, linting, and type checking are all operational.

---

## Phase 4: User Story 3 - Issue Resolution (Priority: P3)

**Goal**: Identify all code quality issues in the existing codebase and fix them to bring the codebase into compliance with quality standards (zero critical errors).

**Independent Test**: Run quality checks, identify all issues, fix them systematically, and verify checks pass after fixes (zero critical errors).

### Implementation for User Story 3

- [ ] T036 [US3] Run `pnpm lint` and document all linting errors in the codebase
- [ ] T037 [US3] Run `pnpm typecheck` and document all type errors in the codebase
- [ ] T038 [US3] Run `pnpm format:check` and document all formatting inconsistencies
- [ ] T039 [US3] Fix all auto-fixable linting issues using `pnpm lint:fix`
- [ ] T040 [US3] Fix all formatting issues using `pnpm format`
- [ ] T041 [US3] Manually fix remaining linting errors that cannot be auto-fixed
- [ ] T042 [US3] Manually fix all type errors identified by `pnpm typecheck`
- [ ] T043 [US3] Verify all fixes by running `pnpm lint`, `pnpm typecheck`, and `pnpm format:check` again

### E2E Validation for User Story 3 (MANDATORY per constitution) ⚠️

- [ ] T044 [US3] Run `pnpm lint` and verify zero critical errors remain
- [ ] T045 [US3] Run `pnpm typecheck` and verify zero type errors remain
- [ ] T046 [US3] Run `pnpm format:check` and verify all files are properly formatted
- [ ] T047 [US3] Build application successfully with `pnpm build` (no build errors)
- [ ] T048 [US3] Start application with `pnpm dev` and load pages in browser
- [ ] T049 [US3] Verify no console errors, runtime errors, or visible breakages in browser
- [ ] T050 [US3] Verify codebase passes all validation gates per acceptance scenarios

**Checkpoint**: All user stories should now be independently functional and validated end-to-end. The codebase passes all quality checks with zero critical errors.

---

## Phase 5: Workflow Integration (Husky Pre-commit Hooks)

**Purpose**: Set up Husky pre-commit hooks to automatically enforce quality checks before every commit

- [x] T051 Initialize Husky by creating `.husky` directory structure
- [x] T052 Add `prepare` script to package.json: `"prepare": "husky install"` to auto-install Husky on pnpm install
- [x] T053 Create pre-commit hook script `.husky/pre-commit` that runs `pnpm format`, `pnpm lint:fix`, and `pnpm typecheck`
- [x] T054 Make `.husky/pre-commit` executable (chmod +x)
- [ ] T055 Configure lint-staged in package.json for optimized staged file processing (optional enhancement - deferred)
- [ ] T056 Test pre-commit hook by making a test commit and verifying checks run automatically

### Validation for Workflow Integration

- [x] T057 Run `pnpm install` and verify Husky installs automatically via prepare script (prepare script added)
- [ ] T058 Make a test change, stage it, and attempt to commit to verify pre-commit hook runs (manual test required)
- [ ] T059 Verify commit is aborted if any quality check fails (manual test required)
- [ ] T060 Verify commit succeeds when all quality checks pass (manual test required)

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final validation, documentation, and cleanup

- [x] T061 [P] Verify all package.json scripts work correctly: `lint`, `lint:fix`, `format`, `format:check`, `typecheck` (all scripts functional)
- [x] T062 [P] Verify ESLint configuration handles all file types correctly (TypeScript, Vue, Astro) - using ESLint 9 flat config format
- [x] T063 [P] Verify Prettier configuration formats all file types correctly (all file types formatted correctly)
- [x] T064 Verify strictest configurations are applied (strict-type-checked, stylistic-type-checked, vue3-recommended) - all applied
- [x] T065 Verify test file exceptions work correctly (relaxed rules for test files and .d.ts files) - exceptions configured
- [x] T066 Run performance validation: verify linting completes within 30 seconds, formatting within 10 seconds, type checking within 60 seconds for codebase under 10k lines (lint: ~3s, format: ~1.6s, typecheck: ~3.6s for 13 files - all within targets)
- [x] T067 Verify application builds and runs without errors after all tooling setup (builds successfully, dev server starts)
- [x] T068 Verify all success criteria from spec are met (SC-001 through SC-006) - tooling operational, 0 critical errors, typecheck passes
- [ ] T069 Review and update documentation if needed (quickstart.md, README.md) - note: using eslint.config.mjs (flat config) instead of .eslintrc.cjs

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **User Story 1 (Phase 2)**: Depends on Setup completion - BLOCKS User Story 2 and 3
- **User Story 2 (Phase 3)**: Depends on User Story 1 completion (needs ESLint config for integration)
- **User Story 3 (Phase 4)**: Depends on User Story 1 and 2 completion (needs tooling to be functional)
- **Workflow Integration (Phase 5)**: Depends on User Story 1 and 2 completion (needs tooling to be functional)
- **Polish (Phase 6)**: Depends on all previous phases completion

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Setup (Phase 1) - Foundation for all other tooling
- **User Story 2 (P2)**: Must start after User Story 1 (P1) - Requires ESLint config for Prettier integration
- **User Story 3 (P3)**: Must start after User Story 1 and 2 - Requires tooling to be functional to identify and fix issues

### Within Each User Story

- Configuration files before package.json scripts
- ESLint config before Prettier integration (for User Story 2)
- Tooling setup before issue resolution (for User Story 3)
- E2E validation MUST complete before marking story complete (see E2E Validation sections)
- Story complete (including E2E validation) before moving to next priority

### Parallel Opportunities

- Setup tasks (T001, T002, T003) can run in parallel (different package groups)
- ESLint ignore file (T011) and Prettier ignore file (T024) can be created in parallel
- Polish validation tasks marked [P] (T061, T062, T063) can run in parallel
- Different configuration file creation tasks within a story marked [P] can run in parallel if they don't depend on each other

---

## Parallel Example: Setup Phase

```bash
# Install packages in parallel (if package manager supports it):
Task: "Install ESLint packages..." (T001)
Task: "Install Prettier packages..." (T002)
Task: "Install Husky packages..." (T003)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (install packages)
2. Complete Phase 2: User Story 1 (ESLint and type checking setup + E2E validation)
3. **STOP and VALIDATE**: Verify ESLint and type checking work end-to-end (commands run, analyze files, report issues, app builds and runs)
4. Deploy/demo if ready (basic code quality validation operational)

### Incremental Delivery

1. Complete Setup → Packages installed
2. Add User Story 1 → ESLint and type checking operational → E2E validation → Deploy/Demo (MVP!)
3. Add User Story 2 → Prettier integration → E2E validation → Deploy/Demo
4. Add User Story 3 → Issue resolution → E2E validation → Deploy/Demo
5. Add Workflow Integration → Husky hooks → Validation → Deploy/Demo
6. Add Polish → Final validation → Deploy/Demo
7. Each phase adds value without breaking previous functionality (verified through E2E validation)

### Sequential Execution (Recommended for This Feature)

Since this feature has clear dependencies (ESLint before Prettier, tooling before fixes), sequential execution is recommended:

1. Setup (Phase 1)
2. User Story 1 (Phase 2) - Foundation
3. User Story 2 (Phase 3) - Builds on foundation
4. User Story 3 (Phase 4) - Uses functional tooling
5. Workflow Integration (Phase 5) - Enhances workflow
6. Polish (Phase 6) - Final validation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Verify all commands work before proceeding to next phase
- Test pre-commit hooks before considering feature complete
- Avoid: skipping E2E validation, committing broken tooling, ignoring configuration errors
