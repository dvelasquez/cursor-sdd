# Quickstart: E2E Testing with Playwright and BDD

**Feature**: E2E Testing with Playwright and BDD (004-playwright-e2e)  
**Date**: 2026-01-11

## Overview

This quickstart guide explains how to use the E2E testing infrastructure with Playwright after setup is complete. Tests are co-located with feature specifications and use BDD-style structure to validate specification acceptance scenarios.

**IMPORTANT**: E2E tests validate client-side features described in specifications. Tests must be written alongside feature specifications in `specs/###-feature-name/e2e/` directories.

## Prerequisites

- Node.js and pnpm installed
- Playwright package installed (`@playwright/test` v1.57.0 already in package.json)
- System browsers installed:
  - **Firefox** (bundled with CachyOS - primary browser)
  - **Chromium** (optional - install via `sudo pacman -S chromium`)
- Playwright configuration file (`playwright.config.ts`) at repository root
- Local development server running (`pnpm dev`)

## Available Commands

### Run All E2E Tests

```bash
# Run all E2E tests in headless mode
pnpm test:e2e
```

**When to use**: After implementing features, before committing changes, to validate all client-side features match specifications.

**Example output**:

```
Running 5 tests using 1 worker

  ✓ specs/002-vue-prime-layouts/e2e/public-layout.spec.ts:6:3 › Public Layout - renders correctly (2.1s)
  ✓ specs/002-vue-prime-layouts/e2e/private-layout.spec.ts:8:3 › Private Layout - renders correctly (1.9s)

  5 passed (15.2s)
```

---

### Run Tests in Headed Mode (Debugging)

```bash
# Run tests with visible browser windows
pnpm test:e2e:ui
```

**When to use**: When debugging failing tests, when you want to see browser interactions, when developing new tests.

**Example**: Opens browser windows and shows test execution in real-time.

---

### Run Tests for Specific Feature

```bash
# Run tests for a specific feature
pnpm test:e2e:feature 002-vue-prime-layouts
```

**When to use**: When developing a specific feature, when you want to test only one feature's tests, during focused development.

**Example output**: Runs only tests in `specs/002-vue-prime-layouts/e2e/` directory.

---

### Debug Tests with Inspector

```bash
# Run tests in debug mode with Playwright Inspector
pnpm test:e2e:debug
```

**When to use**: When debugging complex test failures, when you need step-by-step execution, when investigating test behavior.

**Example**: Opens Playwright Inspector UI with step-by-step debugging capabilities.

---

## Test Organization

### Test Location

Tests are co-located with feature specifications:

```
specs/
├── 002-vue-prime-layouts/
│   ├── e2e/                    # E2E tests for this feature
│   │   ├── public-layout.spec.ts
│   │   └── private-layout.spec.ts
│   └── spec.md                 # Feature specification
└── 004-playwright-e2e/
    ├── e2e/                    # Example tests
    └── spec.md
```

### Test File Structure

Tests mirror specification structure:

```typescript
import { test, expect } from '@playwright/test';

// Test suite mirrors specification user story
test.describe('User Story 1 - Public Layout', () => {
  // Test case mirrors specification acceptance scenario
  test('Given a user visits a public page, When page loads, Then layout renders correctly', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });
});
```

---

## Writing E2E Tests

### Step 1: Create Test Directory

For a new feature, create the E2E test directory:

```bash
mkdir -p specs/###-feature-name/e2e
```

### Step 2: Write Test File

Create a test file that mirrors the specification structure:

```typescript
// specs/###-feature-name/e2e/user-story-1.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Story 1 - [Title]', () => {
  test('Given [state], When [action], Then [outcome]', async ({ page }) => {
    // Navigate to page
    await page.goto('/path');

    // Validate elements
    await expect(page.locator('selector')).toBeVisible();

    // Interact with elements
    await page.click('button');

    // Assert expected behavior
    await expect(page.locator('.result')).toContainText('expected text');
  });
});
```

### Step 3: Align with Specification

- **User Stories**: Each user story from `spec.md` maps to a test file or `test.describe` block
- **Acceptance Scenarios**: Each "Given/When/Then" scenario maps to a test case
- **Test Descriptions**: Use the same Given/When/Then format as the specification

### Step 4: Run Tests

```bash
# Start development server (required for tests)
pnpm dev

# In another terminal, run tests
pnpm test:e2e:feature ###-feature-name
```

