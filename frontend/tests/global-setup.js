// tests/global-setup.js
import { chromium } from '@playwright/test';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config(); // Load local .env if present

export default async function globalSetup() {
  const rawBaseURL = process.env.STATIC_WEB_APP_URL;

  if (!rawBaseURL) {
    throw new Error(
      "Environment variable STATIC_WEB_APP_URL is not defined or is empty."
    );
  }

  const baseURL = rawBaseURL.replace(/\/$/, "");
  console.log('Using base URL:', baseURL);

  // Per-preview auth file
  const branchName = process.env.GITHUB_HEAD_REF || 'local';
  const storageFile = path.resolve(`auth-${branchName}.json`);

  const browser = await chromium.launch({ headless: true });
  let context;

  // Try to reuse existing auth state
  if (fs.existsSync(storageFile)) {
    context = await browser.newContext({ storageState: storageFile });
    const page = await context.newPage();

    try {
      // Check if the session is still valid
      await page.goto(`${baseURL}/blog`, { timeout: 15000 });
      await page.waitForSelector('h1:has-text("Post")', { timeout: 5000 });
      console.log('✅ Existing auth state is valid');
      await browser.close();
      return;
    } catch (e) {
      console.warn('⚠️ Existing auth expired. Removing old auth.json');
      await context.close();
      fs.unlinkSync(storageFile); // Remove expired auth file
    }
  }

  // Create new context and login
  context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(`${baseURL}/faq`);
  await page.click('text=GitHub');

  if (process.env.GH_USER && process.env.GH_PASS) {
    await page.waitForURL('**/github.com/login**');
    await page.fill('input[name="login"]', process.env.GH_USER);
    await page.fill('input[name="password"]', process.env.GH_PASS);
    await page.click('input[name="commit"]');

    // Handle OAuth authorize button if it appears
    if (await page.locator('button:has-text("Authorize")').count()) {
      await page.click('button:has-text("Authorize")');
    }

    await page.waitForURL(new RegExp(baseURL));
  } else {
    console.log('⚠️ No GH_USER/GH_PASS provided. Please log in manually...');
    await page.waitForTimeout(60000);
  }

  // Save auth state
  await context.storageState({ path: storageFile });
  console.log(`✅ Auth state saved to ${storageFile}`);
  await browser.close();
}
