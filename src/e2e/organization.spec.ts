import { test, expect } from "@playwright/test";

test.describe("Organization Pages", () => {
  test("companies page requires auth", async ({ page }) => {
    await page.goto("/organization/companies");
    await expect(page).toHaveURL(/\/login/);
  });

  test("employees page requires auth", async ({ page }) => {
    await page.goto("/organization/employees");
    await expect(page).toHaveURL(/\/login/);
  });

  test("departments page requires auth", async ({ page }) => {
    await page.goto("/organization/departments");
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("Organization (authenticated)", () => {
  test.skip(!process.env.TEST_EMAIL, "Requires TEST_EMAIL env var");

  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', process.env.TEST_EMAIL || "");
    await page.fill('input[type="password"]', process.env.TEST_PASSWORD || "");
    await page.click('button:has-text("Sign In")');
    await page.waitForURL(/\/dashboard/);
  });

  test("can navigate to companies page", async ({ page }) => {
    await page.goto("/organization/companies");
    await expect(page.locator("text=Companies")).toBeVisible();
  });

  test("can see Add Company button", async ({ page }) => {
    await page.goto("/organization/companies");
    await expect(page.locator("text=Add Company")).toBeVisible();
  });
});
