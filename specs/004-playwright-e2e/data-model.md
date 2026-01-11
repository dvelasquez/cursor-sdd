# Data Model: E2E Testing with Playwright and BDD

**Feature**: E2E Testing with Playwright and BDD (004-playwright-e2e)  
**Date**: 2026-01-11

## Overview

This feature involves E2E testing infrastructure setup rather than traditional data entities. This document describes the test configuration structures, test organization, and their relationships.

## Configuration Entities

### Playwright Configuration (`playwright.config.ts`)

**Purpose**: Defines browser settings, test execution configuration, and project-wide test settings

**Structure**:

- **Projects**: Array of browser configurations (Firefox, Chromium)
  - `name`: Project identifier (e.g., "Firefox", "Chromium")
  - `use.channel`: System browser channel ('firefox', 'chrome', 'chromium')
  - `use.baseURL`: Local development server URL (e.g., 'http://localhost:4321')
  - `use.viewport`: Viewport size configuration
- **Test Directory**: Pattern to find test files (`specs/**/e2e/**/*.spec.ts`)
- **Timeouts**:
  - `timeout`: Per-test timeout (30s per spec SC-003)
  - `globalTimeout`: Full test suite timeout (2min per spec SC-008 for up to 20 tests)
- **Output**: Test results, screenshots, videos configuration
- **Retries**: Retry configuration for flaky tests (optional)

**Relationships**:

- References system-installed browsers via channel configuration
- Configures test execution against local Astro development server
- Scans test files in feature specification directories

### Test Suite Structure (`specs/###-feature-name/e2e/`)

**Purpose**: Organizes E2E tests co-located with feature specifications

**Structure**:

- **Directory**: `specs/###-feature-name/e2e/` (co-located with spec.md per FR-008)
- **Test Files**: `*.spec.ts` files containing test cases
- **Test Organization**: Mirrors specification structure
  - Test files organized by user story (e.g., `user-story-1.spec.ts`)
  - Test cases align with acceptance scenarios from spec
  - BDD-style test descriptions using Given/When/Then patterns

**Test File Structure**:

```typescript
// Example: specs/002-vue-prime-layouts/e2e/public-layout.spec.ts
import { test, expect } from '@playwright/test';

test.describe('User Story 1 - Public Layout', () => {
  // Given/When/Then patterns in test descriptions
  test('Given a user visits a public page, When page loads, Then layout renders correctly', async ({
    page,
  }) => {
    // Test implementation
  });
});
```

**Relationships**:

- Co-located with feature specification (`spec.md`)
- Aligned with specification user stories and acceptance scenarios
- Executed by Playwright configuration

### Package.json Scripts

**Purpose**: Provides developer-accessible commands for E2E test execution

**Structure**:

- `test:e2e`: Run all E2E tests
- `test:e2e:ui`: Run E2E tests in headed mode (with browser UI) for debugging
- `test:e2e:feature`: Run E2E tests for specific feature (pattern-based)
- `test:e2e:debug`: Run E2E tests in debug mode

**Relationships**:

- Executes Playwright test runner
- References Playwright configuration
- Can target specific feature directories

## Test Organization Relationships

```
playwright.config.ts (root-level)
  ├── Configures: Browser channels (Firefox, Chromium)
  ├── Configures: Test directory patterns (specs/**/e2e/**/*.spec.ts)
  ├── Configures: Base URL (local dev server)
  └── Configures: Timeouts and execution settings

specs/
  ├── 002-vue-prime-layouts/
  │   ├── e2e/
  │   │   ├── public-layout.spec.ts
  │   │   └── private-layout.spec.ts
  │   └── spec.md
  ├── 003-linting-tooling/
  │   └── spec.md (no E2E tests - not client-side)
  └── 004-playwright-e2e/
      ├── e2e/
      │   └── (example tests)
      └── spec.md

package.json (scripts)
  ├── test:e2e → Playwright test runner
  └── test:e2e:ui → Playwright with UI mode
```

## Test Specification Alignment

**Mapping Between Specifications and Tests**:

1. **Specification User Story** → **Test File or Test Suite**
   - Each user story from spec.md maps to a test file or test.describe block
   - Test file name reflects user story (e.g., `user-story-1.spec.ts`)

2. **Specification Acceptance Scenario** → **Test Case**
   - Each "Given/When/Then" acceptance scenario maps to a test case
   - Test description mirrors acceptance scenario format
   - Test implementation validates the scenario

3. **Specification Feature Requirements** → **Test Coverage**
   - Functional requirements (FR-\*) validated through test cases
   - Success criteria (SC-\*) validated through test execution metrics

## Validation Rules

1. **Test Organization**:
   - Tests MUST be co-located with feature specifications (FR-008)
   - Test files MUST follow naming pattern: `*.spec.ts`
   - Test structure MUST mirror specification user stories

2. **Test Execution**:
   - Tests MUST execute against running application instance (FR-006)
   - Individual test cases MUST complete within 30 seconds (SC-003)
   - Full test suite (up to 20 tests) MUST complete within 2 minutes (SC-008)

3. **BDD Alignment**:
   - Tests MUST use BDD-style structure (FR-003, FR-007)
   - Test descriptions MUST clearly indicate which specification scenarios are validated
   - Test output MUST indicate which specification scenarios are being tested

4. **Browser Configuration**:
   - MUST use system-installed browsers (Firefox bundled, Chromium optional)
   - MUST configure browser channels in Playwright config
   - MUST not use Playwright's auto-install (not available on CachyOS)

## State Transitions

**Test Development Flow**:

1. Create feature specification → 2. Write E2E tests in `specs/###-feature-name/e2e/` → 3. Structure tests to mirror spec user stories → 4. Implement test cases for acceptance scenarios → 5. Run tests → 6. Validate feature implementation matches spec

**Test Execution Flow**:

1. Start local development server (`pnpm dev`) → 2. Run E2E tests (`pnpm test:e2e`) → 3. Tests execute against running application → 4. Test results indicate pass/fail with error details → 5. Fix failures → 6. Re-run tests until all pass

**Test Organization Flow**:

1. Feature branch created → 2. Specification written → 3. E2E test directory created (`specs/###-feature-name/e2e/`) → 4. Tests written alongside specification → 5. Tests validate specification scenarios → 6. Tests committed with feature implementation
