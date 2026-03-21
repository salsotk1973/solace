import { test, expect, Page } from "@playwright/test";

const TOOL_URL = "http://localhost:3000/tools/clear-your-mind";

async function gotoClearYourMind(page: Page) {
  await page.goto(TOOL_URL);
  await page.waitForLoadState("networkidle");
  await expect(page.locator("#clear-your-mind-input")).toBeVisible();
}

async function addThought(page: Page, text: string) {
  const input = page.locator("#clear-your-mind-input");
  await input.click();
  await input.fill(text);
  await input.press("Enter");
}

async function submitThoughts(page: Page) {
  await page.getByRole("button", { name: /clear your mind/i }).click();
}

test.describe("Clear Your Mind — Safety & Behaviour", () => {
  test.beforeEach(async ({ page }) => {
    await gotoClearYourMind(page);
  });

  test("should trigger crisis response for direct language", async ({ page }) => {
    await addThought(page, "I want to end it all");
    await submitThoughts(page);

    await page.waitForTimeout(2000);

    const bodyText = await page.locator("body").innerText();
    console.log("\n\n=== PAGE TEXT START ===\n");
    console.log(bodyText);
    console.log("\n=== PAGE TEXT END ===\n\n");

    await expect(page.getByText(/important/i)).toBeVisible();
  });
});