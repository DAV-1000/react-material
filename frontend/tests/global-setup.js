// tests/global-setup.js
import { chromium } from "@playwright/test";
import { storageFile } from './branch-storage.js';
import dotenv from "dotenv";

dotenv.config(); // Load local .env if present

export default async function globalSetup() {
  console.log("BRANCH_NAME:", process.env.BRANCH_NAME);
  
  const rawBaseURL = process.env.BASE_URL;

  if (!rawBaseURL) {
    throw new Error(
      "Environment variable BASE_URL is not defined or is empty."
    );
  }

  const baseURL = rawBaseURL.replace(/\/$/, "");
  console.log("Global Setup: Using base URL:", baseURL);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  // Check for JWT token
  const base64JWT = process.env.AUTH_JWT_BASE64;
  if (!base64JWT) {
    throw new Error("Environment variable AUTH_JWT_BASE64 is not set.");
  }

  const urlObj = new URL(baseURL);
  const cookie = {
    name: "StaticWebAppsAuthCookie",
    value: base64JWT,
    domain: urlObj.hostname,
    path: "/",
    expires: 1760293451.249761,
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
  };

  console.log("Cookie details:", JSON.stringify(cookie, null, 2));

  await context.addCookies([cookie]);
  console.log(`✅ JWT cookie set for ${cookie.domain}`);

  // Optionally, verify auth by visiting a protected page
  const page = await context.newPage();
  try {
    await page.goto(`${baseURL}/blog`, { timeout: 15000 });
    await page.waitForSelector('h1:has-text("Posts")', { timeout: 5000 });
    console.log("✅ JWT authentication appears valid");
  } catch (e) {
    console.warn("⚠️ JWT authentication may be invalid or expired:", e.message);
  }

  // Save auth state
  await context.storageState({ path: storageFile }); //<-- Save storage state to file referenced from playwright.config
  console.log(`✅ Auth state saved to ${storageFile} using JWT cookie`);

  await browser.close();
}
