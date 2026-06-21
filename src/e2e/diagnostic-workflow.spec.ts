import { test, expect } from '@playwright/test';

test.describe('Diagnostic Workflow E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'manager@wpos.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button:has-text("Sign In")');
    await page.waitForURL('**/dashboard');
  });

  test('should complete diagnostic workflow: create → evidence → diagnose → approve → report', async ({ page }) => {
    // Navigate to Diagnostics
    await page.click('a:has-text("Diagnostics")');
    await page.waitForURL('**/diagnostics');

    // Create new diagnostic
    await page.click('button:has-text("New Diagnostic")');
    await expect(page.locator('text=Create Diagnostic')).toBeVisible();

    // Select employee
    await page.click('button:has-text("Select Employee")');
    await page.click('li >> text="Ahmed"');

    // Select KPI
    await page.click('button:has-text("Select KPI Category")');
    await page.click('li >> text="Sales Performance"');

    // Create
    await page.click('button:has-text("Create Diagnostic")');
    await page.waitForURL('**/diagnostics/*');

    // Add evidence
    const evidenceItems = [
      { type: 'Qualitative', desc: 'Manager observed reduced engagement' },
      { type: 'Quantitative', desc: 'Sales at 72% of target' },
      { type: 'Qualitative', desc: 'Peer feedback: slower responses' },
    ];

    for (const ev of evidenceItems) {
      await page.click('button:has-text("Add Evidence")');
      await page.selectOption('select[name="type"]', ev.type);
      await page.fill('textarea[name="description"]', ev.desc);
      await page.click('button:has-text("Save Evidence")');
      await expect(page.locator('text=Evidence added')).toBeVisible();
    }

    // Run diagnostic
    await page.click('button:has-text("Run Diagnostic")');
    await page.click('button:has-text("Confirm")');
    await page.waitForTimeout(2000);

    // Verify hypotheses
    await expect(page.locator('[data-testid="hypothesis-card"]')).toBeVisible();

    // View scoring breakdown
    await page.click('button:has-text("View Scoring Breakdown")');
    await expect(page.locator('[data-testid="scoring-breakdown"]')).toBeVisible();

    // Approve
    await page.click('button:has-text("Approve")');
    await page.fill('textarea[name="comment"]', 'Evidence supports diagnosis.');
    await page.click('button:has-text("Confirm Approval")');
    await expect(page.locator('text=Diagnostic approved')).toBeVisible();

    // Export PDF
    await page.click('button:has-text("Export PDF")');
    const download = await page.waitForEvent('download');
    expect(download.suggestedFilename()).toContain('diagnostic');
  });

  test('should reject diagnostic when manager disapproves', async ({ page }) => {
    // Setup (same as above up to Run Diagnostic)
    await page.click('a:has-text("Diagnostics")');
    await page.click('button:has-text("New Diagnostic")');
    await page.click('button:has-text("Select Employee")');
    await page.click('li >> text="Ahmed"');
    await page.click('button:has-text("Create Diagnostic")');

    // Reject path
    await page.click('button:has-text("Reject")');
    await page.fill('textarea[name="reason"]', 'Insufficient evidence.');
    await page.click('button:has-text("Confirm Rejection")');
    await expect(page.locator('text=Diagnostic rejected')).toBeVisible();
    await expect(page.locator('[data-testid="diagnostic-status"]')).toContainText('Rejected');
  });
});