import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for E2E testing
 * Uses system-installed browsers (Firefox bundled, Chromium optional) on CachyOS Linux
 */
export default defineConfig({
  // Test directory - root directory for test files
  testDir: 'specs',

  // Test file pattern - matches test files in e2e subdirectories
  testMatch: '**/e2e/**/*.spec.ts',

  // Timeouts per spec requirements
  timeout: 30000, // 30s per test case (SC-003)
  globalTimeout: 120000, // 2min for full suite up to 20 tests (SC-008)

  // Test execution settings
  fullyParallel: true,
  forbidOnly: false, // Local development only (CI/CD deferred to future enhancement)
  retries: 0, // Local development only (CI/CD deferred to future enhancement)
  workers: undefined, // Use default workers for local development

  // Reporter configuration
  reporter: 'html',

  // Shared settings for all projects
  use: {
    baseURL: 'http://localhost:4321', // Local Astro dev server
    trace: 'on-first-retry',
  },

  // Browser projects - system-installed browsers
  projects: [
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        channel: 'firefox', // System-installed Firefox (bundled with CachyOS)
      },
    },
    // Optional: Add Chromium if installed via package manager
    // {
    //   name: 'chromium',
    //   use: {
    //     ...devices['Desktop Chrome'],
    //     channel: 'chromium', // System-installed Chromium (install via: sudo pacman -S chromium)
    //   },
    // },
  ],
});
