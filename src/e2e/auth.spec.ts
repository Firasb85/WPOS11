import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should redirect unauthenticated user to login", async ({ page }) => {
    await page.goto("/dashboard/ceo");
    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });

  test("login page should render correctly", async ({ page }) => {
    await page.goto("/login");
    // Should show login form
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button:has-text("Sign In")')).toBeVisible();
  });

  test("should show error on invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.fill('input[type="email"]', "invalid@test.com");
    await page.fill('input[type="password"]', "wrongpassword");
    await page.click('button:has-text("Sign In")');

    // Should show error message
    await expect(page.locator("text=Invalid")).toBeVisible({ timeout: 10000 });
  });
});
