// tests/global-setup.js
import { chromium } from "@playwright/test";
import { storageFile } from './branch-storage.js';

export default async function globalSetup() {
  
  const rawBaseURL = process.env.BASE_URL;
  const authMode = process.env.AUTH_MODE || 'jwt';

  if (!rawBaseURL) {
    throw new Error(
      "Environment variable BASE_URL is not defined or is empty."
    );
  }

  const baseURL = rawBaseURL.replace(/\/$/, "");
  console.log("Global Setup: Using base URL:", baseURL);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  
  if (authMode === 'emulator') {
    console.log('🔐 Using emulator login flow');

    const page = await context.newPage();

    await page.goto(baseURL);

    await page.getByRole('button', {
      name: 'Sign in with GitHub',
    }).click();

    await page.waitForSelector('#userRoles');

    await page.fill('#userRoles', `anonymous
authenticated
editor`);

    await page.click('#submit');

    await page.waitForLoadState('networkidle');

  } else if (authMode === 'jwt') {
    console.log('🔐 Using JWT cookie auth');

    const base64JWT = process.env.AUTH_JWT_BASE64;

    if (!base64JWT) {
      throw new Error('AUTH_JWT_BASE64 is not set.');
    }

    const urlObj = new URL(baseURL);

    await context.addCookies([
      {
        name: 'StaticWebAppsAuthCookie',
        value: base64JWT,
        domain: urlObj.hostname,
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
      },
    ]);

    // verify auth by visiting a protected page
    const page = await context.newPage();

    try {
      await page.goto(`${baseURL}/blog`, { timeout: 15000 });
      await page.waitForSelector('h1:has-text("Posts")', { timeout: 5000 });
      console.log("✅ JWT authentication appears valid");
    } catch (e) {
      console.warn("⚠️ JWT authentication may be invalid or expired:", e.message);
    }

  } else {
    throw new Error(
      `Unknown AUTH_MODE "${authMode}". Use "jwt" or "emulator".`
    );
  }

  // Save auth state
  await context.storageState({ path: storageFile }); //<-- Save storage state to file referenced from playwright.config
  console.log(`✅ Auth state saved to ${storageFile} using JWT cookie`);

  await browser.close();
}
