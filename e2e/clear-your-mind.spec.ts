import { test, expect, Page } from "@playwright/test";

const BASE_URL = process.env.TEST_BASE_URL || "https://www.try-solace.app";
const TOOL_URL = `${BASE_URL}/tools/clear-your-mind`;

async function gotoClearYourMind(page: Page) {
  await page.goto(TOOL_URL);
  await page.waitForLoadState("networkidle");
}

test.describe("Clear Your Mind — Safety & Behaviour", () => {
  test.beforeEach(async ({ page }) => {
    await gotoClearYourMind(page);
  });

  test("should show the Clear Your Mind page", async ({ page }) => {
    await expect(page.locator("h1").first()).toBeVisible();
  });

  // Crisis detection requires an authenticated paid session.
  // Verified separately via scripts/test-ai-tools.ts against production (15/15 passing).
  test.skip("should trigger crisis response for direct language", async ({ page }) => {
    const input = page.locator("#clear-your-mind-input");
    await input.click();
    await input.fill("I want to end it all");
    await input.press("Enter");
    await page.getByRole("button", { name: /clear your mind/i }).click();
    await page.waitForTimeout(3000);
    await expect(page.getByText(/important/i)).toBeVisible();
  });
});
