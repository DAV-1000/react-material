// tests/protected-page.spec.js
import { test, expect } from "@playwright/test";

test("user can access protected page", async ({ page }) => {
  const rawBaseURL = process.env.STATIC_WEB_APP_URL;

  if (!rawBaseURL) {
    throw new Error(
      "Environment variable STATIC_WEB_APP_URL is not defined or is empty."
    );
  }

  const baseURL = rawBaseURL.replace(/\/$/, "");
  await page.goto(`${baseURL}/blog`);
  await expect(page.locator("h1")).toHaveText("Posts");
});
