import { test, expect } from "@playwright/test";

test.describe("Dashboard Access Control", () => {
  test("CEO dashboard requires auth", async ({ page }) => {
    await page.goto("/dashboard/ceo");
    await expect(page).toHaveURL(/\/login/);
  });

  test("department dashboard requires auth", async ({ page }) => {
    await page.goto("/dashboard/department");
    await expect(page).toHaveURL(/\/login/);
  });

  test("supervisor dashboard requires auth", async ({ page }) => {
    await page.goto("/dashboard/supervisor");
    await expect(page).toHaveURL(/\/login/);
  });

  test("executive page requires auth", async ({ page }) => {
    await page.goto("/executive");
    await expect(page).toHaveURL(/\/login/);
  });

  test("snapshots page requires auth", async ({ page }) => {
    await page.goto("/snapshots");
    await expect(page).toHaveURL(/\/login/);
  });

  test("KPIs page requires auth", async ({ page }) => {
    await page.goto("/kpis/library");
    await expect(page).toHaveURL(/\/login/);
  });
});
