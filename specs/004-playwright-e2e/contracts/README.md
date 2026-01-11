# Contracts: E2E Testing with Playwright and BDD

**Feature**: E2E Testing with Playwright and BDD (004-playwright-e2e)  
**Date**: 2026-01-11

## Overview

This feature establishes E2E testing interfaces through Playwright test execution commands and test file structure. These are "test execution contracts" that define the interface between developers and the E2E testing infrastructure.

**Test Organization**: Tests are co-located with feature specifications (per FR-008). Tests validate client-side features described in specifications through executable BDD-style test cases.

## Test Execution Interface

### Playwright Test Commands

#### `pnpm test:e2e`

**Purpose**: Run all E2E tests across all feature directories

**Input**: None (runs all tests matching pattern `specs/**/e2e/**/*.spec.ts`)

**Output**:

- Exit code 0 if all tests pass
- Exit code non-zero if any tests fail
- Console output with test results (pass/fail status, test duration, error details if applicable)
- Test execution report with summary statistics

**Behavior**:

- Executes all E2E tests found in feature directories
- Runs tests in headless mode (no browser UI)
- Executes against running application instance (baseURL from playwright.config.ts)
- Reports results per test case and overall summary

**Performance Target**: Full test suite (up to 20 tests) completes within 2 minutes (per spec SC-008)

---

#### `pnpm test:e2e:ui`

**Purpose**: Run E2E tests in headed mode (with browser UI visible) for debugging

**Input**: None (or specific test file path for focused debugging)

**Output**:

- Same as `test:e2e` but with visible browser windows
- Allows visual inspection of test execution
- Pauses on failures for debugging

**Behavior**:

- Opens browser windows during test execution
- Shows browser interactions in real-time
- Useful for debugging failing tests

---

#### `pnpm test:e2e:feature <feature-name>`

**Purpose**: Run E2E tests for a specific feature

**Input**: Feature name or directory pattern (e.g., `002-vue-prime-layouts`)

**Output**:

- Same as `test:e2e` but scoped to specific feature directory
- Results for tests in `specs/<feature-name>/e2e/` directory only

**Behavior**:

- Executes tests in specified feature directory
- Useful for testing specific features during development
- Allows focused test execution

---

#### `pnpm test:e2e:debug`

**Purpose**: Run E2E tests in debug mode with Playwright Inspector

**Input**: None (or specific test file path)

**Output**:

- Opens Playwright Inspector UI
- Allows step-by-step test debugging
- Breakpoint support and variable inspection

**Behavior**:

- Launches Playwright Inspector interface
- Enables step-by-step test execution
- Useful for detailed debugging of complex test scenarios

---

## Test File Structure Contract

### Test File Location

**Path Pattern**: `specs/###-feature-name/e2e/*.spec.ts`

**Requirements**:

- Tests MUST be co-located with feature specification (same directory as `spec.md`)
- Test files MUST use `.spec.ts` extension
- Test files MUST be in `e2e/` subdirectory of feature directory

### Test File Structure

**Required Structure**:

```typescript
import { test, expect } from '@playwright/test';

// Test suite mirrors specification user story
test.describe('User Story N - [Brief Title]', () => {
  // Test case mirrors specification acceptance scenario
  test('Given [state], When [action], Then [outcome]', async ({ page }) => {
    // Test implementation
    await page.goto('/path');
    await expect(page.locator('selector')).toBeVisible();
  });
});
```

**BDD Alignment Requirements**:

- Test descriptions MUST mirror specification acceptance scenarios
- Test structure MUST align with specification user stories
- Test output MUST indicate which specification scenarios are being validated

### Test Execution Contract

**Preconditions**:

1. Local development server MUST be running (`pnpm dev`)
2. Application MUST be accessible at baseURL configured in `playwright.config.ts`
3. System browsers MUST be installed (Firefox bundled, Chromium optional)

**Execution Flow**:

1. Playwright starts browser using configured channel
2. Tests execute against running application instance
3. Each test case validates acceptance scenario
4. Results reported with pass/fail status and error details
5. Test execution completes within timeout limits

**Postconditions**:

- Test results indicate pass/fail status for each test case
- Error details provided for failed tests (per SC-007: actionable within 5 minutes)
- Test execution completes within performance targets

---

## Browser Configuration Contract

### System Browser Requirements

**Firefox (Primary - Bundled)**:

- MUST be installed on system (bundled with CachyOS)
- MUST be accessible via `channel: 'firefox'` in Playwright config
- MUST be in system PATH

**Chromium (Secondary - Optional)**:

- MAY be installed via package manager (`sudo pacman -S chromium`)
- MUST be accessible via `channel: 'chrome'` or `channel: 'chromium'` if installed
- MUST be in system PATH

**Ungoogled Chromium (Alternative)**:

- MAY be installed via package manager or AUR
- MAY require `executablePath` configuration instead of channel
- MUST be accessible if configured

### Browser Channel Configuration

**Contract**: Playwright MUST use system browsers via channel configuration

- Firefox: `use: { channel: 'firefox' }`
- Chromium: `use: { channel: 'chrome' }` or `use: { channel: 'chromium' }`
- Custom browsers: `use: { executablePath: '/path/to/browser' }`

**Prohibition**: Playwright's auto-install browser commands (`npx playwright install`) MUST NOT be used (not supported on CachyOS)

---

## Test Result Contract

### Test Execution Results

**Success Criteria** (per spec SC-003, SC-007, SC-008):

- Individual test cases complete within 30 seconds
- Full test suite (up to 20 tests) completes within 2 minutes
- Test execution provides actionable error information
- Developers can identify and resolve issues within 5 minutes of reviewing failure output

**Output Format**:

- Pass/fail status for each test case
- Test duration for each test case
- Error messages with stack traces for failed tests
- Screenshot/video attachments for failed tests (if configured)
- Summary statistics (total tests, passed, failed, duration)

---

## Integration with Specify Workflow

### Test Development Workflow

**Contract**: Tests MUST be developed alongside feature specifications

1. Feature specification created (`spec.md`)
2. E2E test directory created (`specs/###-feature-name/e2e/`)
3. Tests written to mirror specification structure
4. Tests validate specification acceptance scenarios
5. Tests committed with feature implementation

**Alignment Requirement**: Tests MUST validate specification requirements (FR-_), success criteria (SC-_), and acceptance scenarios

---

## Performance Contracts

### Execution Time Limits

- **Per-test timeout**: 30 seconds (per spec SC-003)
- **Full suite timeout**: 2 minutes for up to 20 tests (per spec SC-008)
- **Error resolution**: Actionable information available within 5 minutes (per spec SC-007)

### Resource Requirements

- Local development server running
- System browsers installed and accessible
- Sufficient system resources for browser automation
