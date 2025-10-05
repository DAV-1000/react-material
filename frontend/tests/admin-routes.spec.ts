// tests/protected-page.spec.js
import { test, expect } from "@playwright/test";

test("user can access protected page", async ({ page }) => {
  

  const baseURL = process.env.BASE_URL;
  await page.goto(`${baseURL}/blog`);
  await expect(page.locator("h1")).toHaveText("Posts");
});
