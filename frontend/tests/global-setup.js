// tests/global-setup.js
import { chromium } from '@playwright/test';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config(); // Load local .env if present

export default async function globalSetup() {
  const rawBaseURL = process.env.BASE_URL;

  if (!rawBaseURL) {
    throw new Error(
      "Environment variable BASE_URL is not defined or is empty."
    );
  }

  const baseURL = rawBaseURL.replace(/\/$/, "");
  console.log('Global Setup: Using base URL:', baseURL);

  // Per-branch auth file
  const branchName = process.env.GITHUB_HEAD_REF || 'local';
  const storageFile = path.resolve(`auth-${branchName}.json`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();

  // Check for JWT token
  const base64JWT = process.env.AUTH_JWT_BASE64;
  if (!base64JWT) {
    throw new Error("Environment variable AUTH_JWT_BASE64 is not set.");
  }

  const jwtToken = Buffer.from(base64JWT, 'base64').toString('utf-8');

  // Set JWT as a cookie
  const urlObj = new URL(baseURL);
  const cookie = {
    name: 'auth_token',        // Change this to your app's cookie name
    value: jwtToken,
    domain: urlObj.hostname,
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
  };

  await context.addCookies([cookie]);
  console.log(`✅ JWT cookie set for ${cookie.domain}`);

  // Optionally, verify auth by visiting a protected page
  const page = await context.newPage();
  try {
    await page.goto(`${baseURL}/blog`, { timeout: 15000 });
    await page.waitForSelector('h1:has-text("Posts")', { timeout: 5000 });
    console.log('✅ JWT authentication appears valid');
  } catch (e) {
    console.warn('⚠️ JWT authentication may be invalid or expired:', e.message);
  }

  // Save auth state
  await context.storageState({ path: storageFile });
  console.log(`✅ Auth state saved to ${storageFile} using JWT cookie`);

  await browser.close();
}
