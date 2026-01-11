import { test, expect } from '@playwright/test';

/**
 * Example E2E test demonstrating Playwright framework foundation
 * This test validates that the testing framework can execute tests against the running application
 */
test.describe('Example E2E Test', () => {
  test('Given a developer wants to validate application behavior, When they visit the homepage, Then the page loads successfully', async ({
    page,
  }) => {
    // Navigate to homepage
    await page.goto('/');

    // Verify page loads
    await expect(page).toHaveTitle(/./); // Page has a title

    // Verify page is visible (not blank)
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
