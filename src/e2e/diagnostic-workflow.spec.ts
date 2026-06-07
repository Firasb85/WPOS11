import { test, expect } from "@playwright/test";

test.describe("Diagnostic Workflow", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login
    await page.goto("/login");
  });

  test("should show login page before accessing diagnostics", async ({ page }) => {
    await page.goto("/diagnostics");
    // Should redirect to login since we're not authenticated
    await expect(page).toHaveURL(/\/login/);
  });

  test("login page should have create account option", async ({ page }) => {
    await expect(page.locator('button:has-text("Create Account")')).toBeVisible();
  });

  test("should have password toggle button", async ({ page }) => {
    const toggle = page.locator('button[aria-label*="password"]');
    await expect(toggle).toBeVisible();
  });
});

test.describe("Diagnostic Pages (requires auth)", () => {
  // These tests require authentication setup
  // To run: set TEST_EMAIL and TEST_PASSWORD env vars

  test.skip(!process.env.TEST_EMAIL, "Requires TEST_EMAIL and TEST_PASSWORD env vars");

  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('input[type="email"]', process.env.TEST_EMAIL || "");
    await page.fill('input[type="password"]', process.env.TEST_PASSWORD || "");
    await page.click('button:has-text("Sign In")');
    await page.waitForURL(/\/dashboard/);
  });

  test("should navigate to new diagnostic page", async ({ page }) => {
    await page.goto("/diagnostics/new");
    await expect(page.locator("text=New Diagnostic Investigation")).toBeVisible();
  });

  test("should show 3-step wizard", async ({ page }) => {
    await page.goto("/diagnostics/new");
    await expect(page.locator("text=Report Details")).toBeVisible();
    await expect(page.locator("text=Collect Evidence")).toBeVisible();
    await expect(page.locator("text=Generate Hypotheses")).toBeVisible();
  });

  test("should navigate to diagnostics list", async ({ page }) => {
    await page.goto("/diagnostics");
    await expect(page.locator("text=Diagnostic Reports")).toBeVisible();
  });
});
