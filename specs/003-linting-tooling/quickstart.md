# Quickstart: Development Tooling Setup

**Feature**: Development Tooling Setup (003-linting-tooling)  
**Date**: 2026-01-16

## Overview

This quickstart guide explains how to use the code quality tooling (ESLint, Prettier, and Astro type checking) after setup is complete.

**IMPORTANT**: This project uses the **strictest configurations possible** for all linting and type checking. Formatting, linting, and fixing are **MANDATORY** parts of the developer workflow and **MUST ALWAYS** be run and corrected before committing code. This is not optional.

## Prerequisites

- Node.js and pnpm installed
- All tooling packages installed (completed as part of feature implementation)
- Configuration files present (`.eslintrc.cjs`, `.prettierrc`)

## Available Commands

### Code Quality Validation

```bash
# Run linting to check for code quality issues
pnpm lint

# Run linting with auto-fix for fixable issues
pnpm lint:fix
```

**When to use**: **MANDATORY** before committing code. Also use when reviewing code quality, during development to catch issues early.

**Example output**:

```
src/components/HomepageCard.vue
  15:5  error  'unusedVariable' is defined but never used  @typescript-eslint/no-unused-vars
  22:10 warning  Missing prop validation for 'title'         vue/require-prop-types

✖ 2 problems (1 error, 1 warning)
```

---

### Code Formatting

```bash
# Format all files automatically
pnpm format

# Check if files need formatting (without modifying them)
pnpm format:check
```

**When to use**:

- `pnpm format`: **MANDATORY** before committing. Also use when you want consistent formatting
- `pnpm format:check`: In CI/CD pipelines, to verify formatting without changes

**Example output**:

```
Checking formatting...
All matched files use Prettier code style!
```

---

### Type Checking

```bash
# Check TypeScript types across all files
pnpm typecheck
```

**When to use**: **MANDATORY** before committing. Also use when adding new types, when refactoring code, to verify type safety.

**Example output**:

```
src/components/PrivateNav.vue:42:18
  Type 'string | undefined' is not assignable to type 'string'.
```

---

## Mandatory Developer Workflow

**⚠️ CRITICAL**: Code quality checks are **AUTOMATICALLY ENFORCED** via Husky pre-commit hooks. When you run `git commit`, the pre-commit hook automatically runs all quality checks. If any check fails, the commit is aborted.

### Automatic Pre-commit Checks

The Husky pre-commit hook automatically runs:

1. **Formatting**: `pnpm format` - Formats all files
2. **Linting**: `pnpm lint:fix` - Lints and auto-fixes staged files
3. **Type Checking**: `pnpm typecheck` - Checks types across entire codebase

**If any check fails, the commit is aborted.** You must fix all issues before the commit will succeed.

### Manual Workflow (Optional but Recommended)

While the pre-commit hook enforces checks automatically, you can also run checks manually:

```bash
# Run all checks manually (recommended before committing)
pnpm format
pnpm lint:fix
pnpm typecheck
```

Running checks manually allows you to catch and fix issues earlier, before attempting to commit.

### During Development

- Run `pnpm lint` periodically to catch issues early (recommended)
- Use `pnpm format` when code style becomes inconsistent (recommended)
- Run `pnpm typecheck` after making significant type changes (recommended)

**Note**: These are recommended during development. The pre-commit hook ensures they run automatically before every commit.

### In CI/CD (Future Enhancement)

Add these checks to your CI pipeline:

```yaml
- run: pnpm typecheck
- run: pnpm lint
- run: pnpm format:check
```

All should pass before allowing merges.

## Editor Integration

### VS Code

Install these extensions:

- **ESLint** (dbaeumer.vscode-eslint)
- **Prettier - Code formatter** (esbenp.prettier-vscode)

Recommended settings (`.vscode/settings.json`):

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue",
    "astro"
  ]
}
```

This provides:

- Real-time linting errors as you type
- Automatic formatting on save
- Quick fixes for common issues

## Configuration Strictness

This project uses the **strictest configurations possible**:

- **TypeScript ESLint**: `@typescript-eslint/strict-type-checked` and `@typescript-eslint/stylistic-type-checked` (strictest available rules with type information)
- **Vue ESLint**: `plugin:vue/vue3-recommended` (strictest Vue 3 configuration)
- **TypeScript**: `strict` mode enabled in `tsconfig.json` (already configured)

**Exceptions**: Only test files (`**/*.test.{ts,tsx}`, `**/*.spec.{ts,tsx}`, `tests/**`) and type definition files (`**/*.d.ts`) use relaxed rules to allow mocking without full type implementations. All production code must pass the strictest rules.

## Common Issues and Solutions

### Issue: ESLint reports errors in `.astro` files

**Solution**: Ensure `eslint-plugin-astro` is installed and configured in `.eslintrc.cjs`.

### Issue: Prettier and ESLint conflict

**Solution**: Ensure `eslint-config-prettier` and `eslint-plugin-prettier` are installed and `plugin:prettier/recommended` is in ESLint extends.

### Issue: Type errors in `.astro` files not detected

**Solution**: Use `pnpm typecheck` (which runs `astro check`), not `tsc --noEmit`. The TypeScript compiler doesn't check `.astro` files directly.

### Issue: Formatting takes too long

**Solution**: Check `.prettierignore` to ensure large generated files (like `dist/`, `node_modules/`) are excluded.

### Issue: Too many strict linting errors

**Solution**: This project uses the strictest configurations by design. All errors must be fixed. Test files and `.d.ts` files have relaxed rules for mocking purposes, but all production code must pass strict rules.

## Performance Targets

- **Linting**: <30 seconds for codebases under 10,000 lines
- **Formatting**: <10 seconds for codebases under 10,000 lines
- **Type Checking**: <60 seconds for codebases under 10,000 lines

If commands exceed these targets, check:

- Number of files being processed (ensure ignores are configured)
- TypeScript configuration complexity
- System resources

## Pre-commit Hooks (Husky)

This project uses **Husky** to automatically enforce code quality checks before every commit.

### How It Works

1. When you run `git commit`, Husky automatically triggers the pre-commit hook
2. The hook runs: `format`, `lint:fix`, and `typecheck`
3. If all checks pass, the commit proceeds
4. If any check fails, the commit is aborted with error messages

### Bypassing Hooks (Not Recommended)

You can bypass hooks using `git commit --no-verify`, but **this is strongly discouraged** and violates the project's code quality standards. All code should pass quality checks before being committed.

### Initial Setup

After cloning the repository, run:

```bash
pnpm install
```

This automatically installs Husky via the `prepare` script and sets up the pre-commit hook.

## Next Steps

After tooling is set up and working:

1. Fix existing code quality issues (User Story 3) - **REQUIRED**
2. Ensure all team members understand the automatic pre-commit enforcement
3. Integrate into CI/CD pipeline (future enhancement)
4. Configure team editor settings for consistency

## Workflow Enforcement

Remember: Formatting, linting, and fixing are **AUTOMATICALLY ENFORCED** via pre-commit hooks. You cannot commit code that doesn't pass all quality checks. The strictest configurations ensure high code quality and maintainability.
