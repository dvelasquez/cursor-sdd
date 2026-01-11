# Contracts: Development Tooling Setup

**Feature**: Development Tooling Setup (003-linting-tooling)  
**Date**: 2026-01-16

## Overview

This feature establishes developer tooling interfaces through command-line scripts and configuration files. Unlike API contracts, these are "tooling contracts" that define the interface between developers and the code quality tooling.

**Workflow Requirement**: Formatting, linting, and fixing are AUTOMATICALLY ENFORCED via Husky pre-commit hooks. The pre-commit hook runs all quality checks before every commit and aborts the commit if any check fails. Developers cannot commit code that doesn't pass all quality checks.

## Tooling Command Interface

### Linting Commands

#### `pnpm lint`

**Purpose**: Validate code quality across all supported file types

**Input**: None (operates on entire codebase)

**Output**:

- Exit code 0 if no linting errors
- Exit code non-zero if linting errors found
- Console output listing all linting issues with file paths, line numbers, and rule names

**Behavior**:

- Analyzes TypeScript (`.ts`, `.tsx`), Vue (`.vue`), and Astro (`.astro`) files
- Applies rules from ESLint configuration
- Reports errors and warnings according to configured severity levels

**Performance Target**: Completes within 30 seconds for codebases under 10,000 lines

---

#### `pnpm lint:fix`

**Purpose**: Validate code quality and automatically fix auto-fixable issues

**Input**: None (operates on entire codebase)

**Output**:

- Exit code 0 if no linting errors remain (after fixes)
- Exit code non-zero if unfixable linting errors remain
- Console output listing fixes applied and remaining issues
- Modified files updated with fixes

**Behavior**:

- Same analysis as `pnpm lint`
- Automatically applies fixes for rules that support auto-fix
- Updates files in-place with fixes
- Reports remaining issues that require manual intervention

---

### Formatting Commands

#### `pnpm format`

**Purpose**: Automatically format all code files according to Prettier rules

**Input**: None (operates on entire codebase)

**Output**:

- Exit code 0 on success
- Console output listing files that were formatted
- Modified files updated with formatted code

**Behavior**:

- Formats TypeScript, Vue, and Astro files
- Applies formatting rules from Prettier configuration
- Updates files in-place with formatted code
- Respects `.prettierignore` file patterns

**Performance Target**: Completes within 10 seconds for codebases under 10,000 lines

---

#### `pnpm format:check`

**Purpose**: Check if files conform to Prettier formatting rules without modifying them

**Input**: None (operates on entire codebase)

**Output**:

- Exit code 0 if all files are properly formatted
- Exit code non-zero if any files need formatting
- Console output listing files that would be reformatted

**Behavior**:

- Validates formatting without making changes
- Useful for CI/CD pipelines and pre-commit checks
- Reports which files would be changed by `pnpm format`

---

### Type Checking Commands

#### `pnpm typecheck`

**Purpose**: Validate TypeScript types across all files

**Input**: None (operates on entire codebase)

**Output**:

- Exit code 0 if no type errors
- Exit code non-zero if type errors found
- Console output listing type errors with file paths, line numbers, and error messages

**Behavior**:

- Checks TypeScript types in `.ts`, `.tsx`, and `.astro` files
- Uses `tsconfig.json` configuration
- Reports type errors, missing types, and type mismatches

**Performance Target**: Completes within 60 seconds for codebases under 10,000 lines

---

## Configuration File Contracts

### `.eslintrc.cjs`

**Contract**: Must export a valid ESLint configuration object

**Required Properties**:

- `root: true`
- `parser: '@typescript-eslint/parser'` (or appropriate parser)
- `plugins: Array<string>`
- `extends: Array<string>`

**File Support**: Must handle `.ts`, `.tsx`, `.vue`, `.astro` files

### `.prettierrc`

**Contract**: Must contain valid Prettier configuration (JSON format)

**Required Properties**:

- `plugins: Array<string>` (must include `prettier-plugin-astro`)
- Formatting options (printWidth, singleQuote, etc.)

**File Support**: Must format `.ts`, `.tsx`, `.vue`, `.astro` files

## Integration Contracts

### ESLint ↔ Prettier Integration

**Contract**: ESLint and Prettier must not conflict

**Requirements**:

- `eslint-config-prettier` disables conflicting ESLint formatting rules
- `eslint-plugin-prettier` runs Prettier as an ESLint rule
- Formatting is handled by Prettier, not ESLint

### TypeScript Integration

**Contract**: Type checking must use project TypeScript configuration

**Requirements**:

- `astro check` uses `tsconfig.json` configuration
- ESLint TypeScript parser uses `tsconfig.json` for type-aware linting
- Consistent type checking behavior across tools

## Error Handling Contracts

### Linting Errors

**Contract**: All linting errors must be actionable

**Requirements**:

- Errors include file path, line number, column number
- Errors include rule name and description
- Errors include suggested fixes when available

### Formatting Errors

**Contract**: Formatting issues must be automatically fixable

**Requirements**:

- All formatting issues can be fixed by `pnpm format`
- `format:check` accurately reports what would be formatted
- No manual formatting steps required

### Type Errors

**Contract**: Type errors must reference TypeScript configuration

**Requirements**:

- Errors include file path and location
- Errors reference TypeScript types and interfaces
- Errors align with `tsconfig.json` strict mode settings

## Pre-commit Hook Contract

### `.husky/pre-commit` Hook

**Contract**: Must execute all quality checks and abort commit on failure

**Required Behavior**:

- Runs `pnpm format` to format all files
- Runs `pnpm lint:fix` to lint and auto-fix staged files
- Runs `pnpm typecheck` to check types across entire codebase
- Aborts commit (exit code non-zero) if any check fails
- Allows commit (exit code 0) only if all checks pass

**Execution Context**:

- Triggered automatically by Git on `git commit`
- Runs before commit is finalized
- Cannot be bypassed without `--no-verify` flag (strongly discouraged)

**Performance Requirements**:

- Must complete within reasonable time (targets: <30s lint, <10s format, <60s typecheck for <10k lines)
- Should provide clear error messages on failure
