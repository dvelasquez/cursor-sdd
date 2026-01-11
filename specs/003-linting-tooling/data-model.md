# Data Model: Development Tooling Setup

**Feature**: Development Tooling Setup (003-linting-tooling)  
**Date**: 2026-01-16

## Overview

This feature involves configuration file setup and tooling integration rather than traditional data entities. This document describes the configuration structures and their relationships.

## Configuration Entities

### ESLint Configuration (`.eslintrc.cjs`)

**Purpose**: Defines linting rules and parser configurations for code quality validation

**Structure**:

- Root parser: `@typescript-eslint/parser` (with `parserOptions.project: true` for type-aware rules)
- Plugins: `@typescript-eslint`, `vue`, `astro`, `tailwindcss`, `prettier`
- Extends: **Strictest configurations available**:
  - `plugin:@typescript-eslint/strict-type-checked` - Strictest TypeScript rules with type information
  - `plugin:@typescript-eslint/stylistic-type-checked` - Strictest stylistic rules with type information
  - `plugin:vue/vue3-recommended` - Strictest Vue 3 configuration
  - `plugin:tailwindcss/recommended` - Tailwind CSS rules
  - `plugin:astro/recommended` - Astro rules
- Overrides: File-specific configurations for `.astro` and `.vue` files
- Test file overrides: Relaxed rules for test files (`**/*.test.{ts,tsx}`, `**/*.spec.{ts,tsx}`, `tests/**`)
- Type definition overrides: Relaxed rules for `.d.ts` files (for mocking/partial types)
- Rules: Custom rule definitions and Prettier integration

**Relationships**:

- References `tsconfig.json` for TypeScript configuration
- Integrates with Prettier via `eslint-config-prettier` and `eslint-plugin-prettier`

### Prettier Configuration (`.prettierrc`)

**Purpose**: Defines code formatting rules for consistent style

**Structure**:

- Core formatting options (printWidth, singleQuote, trailingComma, tabWidth)
- Plugins: `prettier-plugin-astro`
- Overrides: File-specific options for `.astro` files

**Relationships**:

- Integrated with ESLint to prevent formatting conflicts
- Processes files matching patterns in `.prettierignore`

### Package.json Scripts

**Purpose**: Provides developer-accessible commands for tooling operations

**Structure**:

- `lint`: Run ESLint on all files
- `lint:fix`: Run ESLint with auto-fix
- `format`: Run Prettier to format all files
- `format:check`: Check formatting without modifying files
- `typecheck`: Run `astro check` for type checking
- `prepare`: Install Husky Git hooks (runs automatically on `pnpm install`)

**Relationships**:

- Executes underlying tooling (ESLint, Prettier, Astro)
- Referenced in development workflow, pre-commit hooks, and CI/CD (future)

### Husky Pre-commit Hook (`.husky/pre-commit`)

**Purpose**: Automatically enforces code quality checks before every commit

**Structure**:

- Git hook script that runs before commits
- Executes: `pnpm format`, `pnpm lint:fix`, `pnpm typecheck`
- Aborts commit if any check fails

**Relationships**:

- Managed by Husky package
- References package.json scripts
- Triggered automatically by Git on commit

## Configuration File Relationships

```
.eslintrc.cjs
  ├── References: tsconfig.json (TypeScript config)
  ├── Integrates: eslint-config-prettier (disables conflicting rules)
  └── Integrates: eslint-plugin-prettier (runs Prettier as rule)

.prettierrc
  ├── Uses: prettier-plugin-astro (Astro file support)
  └── Referenced by: eslint-plugin-prettier

package.json (scripts)
  ├── lint → ESLint
  ├── format → Prettier
  ├── typecheck → @astrojs/check
  └── prepare → Husky install

.husky/pre-commit (Git hook)
  ├── Runs: pnpm format
  ├── Runs: pnpm lint:fix
  └── Runs: pnpm typecheck

tsconfig.json (existing)
  └── Referenced by: ESLint parser, Astro check
```

## Validation Rules

1. **ESLint Configuration**:
   - Must use strictest configurations available (`strict-type-checked`, `stylistic-type-checked`, `vue3-recommended`)
   - Must parse TypeScript, Vue, and Astro files correctly
   - Must not conflict with Prettier formatting rules
   - Must provide actionable error messages
   - Must allow exceptions only for test files and `.d.ts` files (for mocking purposes)
   - All production code must pass strictest rules with zero errors

2. **Prettier Configuration**:
   - Must format TypeScript, Vue, and Astro files consistently
   - Must integrate seamlessly with ESLint
   - Must complete formatting within performance targets (<10s for <10k lines)

3. **Type Checking**:
   - Must use TypeScript strict mode (already configured in `tsconfig.json`)
   - Must check all TypeScript and Astro files
   - Must use existing `tsconfig.json` configuration
   - Must complete within performance targets (<60s for <10k lines)
   - All type errors must be fixed (zero errors allowed)

## State Transitions

**Configuration Setup Flow**:

1. Install packages → 2. Create config files (with strictest configurations) → 3. Update package.json → 4. Test configuration → 5. Fix all issues

**Developer Workflow (AUTOMATICALLY ENFORCED)**:

1. Make code changes → 2. Run `git commit` → 3. Pre-commit hook automatically runs `format`, `lint:fix`, and `typecheck` → 4. If checks pass, commit succeeds → 5. If checks fail, commit aborts → 6. Fix ALL issues → 7. Retry commit

**Workflow Enforcement**: Formatting, linting, and fixing are AUTOMATICALLY ENFORCED via Husky pre-commit hooks. All issues MUST be corrected before code can be committed. The Git hook prevents commits that don't pass all quality checks.