---

## Browser Configuration

### System Browsers

**Firefox (Primary)**:

- Bundled with CachyOS
- Configured in `playwright.config.ts` via `channel: 'firefox'`
- No installation needed

**Chromium (Secondary - Optional)**:

- Install via package manager: `sudo pacman -S chromium`
- Configured in `playwright.config.ts` via `channel: 'chrome'` or `channel: 'chromium'`
- Adds browser coverage if needed

**Important**: Playwright's auto-install (`npx playwright install`) is NOT used on CachyOS. System browsers are used instead.

---

## Test Execution Workflow

### Development Workflow

1. **Create Feature Specification**: Write `spec.md` with user stories and acceptance scenarios
2. **Create Test Directory**: Create `specs/###-feature-name/e2e/` directory
3. **Write Tests**: Write test files that mirror specification structure
4. **Start Dev Server**: Run `pnpm dev` to start local development server
5. **Run Tests**: Execute `pnpm test:e2e:feature ###-feature-name` to validate feature
6. **Fix Issues**: Address any test failures by fixing implementation or updating tests
7. **Commit**: Commit tests alongside feature implementation

### Validation Workflow

1. **Run Tests**: Execute `pnpm test:e2e` to run all tests
2. **Review Results**: Check test output for pass/fail status
3. **Debug Failures**: Use `pnpm test:e2e:ui` or `pnpm test:e2e:debug` for debugging
4. **Fix Issues**: Address failures by fixing implementation or updating tests
5. **Re-run Tests**: Verify all tests pass

---

## Performance Targets

- **Individual Test Cases**: Must complete within 30 seconds (per spec SC-003)
- **Full Test Suite**: Up to 20 tests must complete within 2 minutes (per spec SC-008)
- **Error Resolution**: Test failures provide actionable information within 5 minutes (per spec SC-007)

---

## Troubleshooting

### Tests Fail to Start

**Issue**: Browser not found or not accessible

**Solution**:

- Verify Firefox is installed: `firefox --version`
- Verify Chromium is installed (if using): `chromium --version`
- Check `playwright.config.ts` channel configuration matches installed browsers

### Tests Timeout

**Issue**: Tests exceed 30-second timeout

**Solution**:

- Check if development server is running (`pnpm dev`)
- Verify application is accessible at baseURL in `playwright.config.ts`
- Increase timeout in test if legitimate (but prefer optimizing test speed)
- Use `test.setTimeout()` for specific slow tests

### Browser Not Visible

**Issue**: Tests run but browser window doesn't appear

**Solution**:

- Use `pnpm test:e2e:ui` for headed mode (visible browser)
- Default `test:e2e` runs in headless mode (no browser UI)

### Tests Don't Match Specification

**Issue**: Tests don't align with specification structure

**Solution**:

- Review specification user stories and acceptance scenarios
- Restructure tests to mirror specification structure
- Use test descriptions that match specification format (Given/When/Then)

---

## Best Practices

1. **Co-locate Tests**: Keep tests in `specs/###-feature-name/e2e/` alongside specifications
2. **Mirror Structure**: Structure tests to mirror specification user stories
3. **Use BDD Patterns**: Use Given/When/Then patterns in test descriptions
4. **Validate Acceptance Scenarios**: Each acceptance scenario should have a corresponding test
5. **Keep Tests Fast**: Optimize tests to complete within timeout limits
6. **Debug Systematically**: Use UI mode and debug mode for failing tests
7. **Run Before Commit**: Execute tests before committing feature changes

---

## Next Steps

1. **Review Specification**: Read the feature specification (`spec.md`) to understand requirements
2. **Review Research**: See [research.md](./research.md) for technical decisions
3. **Review Data Model**: See [data-model.md](./data-model.md) for test organization structure
4. **Review Contracts**: See [contracts/README.md](./contracts/README.md) for test execution interfaces
5. **Create Tests**: Write E2E tests for your feature following the patterns above

---

## Additional Resources

- **Playwright Documentation**: https://playwright.dev
- **BDD Patterns**: https://playwright.dev/docs/best-practices#use-test-structure
- **Feature Specification**: [spec.md](./spec.md)
- **Implementation Plan**: [plan.md](./plan.md)
- **Research & Decisions**: [research.md](./research.md)
