# Research: Development Tooling Setup

**Feature**: Development Tooling Setup (003-linting-tooling)  
**Date**: 2026-01-16  
**Purpose**: Research best practices for ESLint, Prettier, and Astro type checking configuration

## ESLint Configuration for Astro + Vue + TypeScript + Tailwind CSS

### Decision: Use comprehensive ESLint setup with plugins for each technology

**Rationale**: ESLint is the industry-standard JavaScript/TypeScript linter. Separate plugins provide specialized support for each technology stack component.

**Key Packages**:

- `eslint` - Core ESLint package
- `eslint-plugin-astro` - Provides linting support for `.astro` files
- `eslint-plugin-vue` - Adds linting capabilities for Vue components
- `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin` - Enable ESLint to parse and lint TypeScript code
- `eslint-plugin-tailwindcss` - Ensures proper usage of Tailwind CSS classes

**Configuration Approach**:

- Use `.eslintrc.cjs` (CommonJS) for compatibility with Node.js tooling
- Configure parser overrides for `.astro` and `.vue` files to use appropriate parsers
- **Use strictest configurations available**:
  - `plugin:@typescript-eslint/strict-type-checked` - Strictest TypeScript rules with type information
  - `plugin:@typescript-eslint/stylistic-type-checked` - Strictest stylistic rules with type information
  - `plugin:vue/vue3-recommended` - Strictest Vue 3 configuration (includes strongly-recommended and essential rules)
  - `plugin:tailwindcss/recommended` - Recommended Tailwind CSS rules
  - `plugin:astro/recommended` - Recommended Astro rules
- Use `astro-eslint-parser` for `.astro` files with TypeScript parser as sub-parser
- Use `vue-eslint-parser` for `.vue` files with TypeScript parser as sub-parser
- **Exceptions**: Only test files (`**/*.test.{ts,tsx,js,jsx}`, `**/*.spec.{ts,tsx,js,jsx}`, `tests/**`) and type definition files (`**/*.d.ts`) for mocking/partial types - use relaxed rules for these

**Alternatives Considered**:

