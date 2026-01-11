# Research: E2E Testing with Playwright and BDD

**Feature**: E2E Testing with Playwright and BDD (004-playwright-e2e)  
**Date**: 2026-01-11  
**Purpose**: Research Playwright browser installation options for CachyOS Linux, BDD tooling integration, and linting options

## Playwright Browser Installation for CachyOS Linux

### Decision: Use system-installed browsers with Playwright channel configuration

**Rationale**: CachyOS Linux (Arch-based distribution) does not support Playwright's auto-install browser commands. Using system-installed browsers via Playwright's channel configuration provides a reliable alternative that works with existing browser installations while maintaining full Playwright functionality.

**Key Requirements**:

- Cannot use `npx playwright install` or `playwright install` commands (not supported on CachyOS)
- Must use system-installed browsers (Firefox bundled, or Chromium/Ungoogled Chromium via package manager)
- Playwright configuration must specify browser channels to use system browsers

**Configuration Approach**:

- Use `@playwright/test` package (already installed v1.57.0 in package.json)
- Configure `playwright.config.ts` with channel option to use system browsers:
  - For Firefox: `channel: 'firefox'` (uses system-installed Firefox)
  - For Chromium: `channel: 'chrome'` or `channel: 'chromium'` (uses system-installed Chromium/Chrome)
  - For Ungoogled Chromium: May require custom executable path configuration (see alternatives below)
- Install Playwright without bundled browsers (skip browser download step)
- Ensure system browsers are installed and accessible in PATH

**Browser Options for CachyOS**:

1. **Firefox (Recommended - Bundled)**
   - Pre-installed on most Linux distributions including CachyOS
   - Configuration: `channel: 'firefox'`
   - Advantages: No additional installation needed, well-tested with Playwright
   - Limitations: May have version differences from Playwright's bundled Firefox

2. **Chromium (Package Manager)**
   - Install via package manager: `sudo pacman -S chromium` (CachyOS uses Arch package manager)
   - Configuration: `channel: 'chrome'` or `channel: 'chromium'`
   - Advantages: Compatible with Playwright, standard Chromium builds
   - Limitations: Requires manual installation and dependency management

3. **Ungoogled Chromium (Alternative)**
   - Install via package manager or AUR (Arch User Repository)
   - Configuration: May require `executablePath` pointing to browser binary instead of channel
   - Advantages: Privacy-focused Chromium variant
   - Limitations: May require custom configuration, less standard setup

**Recommended Approach**: Start with Firefox (bundled) as primary browser for testing. Add Chromium as secondary option if needed. Use channel configuration for standard browsers; use executablePath for custom browser paths if required.

**Alternatives Considered**:

- Using Playwright's bundled browsers (rejected - auto-install not available on CachyOS)
- Using only Firefox (acceptable but limits browser coverage - Chromium can be added as secondary)
- Using custom browser paths only (rejected - channel configuration is simpler for standard browsers)

## BDD Tooling Integration

### Decision: Use Playwright's native BDD-style TypeScript patterns (Cucumber.js rejected due to complexity)

**Rationale**: Playwright supports BDD-style test structure natively through TypeScript test files with descriptive test names and Given/When/Then patterns. Cucumber.js integration adds significant complexity (separate feature files, step definitions, configuration) without clear benefit for the use case. Playwright's native approach is sufficient and easier to maintain.

**Options Evaluated**:

1. **Playwright Native BDD (Recommended - Selected)**
   - Use Playwright's TypeScript test structure with descriptive test names and Given/When/Then patterns
   - Structure tests to mirror specification user scenarios directly in TypeScript
   - Advantages:
     - No additional dependencies (Playwright already installed)
     - Simpler setup (no separate feature files, step definitions, or Cucumber configuration)
     - Fully integrated with Playwright test runner
     - Type-safe TypeScript test code
     - Easier to lint and maintain (standard TypeScript)
     - No need for separate Gherkin file management
   - Limitations: Less formal Gherkin syntax, manual alignment with specs (but specs already use Given/When/Then format)

2. **Cucumber.js with Playwright (Rejected - Too Complex)**
   - Use `@cucumber/cucumber` with Playwright test runner
   - Write separate Gherkin `.feature` files and TypeScript step definitions
   - Advantages: Formal Gherkin syntax, separate feature files
   - Limitations:
     - Additional dependency (`@cucumber/cucumber`, `ts-node` for TypeScript support)
     - More complex setup (Cucumber configuration, separate feature files, step definition mapping)
     - Additional tooling needed (Gherkin linters, Prettier plugins)
     - Dual file management (feature files + step definitions)
     - Step definition maintenance overhead
     - May be overkill for direct spec-to-test alignment use case

**Recommended Approach**: Use Playwright's native BDD-style TypeScript patterns. Structure test files to mirror specification user scenarios with descriptive test names using Given/When/Then patterns in test descriptions. This approach is sufficient for validating specifications and easier to maintain than Cucumber.js integration.

**Test Organization Pattern**:

- Tests co-located with specs: `specs/###-feature-name/e2e/*.spec.ts`
- Test file structure mirrors spec user stories
- Test names and descriptions align with specification acceptance scenarios
- Use Playwright's `test.describe` blocks to group tests by user story
- Use Given/When/Then patterns in test descriptions: `test('Given [state], When [action], Then [outcome]', async ({ page }) => { ... })`

**Alternatives Considered**:

