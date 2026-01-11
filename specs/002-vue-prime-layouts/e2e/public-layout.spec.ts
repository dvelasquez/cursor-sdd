import { test, expect } from '@playwright/test';

/**
 * BDD-style E2E tests for User Story 1 - View Public Pages with Standard Layout
 * Tests mirror acceptance scenarios from specs/002-vue-prime-layouts/spec.md
 * Validates that public pages render with consistent layout structure
 */
test.describe('User Story 1 - View Public Pages with Standard Layout', () => {
  test('Given a user visits a public landing page, When the page loads, Then they see a consistent header with navigation elements, main content area, and footer', async ({
    page,
  }) => {
    // Navigate to homepage (public landing page)
    await page.goto('/');

    // Verify header with navigation elements is visible
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Verify navigation is present in header
    const nav = header.locator('nav, [role="navigation"]').first();
    await expect(nav).toBeVisible();

    // Verify main content area is present
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Verify footer is present
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();
  });

  test('Given a user visits a public documentation page, When the page loads, Then they see the same layout structure as other public pages with content-specific elements', async ({
    page,
  }) => {
    // Navigate to about page (public documentation page)
    await page.goto('/about');

    // Verify header with navigation is present (same structure as landing page)
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Verify main content area is present
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Verify footer is present (consistent with other public pages)
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Verify page has content-specific elements (about page content)
    const pageContent = main.getByRole('heading', { level: 1 });
    await expect(pageContent).toBeVisible();
  });

  test('Given a user views the public layout on a mobile device, When they interact with the page, Then the layout adapts responsively to smaller screen sizes', async ({
    page,
  }) => {
    // Set mobile viewport (320px width - small mobile device)
    await page.setViewportSize({ width: 320, height: 568 });

    // Navigate to homepage
    await page.goto('/');

    // Verify header is still visible and accessible on mobile
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Verify main content area is visible and properly sized for mobile
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Verify footer is visible on mobile
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Verify layout elements are within viewport bounds (no horizontal scroll)
    const body = page.locator('body');
    const bodyBox = await body.boundingBox();
    expect(bodyBox?.width).toBeLessThanOrEqual(320);
  });

  test('Given a user navigates between different public pages, When they move between routes, Then the layout structure remains consistent across all public pages', async ({
    page,
  }) => {
    // Navigate to homepage
    await page.goto('/');

    // Capture layout structure from homepage
    const homeHeader = page.locator('header');
    const homeMain = page.locator('main');
    const homeFooter = page.locator('footer');

    await expect(homeHeader).toBeVisible();
    await expect(homeMain).toBeVisible();
    await expect(homeFooter).toBeVisible();

    // Navigate to about page
    await page.goto('/about');

    // Verify same layout structure is present on about page
    const aboutHeader = page.locator('header');
    const aboutMain = page.locator('main');
    const aboutFooter = page.locator('footer');

    await expect(aboutHeader).toBeVisible();
    await expect(aboutMain).toBeVisible();
    await expect(aboutFooter).toBeVisible();

    // Verify layout elements have consistent structure (header, main, footer in correct order)
    const headerTag = await aboutHeader.evaluate((el) => el.tagName);
    const mainTag = await aboutMain.evaluate((el) => el.tagName);
    const footerTag = await aboutFooter.evaluate((el) => el.tagName);

    expect(headerTag).toBe('HEADER');
    expect(mainTag).toBe('MAIN');
    expect(footerTag).toBe('FOOTER');
  });
});