- Using separate linting tools for each language (rejected - adds complexity, inconsistent rules)
- Using only TypeScript compiler for type checking (rejected - doesn't cover code quality/style rules)

## Prettier Configuration and ESLint Integration

### Decision: Use Prettier with ESLint integration via eslint-config-prettier and eslint-plugin-prettier

**Rationale**: Prettier handles code formatting automatically, while ESLint handles code quality. Integration prevents conflicts between formatting and linting rules.

**Key Packages**:

- `prettier` - Code formatter
- `prettier-plugin-astro` - Prettier plugin for Astro file formatting
- `eslint-config-prettier` - Disables ESLint rules that conflict with Prettier
- `eslint-plugin-prettier` - Runs Prettier as an ESLint rule

**Configuration Approach**:

- Use `.prettierrc` (JSON) for Prettier configuration
- Configure Prettier with `printWidth: 100`, `singleQuote: true`, `trailingComma: "all"`, `tabWidth: 2`
- Include `prettier-plugin-astro` in plugins array
- Use overrides for `.astro` files with parser: "astro"
- Integrate Prettier into ESLint via `plugin:prettier/recommended` in ESLint extends
- Set `prettier/prettier: 'error'` rule to enforce formatting

**Alternatives Considered**:

- Using ESLint formatting rules only (rejected - less powerful, more configuration needed)
- Running Prettier separately without ESLint integration (rejected - can cause conflicts, less streamlined workflow)

## Astro Type Checking Setup

### Decision: Use `astro check` command for type checking (already available via @astrojs/check)

**Rationale**: Astro provides built-in type checking via the `@astrojs/check` package, which is already installed in the project. This is the official and recommended way to check types in Astro projects.

**Configuration Approach**:

- `astro check` command is already available (package.json shows `@astrojs/check` in devDependencies)
- TypeScript configuration already extends `astro/tsconfigs/strict` (from tsconfig.json)
- No additional configuration needed - command works out of the box
- Add package.json script: `"typecheck": "astro check"` for convenience

**Key Points**:

- `astro check` checks both `.astro` and `.ts` files
- Works with existing `tsconfig.json` configuration
- Development server doesn't perform type checking, so this command is required
- No additional packages needed (already installed)

**Alternatives Considered**:

- Using `tsc --noEmit` directly (rejected - doesn't check `.astro` files, less integrated)
- Adding additional TypeScript tooling (rejected - redundant, `astro check` covers needs)

## Package Installation Summary

**Required ESLint packages**:

- `eslint`
- `eslint-plugin-astro`
- `eslint-plugin-vue`
- `@typescript-eslint/parser`
- `@typescript-eslint/eslint-plugin`
- `eslint-plugin-tailwindcss`

**Required Prettier packages**:

- `prettier`
- `prettier-plugin-astro`
- `eslint-config-prettier`
- `eslint-plugin-prettier`

**Required Git Hooks packages**:

- `husky` - Git hooks manager
- `lint-staged` - Run linters on staged files

**Already Available**:

- `@astrojs/check` (already in devDependencies)

## Configuration File Structure

**Files to create**:

- `.eslintrc.cjs` - ESLint configuration
- `.prettierrc` - Prettier configuration
- `.prettierignore` - Files to exclude from Prettier formatting
- `.eslintignore` - Files to exclude from ESLint (if needed, or use ignorePatterns in config)
- `.husky/pre-commit` - Pre-commit hook script

**Files to update**:

- `package.json` - Add scripts: `lint`, `lint:fix`, `format`, `format:check`, `typecheck`, `prepare` (for Husky), `lint-staged` configuration

## Husky Pre-commit Hook Setup

### Decision: Use Husky to enforce mandatory workflow via pre-commit hooks

**Rationale**: Pre-commit hooks automatically enforce the mandatory workflow, preventing commits that don't meet quality standards. Husky is the industry-standard tool for managing Git hooks in Node.js projects.

**Key Packages**:

- `husky` - Git hooks manager
- `lint-staged` - Run linters on staged files only (optimizes performance)

**Configuration Approach**:

- Initialize Husky with `npx husky install`
- Add `prepare` script to `package.json` to auto-install Husky on `pnpm install`
- Create pre-commit hook that runs: `format`, `lint:fix`, and `typecheck`
- Use lint-staged for formatting and linting staged files (optimizes performance)
- Run typecheck on entire codebase (type errors can span multiple files)

**Pre-commit Hook Behavior**:

- Runs `pnpm format` to format all files
- Runs `pnpm lint:fix` to lint and auto-fix staged files
- Runs `pnpm typecheck` to check types across entire codebase
- Aborts commit if any step fails
- Ensures all code meets quality standards before commit

**Alternatives Considered**:

- Manual workflow only (rejected - too easy to skip, doesn't enforce standards)
- Using only lint-staged (rejected - type checking needs full codebase scan)
- Running all checks on entire codebase only (rejected - slower, lint-staged is more efficient for linting/formatting)

## Integration Considerations

1. **Editor Integration**: VS Code settings should include ESLint and Prettier extensions with proper file type validation
2. **Workflow Integration**: Formatting, linting, and fixing MUST be part of the developer workflow and ALWAYS be run and corrected before committing code
3. **Git Hooks**: Husky pre-commit hooks automatically enforce mandatory workflow (part of this feature)
4. **CI/CD**: Linting and type checking should be run in CI (future enhancement, not in scope for this feature)
5. **Performance**: Configuration should handle codebase efficiently (spec targets: <30s lint, <10s format, <60s typecheck)

## Strictness Requirements

**Requirement**: Use the strictest configurations possible for all tooling.

**TypeScript ESLint**:

- Use `plugin:@typescript-eslint/strict-type-checked` (requires `parserOptions.project: './tsconfig.json'` in ESLint config)
- Use `plugin:@typescript-eslint/stylistic-type-checked` for stylistic rules
- These configurations enforce the most rigorous TypeScript rules available
- Requires type-aware linting (slower but more accurate)

**Vue ESLint**:

- Use `plugin:vue/vue3-recommended` (strictest available, includes strongly-recommended rules)
- Enforces comprehensive Vue 3 best practices

**Exceptions**:

- **Test files**: Relax rules for test files (`**/*.test.{ts,tsx,js,jsx}`, `**/*.spec.{ts,tsx,js,jsx}`, `tests/**`) to allow mocking without full type implementations
- **Type definition files**: Relax rules for `.d.ts` files to allow partial types and mocking interfaces
- All other files must use strictest configurations

## Workflow Integration Requirements

**Mandatory Workflow**: Formatting, linting, and fixing MUST be part of every developer's workflow:

- Developers MUST run `pnpm format` before committing
- Developers MUST run `pnpm lint:fix` before committing (auto-fix issues)
- Developers MUST run `pnpm typecheck` before committing
- All issues MUST be corrected before code is committed
- This is not optional - it's part of the standard development process

**Pre-commit Hook Enforcement**: Husky pre-commit hook automatically runs all checks:

- Automatically runs `format`, `lint:fix`, and `typecheck` before every commit
- Aborts commit if any check fails
- Ensures no code can be committed without passing all quality checks
- Developers cannot skip these checks (enforced at Git level)