- Cucumber.js with Playwright (rejected - adds complexity without clear benefit; native BDD-style TypeScript is sufficient)
- Jest + Playwright (rejected - Playwright's native test runner is more suitable for E2E)
- Cypress (rejected - user specified Playwright, and Playwright is already installed)
- WebDriverIO (rejected - user specified Playwright, and Playwright provides better modern browser automation)

## Playwright Configuration Structure

### Decision: Single root-level playwright.config.ts with project definitions

**Rationale**: Single configuration file at repository root provides centralized management of browser settings, test execution options, and project-wide settings. Project definitions can be used to configure different browser channels (Firefox, Chromium) if multiple browsers are supported.

**Configuration Structure**:

- Root-level `playwright.config.ts` file
- Use `projects` array to define different browser configurations
- Configure base URL for local development (e.g., `http://localhost:4321` for Astro dev server)
- Set test directories to scan `specs/**/e2e/**/*.spec.ts` pattern
- Configure timeout values per spec requirements (30s per test case, 2min for full suite)

**Key Configuration Options**:

- `use.channel`: Specify system browser channel ('firefox', 'chrome', 'chromium')
- `use.baseURL`: Local development server URL
- `testDir`: Pattern to find test files in spec directories
- `timeout`: Per-test timeout (30s per SC-003)
- `globalTimeout`: Full test suite timeout (2min per SC-008 for up to 20 tests)

**Alternatives Considered**:

- Per-feature Playwright configs (rejected - adds complexity, less consistent configuration)
- JSON configuration (rejected - TypeScript config provides better type safety and IDE support)

## Linting and Code Quality Tools

### Decision: Add eslint-plugin-playwright for Playwright test linting (Gherkin/Cucumber linting not needed)

**Rationale**: Since we're using Playwright's native BDD-style TypeScript patterns (not Cucumber.js/Gherkin), we need linting for TypeScript test files but not for Gherkin feature files. ESLint with Playwright plugin provides code quality enforcement for test code.

**Playwright Linting**:

1. **eslint-plugin-playwright (Recommended)**
   - ESLint plugin specifically for Playwright tests
   - Enforces Playwright best practices in test code
   - Integrates with existing ESLint configuration
   - Installation: `npm install --save-dev eslint-plugin-playwright`
   - Configuration: Add to ESLint config extends: `'plugin:playwright/recommended'`
   - Advantages:
     - Catches common Playwright mistakes and anti-patterns
     - Enforces best practices (e.g., proper use of `expect`, page objects)
     - Integrates seamlessly with existing ESLint setup
     - Works with TypeScript via `@typescript-eslint/parser`

**Gherkin/Cucumber Linting (Not Needed)**:

Since we're using Playwright's native BDD-style TypeScript patterns (not Cucumber.js), we don't need:

- Gherkin linters (gherklin) - no `.feature` files
- Cucumber ESLint plugins (eslint-plugin-cucumber) - no step definitions
- Prettier Gherkin plugins (prettier-plugin-gherkin) - no Gherkin files

**Recommended Approach**: Add `eslint-plugin-playwright` to existing ESLint configuration. Configure it to lint test files in `specs/**/e2e/**/*.spec.ts` pattern. Update ESLint ignores to exclude `specs/**/*.md` (documentation files) but allow TypeScript test files in `specs/**/e2e/**/*.spec.ts`. Ensure TypeScript configuration includes specs directory for type checking. This provides code quality enforcement for Playwright test code without additional complexity.

**Alternatives Considered**:

- No linting for test files (rejected - code quality should be enforced for test code too)
- Separate linting configuration for tests (rejected - existing ESLint setup can be extended)
- Gherkin/Cucumber linting tools (not needed - using native TypeScript patterns, not Gherkin)

## Tooling Integration with Specify Workflow

### Decision: Minimal integration - tests co-located with specs, standard Playwright commands

**Rationale**: The specify workflow focuses on feature development with specs. Co-locating tests with specs (per FR-008) provides natural integration. Standard Playwright npm scripts provide sufficient workflow integration without requiring custom tooling.

**Integration Points**:

- Tests in `specs/###-feature-name/e2e/` directories (co-located with specs)
- Standard package.json scripts: `test:e2e`, `test:e2e:ui` (headed mode for debugging)
- ESLint integration: `eslint-plugin-playwright` enforces code quality in test files
- Playwright can run tests from specific directories or patterns
- Test execution can target specific feature directories

**Future Enhancements** (deferred):

- Custom scripts to run tests for a specific feature
- Integration with specify commands to automatically run relevant tests
- Test result reporting integrated with spec documentation

**Alternatives Considered**:

- Custom CLI tool for specify-test integration (rejected - overkill for initial setup, can be added later)
- Full IDE integration plugins (deferred - standard Playwright VS Code extension is sufficient)

## Summary of Technical Decisions

1. **Browser Installation**: Use system-installed browsers (Firefox bundled, Chromium optional) via Playwright channel configuration
2. **BDD Approach**: Use Playwright's native BDD-style TypeScript patterns (Cucumber.js rejected - too complex, native approach sufficient)
3. **Linting**: Add `eslint-plugin-playwright` for test code quality (Gherkin/Cucumber linting not needed)
4. **Configuration**: Single root-level `playwright.config.ts` with project definitions
5. **Test Organization**: Co-located with specs (`specs/###-feature-name/e2e/`)
6. **Tooling Integration**: Minimal - standard Playwright scripts, ESLint integration, co-location provides workflow alignment
