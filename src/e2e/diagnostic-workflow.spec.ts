import { test, expect } from "@playwright/test";

test.describe("Diagnostic Workflow", () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('input[name="email"]', "manager@example.com");
    await page.fill('input[name="password"]', "password123");
    await page.click('button:has-text("Login")');
    await page.waitForNavigation();
  });

  test("should create a diagnostic report", async ({ page }) => {
    // Navigate to diagnostics
    await page.goto("/diagnostics/new");

    // Fill form
    await page.fill('input[name="title"]', "Sales Performance Gap");
    await page.fill('textarea[name="performanceSummary"]', "Sales are down 20%");
    await page.click('button:has-text("Add Symptom")');
    await page.fill('input[name="symptoms.0"]', "Missed quota");

    // Submit
    await page.click('button:has-text("Create Report")');

    // Verify success
    await expect(page.locator("text=Diagnostic created successfully")).toBeVisible();
    await expect(page).toHaveURL(/\/diagnostics\/\d+/);
  });

  test("should generate hypotheses", async ({ page }) => {
    // Navigate to diagnostic
    await page.goto("/diagnostics/123");

    // Click generate hypotheses
    await page.click('button:has-text("Generate Hypotheses")');

    // Wait for hypotheses to load
    await expect(page.locator("text=Skill gap")).toBeVisible();
    await expect(page.locator("text=Knowledge gap")).toBeVisible();
  });

  test("should submit for manager review", async ({ page }) => {
    await page.goto("/diagnostics/123");

    // Click submit button
    await page.click('button:has-text("Submit for Review")');

    // Verify status changed
    await expect(page.locator("text=Under Review")).toBeVisible();
  });
});
