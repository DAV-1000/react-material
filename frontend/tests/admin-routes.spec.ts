// tests/protected-page.spec.js
import { test, expect } from "@playwright/test";

test("user can access protected page", async ({ page }) => {
    const rawBaseURL = process.env.BASE_URL;

  if (!rawBaseURL) {
    throw new Error(
      "Environment variable BASE_URL is not defined or is empty."
    );
  }

  const baseURL = rawBaseURL.replace(/\/$/, "");
  console.log('Protected Page Test: Using base URL:', baseURL);
  await page.goto(`${baseURL}/blog`);
  await expect(page.locator("h1")).toHaveText("Posts");
});
