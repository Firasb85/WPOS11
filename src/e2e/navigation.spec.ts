import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  // Skip auth for navigation tests by going to login first
  test("login page should be accessible", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("text=WPOS")).toBeVisible();
    await expect(page.locator("text=Sign in")).toBeVisible();
  });

  test("root should redirect to login when not authenticated", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
  });

  test("404 page should show for unknown routes", async ({ page }) => {
    await page.goto("/this-does-not-exist");
    await expect(page.locator("text=404")).toBeVisible();
  });
});
