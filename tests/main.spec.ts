import { test, expect } from "@playwright/test";

test("main flow works", async ({ browser }) => {
  const context = await browser.newContext({
    permissions: ["clipboard-read", "clipboard-write"],
  });

  const page = await context.newPage();

  await page.goto("http://localhost:8081/");

  await page.getByTestId("search-input").fill("О, благодать");

  await page.getByTestId("search-button").click();

  await expect(page.getByTestId("loading-indicator")).toBeVisible();

  await page.getByTestId("search-result").first().click();

  await page.getByTestId("song-copy-button").click();

  const clipboardText = await page.evaluate(() =>
    navigator.clipboard.readText()
  );
  expect(clipboardText.trim().length).toBeGreaterThan(0);
});

// test('has title', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Expect a title "to contain" a substring.
//   await expect(page).toHaveTitle(/Playwright/);
// });

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
