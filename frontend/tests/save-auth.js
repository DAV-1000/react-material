import { chromium } from '@playwright/test';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://ambitious-tree-05189ec03-47.westeurope.1.azurestaticapps.net/');
  await page.click('button:has-text("GitHub")');

  console.log('Please log in manually to GitHub in this window...');
  await page.waitForTimeout(60000); // Give 60s to log in manually

  // Save auth state
  await context.storageState({ path: 'auth.json' });
  console.log('Auth saved to auth.json');
  await browser.close();
})();